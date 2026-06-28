import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";
import "../styles/Classes.css";

function Classes() {

  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    class_name: "",
    department: "",
    year: "",
    section: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const saveClass = async () => {

    if (
      !formData.class_name ||
      !formData.department ||
      !formData.year ||
      !formData.section
    ) {
      alert("Fill all fields");
      return;
    }

    try {

      if (editingId) {

        await fetch(
          `http://127.0.0.1:5000/classes/${editingId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          }
        );

      } else {

        await fetch(
          "http://127.0.0.1:5000/classes",
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          }
        );

      }

      setFormData({
        class_name: "",
        department: "",
        year: "",
        section: ""
      });

      setEditingId(null);

      fetchClasses();

    } catch (error) {

      console.log(error);

    }

  };

  const editClass = (c) => {

    setEditingId(c.id);

    setFormData({
      class_name: c.class_name,
      department: c.department,
      year: c.year,
      section: c.section
    });

  };

  const deleteClass = async (id) => {

    if (!window.confirm("Delete this class?")) {
      return;
    }

    try {

      await fetch(
        `http://127.0.0.1:5000/classes/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

      fetchClasses();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="classes-container">

      <h1>
        🏫 Class Management
      </h1>

      <div className="class-form">

        <input
          name="class_name"
          placeholder="Class Name"
          value={formData.class_name}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <input
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />

        <input
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
        />

        <button onClick={saveClass}>

          {editingId
            ? "✏️ Update Class"
            : "➕ Add Class"}

        </button>

      </div>

      <div className="class-grid">

        {classes.map((c) => (

          <div
            className="class-card"
            key={c.id}
          >

            <h2>
              📚 {c.class_name}
            </h2>

            <p>
              🏢 {c.department}
            </p>

            <p>
              🎓 Year {c.year}
            </p>

            <p>
              👥 Section {c.section}
            </p>

            <div className="class-buttons">

              <button
                className="edit-btn"
                onClick={() => editClass(c)}
              >
                ✏️ Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteClass(c.id)}
              >
                🗑 Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Classes;