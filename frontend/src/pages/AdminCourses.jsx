import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setError("");
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses");
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/courses/${editing._id}`, form);
        setMsg("Course updated successfully");
      } else {
        await api.post("/courses", form);
        setMsg("Course added successfully");
      }
      setForm({ name: "", description: "" });
      setEditing(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    setForm({ name: course.name, description: course.description });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
      setMsg("Course deleted");
    } catch (err) {
      console.error(err);
      setError("Failed to delete course");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <div className="space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editing ? "Update Course" : "Add Course"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", description: "" });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Course List */}
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((c) => (
              <tr key={c._id}>
                <td className="border px-4 py-2">{c.name}</td>
                <td className="border px-4 py-2">{c.description}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border px-4 py-2 text-center">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
