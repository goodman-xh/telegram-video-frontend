import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            console.log('[Auth] 认证流程开始...');
            
            // **核心修正**: 不再轮询，直接读取我们在index.html中保存的全局变量
            const initData = window.myTelegramInitData;

            if (initData && initData.length > 0) {
                console.log('[Auth] 成功从全局变量获取到 initData。');
                try {
                    console.log('[Auth] 正在向后端发送验证请求...');
                    const response = await api.post('/auth/verify', { initData });
                    console.log('[Auth] 收到后端响应:', response.data);

                    if (response.data.success && response.data.user) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                        console.log('[Auth] 认证成功！');
                    } else {
                        throw new Error(response.data.error || '后端返回验证失败');
                    }
                } catch(err) {
                    console.error('[Auth] 后端验证过程中发生错误:', err);
                    setIsAuthenticated(false);
                }
            } else {
                console.error('[Auth] 致命错误: 全局变量中没有找到initData。小程序可能未在Telegram中正确启动。');
                setIsAuthenticated(false);
            }

            setLoading(false);
            console.log('[Auth] 认证流程结束。');
        };

        // 直接执行，不再需要延时或轮询
        verifyUser();
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};