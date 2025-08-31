import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios';
import '../css/LoginPage.css';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import Home from './HomePage';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('')

  useEffect(() => {
    checkIfLogin()
  }, [])

  function checkIfLogin() {
    const token = localStorage.getItem('access');
    if (token) {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration > now) {
        navigate("/");
      }
    }

  }

  const login = async () => {
    setIsAuthorized(null)
    try {
      const res = await API.post('/token/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      setIsAuthorized(true)

    } catch (error) {

      if (error.response && error.response.data) {
        setError(error.response.data.detail || error.response.data.password || error.response.data.username|| 'Failed to login');
      } else {
        setError('An unknown error occurred. Please try again.');
      }

      setIsAuthorized(false);

    }
  };
  if (isAuthorized == null) return <LoadingIndicator />

  if (isAuthorized === true) return <Home />
  return (
    <div>
      <div className='login-main'>
        <img src='/images/computer.jpg' />
        <div>
          <h2>Vladogram</h2>
          <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          {error && <p className='error'>{error}</p>}

          <div className="divider">or</div>
          <Link className="register" to="/register">Register</Link>

          <div className="forgot">Forgot a password?</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
