import { useState } from "react";
import "../css/Post.css"
import API from "../api/axios";

function Post({ id = "notfound", author = "Author", profile = false, posted = "1.09.2025", title = "Unnamed post", content = "Empty content", count_comments = 0, openModalComment, refreshPosts = () => {}, }) {
    const [copied, setCopied] = useState(false);
    const [errorPostsDelete, setErrorPosts] = useState('')
    const [addPostInputTitle, setAddPostInputTitle] = useState(title)
    const [addPostInputContent, setAddPostInputContent] = useState(content)
    const [isloadingNew, setIsloadingNew] = useState(false)
    const [errorNew, setErrorNew] = useState('')

    function copyPostLink(post_id) {
        const link = `${window.location.origin}/#/post/${post_id}/`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
    const deletePost = async (post_id) => {
        try {
            const res = await API.delete(`/posts/${post_id}/`);
            setErrorPosts('')
            alert(`Post ${post_id} succesfully deleted`)
            refreshPosts();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorPosts(error.response.data.message);
            } else {
                setErrorPosts("Something went wrong");
            }
            console.error(error);
        }
    }

    const updatePost = async (post_id) => {
        if (!addPostInputTitle.trim() || !addPostInputContent.trim()) {
            setErrorNew('Title and content are required.')
            return;
        }
        setIsloadingNew(true);
        try {
            const res = await API.put(`/posts/${post_id}/`, {
                title: addPostInputTitle,
                content: addPostInputContent,
            });

            setErrorNew('')
            refreshPosts();

        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setErrorNew(error.response.data.message);
            } else {
                setErrorNew("Something went wrong");
            }
            console.error(error); // Always log full error for debugging
        } finally {
            setIsloadingNew(false);
        }
    }

    return (
        <div className="home-post">
            {errorPostsDelete && <p>{errorPostsDelete}</p>}
            <div className="home-post-header">
                <span>{author}</span>
                <span>Posted: {posted}</span>
            </div>
            <h2>{title}</h2>
            <div>{content}</div>

            {profile &&
            <div className="update-post">
                <p>Edit title</p>
                <input value={addPostInputTitle} onChange={e => setAddPostInputTitle(e.target.value)} placeholder="Title of post"></input>
                <p>Edit content</p>
                <textarea value={addPostInputContent} onChange={e => setAddPostInputContent(e.target.value)} rows={2} placeholder="Start update a post here..."></textarea>
                {errorNew && <p>{errorNew}</p>}
            </div>}

            {profile &&
                <div className="post-profile-btn">
                    <button onClick={() => deletePost(id)}>Delete post</button>
                    {isloadingNew?<button>Editing...</button>:<button onClick={() => updatePost(id)}>Edit post</button>}
                </div>
            }
            <div className="post-btn-wrapper">
                <button onClick={() => openModalComment(id)}>{count_comments} comments</button>
                {!profile && <button onClick={() => openModalComment(id)}>To comment</button>}
                <button onClick={() => copyPostLink(id)}>Share</button>
            </div>

            {copied && <p className="copied-message">The post's link is copied to clipboard</p>}
        </div>
    )
}

export default Post