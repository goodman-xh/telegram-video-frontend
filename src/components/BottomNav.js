// src/components/BottomNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css'; // 为导航栏添加样式

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                首页
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                +
            </NavLink>
            <NavLink to="/recharge" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                充值
            </NavLink>
            <NavLink to="/me" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                我
            </NavLink>
        </nav>
    );
};

export default BottomNav;