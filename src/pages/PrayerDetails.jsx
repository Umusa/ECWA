import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, MessageSquare, User, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrayerDetails = () => {
  const { id } = useParams();
  const [prayer, setPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/admin');
    });
    fetchPrayer();
    return () => unsubscribe();
  }, [id, navigate]);

  const fetchPrayer = async () => {
    try {
      const docRef = doc(db, 'prayers', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrayer(docSnap.data());
      }
    } catch (err) {
      console.error("Error fetching prayer:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = prayer.status === 'prayed' ? 'pending' : 'prayed';
    try {
      await updateDoc(doc(db, 'prayers', id), { status: newStatus });
      setPrayer({ ...prayer, status: newStatus });
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  if (loading) return <div className="admin-loader"><Loader2 className="spinner" size={40} /><p>Loading intercession...</p></div>;
  if (!prayer) return <div className="admin-content container"><p>Prayer request not found.</p></div>;

  return (
    <div className="details-page">
      <Navbar />
      <main className="container">
        <div className="admin-nav-back">
          <Link to="/admin/prayers" className="back-link"><ArrowLeft size={18} /> Back to Prayers</Link>
        </div>

        <div className="details-card glass fade-in">
          <header className="details-header">
            <div className="header-title">
              <MessageSquare size={40} color="var(--primary)" />
              <div>
                <h1 style={{ color: 'var(--primary)' }}>{prayer.subject}</h1>
                <span className={`status-badge ${prayer.status}`} style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: prayer.status === 'prayed' ? 'rgba(34,139,34,0.1)' : 'rgba(255,215,0,0.1)',
                  color: prayer.status === 'prayed' ? 'var(--accent)' : '#b45309'
                }}>
                  {prayer.status ? prayer.status.toUpperCase() : 'PENDING'}
                </span>
              </div>
            </div>
            <button 
              onClick={toggleStatus}
              className={`status-btn ${prayer.status === 'prayed' ? 'btn-prayed' : 'btn-pending'}`}
            >
              {prayer.status === 'prayed' ? <CheckCircle size={18} /> : null}
              {prayer.status === 'prayed' ? 'PRAYED FOR' : 'MARK AS PRAYED'}
            </button>
          </header>

          <div className="details-grid">
            <div className="detail-block">
              <h5>Submitted By</h5>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--primary)" /> {prayer.fullName || 'Anonymous'}
              </p>
            </div>
            <div className="detail-block">
              <h5>Submission Date</h5>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--primary)" /> {prayer.submittedAt?.toDate().toLocaleDateString() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="detail-block">
            <h5>Prayer Burden / Message</h5>
            <div className="message-detail">
              <p>{prayer.message}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrayerDetails;
