import React, { useState, useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import { jwtDecode } from "jwt-decode";
import API from '../api/axios';
import LoadingIndicator from './LoadingIndicator';

export default function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    try {
      const res = await API.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        setIsAuthorized(true);
        return children
      } else {
        setIsAuthorized(false);
        return <LoginPage/>
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
      return children
      
    }
  };

  if (isAuthorized === null) {
    return <LoadingIndicator />;
  }
  return isAuthorized ? children : <LoginPage />;
}
