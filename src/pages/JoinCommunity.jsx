import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Gift, AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinCommunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    surname: '',
    firstname: '',
    sex: '',
    dob: '',
    email: '',
    phone_personal: '',
    address: '',
    spiritual_gifts: ''
  });

  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'members'), {
        ...formData,
        submittedAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        title: '', surname: '', firstname: '', sex: '', dob: '',
        email: '', phone_personal: '', address: '', spiritual_gifts: ''
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="join-page">
      <Navbar />
      
      <section className="registration-hero" style={{ padding: '140px 0 80px' }}>
        <div className="container">
          <div className="form-card glass fade-in" style={{ border: 'none', boxShadow: 'var(--3d-shadow)', maxWidth: '900px' }}>
            <div className="form-header">
              <img src="/ecwa-logo.png" alt="ECWA Logo" className="form-logo floating" style={{ height: '80px', marginBottom: '20px' }} />
              <h2 className="text-shimmer" style={{ fontSize: '2.5rem' }}>MEMBERSHIP PORTAL</h2>
              <p style={{ letterSpacing: '3px' }}>ECWA GOSPEL CHURCH MAI-GERO</p>
            </div>

            {status === 'success' ? (
              <div className="success-message">
                <CheckCircle2 size={80} color="var(--accent)" className="floating" />
                <h3>Welcome to the Community!</h3>
                <p>Your registration is complete. We are excited to have you as part of the family.</p>
                <button onClick={() => setStatus('idle')} className="btn-primary">REGISTER ANOTHER</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reg-form">
                <div className="form-section">
                  <div className="section-title"><User size={20} /> Personal Profile</div>
                  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Title</label>
                      <select name="title" value={formData.title} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Miss">Miss.</option>
                        <option value="Dr">Dr.</option>
                        <option value="Rev">Rev.</option>
                        <option value="Elder">Elder</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>First Name</label>
                      <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" required />
                    </div>
                    <div className="input-group">
                      <label>Surname</label>
                      <input type="text" name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" required />
                    </div>
                  </div>

                  <div className="grid-2" style={{ marginTop: '20px' }}>
                    <div className="input-group">
                      <label>Gender</label>
                      <select name="sex" value={formData.sex} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title"><Mail size={20} /> Connectivity</div>
                  <div className="grid-2">
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" required />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone_personal" value={formData.phone_personal} onChange={handleChange} placeholder="080 0000 0000" required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Residential Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full address..." rows="2" required></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title"><Gift size={20} /> Spiritual Gifts & Interests</div>
                  <div className="input-group">
                    <textarea 
                      name="spiritual_gifts" 
                      value={formData.spiritual_gifts} 
                      onChange={handleChange} 
                      placeholder="e.g. Music, Teaching, Intercession, Ushering..." 
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="error-box glass" style={{ background: 'rgba(254, 226, 226, 0.4)' }}>
                    <AlertCircle size={20} />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <button type="submit" className="submit-btn btn-primary" style={{ width: '100%', padding: '18px' }} disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <><Loader2 className="spinner" size={20} /> SYNCING DATA...</>
                  ) : <><Send size={18} /> COMPLETE REGISTRATION</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinCommunity;
