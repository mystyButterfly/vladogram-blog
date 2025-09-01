
import '../css/Footer.css'
import { Link } from 'react-router-dom';

function Footer() {
    const apiUrl = import.meta.env.VITE_API_URL.slice(0, -4);
  return (
    <div className='login-footer'>
        <Link to='/about'>About</Link>
        <a href={apiUrl}>Api</a>
        <span>&copy;2025 Vladogram</span>
    </div>
  )
}

export default Footer