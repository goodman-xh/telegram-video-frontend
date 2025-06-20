import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate(); // 用于跳转
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('works');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${userId}/profile`);
                if (response.data.success) {
                    setProfile(response.data.profile);
                } else {
                    // 如果API返回了业务错误
                    console.error("获取个人资料失败 (API):", response.data.error);
                }
            } catch (error) {
                // 如果是网络或服务器错误
                console.error("获取个人资料失败 (Request):", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) {
        return <div className="profile-loading">正在加载个人资料...</div>;
    }

    if (!profile) {
        return <div className="profile-error">无法加载该用户。请检查浏览器控制台获取详细错误信息。</div>;
    }

    const { stats, works, likes } = profile;

    return (
        <div className="profile-page dark-theme">
            <header className="profile-header">
                <img src={profile.photo_url || 'default_avatar.png'} alt="avatar" className="profile-avatar" />
                <h2 className="profile-username">@{profile.username || profile.first_name}</h2>
                <div className="profile-stats-and-actions">
                    <div className="profile-stats">
                        <div className="stat-item">
                            <strong>{stats.following_count}</strong>
                            <span>关注</span>
                        </div>
                        <div className="stat-item">
                            <strong>{stats.followers_count}</strong>
                            <span>粉丝</span>
                        </div>
                        <div className="stat-item">
                            <strong>{stats.total_likes_received}</strong>
                            <span>获赞</span>
                        </div>
                    </div>
                    <button className="recharge-button-profile" onClick={() => navigate('/recharge')}>
                        充值
                    </button>
                </div>
            </header>
            
            <div className="profile-tabs">
                <button onClick={() => setActiveTab('works')} className={activeTab === 'works' ? 'active' : ''}>
                    作品 {works.length}
                </button>
                <button onClick={() => setActiveTab('likes')} className={activeTab === 'likes' ? 'active' : ''}>
                    喜欢 {likes.length}
                </button>
            </div>

            <div className="profile-content">
                <div className="video-grid">
                    {(activeTab === 'works' ? works : likes).map(video => (
                        <div key={video.id} className="video-grid-item">
                            <video src={`http://localhost:4000${video.video_url}`} className="video-thumbnail" />
                            <div className="thumbnail-likes">❤️ {video.likes_count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;