import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, User, Mail, Phone, MapPin, Gift, Calendar, Loader2, Heart, Briefcase, Shield, Users } from 'lucide-react';
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
              <p>{member.email || 'N/A'}</p>
            </div>
            <div className="detail-block">
              <h5>Phone Number</h5>
              <p>{member.phone_personal || 'N/A'}</p>
            </div>
            <div className="detail-block">
              <h5>Registration Date</h5>
              <p>{member.submittedAt?.toDate ? member.submittedAt.toDate().toLocaleDateString() : (member.submittedAt?.seconds ? new Date(member.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A')}</p>
            </div>

            <div className="detail-block">
              <h5>Marital Status</h5>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Heart size={16} color="var(--primary)" /> {member.marital_status || 'Not specified'}
              </p>
            </div>

            {member.spouse_name && (
              <div className="detail-block">
                <h5>Spouse Name (Wife/Husband)</h5>
                <p>{member.spouse_name}</p>
              </div>
            )}

            <div className="detail-block">
              <h5>Occupation</h5>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Briefcase size={16} color="var(--primary)" /> {member.occupation || 'Not specified'}
              </p>
            </div>

            <div className="detail-block">
              <h5>Number of Children</h5>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Users size={16} color="var(--primary)" /> {member.num_children ?? (member.children ? member.children.length : 0)}
              </p>
            </div>
          </div>

          {/* Children List */}
          {member.children && member.children.length > 0 && (
            <div className="detail-block" style={{ marginBottom: '25px' }}>
              <h5>Children Details</h5>
              <div className="message-detail">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {member.children.map((child, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontWeight: '600' }}>{i + 1}. {child.name || 'Unnamed'}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Age: {child.age || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Next of Kin */}
          <div className="detail-block" style={{ marginBottom: '25px' }}>
            <h5>Next of Kin</h5>
            <div className="message-detail">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Name</span>
                  <strong>{member.next_of_kin_name || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Relationship</span>
                  <strong>{member.next_of_kin_relationship || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Phone</span>
                  <strong>{member.next_of_kin_phone || 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-block" style={{ marginBottom: '25px' }}>
            <h5>Residential Address</h5>
            <div className="message-detail">
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--primary)" /> {member.address || 'N/A'}
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

