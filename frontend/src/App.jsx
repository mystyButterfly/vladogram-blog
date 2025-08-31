import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/RegisterPage';
import About from './pages/AboutPage';
import './css/App.css'
import AuthorPage from './pages/AuthorPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';


function App() {
  return (
    <Router basename="/vladogram-blog">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/author/:authorId/" element={<AuthorPage />} />
        <Route path="/post/:postId/" element={<PostPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
