import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import '../css/LoginPage.css';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear()
  }, [])

  const register = async () => {
    setLoading(true)
    try {
      const res = await API.post('/register/', { username, email, password });
      localStorage.setItem('access', res.data.data.access);
      localStorage.setItem('refresh', res.data.data.refresh);
      setLoading(false)
      navigate("/");
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.data) {
        const { data } = error.response.data;

        // Clear previous errors
        setError('');

        // Find the first error and display it
        if (data.username && data.username.length > 0) {
          setError(`Username: ${data.username[0]}`); // Display the first username error
        } else if (data.email && data.email.length > 0) {
          setError(`Email: ${data.email[0]}`); // Display the first email error
        } else if (data.password && data.password.length > 0) {
          setError(`Password: ${data.password[0]}`); // Display the first password error
        } else {
          setError('An unknown error occurred. Please try again.');
        }
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className='login-main'>
        <div className='register-container'>
          <h2>Vladogram</h2>
          <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <input placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)} />
          <button onClick={register}>Register</button>
          {error && <p className='error'>{error}</p>}
          {loading === true && "Loading..."}

          <div className="divider">or</div>

          <div className="forgot">Have an account?</div>
          <Link className="register" to="/login">Login</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
