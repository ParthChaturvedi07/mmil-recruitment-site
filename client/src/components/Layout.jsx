import React from 'react';
import logo from '../assets/Group 1597880472.png'; // Your Logo File
import bulb from '../assets/light-bulb 1.png';     // Your Bulb File

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      {/* 1. Background Text (Centered automatically by CSS) */}
      <div className="bg-text">
        INSPIRE<br />INVENT<br />INNOVATE
      </div>
      
      {/* 2. Bulb (Positioned absolute top-right) */}
      <div className="bulb-container">
        <img src={bulb} alt="Idea" className="bulb-img" />
        <div className="bulb-trail"></div>
      </div>

      {/* 3. Logo (Centered automatically because app-container is flex column) */}
      <img src={logo} alt="Microsoft Mobile Innovation Lab" className="logo-main" />

      {/* 4. Page Content (Centered automatically) */}
      <div className="card-wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;