import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CompleteProfile from "./pages/CompleteProfile";
import AllApplications from "./pages/admin/AllApplications";
import DepartmentApplications from "./pages/admin/DepartmentApplications";
import { ToastContainer } from "react-toastify";
import AdminPage from './pages/AdminPage';
import DomainStudents from './pages/DomainStudents';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:domainName" element={<DomainStudents />} />
        <Route path="/admin/applications" element={<AllApplications />} />
        <Route path="/admin/applications/:department" element={<DepartmentApplications />} />

      </Routes>
      <ToastContainer position="top-center" />
    </div>
  )
}

export default App;
