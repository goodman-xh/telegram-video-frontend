import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VideoPlayer.css';

// 假设我们有一个图标库，或者用文本代替
const LikeIcon = ({ liked }) => <span className={`video-action-icon ${liked ? 'liked' : ''}`}>❤️</span>;
const FollowIcon = () => <span className="follow-plus">+</span>;

const VideoPlayer = ({ videoData, isVisible }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    // 点击视频时切换播放/暂停
    const handleVideoClick = () => {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // 当视频进入视口时自动播放
    useEffect(() => {
        if (isVisible) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // 回到视频开头
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    const handleLike = () => {
        // TODO: 调用后端API处理点赞逻辑
        console.log(`点赞视频 ${videoData.id}`);
    };
    
    const handleFollow = () => {
        // TODO: 调用后端API处理关注逻辑
        console.log(`关注用户 ${videoData.uploader_id}`);
    };

    return (
        <div className="video-player-container">
            <video
                ref={videoRef}
                className="video-player"
                src={`http://localhost:4000${videoData.video_url}`} // 使用完整的后端地址
                loop
                onClick={handleVideoClick}
            />
            
            <div className="video-overlay-info">
                <div className="video-text-info">
                    <Link to={`/profile/${videoData.uploader_id}`} className="uploader-username">
                        @{videoData.uploader_name || '匿名用户'}
                    </Link>
                    <p className="video-title">{videoData.title}</p>
                </div>
            </div>

            <div className="video-overlay-actions">
                <div className="action-item">
                    <Link to={`/profile/${videoData.uploader_id}`} className="uploader-avatar-link">
                         <img 
                            src={videoData.uploader_photo || 'default_avatar.png'} 
                            alt="avatar" 
                            className="uploader-avatar"
                         />
                         <FollowIcon />
                    </Link>
                </div>
                <div className="action-item" onClick={handleLike}>
                    <LikeIcon liked={false} />
                    <span className="action-count">{videoData.likes_count}</span>
                </div>
                 {/* 可以继续添加评论、分享等按钮 */}
            </div>
        </div>
    );
};

export default VideoPlayer;