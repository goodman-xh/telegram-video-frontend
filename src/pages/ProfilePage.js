import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('works'); // 'works' or 'likes'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${userId}/profile`);
                if (response.data.success) {
                    setProfile(response.data.profile);
                }
            } catch (error) {
                console.error("获取个人资料失败:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    if (loading) {
        return <div className="profile-loading">正在加载个人资料...</div>;
    }

    if (!profile) {
        return <div className="profile-error">无法加载该用户。</div>;
    }

    const { stats, works, likes } = profile;

    return (
        <div className="profile-page">
            <header className="profile-header">
                <img src={profile.photo_url || 'default_avatar.png'} alt="avatar" className="profile-avatar" />
                <h2 className="profile-username">@{profile.username || profile.first_name}</h2>
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
                {/* 可以添加关注/编辑资料按钮 */}
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