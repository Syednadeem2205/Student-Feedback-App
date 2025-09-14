import React, { useEffect, useState } from "react";
import api from "../api";

export default function MyFeedbacks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/feedback/mine");
      setData(res.data.items || []);
    } catch (error) {
      setErr(error.response?.data?.msg || "Failed to load feedbacks");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Delete feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      load();
    } catch (error) {
      alert(error.response?.data?.msg || "Delete failed");
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Feedbacks</h2>

      {loading && <p>Loading...</p>}
      {err && <p className="text-red-500">{err}</p>}

      {!loading && !data.length && (
        <p className="text-gray-500">You haven’t submitted any feedback yet.</p>
      )}

      <ul className="space-y-4">
        {data.map((f) => (
          <li
            key={f._id}
            className="p-4 border rounded-lg flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <strong>{f.course?.name || "Course"}</strong>
              <span className="text-yellow-500">{f.rating} ⭐</span>
            </div>
            <p className="text-gray-700">{f.message}</p>
            <small className="text-gray-400">
              {new Date(f.createdAt).toLocaleString()}
            </small>
            <button
              onClick={() => remove(f._id)}
              className="self-end text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
