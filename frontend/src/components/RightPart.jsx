import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../css/RigthPart.css'
import API from '../api/axios';

function RightPart() {
  const [authors, setAuthors] = useState([])
  const [error, setError] = useState('')
  const [isloading, setIsloading] = useState(true)
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsloading(true);
      try {
        const res = await API.get('/users/');
        setAuthors(res.data.data);
      } catch (error) {
        // Safe way to extract message from Axios error
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

    fetchAuthors();
  }, []);


  return (
    <div className="right-part">
      <h2>All authors</h2>
      <div className="authors-list">
        {
          isloading ? (<p>Loading...</p>) :

            error ? <p>{error}</p> :
              authors.length === 0 ?
                <p>No authors</p>
                :
                authors.map(a => (
                  <div key={`author${a.id}`}>
                    <span>{a.username}</span>
                    <Link to={`/author/${a.id}`}><button>Visit</button></Link>
                  </div>
                ))
        }

      </div>
    </div>
  )
}

export default RightPart