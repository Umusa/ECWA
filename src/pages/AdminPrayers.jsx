import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { HandHeart, Trash2, ArrowLeft, Loader2, MessageSquare, Clock, CheckCircle, User, AlertCircle, Eye } from 'lucide-react';
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
      
      <main className="admin-content container">
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
          <div className="admin-loader">
            <Loader2 className="spinner" size={40} />
            <p>Gathering intercessions...</p>
          </div>
        ) : fetchError ? (
          <div className="admin-error-box glass">
            <AlertCircle size={48} />
            <h3>Sync Failed</h3>
            <p>{fetchError}</p>
            <button onClick={fetchPrayers} className="btn-primary">Retry Sync</button>
          </div>
        ) : (
          <div className="admin-table-wrapper glass fade-in">
            {prayers.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={48} />
                <p>No prayer requests currently in the database.</p>
              </div>
            ) : (
              <table className="admin-list-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prayers.map(prayer => (
                    <tr key={prayer.id} className={prayer.status === 'prayed' ? 'status-prayed-row' : ''}>
                      <td>
                        <div className="admin-row-info">
                          <User size={16} />
                          <h4>{prayer.fullName || 'Anonymous'}</h4>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{prayer.subject}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${prayer.status}`} style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: prayer.status === 'prayed' ? 'rgba(34,139,34,0.1)' : 'rgba(255,215,0,0.1)',
                          color: prayer.status === 'prayed' ? 'var(--accent)' : '#b45309'
                        }}>
                          {prayer.status ? prayer.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{formatDate(prayer.submittedAt)}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <Link to={`/admin/prayers/${prayer.id}`} className="btn-view" title="View Burden">
                            <Eye size={16} /> VIEW
                          </Link>
                          <button 
                            onClick={() => toggleStatus(prayer.id, prayer.status)} 
                            className={`status-btn-minimal ${prayer.status === 'prayed' ? 'prayed' : ''}`}
                            title={prayer.status === 'prayed' ? 'Mark as Pending' : 'Mark as Prayed'}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(prayer.id)} 
                            className="btn-delete" 
                            title="Delete Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPrayers;
