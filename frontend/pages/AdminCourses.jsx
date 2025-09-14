import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add or Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // Update existing
        await axios.put(`${API_URL}/courses/${editingCourse._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new
        await axios.post(`${API_URL}/courses`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: "", description: "" });
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({ name: course.name, description: course.description });
  };

  // Delete course
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Courses</h2>

      {/* Add/Edit form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Course name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Course description"
          value={formData.description}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
        {editingCourse && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingCourse(null);
              setFormData({ name: "", description: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Course list */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No courses found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCourses;
