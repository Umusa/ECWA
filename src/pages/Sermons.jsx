import React, { useState } from 'react';
import { Play, Music, Globe, Calendar, Video, Headphones, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Sermons = () => {
  const [activeFilter, setActiveFilter] = useState('ALL MEDIA');

  const mediaItems = [
    {
      title: '2026 Theme Launch',
      description: '"Keep Your Lamps Burning" - A powerful session on spiritual vigilance and the fire of the Holy Spirit.',
      date: 'FEB 2026',
      type: 'VIDEO',
      category: 'SERMONS',
      icon: <Video size={16} />,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Music Ministry: Revival Songs',
      description: 'Our choir leading the congregation in songs of awakening, praise, and deep worship.',
      date: 'JAN 2026',
      type: 'AUDIO',
      category: 'MUSIC',
      icon: <Music size={16} />,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'EMS Mission Highlights',
      description: 'Touching lives and planting seeds of hope through the Evangelical Missionary Society\'s local outreach.',
      date: 'DEC 2025',
      type: 'MISSION',
      category: 'OUTREACH',
      icon: <Globe size={16} />,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Sermon: Spiritual Readiness',
      description: 'A deep dive into 1 Peter 4:7-11. Understanding how to live with urgency, love, and spiritual readiness.',
      date: 'NOV 2025',
      type: 'SERMON',
      category: 'SERMONS',
      icon: <Headphones size={16} />,
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const filters = ['ALL MEDIA', 'SERMONS', 'MUSIC', 'OUTREACH'];

  const filteredItems = activeFilter === 'ALL MEDIA' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeFilter);

  return (
    <div className="sermons-page">
      <Navbar />
      
      <section className="media-hero">
        <div className="hero-content container">
          <span className="media-badge">Visual Ministry</span>
          <h1>Faith Comes By <span className="highlight">Hearing</span></h1>
          <p>Nourish your spirit with the Word of Truth from ECWA Gospel Mai-Gero.</p>
        </div>
      </section>

      <section id="media" className="container">
        <div className="media-filter">
          {filters.map(filter => (
            <button 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="content-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className="media-card glass hover-3d fade-in" style={{ animationDelay: `${index * 0.1}s`, border: 'none' }}>
              <div className="media-container">
                <img src={item.image} className="card-img" alt={item.title} />
                <div className="play-overlay">
                  <div className="play-btn">
                    {item.type === 'VIDEO' ? <Video size={24} /> : <Play size={24} />}
                  </div>
                </div>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="media-meta">
                  <span><Calendar size={14} /> {item.date}</span>
                  <span className="type-badge">{item.icon} {item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Sermons;
