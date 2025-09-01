import { useState } from 'react';
import API from '../api/axios';
import '../css/Comment.css'

function Comment({ author = "Guest", posted = "30.08.2025", content = "Comment for some post", profile = false, id , refreshComments = ()=>{}, currentPost = 0}) {
    const [error, setError] = useState('')
    const deleteComment = async (comment_id) => {
        try {
            const res = await API.delete(`/comments/${comment_id}/`);
            setError('')
            alert(`Comment ${comment_id} succesfully deleted`)
            refreshComments(currentPost);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong while delete comment");
            }
            console.error(error);
        }
    }
    return (
        <div className='comment-component'>
            <div>
                <b>{author}</b>
                <span>{posted}</span>
            </div>
            <p>{content}</p>
            {profile &&
                <div>
                    {error && <p>{error}</p>}
                    <button className='delete-comment-btn' onClick={() => deleteComment(id)}>Delete comment</button>
                </div>
            }
        </div>
    )
}

export default Comment