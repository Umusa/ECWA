import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-brand">
                   <p>Building a community of faith, hope, and love in Mai-Gero. Join us in our mission to reach souls for Christ.</p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Youtube size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-group">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/prayer-request">Prayer Request</Link></li>
              <li><Link to="/join">Membership Portal</Link></li>
            </ul>
          </div>

          <div className="footer-group">
            <h3>Get in Touch</h3>
            <ul className="contact-list">
              <li><MapPin size={16} /> Mai-Gero, Jos, Plateau State</li>
              <li><Phone size={16} /> +234 (0) 123 456 7890</li>
              <li><Mail size={16} /> office@ecwamai-gero.org</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ECWA Gospel Church Mai-Gero. All Rights Reserved.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
