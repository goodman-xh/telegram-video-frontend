import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import './RechargePage.css';

const plans = [
    { type: 'monthly', name: '月卡会员', price: 10, duration: '30天' },
    { type: 'quarterly', name: '季卡会员', price: 25, duration: '90天' },
    { type: 'yearly', name: '年卡会员', price: 88, duration: '365天' },
    { type: 'lifetime', name: '永久会员', price: 188, duration: '永久有效' }
];

const RechargePage = () => {
    const { user, loading: userLoading } = useAuth();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // 当生成支付信息后，生成对应的二维码
    useEffect(() => {
        if (paymentInfo && paymentInfo.address) {
            QRCode.toDataURL(paymentInfo.address, { width: 200 })
                .then(url => setQrCodeUrl(url))
                .catch(err => console.error('QR Code generation failed:', err));
        }
    }, [paymentInfo]);

    // 当生成支付信息后，开始轮询检查支付状态
    useEffect(() => {
        let intervalId;
        if (paymentInfo && paymentInfo.paymentId) {
            setStatusMessage('正在等待您的付款...');
            intervalId = setInterval(async () => {
                try {
                    const response = await api.get(`/payments/status/${paymentInfo.paymentId}`);
                    if (response.data.success && response.data.status === 'paid') {
                        setStatusMessage('支付成功！您的会员已更新。');
                        setPaymentInfo(null); // 清空支付信息
                        clearInterval(intervalId);
                        // TODO: 可以触发一个全局事件或刷新用户信息
                    }
                } catch (err) {
                    console.error("查询支付状态失败:", err);
                }
            }, 5000); // 每5秒查询一次
        }
        return () => clearInterval(intervalId); // 组件卸载时清除定时器
    }, [paymentInfo]);

    const handlePlanSelect = async (plan) => {
        if (!user) {
            setError('请先等待用户信息加载完毕。');
            return;
        }
        setError('');
        setPaymentInfo(null);
        setStatusMessage('正在为您生成专属支付地址...');
        try {
            const { data } = await api.post('/payments/request-address', { userId: user.id, planType: plan.type });
            if (data.success) {
                setPaymentInfo(data.paymentInfo);
            } else {
                setError(data.error || '生成支付地址失败。');
            }
        } catch (err) {
            setError('请求支付地址时出错，请稍后重试。');
            console.error(err);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('地址已复制！');
        });
    };
    
    if (userLoading) return <div>正在加载用户信息...</div>

    return (
        <div className="recharge-page">
            <div className="user-plan-status">
                <h3>当前状态</h3>
                <p><strong>{user?.plan_type === 'free' ? '免费套餐' : `${user?.plan_type}会员`}</strong></p>
                <p>{user?.plan_type !== 'free' && user?.plan_expiry_date ? `到期时间: ${new Date(user.plan_expiry_date).toLocaleString()}` : '仅可观看视频前30秒'}</p>
            </div>
            
            {!paymentInfo ? (
                <div className="plan-selection">
                    <h3>选择升级套餐</h3>
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <div key={plan.type} className="plan-card" onClick={() => handlePlanSelect(plan)}>
                               <h4>{plan.name}</h4>
                               <div className="plan-price"><span>$</span>{plan.price}</div>
                               <div className="plan-duration">{plan.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="payment-instructions">
                    <h3>请支付</h3>
                    <p>请向以下USDT-TRC20地址转账</p>
                    <p className="payment-amount"><strong>{paymentInfo.expectedAmount} USDT</strong></p>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="Payment QR Code" className="qr-code" />}
                    <div className="address-box" onClick={() => copyToClipboard(paymentInfo.address)}>
                        <p className="payment-address">{paymentInfo.address}</p>
                        <span className="copy-hint">点击复制</span>
                    </div>
                    <button onClick={() => setPaymentInfo(null)} className="cancel-button">返回重新选择</button>
                </div>
            )}
            
            {statusMessage && <p className="status-message">{statusMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RechargePage;