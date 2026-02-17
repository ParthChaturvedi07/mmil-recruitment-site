import React from 'react';
import './FirstPage.css';

// Importing your specific assets
import robotBoard from '../assets/image 23.png';
import mmilLogo from '../assets/Group 1597880472.png';

const FirstPage = () => {
  return (
    <div className="landing-wrapper">
      <div className="hero-container">
        {/* The Robot holding the board */}
        <img src={robotBoard} alt="Robot Board" className="robot-image" />
        
        {/* The Logo positioned exactly on the board */}
        <div className="logo-overlay">
          <img src={mmilLogo} alt="MMIL Logo" className="board-logo" />
        </div>
      </div>
    </div>
  );
};

export default FirstPage;