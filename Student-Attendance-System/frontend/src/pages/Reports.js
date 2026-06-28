import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";
import "../styles/Reports.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Reports() {

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const studentsRes = await fetch(
      "http://127.0.0.1:5000/students",
      {
        headers: getAuthHeaders()
      }
    );

    const classesRes = await fetch(
      "http://127.0.0.1:5000/classes",
      {
        headers: getAuthHeaders()
      }
    );

    const attendanceRes = await fetch(
      "http://127.0.0.1:5000/attendance",
      {
        headers: getAuthHeaders()
      }
    );

    const studentsData = await studentsRes.json();
    const classesData = await classesRes.json();
    const attendanceData = await attendanceRes.json();

    const safeStudents =
      Array.isArray(studentsData)
        ? studentsData
        : [];

    const safeClasses =
      Array.isArray(classesData)
        ? classesData
        : [];

    const safeAttendance =
      Array.isArray(attendanceData)
        ? attendanceData
        : [];

    setStudents(safeStudents);
    setClasses(safeClasses);
    setAttendance(safeAttendance);

    safeStudents.forEach(async (student) => {

      const res = await fetch(
        `http://127.0.0.1:5000/attendance/percentage/${student.id}`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      setPercentages(prev => ({
        ...prev,
        [student.id]: data.percentage
      }));

    });

  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Student Attendance Report",
      15,
      20
    );

    const tableData = students.map(student => [

      student.name,

      student.roll_no,

      student.class_name,

      `${percentages[student.id] || 0}%`,

      (percentages[student.id] || 0) < 75
        ? "High Risk"
        : "Safe"

    ]);

    autoTable(doc, {

      head: [[
        "Name",
        "Roll No",
        "Class",
        "Attendance %",
        "Status"
      ]],

      body: tableData,

      startY: 30

    });

    doc.save("Attendance_Report.pdf");

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

    <div className="reports-page">

      <div className="reports-header">

        <div>

          <h1>
            📊 Reports Dashboard
          </h1>

          <p>
            Attendance Analytics & Insights
          </p>

        </div>

        <button
          className="pdf-btn"
          onClick={exportPDF}
        >
          📄 Export PDF
        </button>

      </div>

      <div className="report-cards">

        <div className="report-card">

          <h2>
            👨‍🎓 {students.length}
          </h2>

          <p>Total Students</p>

        </div>

        <div className="report-card">

          <h2>
            🏫 {classes.length}
          </h2>

          <p>Total Classes</p>

        </div>

        <div className="report-card">

          <h2>
            📅 {attendance.length}
          </h2>

          <p>Attendance Records</p>

        </div>

      </div>

      <div className="reports-grid">

        <div className="chart-card">

          <h2>
            Attendance Overview
          </h2>

          <Pie data={chartData} />

        </div>

        <div className="risk-card">

          <h2>
            ⚠ High Risk Students
          </h2>

          {

            students
              .filter(
                s =>
                  (percentages[s.id] || 0) < 75
              )
              .map(student => (

                <div
                  className="risk-item"
                  key={student.id}
                >

                  <span>
                    {student.name}
                  </span>

                  <span>
                    {percentages[student.id] || 0}%
                  </span>

                </div>

              ))

          }

        </div>

      </div>

      <div className="student-table-card">

        <h2>
          Student Performance
        </h2>

        <table>

          <thead>

            <tr>

              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Attendance</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {

              students.map(student => (

                <tr key={student.id}>

                  <td>
                    {student.name}
                  </td>

                  <td>
                    {student.roll_no}
                  </td>

                  <td>
                    {student.class_name}
                  </td>

                  <td>
                    {percentages[student.id] || 0}%
                  </td>

                  <td>

                    {

                      (percentages[student.id] || 0) < 75

                        ?

                        <span className="danger">
                          High Risk
                        </span>

                        :

                        <span className="safe">
                          Safe
                        </span>

                    }

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Reports;