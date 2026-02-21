import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Users, Trash2, ArrowLeft, Loader2, Search, Calendar, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminMembers = () => {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    try {
      const q = query(collection(db, 'members'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const memberList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(memberList);
    } catch (err) {
      console.error("Error fetching members:", err);
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

  const filteredMembers = members.filter(m => 
    `${m.firstname || ''} ${m.surname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

        {loading ? (
          <div className="admin-loader" style={{ textAlign: 'center', padding: '100px 0' }}>
            <Loader2 className="spinner" size={40} style={{ margin: '0 auto 20px' }} />
            <p>Fetching member database...</p>
          </div>
        ) : (
          <div className="admin-list-container glass">
            {filteredMembers.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px' }}>
                <Users size={48} style={{ opacity: 0.3, marginBottom: '20px' }} />
                <p>No members found matching your search.</p>
              </div>
            ) : (
              <div className="member-cards-grid">
                {filteredMembers.map(member => (
                  <div key={member.id} className="member-card glass hover-3d">
                    <div className="member-card-header">
                      <div className="member-initials">
                        {(member.firstname?.[0] || '?')}{(member.surname?.[0] || '?')}
                      </div>
                      <div className="member-main-info">
                        <h3>{member.title} {member.firstname} {member.surname}</h3>
                        <span className="member-id">ID: {member.id.substring(0, 8)}</span>
                      </div>
                      <button onClick={() => handleDelete(member.id)} className="delete-icon-btn" title="Delete member">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="member-card-body">
                      {member.dob && <div className="info-item"><Calendar size={14} /> <span>DOB: {member.dob}</span></div>}
                      {member.phone_personal && <div className="info-item"><Phone size={14} /> <span>{member.phone_personal}</span></div>}
                      {member.address && <div className="info-item"><MapPin size={14} /> <span>{member.address}</span></div>}
                    </div>

                    <div className="member-card-footer">
                      <div className="spiritual-gifts-tag">
                        <strong>Gifts:</strong> {member.spiritual_gifts || 'Not specified'}
                      </div>
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

export default AdminMembers;
