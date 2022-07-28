import { useEffect, useState } from "react"
import { projectAuth, projectFirestore, projectStorage } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        try {
            // signup the user
            const response = await projectAuth.createUserWithEmailAndPassword(email, password);

            if(!response) {
                throw new Error('Could not signup the user')
            }

            // uploade image to storage
            const uploadPath = `thumbnails/${response.user.uid}/${thumbnail.name}`
            const image = await projectStorage.ref(uploadPath).put(thumbnail)
            const imageUrl = await image.ref.getDownloadURL()

            // update user profile
            await response.user.updateProfile({ displayName, photoURL: imageUrl })

            // create a user document in firestore
            await projectFirestore.collection('users').doc(response.user.uid).set({
                online: true,
                displayName,
                photoURL: imageUrl
            })

            // dispatch login action
            dispatch({type: 'LOGIN', payload: response.user })

            // update the state
            if(!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            console.log(err.message)
            if(!isCancelled) {
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { signup, error, isPending }
}