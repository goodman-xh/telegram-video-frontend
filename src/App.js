// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import './App.css'; // 我们将添加一些基本样式

// 临时的页面占位符
const HomePage = () => <div>首页</div>;
const UploadPage = () => <div>上传页</div>;
const RechargePage = () => <div>充值页</div>;

const ProfilePage = () => {
  const { user } = useAuth();
  return <div>我的主页 - 用户: {user ? user.username : '加载中...'}</div>;
};

// App内容组件，它能访问到AuthContext
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
            {/* 个人主页路由，使用当前登录用户的ID */}
            <Route path="/me" element={user ? <Navigate to={`/profile/${user.id}`} /> : null} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

// 最终的App组件，用AuthProvider包裹
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;