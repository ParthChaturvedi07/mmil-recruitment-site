import React from 'react';
import Layout from '../components/Layout';

const Interview = () => {
  return (
    <Layout>
      <h1 className="page-title">Rounds</h1>
      
      <div className="card-outer">
        {/* Active Interview Card */}
        <div className="card-inner">
          <div className="round-header-top">
            <span>Round 2</span>
            <span style={{fontSize:'20px'}}>&gt;</span>
          </div>
          
          <h2 className="round-main-title">Interview and HR Round</h2>
          <p className="round-sub-title" style={{marginBottom:'20px'}}>
            Personal interview and HR interview round to check your personality and coordination skills.
          </p>

          <div className="content-area">
            <h3 className="section-label">Instructions for Students</h3>
            <ul className="instruction-list">
              <li>Your interview is scheduled for [Date Yet to announce] at [Time Yet to announce]. Please ensure you are available at least 10 minutes before the scheduled time.</li>
              <li>Interviewer will focus on different aspects of your skills and experience.</li>
              <li>Be ready to discuss specific examples from your past experiences that demonstrate your skills, problem-solving abilities, and teamwork.</li>
              <li>Please have a copy of your resume for reference.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Interview;