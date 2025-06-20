// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

// 创建 Auth Context
const AuthContext = createContext(null);

// 创建一个自定义Hook，方便其他组件使用Auth Context
export const useAuth = () => useContext(AuthContext);

// 创建 Provider 组件
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 存储从我们后端获取的用户信息
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                // 检查是否在Telegram环境中
                if (window.Telegram && window.Telegram.WebApp) {
                    const tg = window.Telegram.WebApp;
                    tg.ready(); // 通知Telegram应用已准备好
                    
                    const initData = tg.initData;
                    if (!initData) {
                        throw new Error('无法获取Telegram initData');
                    }

                    // 调用后端的 /api/auth/verify 接口
                    const response = await api.post('/auth/verify', { initData });

                    if (response.data.success) {
                        setUser(response.data.user); // 登录成功，设置用户信息
                        console.log('用户验证成功:', response.data.user);
                    } else {
                        throw new Error(response.data.error || '验证失败');
                    }
                } else {
                     // 非Telegram环境的模拟数据，方便在浏览器中调试
                    console.warn('非Telegram环境，使用模拟用户数据进行调试。');
                    setUser({ id: 1, telegram_user_id: 12345, username: 'testuser', first_name: 'Test', plan_type: 'free' });
                }
            } catch (err) {
                console.error('认证流程出错:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []); // 这个 effect 只在组件首次加载时运行一次

    const value = {
        user,
        loading,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};