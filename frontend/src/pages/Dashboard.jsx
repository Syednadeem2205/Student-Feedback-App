import React, { useState, useEffect } from "react";
import api from "../api";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: 5, message: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await api.get("/courses");
      setCourses(res.data || []);
      if (res.data[0]) setForm((f) => ({ ...f, courseId: res.data[0]._id }));
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.post("/feedback", {
        courseId: form.courseId,
        rating: form.rating,
        message: form.message,
      });
      setMsg("Feedback submitted successfully");
      setForm({ ...form, message: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Error submitting feedback");
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Course</label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Message (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Share your thoughts..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
