import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrayerRequest = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out. This usually means the website cannot reach Firebase. Please check your internet or Vercel environment variables.')), 10000);
    });

    try {
      // Race the Firebase call against our timeout
      await Promise.race([
        addDoc(collection(db, 'prayers'), {
          ...formData,
          submittedAt: serverTimestamp(),
          status: 'pending'
        }),
        timeoutPromise
      ]);

      setStatus('success');
      setFormData({ fullName: '', subject: '', message: '' });
    } catch (err) {
      console.error("Firestore Prayer Error:", err);
      setStatus('error');
      setErrorMsg(`Request failed: ${err.message}`);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <section className="registration-hero" style={{ padding: '140px 0 80px' }}>
        <div className="container">
          <div className="form-card glass fade-in" style={{ border: 'none', boxShadow: 'var(--3d-shadow)', maxWidth: '1000px' }}>
            <div className="form-header">
              <MessageSquare size={52} color="var(--primary)" className="floating" style={{ margin: '0 auto 20px' }} />
              <h2 className="text-shimmer" style={{ fontSize: '2.5rem' }}>BURDEN OF INTERCESSION</h2>
              <p style={{ letterSpacing: '4px' }}>ECWA GOSPEL CHURCH MAI-GERO</p>
            </div>

            {status === 'success' ? (
              <div className="success-message">
                <CheckCircle2 size={80} color="var(--accent)" className="floating" />
                <h3>Your request is before God!</h3>
                <p>We receive your request with faith. Our prayer team will join you in intercession.</p>
                <button onClick={() => setStatus('idle')} className="btn-primary">SUBMIT ANOTHER REQUEST</button>
              </div>
            ) : (
              <div className="contact-grid-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div className="contact-info-box">
                  <h3 style={{ color: 'var(--primary)', marginBottom: '20px', fontSize: '1.5rem' }}>We Stand with You</h3>
                  <p style={{ marginBottom: '30px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                    The Bible says, "The effectual fervent prayer of a righteous man availeth much."
                    Whatever the burden, we believe God hears and answers.
                  </p>
                  
                  <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="detail-item glass hover-3d" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px' }}>
                      <MapPin size={24} color="var(--primary)" />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Church Office</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ungwan Maigero, Kaduna State</p>
                      </div>
                    </div>

                    <div className="detail-item glass hover-3d" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px' }}>
                      <Phone size={24} color="var(--primary)" />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Counseling Line</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>+234 803 592 4855</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-form-box">
                  <form onSubmit={handleSubmit} className="reg-form">
                    <div className="grid-1">
                      <div className="input-group">
                        <label>Your Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Request Title</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Health, Family, Finance" required />
                    </div>
                    <div className="input-group">
                      <label>Prayer Detail</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Describe your prayer need..." rows="4" required></textarea>
                    </div>

                    {status === 'error' && (
                      <div className="error-box glass" style={{ marginBottom: '20px' }}>
                        <AlertCircle size={20} />
                        <p>{errorMsg}</p>
                      </div>
                    )}

                    <button type="submit" className="submit-btn btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
                      {status === 'submitting' ? (
                        <><Loader2 className="spinner" size={20} /> INTERCEDING...</>
                      ) : <><Send size={18} /> SUBMIT PRAYER REQUEST</>}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrayerRequest;
