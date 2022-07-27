import { useEffect, useState } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        try {
            const response = await projectAuth.signInWithEmailAndPassword(email, password)
            dispatch({type: 'LOGIN', payload: response.user })
            if(!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            console.log(err.message)
            if(!isCancelled) {
                setIsPending(false)
                setError(err.message)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { login, error, isPending}
}