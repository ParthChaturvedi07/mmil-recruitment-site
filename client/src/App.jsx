import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Technical from './pages/Technical';
import Interview from './pages/Interview';
import Results from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Main Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* 2. Fix for your error: Redirect /portal to / */}
        <Route path="/portal" element={<Navigate to="/" replace />} />

        {/* 3. Technical Rounds (Redirects & Dynamic) */}
        <Route path="/technical" element={<Navigate to="/technical/design" replace />} />
        <Route path="/technical/:domain" element={<Technical />} />
        
        {/* 4. Other Pages */}
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />

        {/* 5. Catch-all: If user types ANY unknown URL, go to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;