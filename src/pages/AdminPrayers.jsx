import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { HandHeart, Trash2, ArrowLeft, Loader2, MessageSquare, Clock, CheckCircle, User, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminPrayers = () => {
  const [user, setUser] = useState(null);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin');
      } else {
        setUser(currentUser);
        fetchPrayers();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchPrayers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const q = query(collection(db, 'prayers'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const prayerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrayers(prayerList);
    } catch (err) {
      console.error("Error fetching prayers:", err);
      setFetchError(`Database error: ${err.message}. Check your Firebase settings and Authorized Domains.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prayer request?")) {
      try {
        await deleteDoc(doc(db, 'prayers', id));
        setPrayers(prayers.filter(p => p.id !== id));
      } catch (err) {
        alert("Error deleting request: " + err.message);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'prayed' ? 'pending' : 'prayed';
    try {
      await updateDoc(doc(db, 'prayers', id), {
        status: newStatus
      });
      setPrayers(prayers.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
      if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
      return new Date(timestamp).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (!user && !loading) return null;

  return (
    <div className="admin-page">
      <Navbar />
      
      <main className="admin-content container" style={{ padding: '120px 0 80px' }}>
        <div className="admin-nav-back">
          <Link to="/admin" className="back-link"><ArrowLeft size={18} /> Back to Dashboard</Link>
        </div>

        <header className="admin-header-flex">
          <div className="header-title">
            <HandHeart size={32} color="var(--primary)" />
            <h1>Prayer Requests</h1>
          </div>
          <div className="prayer-count glass">
            <strong>{prayers.filter(p => p.status === 'pending').length}</strong> Pending
          </div>
        </header>

        {loading ? (
          <div className="admin-loader" style={{ textAlign: 'center', padding: '100px 0' }}>
            <Loader2 className="spinner" size={40} style={{ margin: '0 auto 20px' }} />
            <p>Gathering intercessions...</p>
          </div>
        ) : fetchError ? (
          <div className="admin-error-box glass" style={{ margin: '40px auto', padding: '40px', textAlign: 'center', maxWidth: '600px', color: '#ff4d4d' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 20px' }} />
            <h3>Sync Failed</h3>
            <p style={{ margin: '15px 0' }}>{fetchError}</p>
            <button onClick={fetchPrayers} className="btn-primary">Retry Sync</button>
          </div>
        ) : (
          <div className="prayers-list glass">
            {prayers.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px' }}>
                <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '20px' }} />
                <p>No prayer requests currently in the database.</p>
              </div>
            ) : (
              <div className="prayers-grid">
                {prayers.map(prayer => (
                  <div key={prayer.id} className={`prayer-item glass hover-3d ${prayer.status === 'prayed' ? 'status-prayed' : ''}`}>
                    <div className="prayer-meta">
                      <div className="requestor">
                        <User size={16} /> <span>{prayer.fullName || 'Anonymous'}</span>
                      </div>
                      <div className="date">
                        <Clock size={14} /> <span>{formatDate(prayer.submittedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="prayer-content">
                      <h3>{prayer.subject}</h3>
                      <p>{prayer.message}</p>
                    </div>

                    <div className="prayer-actions">
                      <button 
                        onClick={() => toggleStatus(prayer.id, prayer.status)} 
                        className={`status-btn ${prayer.status === 'prayed' ? 'btn-prayed' : 'btn-pending'}`}
                      >
                        {prayer.status === 'prayed' ? <><CheckCircle size={14} /> PRAYED FOR</> : 'MARK AS PRAYED'}
                      </button>
                      <button onClick={() => handleDelete(prayer.id)} className="delete-btn-minimal" title="Remove request">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPrayers;
