import { useEffect, useRef, useState } from "react"
import { projectFirestore } from "../firebase/config"

export const useCollection = (collection, _query, _orderBy) => {
    const [documents, setDocuments] = useState()
    const [error, setError] = useState()
    const query = useRef(_query).current // because _query is reference type we have to use useRef to not rernder component in loop (dependency array in useEffect)
    const orderBy = useRef(_orderBy).current

    useEffect(() => {
        let ref = projectFirestore.collection(collection)

        if(query) {
            ref = ref.where(...query)
        }

        if(orderBy) {
            ref = ref.orderBy(...orderBy)
        }

        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            })

            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError('Could not featch the data')
        })

        return () => unsubscribe()
    }, [collection, query, orderBy])

    return { documents, error }
}