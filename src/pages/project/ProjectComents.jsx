import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { v4 as uuid } from 'uuid'

export default function ProjectComents() {
    const [newComment, setNewComment] = useState('')
    const { user } = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: uuid()
        }

        console.log(commentToAdd)
    }

  return (
    <div className="project-comments">
        <h4>Project comments</h4>

        <form className="add-comment" onSubmit={handleSubmit}>
            <label>
                <span>Add new comment</span>
                <textarea
                    required
                    onChange={e => setNewComment(e.target.value)}
                    value={newComment}
                ></textarea>
            </label>
            <button className="btn">Add comment</button>
        </form>
    </div>
  )
}
