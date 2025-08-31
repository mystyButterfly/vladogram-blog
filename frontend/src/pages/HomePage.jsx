import '../css/HomePage.css'
import RightPart from '../components/RightPart'
import LeftPart from '../components/LeftPart'
import Post from '../components/Post'
import { useEffect, useRef, useState } from 'react'
import API from '../api/axios'
import LoadingIndicator from '../components/LoadingIndicator'
import axios from 'axios'
import Comment from '../components/Comment'

function Home() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')
  const [isloading, setIsloading] = useState(true)
  const [nextPageUrl, setNextPageUrl] = useState(null)
  const [isloadingNext, setIsloadingNext] = useState(false)
  const [errorNext, setErrorNext] = useState('')

  const [addPostInputTitle, setAddPostInputTitle] = useState('')
  const [addPostInputContent, setAddPostInputContent] = useState('')
  const [isloadingNew, setIsloadingNew] = useState(false)
  const [errorNew, setErrorNew] = useState('')

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [progress, setProgress] = useState(100);
  const modalTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

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
        const res = await API.get('/posts/');
        setPosts(res.data.results);
        if (res.data.next) {
          setNextPageUrl(res.data.next)
        }
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

    fetchPostsinHome();
  }, []);
  const fetchNextPage = async () => {
    setIsloadingNext(true);
    try {
      const res = await axios.get(nextPageUrl);
      setPosts(prevPosts => [...prevPosts, ...res.data.results]);
      if (res.data.next) {
        setNextPageUrl(res.data.next)
      } else { setNextPageUrl(null) }
    } catch (error) {
      // Safe way to extract message from Axios error
      if (error.response && error.response.data && error.response.data.message) {
        setErrorNext(error.response.data.message);
      } else {
        setErrorNext("Something went wrong with next page");
      }
      console.error(error); // Always log full error for debugging
    } finally {
      setIsloadingNext(false);
    }
  };
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
  const addNewPost = async () => {
    if (!addPostInputTitle.trim() || !addPostInputContent.trim()) {
      setErrorNew('Title and content are required.')
      return;
    }
    setIsloadingNew(true);
    try {

      const res = await API.post('/posts/', {
        title: addPostInputTitle,
        content: addPostInputContent,
      });
      setPosts(prev => [res.data, ...prev]);

      setAddPostInputTitle('');
      setAddPostInputContent('');
      setErrorNew('')

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

  function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
    setProgress(100);

    // Clear any existing timers
    clearTimeout(modalTimerRef.current);
    clearInterval(progressIntervalRef.current);

    // Timer to auto-close modal
    modalTimerRef.current = setTimeout(() => {
      setIsModalOpen(false);
    }, 10000);

    // Progress bar logic (updates every 100ms)
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearTimeout(modalTimerRef.current);
    clearInterval(progressIntervalRef.current);
  };
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

  return (
    <div className="home-main">
      <LeftPart />
      <div className="central-part">
        <div className="home-stories">
          <button onClick={() => openModal('Content1')}>story1</button>
          <button onClick={() => openModal('Content2')}>story2</button>
          <button onClick={() => openModal('Content3')}>story3</button>
          <button onClick={() => openModal('Content4')}>story4</button>
        </div>
        <form className="home-add-post" onSubmit={(e) => {
          e.preventDefault();
          addNewPost();
        }}>
          <input value={addPostInputTitle} onChange={e => setAddPostInputTitle(e.target.value)} placeholder="Title of new post"></input>
          <textarea value={addPostInputContent} onChange={e => setAddPostInputContent(e.target.value)} rows={3} placeholder="Start adding a new post here..."></textarea>
          <div className="post-btn-wrapper">
            <button type="submit">{isloadingNew ? <span>Publicating...</span> : <span>Make post</span>}</button>
          </div>
          {errorNew && <p>{errorNew}</p>}
        </form>
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
          {nextPageUrl && <center><button onClick={() => fetchNextPage()} className='next-btn'>
            {isloadingNext ? <span>Loading...</span> : <span>Load more</span>}
          </button></center>}
          {errorNext && <center>{errorNext}</center>}
        </div>
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-progress" style={{ width: `${progress}%` }}></div>
              <div className="modal-content">{modalContent}</div>
            </div>
          </div>
        )}
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
      <RightPart />
    </div>
  )
}

export default Home