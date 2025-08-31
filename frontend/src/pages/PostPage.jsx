import { useParams } from "react-router-dom";
import LeftPart from "../components/LeftPart"
import RightPart from "../components/RightPart"
import Post from "../components/Post";
import { useEffect, useState } from "react";
import API from "../api/axios";
import axios from "axios";
import LoadingIndicator from "../components/LoadingIndicator";
import Comment from "../components/Comment";


function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState([])
    const [error, setError] = useState('')
    const [isloading, setIsloading] = useState(true)

    //comments
    const [isModalOpenComment, setIsModalOpenComment] = useState(false);
    const [comments, setComments] = useState([])
    const [isloadingComments, setIsloadingComments] = useState(false)
    const [nextPageUrlComments, setNextPageUrlComments] = useState(null)
    const [isloadingNextComments, setIsloadingNextComments] = useState(false)
    const [errorComments, setErrorComments] = useState('')
    const [errorNextComments, setErrorNextComments] = useState('')
    const [commentInput, setCommentInput] = useState('')
    const [errorNewComment, setErrorNewComment] = useState('')
    const [isloadingNewComment, setIsloadingNewComment] = useState(false)

    const [currentPost, setCurrentPost] = useState(null)

    useEffect(() => {
        const fetchPostsinHome = async () => {
            setIsloading(true);
            try {
                const res = await API.get(`/posts/${postId}/`);
                setPost(res.data);
            } catch (error) {
                // Safe way to extract message from Axios error
                if (error.response && error.response.data && error.response.data.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError("Something went wrong");
                }
                console.error(error); // Always log full error for debugging
            } finally {
                setIsloading(false);
            }
        };
        fetchPostsinHome();
    }, [postId]);
    function formatDateToDDMMYYYY(isoDateString) {
        const date = new Date(isoDateString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getUTCFullYear();

        return `${day}.${month}.${year}`;
    }

    //comments
    const closeModalComment = () => {
        setIsModalOpenComment(false)
        setCurrentPost(null)
        setCommentInput('')
        setErrorNewComment('')
    }
    const fetchCommentsinHome = async (post_id) => {
        setIsloadingComments(true);
        try {
            const res = await API.get(`/posts/${post_id}/comments`);
            setComments(res.data.results);
            if (res.data.next) {
                setNextPageUrlComments(res.data.next)
            }
        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setErrorComments(error.response.data.message);
            } else {
                setErrorComments("Something went wrong to fetch comment");
            }
            console.error(error);
        } finally {
            setIsloadingComments(false);
        }
    };
    const openModalComment = (post_id) => {
        setIsModalOpenComment(true)
        fetchCommentsinHome(post_id)
        setCurrentPost(post_id)
    }
    const addNewCommets = async () => {
        if (!commentInput.trim()) {
            setErrorNewComment('Content are required.')
            return;
        }
        setIsloadingNewComment(true);
        try {
            const res = await API.post(`/posts/${currentPost}/comments/`, {
                content: commentInput,
            });
            setComments(prev => [res.data, ...prev]);

            setCommentInput('');
            setErrorNewComment('')

        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setErrorNewComment(error.response.data.message);
            } else {
                setErrorNewComment("Something went wrong");
            }
            console.error(error); // Always log full error for debugging
        } finally {
            setIsloadingNewComment(false);
        }
    }
    const fetchNextPageComments = async () => {
        setIsloadingNextComments(true);
        try {
            const res = await axios.get(nextPageUrlComments);
            setComments(prevComments => [...prevComments, ...res.data.results]);
            if (res.data.next) {
                setNextPageUrlComments(res.data.next)
            } else { setNextPageUrlComments(null) }
        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setErrorNextComments(error.response.data.message);
            } else {
                setErrorNextComments("Something went wrong with next page");
            }
            console.error(error); // Always log full error for debugging
        } finally {
            setIsloadingNextComments(false);
        }
    };

    return (
        <div className="home-main">
            <LeftPart />
            <div className="central-part">
                {
                    isloading ? <LoadingIndicator /> :

                        error ? <p>{error}</p> :
                            post.length === 0 ?
                                <p>The post is not found</p>
                                :
                                <Post
                                    key={`post-home${post.id}`}
                                    id={post.id}
                                    author={post.author}
                                    posted={formatDateToDDMMYYYY(post.created_at)}
                                    title={post.title}
                                    content={post.content}
                                    count_comments={post.count_comments}
                                    openModalComment={openModalComment}
                                />}
            </div>
            <RightPart />
            {isModalOpenComment && (
                <div className='modal-overlay' onClick={closeModalComment}>
                    <div className='comments-window' onClick={(e) => e.stopPropagation()}>
                        <button className='comments-window-close' onClick={closeModalComment}><b>X</b></button>
                        <div className='comments-container'>
                            {
                                isloadingComments ? <LoadingIndicator /> :

                                    errorComments ? <p>{errorComments}</p> :
                                        comments.length === 0 ?
                                            <p>No Comments jet</p>
                                            :
                                            comments.map(c => (
                                                <Comment
                                                    key={`comment-home${c.id}`}
                                                    author={c.author}
                                                    posted={formatDateToDDMMYYYY(c.created_at)}
                                                    content={c.content}
                                                />
                                            ))
                            }
                            {nextPageUrlComments && <center><button onClick={() => fetchNextPageComments()} className='next-btn'>
                                {isloadingNextComments ? <span>Loading...</span> : <span>Load more comments</span>}
                            </button></center>}
                            {errorNextComments && <center>{errorNextComments}</center>}
                        </div>
                        <form className="home-add-post" onSubmit={(e) => {
                            e.preventDefault();
                            addNewCommets();
                        }}>
                            <textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} rows={3} placeholder="Start commenting here..."></textarea>
                            <div className="post-btn-wrapper">
                                <button type="submit">{isloadingNewComment ? <span>Publicating...</span> : <span>Make comment</span>}</button>
                            </div>
                            {errorNewComment && <p>{errorNewComment}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostPage