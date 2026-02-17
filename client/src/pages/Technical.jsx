import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Technical = () => {
  const { domain } = useParams(); // Gets 'design', 'web', etc.

  // Tabs Helper
  const Tabs = () => (
    <div className="tabs-container">
      {['Design', 'Programming', 'Web dev', 'Android'].map((name) => {
        const slug = name.toLowerCase().replace(' ', '');
        const isActive = domain === slug;
        return (
          <Link 
            key={slug} 
            to={`/technical/${slug}`} 
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );

  // Content Logic
  let instructions = [];
  let formContent = null;
  let showSubmit = true;

  if (domain === 'programming') {
     instructions = [
       "The contest will be held on Hackerrank.com.",
       "It will be of 2.5 hours and will contain 5 questions.",
       "The contest timing will be from 4pm to 6:30pm IST on 15-04-23.",
       "Please sign up on Hackerrank.com before attempting the quiz."
     ];
     formContent = (
       <>
         <div className="input-group">
           <label className="input-label">Phone number*</label>
           <input type="text" className="input-line" />
         </div>
         <div style={{textAlign: 'center', fontSize: '12px', marginTop: '20px'}}>
            <a href="#" className="link-blue">Click Here</a> to go the contest page.
         </div>
       </>
     );
     showSubmit = false;
  } else if (domain === 'design') {
      instructions = [
          <>You are required to choose ANY ONE task from <span className="link-blue">here</span></>,
          "The task deadline is 1pm IST on 16-04-2023",
          "Task should be submitted below"
      ];
      formContent = (
        <>
          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <input type="text" className="input-line" />
          </div>
          <div className="input-group">
            <label className="input-label">Figma/Adobe Xd Link*</label>
            <input type="text" className="input-line" placeholder="Paste here" />
            <span className="input-icon">✕</span>
          </div>
        </>
      );
  } else {
      // Web Dev & Android (Matches Image 7)
      instructions = [
          "You are required to make a unit Converter app",
          <>Task details can be found <span className="link-blue">here</span></>,
          "The task deadline is 1pm IST on 16-04-2023",
          "Task should be submitted below",
          "Apk should be uploaded on g-drive and attached below"
      ];
      formContent = (
        <>
          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <input type="text" className="input-line" />
          </div>
          <div className="input-group">
            <label className="input-label">Github Link*</label>
            <input type="text" className="input-line" placeholder="Paste here" />
            <span className="input-icon">✕</span>
          </div>
          <div className="input-group">
            <label className="input-label">G-drive Link*</label>
            <input type="text" className="input-line" placeholder="Paste here" />
            <span className="input-icon">✕</span>
          </div>
        </>
      );
  }

  return (
    <Layout>
      <Tabs />
      <div className="card-outer">
        <div className="card-inner">
          <div className="round-header-top">
            <span>Round 1</span>
            <span style={{fontSize:'20px'}}>&gt;</span>
          </div>
          
          <h2 className="round-main-title">Technical Round</h2>
          <p className="round-sub-title">Task round to check your skills.</p>

          <div className="content-area">
            <h3 className="section-label">Instructions for Students</h3>
            <ul className="instruction-list">
              {instructions.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <h3 className="section-label">Details to be filled by students.</h3>
            <form>
              {formContent}
              {showSubmit && <button className="btn-submit">Submit</button>}
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Technical;