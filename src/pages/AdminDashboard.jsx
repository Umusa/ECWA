import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Users, 
  HandHeart, 
  LayoutDashboard, 
  LogOut, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ members: 0, prayers: 0 });
  const [statsError, setStatsError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchStats();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchStats = async () => {
    setIsRefreshing(true);
    setStatsError(null);
    try {
      const membersColl = collection(db, 'members');
      const prayersColl = collection(db, 'prayers');
      
      const membersSnap = await getDocs(membersColl);
      const prayersSnap = await getDocs(prayersColl);
      
      setStats({
        members: membersSnap.size,
        prayers: prayersSnap.size
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatsError(`Sync failed: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-large"></div>
        <p>Securing connection...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login-page">
        <div className="login-container glass fade-in" style={{ border: 'none', boxShadow: 'var(--3d-shadow)' }}>
          <div className="login-header">
            <img src="/ecwa-logo.png" alt="ECWA Logo" className="login-logo" />
            <h2>Portal Access</h2>
            <p>ECWA GOSPEL CHURCH MAI-GERO</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-field">
              <label>Admin Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecwamai-gero.org"
                  required 
                />
              </div>
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required 
                />
                <button 
                  type="button" 
                  className="pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && <div className="auth-error-msg">{authError}</div>}

            <button type="submit" className="login-btn" disabled={isAuthenticating}>
              {isAuthenticating ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
            </button>
          </form>
          
          <div className="login-footer">
            <p><Link to="/">Return to Home</Link></p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <main className="admin-content container">
        <header className="admin-header">
          <div className="welcome-text">
            <span>Welcome back,</span>
            <h1>Administrator</h1>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> LOGOUT
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card glass hover-3d" style={{ border: 'none' }}>
            <div className="stat-icon members-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Members</span>
              <h2 className="stat-value">{isRefreshing ? "..." : stats.members}</h2>
            </div>
            <TrendingUp className="stat-trend" size={16} />
          </div>

          <div className="stat-card glass hover-3d" style={{ border: 'none' }}>
            <div className="stat-icon prayers-icon">
              <HandHeart size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Prayer Requests</span>
              <h2 className="stat-value">{isRefreshing ? "..." : stats.prayers}</h2>
            </div>
            <Clock className="stat-trend" size={16} />
          </div>
        </div>

        {statsError && (
          <div className="stats-error-box glass" style={{ marginTop: '20px', padding: '15px', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <p>{statsError} - Please verify your Firebase project settings in Vercel.</p>
            <button onClick={fetchStats} className="btn-mini">Retry</button>
          </div>
        )}

        <section className="admin-sections">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="actions-grid">
            <Link to="/admin/members" className="action-card">
              <div className="action-main">
                <Users size={28} />
                <div>
                  <h3>Manage Members</h3>
                  <p>View, edit, or remove registrations.</p>
                </div>
              </div>
              <ChevronRight className="arrow" />
            </Link>

            <Link to="/admin/prayers" className="action-card">
              <div className="action-main">
                <HandHeart size={28} />
                <div>
                  <h3>Prayer Requests</h3>
                  <p>Open the burden of intercession.</p>
                </div>
              </div>
              <ChevronRight className="arrow" />
            </Link>
          </div>
        </section>

        <div className="security-notice">
          <ShieldCheck size={20} />
          <p>Secure Admin Session active. All activities are being logged for security purposes.</p>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default AdminDashboard;
