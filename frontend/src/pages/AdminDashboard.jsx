import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError("");
      const s = await api.get("/admin/analytics/summary");
      setSummary(s.data);

      const u = await api.get("/admin/users");
      setUsers(u.data.items);

      const c = await api.get("/courses");
      setCourses(c.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data");
      if (err.response?.status === 403) navigate("/");
    }
  }

  async function exportCSV() {
    try {
      const res = await api.get("/admin/feedback/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "feedback_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to export CSV");
    }
  }

  async function toggleBlock(id, block) {
    try {
      await api.put(`/admin/users/${id}/block`, { block });
      load();
    } catch {
      setError("Failed to update user status");
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch {
      setError("Failed to delete user");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

      {error && <p className="text-red-600">{error}</p>}

      {summary ? (
        <div className="space-y-4">
          <div>
            <p>Total Feedback: {summary.totalFeedback}</p>
            <p>Total Students: {summary.totalStudents}</p>
          </div>

          <div>
            <h4 className="font-medium">Avg Rating per Course</h4>
            <ul className="list-disc ml-5">
              {summary.avgRatingPerCourse.map((a) => (
                <li key={a.courseId}>
                  {a.courseName} — {a.avgRating.toFixed(2)} ({a.count})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Rating Distribution</h4>
            <ul className="list-disc ml-5">
              {summary.ratingDistribution.map((r) => (
                <li key={r._id}>
                  {r._id} stars — {r.count}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={exportCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Feedback CSV
          </button>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}

      <div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Students</h3>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u._id} className="flex items-center justify-between border p-2 rounded">
              <div>
                {u.name} — {u.email} — {u.isBlocked ? "Blocked" : "Active"}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleBlock(u._id, !u.isBlocked)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Courses</h3>
        <ul className="list-disc ml-5 space-y-1">
          {courses.map((c) => (
            <li key={c._id}>
              {c.code} - {c.name}
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/admin/courses")}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Manage Courses
        </button>
      </div>
    </div>
  );
}
