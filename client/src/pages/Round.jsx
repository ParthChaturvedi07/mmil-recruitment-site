import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './Round.css';

const Round = () => {
  const { roundId, domain } = useParams();
  const navigate = useNavigate();

  // Redirect to default domain if none selected for Round 1
  useEffect(() => {
    if (roundId === '1' && !domain) {
      navigate('/round/1/design', { replace: true });
    }
  }, [roundId, domain, navigate]);

  const DomainTabs = () => {
    const tabs = ['Design', 'Programming', 'Web dev', 'Android'];
    return (
      <div className="domain-tabs">
        {tabs.map((tab) => {
          const slug = tab.toLowerCase().replace(' ', '');
          const isActive = domain === slug;
          return (
            <Link key={slug} to={`/round/1/${slug}`} className={`tab-link ${isActive ? 'active' : ''}`}>
              {tab}
            </Link>
          );
        })}
      </div>
    );
  };

  const InputField = ({ label, placeholder, hasCloseIcon }) => (
    <div className="input-group">
      <label className="input-label">{label}*</label>
      <div className="input-wrapper">
        <input type="text" className="input-element" placeholder={placeholder} />
        {hasCloseIcon && <span className="close-icon">✕</span>}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="round-container">
        {roundId === '1' && <DomainTabs />}

        <div className="card-outer">
          <div className="card-inner">
            
            {/* Header */}
            <div className="round-header">
              <span className="round-tag">Round {roundId}</span>
              <span className="arrow-icon">&gt;</span>
            </div>

            {/* Titles */}
            <h2 className="round-title">
              {roundId === '1' ? 'Technical Round' : 'Interview Round'}
            </h2>
            <p className="round-subtitle">
              {roundId === '1' ? 'Task round to check your skills.' : 'Check your personality skills.'}
            </p>

            {/* Content Logic */}
            <div className="content-body">
              <h3 className="section-title">Instructions for Students</h3>
              
              <ul className="instruction-list">
                 {/* Hardcoded for visual check based on screenshot */}
                 <li>You are required to make a unit Converter app</li>
                 <li>Task details can be found <span className="blue-link">here</span></li>
                 <li>The task deadline is 1pm IST on 16-04-2023</li>
                 <li>Task should be submitted below</li>
                 <li>Apk should be uploaded on g-drive and attached below</li>
              </ul>

              <h3 className="section-title">Details to be filled by students.</h3>
              
              <form>
                <InputField label="Phone number" />
                <InputField label="Github Link" placeholder="Paste here" hasCloseIcon={true} />
                <InputField label="G-drive Link" placeholder="Paste here" hasCloseIcon={true} />
                
                <button className="submit-btn">Submit</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Round;