import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JoinCommunity from './pages/JoinCommunity';
import Sermons from './pages/Sermons';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import PrayerRequest from './pages/PrayerRequest';
import AdminMembers from './pages/AdminMembers';
import AdminPrayers from './pages/AdminPrayers';
import MemberDetails from './pages/MemberDetails';
import PrayerDetails from './pages/PrayerDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinCommunity />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/prayer-request" element={<PrayerRequest />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/members/:id" element={<MemberDetails />} />
        <Route path="/admin/prayers" element={<AdminPrayers />} />
        <Route path="/admin/prayers/:id" element={<PrayerDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
