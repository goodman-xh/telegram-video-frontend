import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import './RechargePage.css';

const plans = [
    { type: 'monthly', name: '月卡会员', price: '10' },
    { type: 'quarterly', name: '季卡会员', price: '25' },
    { type: 'yearly', name: '年卡会员', price: '88' },
    { type: 'lifetime', name: '永久会员', price: '188' }
];

const RechargePage = () => {
    const { user } = useAuth();
    const [paymentAddress, setPaymentAddress] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            const fetchAddress = async () => {
                try {
                    const response = await api.get(`/payments/user-address/${user.id}`);
                    if (response.data.success) {
                        setPaymentAddress(response.data.address);
                        const qrUrl = await QRCode.toDataURL(response.data.address, { width: 220, margin: 1 });
                        setQrCodeUrl(qrUrl);
                    }
                } catch (error) {
                    console.error("获取支付地址失败:", error);
                }
            };
            fetchAddress();
        }
    }, [user]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('地址已复制到剪贴板！');
        });
    };

    return (
        <div className="recharge-page dark-theme">
            <h3>会员充值</h3>
            <p className="recharge-subtitle">向下方地址转账指定金额即可自动开通</p>

            {paymentAddress ? (
                <div className="payment-area">
                    {qrCodeUrl && <img src={qrCodeUrl} alt="USDT TRC20" className="qr-code" />}
                    <div className="address-box" onClick={() => copyToClipboard(paymentAddress)}>
                        <p className="payment-address">{paymentAddress}</p>
                        <span className="copy-hint">点击复制地址</span>
                    </div>
                </div>
            ) : (
                <p>正在生成您的专属支付地址...</p>
            )}

            <div className="plans-grid-row">
                {plans.map(plan => (
                    <div 
                        key={plan.type} 
                        className={`plan-card-square ${selectedPrice === plan.price ? 'selected' : ''}`}
                        onClick={() => setSelectedPrice(plan.price)}
                    >
                        <h4>{plan.name}</h4>
                        <div className="plan-price-square">{plan.price}<span>USDT</span></div>
                    </div>
                ))}
            </div>
            {selectedPrice && 
                <p className="payment-tip">
                    请转账 <strong>{selectedPrice} USDT</strong> 以开通您选择的套餐
                </p>
            }
        </div>
    );
};

export default RechargePage;