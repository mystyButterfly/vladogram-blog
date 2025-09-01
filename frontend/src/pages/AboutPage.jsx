import React from 'react';
import '../css/AboutPage.css';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="about-main">
      <div className="about-header">
        <Link to="/">
          <span>Vladogram</span>
          <div>V</div>
        </Link>
      </div>
      <section className="about-first-section">
        <p>
          Welcome to a space where your voice matters—share your thoughts, tell your stories, and spark conversations. Dive into posts from others, leave heartfelt comments, and connect through words that inspire, challenge, and unite.
        </p>
        <img src="https://mystybutterfly.github.io/vladogram-blog/images/girl.jpg" alt="Girl" />

      </section>

      <section className="about-second-section">
        <img src="https://mystybutterfly.github.io/vladogram-blog/images/wind.jpg" alt="Wind turbines" />
        <p>
          Built with Django and React, this blog blends robust backend performance with a smooth, responsive frontend for an engaging user experience.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
