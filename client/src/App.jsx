import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CompleteProfile from "./pages/CompleteProfile";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
      <ToastContainer position="top-center" />
      
    </div>
  )
}

export default App