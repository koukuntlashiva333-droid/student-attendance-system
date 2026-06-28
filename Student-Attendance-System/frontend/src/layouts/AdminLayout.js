import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/AdminLayout.css";

function AdminLayout({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (

    <div className="admin-layout">

      <Sidebar />

      <div className="main-content">
        {children}
      </div>

    </div>

  );

}

export default AdminLayout;