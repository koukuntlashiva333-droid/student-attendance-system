import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "../utils/auth";
import "../styles/Attendance.css";

function Attendance() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [attendanceDate, setAttendanceDate] = useState("");
  const [message, setMessage] = useState("");

  const [reasons, setReasons] = useState({});

  useEffect(() => {

    fetchClasses();
    fetchAttendance();

  }, []);

  const fetchClasses = async () => {

    try {

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

    } catch (error) {

      console.log(error);
      setClasses([]);

    }

  };

  const fetchStudents = async (classId) => {

    try {

      const res = await fetch(
        `http://127.0.0.1:5000/students?class_id=${classId}`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      setStudents(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);
      setStudents([]);

    }

  };

  const fetchAttendance = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/attendance",
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      setAttendance(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);
      setAttendance([]);

    }

  };

  const markAttendance = async (
    studentId,
    status
  ) => {

    if (!attendanceDate) {

      setMessage(
        "Please select a date first"
      );

      return;

    }

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/attendance",
        {
          method: "POST",

          headers: {
            ...getAuthHeaders(),
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            student_id: studentId,

            status,

            attendance_date:
              attendanceDate,

            reason:
              status === "Absent"
                ? reasons[studentId] || ""
                : ""

          })

        }
      );

      const data = await res.json();

      setMessage(data.message);

      fetchAttendance();

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed to mark attendance"
      );

    }

  };

  const getPercentage = async (
    studentId
  ) => {

    try {

      const res = await fetch(
        `http://127.0.0.1:5000/attendance/percentage/${studentId}`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      setMessage(
        `Attendance Percentage: ${data.percentage}%`
      );

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed to get percentage"
      );

    }

  };

  return (

    <div className="attendance-container">

      <h1>
        📋 Attendance Management
      </h1>

      {message && (

        <div className="message-box">

          {message}

        </div>

      )}

      <div className="attendance-top">

        <div>

          <label>
            🏫 Select Class
          </label>

          <select
            value={selectedClass}
            onChange={(e) => {

              setSelectedClass(
                e.target.value
              );

              fetchStudents(
                e.target.value
              );

            }}
          >

            <option value="">
              Choose Class
            </option>

            {classes.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >
                {c.class_name}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label>
            📅 Select Date
          </label>

          <input
            type="date"
            value={attendanceDate}
            onChange={(e) =>
              setAttendanceDate(
                e.target.value
              )
            }
          />

        </div>

      </div>

      <div className="student-cards">

        {students.map((student) => (

          <div
            className="student-card"
            key={student.id}
          >

            <h2>
              👨‍🎓 {student.name}
            </h2>

            <p>
              🎫 {student.roll_no}
            </p>

            <p>
              🏢 {student.department}
            </p>

            <input
              type="text"
              placeholder="Reason if absent"
              value={
                reasons[student.id] || ""
              }
              onChange={(e) =>
                setReasons({

                  ...reasons,

                  [student.id]:
                    e.target.value

                })
              }
            />

            <div className="attendance-buttons">

              <button
                className="present-btn"
                onClick={() =>
                  markAttendance(
                    student.id,
                    "Present"
                  )
                }
              >
                ✅ Present
              </button>

              <button
                className="absent-btn"
                onClick={() =>
                  markAttendance(
                    student.id,
                    "Absent"
                  )
                }
              >
                ❌ Absent
              </button>

            </div>

            <button
              className="percentage-btn"
              onClick={() =>
                getPercentage(
                  student.id
                )
              }
            >
              📊 View %
            </button>

          </div>

        ))}

      </div>

      <div className="records-box">

        <h2>
          📑 Attendance Records
        </h2>

        <table>

          <thead>

            <tr>
              <th>Student ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Reason</th>
            </tr>

          </thead>

          <tbody>

            {attendance.map((record) => (

              <tr key={record.id}>

                <td>
                  {record.student_id}
                </td>

                <td>

                  <span
                    className={
                      record.status ===
                      "Present"
                        ? "status-present"
                        : "status-absent"
                    }
                  >

                    {record.status}

                  </span>

                </td>

                <td>
                  {record.date}
                </td>

                <td>
                  {record.reason || "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Attendance;