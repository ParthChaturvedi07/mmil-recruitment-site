import React from 'react';
import Layout from '../components/Layout';

const Results = () => {
  return (
    <Layout>
        <h1 className="page-title">Results</h1>
        <div className="card-outer">
            <div className="card-inner">
                <h2 className="round-main-title">Results</h2>
                <p className="round-sub-title">Technical round results.</p>
                <div style={{textAlign: 'center', marginTop: '30px', color: '#666'}}>
                    Coming Soon
                </div>
            </div>
        </div>
    </Layout>
  );
}
export default Results;