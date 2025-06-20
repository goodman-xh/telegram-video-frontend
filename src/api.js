import axios from 'axios';

// 使用相对路径 '/api'。
// 这样，无论你的前端部署在哪个域名，它都会向该域名下的 /api 路径发送请求。
// 例如，前端在 https://www.omo123.com, 它就会请求 https://www.omo123.com/api
const api = axios.create({
  baseURL: '/api',
});

export default api;