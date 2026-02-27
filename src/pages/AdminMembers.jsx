import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Users, Trash2, ArrowLeft, Loader2, Search, Calendar, Phone, MapPin, AlertCircle, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminMembers = () => {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin');
      } else {
        setUser(currentUser);
        fetchMembers();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchMembers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const q = query(collection(db, 'members'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const memberList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        status: 'pending', // Default status if not present
        ...doc.data()
      }));
      setMembers(memberList);
    } catch (err) {
      console.error("Error fetching members:", err);
      setFetchError(`Database error: ${err.message}. Check your Firebase settings and Authorized Domains.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this member? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'members', id));
        setMembers(members.filter(m => m.id !== id));
      } catch (err) {
        alert("Error deleting member: " + err.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'members', id), {
        status: newStatus
      });
      setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = `${m.firstname || ''} ${m.surname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = m.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
            <Users size={32} color="var(--primary)" />
            <h1>Registered Members</h1>
          </div>
          <div className="search-bar glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({members.filter(m => m.status === 'pending').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({members.filter(m => m.status === 'approved').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({members.filter(m => m.status === 'rejected').length})
          </button>
        </div>

        {loading ? (
          <div className="admin-loader">
            <Loader2 className="spinner" size={40} />
            <p>Fetching member database...</p>
          </div>
        ) : fetchError ? (
          <div className="admin-error-box glass">
            <AlertCircle size={48} />
            <h3>Sync Failed</h3>
            <p>{fetchError}</p>
            <button onClick={fetchMembers} className="btn-primary">Retry Sync</button>
          </div>
        ) : (
          <div className="admin-table-wrapper glass fade-in">
            {filteredMembers.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>No {activeTab} members found matching your search.</p>
              </div>
            ) : (
              <table className="admin-list-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Contact</th>
                    <th>Gifts</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="admin-row-info">
                          <div className="member-initials" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                            {(member.firstname?.[0] || '?')}{(member.surname?.[0] || '?')}
                          </div>
                          <div>
                            <h4 style={{ margin: 0 }}>{member.title} {member.firstname} {member.surname}</h4>
                            <span className="member-id">ID: {member.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {member.phone_personal && <div className="info-item" style={{ margin: 0 }}><Phone size={12} /> <span>{member.phone_personal}</span></div>}
                          {member.email && <div className="info-item" style={{ margin: 0 }}><AlertCircle size={12} /> <span>{member.email}</span></div>}
                        </div>
                      </td>
                      <td>
                         <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{member.spiritual_gifts || 'None'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{formatDate(member.submittedAt)}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <Link to={`/admin/members/${member.id}`} className="btn-view" title="View Details">
                            <Eye size={16} /> VIEW
                          </Link>
                          
                          {activeTab !== 'approved' && (
                            <button 
                              onClick={() => handleStatusUpdate(member.id, 'approved')} 
                              className="btn-approve" 
                              style={{ color: 'var(--accent)' }}
                              title="Approve Member"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          {activeTab !== 'pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(member.id, 'pending')} 
                              className="btn-pend" 
                              style={{ color: '#b45309' }}
                              title="Set to Pending"
                            >
                              <Clock size={16} />
                            </button>
                          )}

                          {activeTab !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusUpdate(member.id, 'rejected')} 
                              className="btn-reject" 
                              style={{ color: '#ef4444' }}
                              title="Reject Member"
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDelete(member.id)} 
                            className="btn-delete" 
                            title="Delete Permanently"
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

export default AdminMembers;
