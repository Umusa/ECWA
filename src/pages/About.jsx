import React from 'react';
import { Target, Users, Heart, Shield, Globe, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      <section className="about-hero">
        <div className="container">
          <div className="fade-in">
            <h1>Our Mission & <span className="highlight">Vision</span></h1>
            <p>Rooted in Scripture, reaching the world from the heart of Mai-Gero.</p>
          </div>
        </div>
      </section>

      <section className="about-content container">
        <div className="vision-mission-grid">
          <div className="info-card glass hover-3d fade-in">
            <Target className="icon" size={40} color="var(--primary)" />
            <h3>Our Mission</h3>
            <p>To glorify God by reaching out to the lost, making disciples, and nurturing believers towards spiritual maturity and holiness in Christ Jesus.</p>
          </div>
          <div className="info-card glass hover-3d fade-in">
            <Eye className="icon" size={40} color="var(--primary)" />
            <h3>Our Vision</h3>
            <p>To be a vibrant, Christ-centered community that impacts Mai-Gero and the world through the transformative power of the Gospel and the fire of the Holy Spirit.</p>
          </div>
        </div>

        <div className="core-values">
          <div className="section-header">
            <h2>Core <span className="highlight">Values</span></h2>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <BookOpen size={24} />
              <h4>Biblical Authority</h4>
            </div>
            <div className="value-item">
              <Heart size={24} />
              <h4>Sincere Worship</h4>
            </div>
            <div className="value-item">
              <Shield size={24} />
              <h4>Holiness</h4>
            </div>
            <div className="value-item">
              <Users size={24} />
              <h4>Fellowship</h4>
            </div>
            <div className="value-item">
              <Globe size={24} />
              <h4>Missions</h4>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

// Helper for missing icon in current context
const Eye = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default About;
