import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

// 引入一个SVG作为加号图标，或者一个图标库的组件
const PlusIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2.33331V25.6666" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.33337 14H25.6667" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                首页
            </NavLink>
            <NavLink to="/upload" className="nav-item-upload">
                <div className="upload-button-inner">
                    <PlusIcon />
                </div>
            </NavLink>
            <NavLink to="/me" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                我
            </NavLink>
        </nav>
    );
};

export default BottomNav;