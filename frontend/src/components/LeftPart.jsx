import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/LeftPart.css';
import API from '../api/axios';
import LoadingIndicator from './LoadingIndicator';


function LeftPart() {
  const navigate = useNavigate();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null)
  const [isLoadingSearchNext, setIsLoadingSearchNext] = useState(false);
  const [errorSearchNext, setErrorSearchNext] = useState('');

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoadingSearch(true);
    setErrorSearch('');
    try {
      const res = await API.get(`/posts/?search=${searchQuery}`);
      setSearchResults(res.data.results || []);
      if (res?.data?.next) {
        setNextPageUrl(res.data.next)
      } else { setNextPageUrl(null) }

    } catch (error) {
      if (error.response?.data?.message) {
        setErrorSearch(error.response.data.message);
      } else {
        setErrorSearch("Something went wrong during search.");
      }
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const loadNextSearch = async () => {
    if (!nextPageUrl) return;

    setIsLoadingSearchNext(true);
    setErrorSearchNext('');

    try {
      const res = await API.get(nextPageUrl);
      setSearchResults(prev => [...prev, ...(res.data.results || [])]);

      if (res?.data?.next) {
        setNextPageUrl(res.data.next);
      } else {
        setNextPageUrl(null);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorSearchNext(error.response.data.message);
      } else {
        setErrorSearchNext("Something went wrong while loading more results.");
      }
    } finally {
      setIsLoadingSearchNext(false);
    }
  };

  return (
    <div className="left-part">
      <div>
        <Link to={"/"}><h2>Vladogram</h2></Link>
        <button onClick={openSearchModal}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>&nbsp; Search</button>
        <button onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H7.5" stroke="#667085" strokeWidth="1.66667" strokewinecap="round" strokeLinejoin="round"></path></svg>  &nbsp;Logout</button>
      </div>
      <Link to={"/profile"}><button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
      </svg>&nbsp; Profile</button></Link>

      {/* Modal inside LeftPart */}
      {isSearchModalOpen && (
        <div className="modal-overlay" onClick={closeSearchModal}>
          <div className="comments-window" onClick={(e) => e.stopPropagation()}>
            <button className="comments-window-close" onClick={closeSearchModal}><b>X</b></button>
            <div className="comments-container">
              <h3>Search Posts</h3>
              <div className="search-control">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button onClick={performSearch}>Start Search 🔎</button>
              </div>


              {isLoadingSearch && <LoadingIndicator />}
              {errorSearch && <p>{errorSearch}</p>}
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div key={`search-p${p.id}`} className="search-result">
                      <div><b>Author: {p.author}</b> ➡️ <Link onClick={closeSearchModal} to={`/post/${p.id}`}><u>View</u></Link></div>
                      <p><b>Title: </b>{p.title}</p>
                      <p><b>Contetn: </b>{p.content}</p>
                    </div>
                  ))
                ) : (
                  !isLoadingSearch && <p>No results found.</p>
                )}
                {nextPageUrl && (
                  <center>
                    <button onClick={loadNextSearch}>
                      {isLoadingSearchNext ? 'Loading...' : 'Load more results'}
                    </button>
                    {errorSearchNext && <p>{errorSearchNext}</p>}
                  </center>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftPart;
