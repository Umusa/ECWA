import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, User, Mail, Phone, MapPin, Gift, Calendar, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/admin');
    });
    fetchMember();
    return () => unsubscribe();
  }, [id, navigate]);

  const fetchMember = async () => {
    try {
      const docRef = doc(db, 'members', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMember(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loader"><Loader2 className="spinner" size={40} /><p>Loading details...</p></div>;
  if (!member) return <div className="admin-content container"><p>Member not found.</p></div>;

  return (
    <div className="details-page">
      <Navbar />
      <main className="container">
        <div className="admin-nav-back">
          <Link to="/admin/members" className="back-link"><ArrowLeft size={18} /> Back to Members</Link>
        </div>

        <div className="details-card glass fade-in">
          <header className="details-header">
            <div className="header-title">
              <div className="member-initials" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                {member.firstname?.[0]}{member.surname?.[0]}
              </div>
              <div>
                <h1 style={{ color: 'var(--primary)' }}>{member.title} {member.firstname} {member.surname}</h1>
                <span className="member-id">Member ID: {id}</span>
              </div>
            </div>
          </header>

          <div className="details-grid">
            <div className="detail-block">
              <h5>Full Name</h5>
              <p>{member.title} {member.firstname} {member.surname}</p>
            </div>
            <div className="detail-block">
              <h5>Email Address</h5>
              <p>{member.email}</p>
            </div>
            <div className="detail-block">
              <h5>Phone Number</h5>
              <p>{member.phone_personal}</p>
            </div>
            <div className="detail-block">
              <h5>Registration Date</h5>
              <p>{member.submittedAt?.toDate().toLocaleDateString() || 'N/A'}</p>
            </div>
          </div>

          <div className="detail-block" style={{ marginBottom: '30px' }}>
            <h5>Residential Address</h5>
            <div className="message-detail">
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--primary)" /> {member.address}
              </p>
            </div>
          </div>

          <div className="detail-block">
            <h5>Spiritual Gifts & Interests</h5>
            <div className="message-detail">
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Gift size={18} color="var(--primary)" /> {member.spiritual_gifts || 'No gifts specified.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberDetails;
