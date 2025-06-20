import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import RechargePage from './pages/RechargePage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function MainApp() {
    const { user } = useAuth();
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

// 最终版的“安全防护墙”
function AuthGuard() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div className="app-loading">正在安全登录...</div>;
    }

    if (isAuthenticated) {
        return <MainApp />;
    }
    
    // 如果认证失败，显示一个对用户友好的提示
    return (
        <div className="app-error">
            <p>登录失败</p>
            <p style={{ fontSize: '14px', color: '#888' }}>
                请确认您正在Telegram官方应用中访问，并尝试重启小程序。
            </p>
        </div>
    );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}

export default App;