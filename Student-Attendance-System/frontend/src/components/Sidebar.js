import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaChalkboard,
  FaUserGraduate,
  FaClipboardCheck,
  FaChartBar,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="sidebar">

      <div className="sidebar-top">

        <div className="profile-circle">
          👨‍🎓
        </div>

        <h2>
          Attendance Pro
        </h2>

        <p>
          {user?.username || "Admin"}
        </p>

      </div>

      <ul>

        <li>
          <Link to="/dashboard">
            <FaTachometerAlt />
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/classes">
            <FaChalkboard />
            Classes
          </Link>
        </li>

        <li>
          <Link to="/students">
            <FaUserGraduate />
            Students
          </Link>
        </li>

        <li>
          <Link to="/attendance">
            <FaClipboardCheck />
            Attendance
          </Link>
        </li>

        <li>
          <Link to="/reports">
            <FaChartBar />
            Reports
          </Link>
        </li>

        <li>
          <Link to="/ai-assistant">
            <FaRobot />
            AI Assistant
          </Link>
        </li>

      </ul>

      <button
        className="logout-btn"
        onClick={logout}
      >

        <FaSignOutAlt />

        Logout

      </button>

    </div>

  );

}

export default Sidebar;