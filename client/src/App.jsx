import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CompleteProfile from "./pages/CompleteProfile";
import { ToastContainer } from "react-toastify";
import AdminPage from './pages/AdminPage';
import DomainStudents from './pages/DomainStudents';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:domainName" element={<DomainStudents />} />
      </Routes>
      <ToastContainer position="top-center" />
      
    </div>
  )
}

export default App