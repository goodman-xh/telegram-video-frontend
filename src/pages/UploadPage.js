import React, { useState, useRef } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './UploadPage.css';

const UploadPage = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); // 创建一个ref来引用文件输入框

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        // 清空之前的消息
        setMessage('');
        setError('');

        if (selectedFile) {
            // --- 新增的文件大小检查逻辑 ---
            const maxSizeInBytes = 200 * 1024 * 1024; // 200MB
            if (selectedFile.size > maxSizeInBytes) {
                setError('文件过大！请选择小于200MB的视频。');
                setFile(null);
                // 清空文件输入框的值，以便用户可以重新选择同一个文件
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }
            // --- 检查结束 ---

            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.id) {
            setError('用户信息尚未加载，请稍后再试。');
            return;
        }
        if (!file || !title) {
            setError('请确保已选择视频文件并填写标题。');
            return;
        }

        const formData = new FormData();
        formData.append('videoFile', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('uploaderId', user.id);

        setMessage('正在上传...');
        setUploadProgress(0);

        try {
            const response = await api.post('/videos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            if (response.data.success) {
                setMessage('上传成功！视频正在等待审核。');
                setFile(null);
                setTitle('');
                setDescription('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setError(response.data.error || '上传失败。');
            }
        } catch (err) {
            setError('上传过程中发生错误，请检查网络。');
            console.error(err);
        } finally {
            setUploadProgress(0);
        }
    };

    return (
        <div className="upload-page">
            <h2>发布新视频</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="file-input" className="file-input-label">
                        {file ? `已选择: ${file.name}` : '点击选择视频 (最大200MB)'}
                    </label>
                    <input 
                        ref={fileInputRef}
                        id="file-input" 
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange} 
                    />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="填写标题..." value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <textarea placeholder="填写描述..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit" disabled={!file || !title || uploadProgress > 0 || !user}>
                    {uploadProgress > 0 ? `上传中... ${uploadProgress}%` : '发布'}
                </button>
            </form>
            {uploadProgress > 0 && (
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default UploadPage;