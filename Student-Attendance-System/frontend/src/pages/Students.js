import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";
import "../styles/Students.css";

function Students() {

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    department: "",
    phone: "",
    class_id: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/students",
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      console.log("Students API:", data);

      setStudents(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.log(error);
      setStudents([]);

    }

  };

  const fetchClasses = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/classes",
        {
          headers: getAuthHeaders()
        }
      );

      const data = await res.json();

      console.log("Classes API:", data);

      setClasses(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.log(error);
      setClasses([]);

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addOrUpdateStudent = async () => {

    if (
      !formData.name ||
      !formData.roll_no ||
      !formData.department ||
      !formData.phone ||
      !formData.class_id
    ) {

      alert("Fill all fields");
      return;

    }

    try {

      if (editingId) {

        await fetch(
          `http://127.0.0.1:5000/students/${editingId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          }
        );

      } else {

        await fetch(
          "http://127.0.0.1:5000/students",
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          }
        );

      }

      setFormData({
        name: "",
        roll_no: "",
        department: "",
        phone: "",
        class_id: ""
      });

      setEditingId(null);

      fetchStudents();

    } catch (error) {

      console.log(error);

    }

  };

  const editStudent = (student) => {

    setFormData({
      name: student.name,
      roll_no: student.roll_no,
      department: student.department,
      phone: student.phone,
      class_id: student.class_id
    });

    setEditingId(student.id);

  };

  const deleteStudent = async (id) => {

    try {

      await fetch(
        `http://127.0.0.1:5000/students/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

      fetchStudents();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="students-container">

      <h1>Student Management</h1>

      <div className="student-form">

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="roll_no"
          placeholder="Roll Number"
          value={formData.roll_no}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <select
          name="class_id"
          value={formData.class_id}
          onChange={handleChange}
        >

          <option value="">
            Select Class
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

        <button onClick={addOrUpdateStudent}>
          {editingId
            ? "Update Student"
            : "Add Student"}
        </button>

      </div>

      <table>

        <thead>

          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.name}</td>
              <td>{student.roll_no}</td>
              <td>{student.department}</td>
              <td>{student.phone}</td>
              <td>{student.class_name}</td>

              <td>

                <button
                  onClick={() => editStudent(student)}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => deleteStudent(student.id)}
                >
                  🗑 Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Students;