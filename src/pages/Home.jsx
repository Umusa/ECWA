import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowRight, Play, BookOpen, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <span className="hero-badge glass floating">Welcome to ECWA Gospel Mai-Gero</span>
            <h1 className="text-shimmer">Keep Your Lamps <span className="highlight">Burning</span></h1>
            <p className="fade-in" style={{ animationDelay: '0.3s' }}>A community dedicated to the spiritual readiness, spiritual growth, and the pursuit of holiness in Christ Jesus.</p>
            <div className="hero-btns fade-in" style={{ animationDelay: '0.6s' }}>
              <Link to="/join" className="btn-primary">JOIN OUR COMMUNITY</Link>
              <Link to="/about" className="btn-secondary">LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="theme-section-wrapper">
        <div className="container">
          <div className="theme-grid">
            <div className="theme-card glass hover-3d fade-in">
              <BookOpen className="theme-icon" size={40} />
              <h3>2026 ANNUAL THEME</h3>
              <p>"KEEP YOUR LAMPS BURNING..."</p>
              <span className="scripture">- Luke 12:35 (NIV)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Our Church <span className="highlight">Life</span></h2>
            <p>Join us as we grow together in faith and fellowship.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass hover-3d fade-in">
              <Users size={32} color="var(--primary)" />
              <h3>Community</h3>
              <p>Find a place to belong and grow with brothers and sisters in Christ.</p>
            </div>
            <div className="feature-card glass hover-3d fade-in">
              <Play size={32} color="var(--primary)" />
              <h3>Worship</h3>
              <p>Experience deep, spiritual worship and sound biblical teachings.</p>
            </div>
            <div className="feature-card glass hover-3d fade-in">
              <Heart size={32} color="var(--primary)" />
              <h3>Ministry</h3>
              <p>Discover your spiritual gifts and serve in various church ministries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="schedule-section">
        <div className="container">
          <div className="schedule-box">
            <div className="schedule-header">
              <Calendar size={28} />
              <h2>Weekly Meetings</h2>
            </div>
            <div className="schedule-list">
              <div className="schedule-item">
                <span className="day">SUNDAY</span>
                <span className="event">Worship Service</span>
                <span className="time">9:00 AM</span>
              </div>
              <div className="schedule-item">
                <span className="day">TUESDAY</span>
                <span className="event">Bible Study</span>
                <span className="time">5:30 PM</span>
              </div>
              <div className="schedule-item">
                <span className="day">FRIDAY</span>
                <span className="event">Prayer Meeting</span>
                <span className="time">5:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Home;
