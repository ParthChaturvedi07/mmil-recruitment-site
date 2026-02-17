import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <h1 className="page-title">Rounds</h1>

      <div className="card-outer">
        {/* Round 1 -> Goes to Technical Domains */}
        <Link to="/technical/design" className="home-item">
          <div>
             <span className="small">Round 1</span>
             <h3>Technical Round</h3>
             <span className="small">Task round to check your skills.</span>
          </div>
          <div className="arrow-big">&gt;</div>
        </Link>

        {/* Round 2 -> Goes to Interview Info */}
        <Link to="/interview" className="home-item">
          <div>
             <span className="small">Round 2</span>
             <h3>Interview and HR Round</h3>
             <span className="small">Personal interview and HR interview round...</span>
          </div>
          <div className="arrow-big">&gt;</div>
        </Link>

        {/* Results -> Goes to Results Page */}
        <Link to="/results" className="home-item">
          <div>
             <h3>Results</h3>
             <span className="small">Check Technical round results.</span>
          </div>
          <div className="arrow-big">&gt;</div>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;