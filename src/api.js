// src/api.js
import axios from 'axios';

// 创建一个axios实例
const api = axios.create({
  // !! 重要 !! 将 baseURL 设置为你的后端服务器地址
  // 如果你在本地运行后端，它通常是 http://localhost:4000
  // 如果你已将后端部署到服务器，请替换为你的服务器URL
  baseURL: 'http://localhost:4000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;