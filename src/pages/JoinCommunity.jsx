import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, Phone, Gift, AlertCircle, CheckCircle2, Loader2, Send, Heart, Briefcase, Shield, Plus, Trash2, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinCommunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    surname: '',
    firstname: '',
    email: '',
    phone_personal: '',
    address: '',
    marital_status: '',
    spouse_name: '',
    occupation: '',
    occupation_other: '',
    next_of_kin_name: '',
    next_of_kin_relationship: '',
    next_of_kin_phone: '',
    spiritual_gifts: ''
  });

  const [children, setChildren] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumChildrenChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    const count = Math.max(0, Math.min(20, val));

    setChildren(prev => {
      if (prev.length < count) {
        const added = Array.from({ length: count - prev.length }, () => ({ name: '', age: '' }));
        return [...prev, ...added];
      } else {
        return prev.slice(0, count);
      }
    });
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const addChild = () => {
    setChildren([...children, { name: '', age: '' }]);
  };

  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out. This usually means the website cannot reach Firebase. Please check your internet or Vercel environment variables.')), 10000);
    });

    try {
      const finalOccupation = formData.occupation === 'Other' && formData.occupation_other ? formData.occupation_other : formData.occupation;

      // Race the Firebase call against our timeout
      await Promise.race([
        addDoc(collection(db, 'members'), {
          ...formData,
          occupation: finalOccupation,
          num_children: children.length,
          children: children,
          status: 'pending',
          submittedAt: serverTimestamp()
        }),
        timeoutPromise
      ]);

      setStatus('success');
      setFormData({
        title: '', surname: '', firstname: '',
        email: '', phone_personal: '', address: '',
        marital_status: '', spouse_name: '',
        occupation: '', occupation_other: '',
        next_of_kin_name: '', next_of_kin_relationship: '', next_of_kin_phone: '',
        spiritual_gifts: ''
      });
      setChildren([]);
    } catch (err) {
      console.error("Firestore Registration Error:", err);
      setStatus('error');
      setErrorMsg(`Submission failed: ${err.message}`);
    }
  };

  return (
    <div className="join-page">
      <Navbar />

      <section className="registration-hero">
        <div className="container">
          <div className="form-card glass fade-in">
            <div className="form-header">
              <img src="/ecwa-logo.png" alt="ECWA Logo" className="form-logo floating" />
              <h2 className="text-shimmer">MEMBERSHIP PORTAL</h2>
              <p>ECWA GOSPEL CHURCH MAI-GERO</p>
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
                {/* 1. Personal Profile */}
                <div className="form-section">
                  <div className="section-title"><User size={18} /> Personal Profile</div>
                  <div className="grid-3-name">
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
                </div>

                {/* Main 2-Column Grid */}
                <div className="form-main-grid">
                  {/* Left Column: Connectivity & Next of Kin */}
                  <div className="form-col">
                    <div className="form-section">
                      <div className="section-title"><Mail size={18} /> Connectivity & Address</div>
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
                        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter full residential address..." rows="2" required></textarea>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="section-title"><Shield size={18} /> Next of Kin</div>
                      <div className="grid-3-equal">
                        <div className="input-group">
                          <label>Name</label>
                          <input
                            type="text"
                            name="next_of_kin_name"
                            value={formData.next_of_kin_name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>Relationship</label>
                          <input
                            type="text"
                            name="next_of_kin_relationship"
                            value={formData.next_of_kin_relationship}
                            onChange={handleChange}
                            placeholder="e.g. Spouse, Parent"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            name="next_of_kin_phone"
                            value={formData.next_of_kin_phone}
                            onChange={handleChange}
                            placeholder="080 0000 0000"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Marital, Occupation & Spiritual Gifts */}
                  <div className="form-col">
                    <div className="form-section">
                      <div className="section-title"><Heart size={18} /> Marital Status & Occupation</div>
                      <div className="grid-2">
                        <div className="input-group">
                          <label>Marital Status</label>
                          <select name="marital_status" value={formData.marital_status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Celibacy">Celibacy</option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label>Occupation</label>
                          <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                            <option value="">Select Occupation</option>
                            <option value="Student">Student</option>
                            <option value="Civil Servant">Civil Servant</option>
                            <option value="Business Man/Woman">Business Man/Woman</option>
                            <option value="Retired">Retired</option>
                            <option value="Applicant">Applicant</option>
                            <option value="Self-Employed">Self-Employed</option>
                            <option value="Private Sector Employee">Private Sector Employee</option>
                            <option value="Artisan">Artisan / Skilled Worker</option>
                            <option value="Unemployed">Unemployed</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {(formData.marital_status === 'Married' || formData.occupation === 'Other') && (
                        <div className="grid-2 fade-in" style={{ marginTop: '8px' }}>
                          {formData.marital_status === 'Married' ? (
                            <div className="input-group">
                              <label>Name of Spouse</label>
                              <input
                                type="text"
                                name="spouse_name"
                                value={formData.spouse_name}
                                onChange={handleChange}
                                placeholder="Full name of spouse"
                                required={formData.marital_status === 'Married'}
                              />
                            </div>
                          ) : <div />}

                          {formData.occupation === 'Other' ? (
                            <div className="input-group">
                              <label>Specify Occupation</label>
                              <input
                                type="text"
                                name="occupation_other"
                                value={formData.occupation_other}
                                onChange={handleChange}
                                placeholder="Specify occupation"
                                required={formData.occupation === 'Other'}
                              />
                            </div>
                          ) : <div />}
                        </div>
                      )}
                    </div>

                    <div className="form-section">
                      <div className="section-title"><Gift size={18} /> Spiritual Gifts & Interests</div>
                      <div className="input-group">
                        <textarea
                          name="spiritual_gifts"
                          value={formData.spiritual_gifts}
                          onChange={handleChange}
                          placeholder="e.g. Music, Teaching, Intercession, Ushering..."
                          rows="2"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Children Section Across Bottom */}
                <div className="children-block" style={{ background: '#f8fafc', padding: '18px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 250px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="var(--primary)" /> Number of Children (where applicable)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={children.length}
                        onChange={handleNumChildrenChange}
                        placeholder="0"
                      />
                    </div>

                    <button type="button" onClick={addChild} className="btn-add-child" style={{ height: '42px', padding: '0 20px' }}>
                      <Plus size={16} /> Add Child
                    </button>
                  </div>

                  {children.length > 0 && (
                    <div className="children-list-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                        Children Details (Names & Ages)
                      </label>
                      {children.map((child, idx) => (
                        <div key={idx} className="child-item-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={child.name}
                            onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                            placeholder={`Child ${idx + 1} Name`}
                            required
                          />
                          <input
                            type="text"
                            value={child.age}
                            onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                            placeholder="Age (e.g. 8 yrs)"
                            required
                          />
                          <button type="button" onClick={() => removeChild(idx)} className="btn-delete-child" title="Remove Child">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {status === 'error' && (
                  <div className="error-box glass" style={{ background: 'rgba(254, 226, 226, 0.4)', marginBottom: '15px' }}>
                    <AlertCircle size={20} />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <button type="submit" className="submit-btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={status === 'submitting'}>
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

