
import { useEffect, useState } from 'react'
import LeftPart from '../components/LeftPart'
import Post from '../components/Post'
import Comment from '../components/Comment'
import '../css/ProfilePage.css'
import API from '../api/axios'
import LoadingIndicator from '../components/LoadingIndicator'
import axios from 'axios'

function ProfilePage() {
    // /me/posts/
    // /api/user/profile/

    const [author, setAuthor] = useState(null)
    const [usernameInput, setUsernameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [error, setError] = useState('')
    const [isloading, setIsloading] = useState(true)
    const [success, setSuccess] = useState('')

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [posts, setPosts] = useState([])
    const [errorPosts, setErrorPosts] = useState('')
    const [isloadingPosts, setIsloadingPosts] = useState(true)

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
        fetchMyPosts();
        fetchAuthor();
    }, []);
    const fetchAuthor = async () => {
        setIsloading(true);
        try {
            const res = await API.get('/user/profile/');
            setAuthor(res.data.data);

        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong");
            }
            console.error(error);
        } finally {
            setIsloading(false);
        }
    };
    const fetchMyPosts = async () => {
        setIsloading(true);
        try {
            const res = await API.get('/me/posts/');
            setPosts(res.data.data);
        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                setErrorPosts(error.response.data.message);
            } else {
                setErrorPosts("Something went wrong");
            }
            console.error(error);
        } finally {
            setIsloadingPosts(false);
        }
    };
    useEffect(() => {
        if (author && author.username && author.email) {
            setUsernameInput(author.username)
            setEmailInput(author.email)
        }
        setError('')
        setSuccess('')
    }, [author])
    const updateAuthor = async () => {
        setIsloading(true);
        setError('')
        setSuccess('')
        try {
            const res = await API.put('/user/profile/', {
                username: usernameInput,
                email: emailInput
            });
            setAuthor(res.data.data);
            setSuccess(res.data.message)
        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong while update user");
            }
            console.error(error);
        } finally {
            setIsloading(false);
        }
    };
    const updatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All password fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        setError('')
        setSuccess('')
        setIsloading(true);
        try {
            const res = await API.post('/user/change-password/', {
                current_password: oldPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
            });
            setSuccess(res.data.message)

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            // Safe way to extract message from Axios error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong while update password");
            }
            console.error(error);
        } finally {
            setIsloading(false);
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

                <div className="profile-detail">
                    <h2>Profile settings</h2>
                    {isloading ? (<p>Loading profile detail...</p>) :
                        <>
                            {success && <p>{success}</p>}
                            {error && <p>{error}</p>}
                        </>
                    }
                    <div className="profile-row">
                        <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Username" />
                        <button onClick={() => updateAuthor()}>Update</button>
                    </div>

                    <div className="profile-row">
                        <input placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                        <button onClick={() => updateAuthor()}>Update</button>
                    </div>

                    <div className="profile-row">
                        <div className="profile-row-password">
                            <input
                                type="password"
                                placeholder="Current password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={updatePassword}>Update</button>
                    </div>


                </div>

                <div className="home-posts-container">
                    <center><h2>Manage your posts</h2></center>
                    <div className="profile-posts">
                        {
                            isloadingPosts ? <LoadingIndicator /> :

                                errorPosts ? <p>{error}</p> :
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
                                                profile={true}
                                                refreshPosts={fetchMyPosts}
                                            />
                                        ))
                        }
                    </div>

                </div>

            </div>
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
                                                    profile={true}
                                                    id = {c.id}
                                                    refreshComments={fetchCommentsinHome}
                                                    currentPost={currentPost}
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

export default ProfilePage