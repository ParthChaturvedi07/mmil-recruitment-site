import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import AdminPage from './pages/AdminPage';
import DomainStudents from './pages/DomainStudents';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/complete-profile" element={<Chatbot />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:domainName" element={<DomainStudents />} />
      </Routes>
      <ToastContainer position="top-center" />
      
    </div>
  )
}

export default App