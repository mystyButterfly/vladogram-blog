import RightPart from '../components/RightPart'
import LeftPart from '../components/LeftPart'
import Post from '../components/Post'
import Comment from '../components/Comment'
import '../css/AuthorPage.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios'
import LoadingIndicator from '../components/LoadingIndicator'
import axios from 'axios';

function AuthorPage() {
    const { authorId } = useParams();
    //author
    const [authorDetail, setAuthorDetail] = useState(null)
    const [errorAuthor, setErrorAuthor] = useState('')
    const [isloadingAuthor, setIsloadingAuthor] = useState(true)

    //posts
    const [posts, setPosts] = useState([])
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
                const res = await API.get(`/user/${authorId}/posts/`);
                setPosts(res.data.data);
            } catch (error) {
                // Safe way to extract message from Axios error
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError("Something went wrong");
                }
                console.error(error); // Always log full error for debugging
            } finally {
                setIsloading(false);
            }
        };
        fetchAuthorDetail();
        fetchPostsinHome();
    }, [authorId]);

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

    const fetchAuthorDetail = async () => {
        setIsloadingAuthor(true);
        try {
            const res = await API.get(`/user/${authorId}/`);
            setAuthorDetail(res.data.data);
        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setErrorAuthor(error.response.data.message);
            } else {
                setErrorAuthor("Something went wrong");
            }
            console.error(error); // Always log full error for debugging
        } finally {
            setIsloadingAuthor(false);
        }
    };


    return (
        <div className="home-main">
            <LeftPart />

            <div className="central-part">

                {isloadingAuthor ? <LoadingIndicator /> :
                    errorAuthor ? <p>{errorAuthor}</p> :
                        authorDetail ?

                            <div className="author-detail">
                                <h2>Author {authorDetail.username}</h2>
                                <p>Joined {formatDateToDDMMYYYY(authorDetail.date_joined)}</p>
                                <p>Total posts: {authorDetail.count_posts}</p>
                                <p>Total comments: {authorDetail.count_comments}</p>
                            </div>
                            :
                            <div className="author-detail">
                                <h2>Author id={authorId}</h2>
                                <p>Joined 18.08.2025</p>
                                <p>Total posts: 5</p>
                                <p>Total comments: 10</p>
                            </div>
                }
                <div className="home-posts-container author-posts-container">
                    <div className="home-posts-container">
                        {
                            isloading ? <LoadingIndicator /> :

                                error ? <p>{error}</p> :
                                    posts.length === 0 ?
                                        <p>No Posts</p>
                                        :
                                        posts.map(p => (
                                            <Post
                                                key={`post-home${p.id}`}
                                                id={p.id}
                                                author={p.author}
                                                posted={formatDateToDDMMYYYY(p.created_at)}
                                                title={p.title}
                                                content={p.content}
                                                count_comments={p.count_comments}
                                                openModalComment={openModalComment}
                                            />
                                        ))
                        }

                    </div>
                </div>

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

export default AuthorPage