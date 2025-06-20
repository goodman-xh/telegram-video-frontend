import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import VideoPlayer from '../components/VideoPlayer';
import './HomePage.css';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const containerRef = useRef(null);

    // 加载视频数据
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

    // 首次加载
    useEffect(() => {
        loadVideos(1);
    }, []);

    // 监听滚动事件，判断当前播放的视频
    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                const videoHeight = container.clientHeight;
                const index = Math.round(container.scrollTop / videoHeight);
                setCurrentVideoIndex(index);

                // 判断是否滚动到底部附近，加载更多
                const isBottom = container.scrollTop + videoHeight >= container.scrollHeight - videoHeight; // 提前一个屏幕高度加载
                if (isBottom) {
                    loadVideos(page);
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loading, page]);

    return (
        <div className="homepage-container" ref={containerRef}>
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