import React from 'react';
import './Result.css';

// Importing your specific assets
import logo from '../assets/mmil-logo.png';
import mainCard from '../assets/Group 1597880471.png';
import lightBulb from '../assets/light-bulb 1.png';
import vectorLine from '../assets/Vector 1.png';
import rectProg from '../assets/Rectangle 42.png';
import rectWeb from '../assets/Rectangle 43.png';
import rectAndroid from '../assets/Rectangle 44.png';
import rectDesign from '../assets/Rectangle 45.png';

const ResultsPage = () => {
  const categories = [
    { title: "Programming", img: rectProg },
    { title: "Web Development", img: rectWeb },
    { title: "Android Development", img: rectAndroid },
    { title: "Design", img: rectDesign },
  ];

  return (
    <div className="page-container">
      {/* Top Logo */}
      <div className="logo-section">
        <img src={logo} alt="MMIL Logo" className="mmil-logo" />
      </div>

      {/* The Main Visual Section */}
      <div className="content-wrapper">
        
        {/* Decorative Assets on the right */}
        <div className="decoration-layer">
          <img src={vectorLine} alt="" className="vector-line" />
          <img src={lightBulb} alt="" className="bulb-icon" />
        </div>

        {/* The Card with the built-in Heading */}
        <div 
          className="background-card" 
          style={{ backgroundImage: `url(${mainCard})` }}
        >
          {/* The grid of 4 category boxes */}
          <div className="results-grid">
            {categories.map((cat, index) => (
              <div 
                key={index} 
                className="category-box"
                style={{ backgroundImage: `url(${cat.img})` }}
              >
                <span className="box-label">{cat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;