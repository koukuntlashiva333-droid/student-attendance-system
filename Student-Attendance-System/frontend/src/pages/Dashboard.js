import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

import "../styles/Dashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {

    fetchStudents();
    fetchAttendance();
    fetchClasses();

  }, []);

  

  const fetchStudents = async () => {

    const res = await fetch(
      "http://127.0.0.1:5000/students",
      {
        headers: getAuthHeaders()
      }
    );

    const data = await res.json();

    setStudents(
      Array.isArray(data) ? data : []
    );

  };

  const fetchAttendance = async () => {

    const res = await fetch(
      "http://127.0.0.1:5000/attendance",
      {
        headers: getAuthHeaders()
      }
    );

    const data = await res.json();

    setAttendance(
      Array.isArray(data) ? data : []
    );

  };


  const fetchClasses = async () => {

  const res = await fetch(
    "http://127.0.0.1:5000/classes",
    {
      headers: getAuthHeaders()
    }
  );

  const data = await res.json();

  setClasses(
    Array.isArray(data)
      ? data
      : []
  );

};

  const presentCount = attendance.filter(
    a => a.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    a => a.status === "Absent"
  ).length;

  const chartData = {

    labels: [
      "Present",
      "Absent"
    ],

    datasets: [
      {
        data: [
          presentCount,
          absentCount
        ],

        backgroundColor: [
          "#10b981",
          "#ef4444"
        ]
      }
    ]

  };

  return (

<div className="dashboard-container">

<h1 className="dashboard-title">
📊 Dashboard Overview
</h1>

<div className="dashboard-cards">

<div className="dashboard-card">

<h2>
👨‍🎓 {students.length}
</h2>

<p>
Total Students
</p>

</div>

<div className="dashboard-card">

<h2>
📅 {attendance.length}
</h2>

<p>
Attendance Records
</p>

</div>

<div className="dashboard-card">

<h2>
🏫 {classes.length}
</h2>

<p>
Active Classes
</p>

</div>

</div>

<div className="chart-box">

<h2>
Attendance Overview
</h2>

<Pie data={chartData}/>

</div>

</div>

);

}

export default Dashboard;