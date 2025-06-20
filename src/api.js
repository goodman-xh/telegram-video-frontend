// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import RechargePage from './pages/RechargePage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function AppContent() {
  const { loading, error, user } = useAuth();

  if (loading) {
    return <div className="app-loading">正在安全登录...</div>;
  }
  if (error) {
    return <div className="app-error">认证失败: {error}</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/recharge" element={<RechargePage />} />
            <Route path="/me" element={user ? <Navigate to={`/profile/${user.id}`} /> : null} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;