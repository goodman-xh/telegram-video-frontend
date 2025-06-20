// /pages/HomePage.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import VideoPlayer from '../components/VideoPlayer';
import './HomePage.css';

// 搜索和充值图标 (内联SVG)
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const RechargeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.7V6.2C21 5.09543 20.1046 4.2 19 4.2H5C3.89543 4.2 3 5.09543 3 6.2V17.8C3 18.9046 3.89543 19.8 5 19.8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 8.4H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 19.8C18.2091 19.8 20 18.0091 20 15.8C20 13.5909 18.2091 11.8 16 11.8C13.7909 11.8 12 13.5909 12 15.8C12 18.0091 13.7909 19.8 16 19.8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 14V17.6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.2 15.8H17.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const loadVideos = async (pageNum) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await api.get(`/videos/feed?page=${pageNum}&limit=5`);
            if (response.data.success && response.data.data.length > 0) {
                setVideos(prev => [...prev, ...response.data.data]);
                setPage(pageNum + 1);
            }
        } catch (error) {
            console.error("加载视频失败:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos(1);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                const videoHeight = container.clientHeight;
                const index = Math.round(container.scrollTop / videoHeight);
                setCurrentVideoIndex(index);

                const isBottom = container.scrollTop + videoHeight >= container.scrollHeight - videoHeight;
                if (isBottom && !loading) {
                    loadVideos(page);
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, page]);

    return (
        <div className="homepage-container" ref={containerRef}>
            {/* --- 新增的顶部固定按钮 --- */}
            <div className="homepage-top-actions">
                <button className="top-action-btn" onClick={() => alert('搜索功能待开发')}>
                    <SearchIcon />
                </button>
                <button className="top-action-btn" onClick={() => navigate('/recharge')}>
                    <RechargeIcon />
                </button>
            </div>

            {videos.map((video, index) => (
                <VideoPlayer
                    key={video.id}
                    videoData={video}
                    isVisible={index === currentVideoIndex}
                />
            ))}
            {loading && <div className="loading-indicator">正在加载更多视频...</div>}
        </div>
    );
};

export default HomePage;