import React, { useEffect, useState } from "react";
import { getMyFeedbacks, submitFeedback } from "../services/feedbackService";

export default function MyFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: 5, comment: "" });

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await getMyFeedbacks();
      setFeedbacks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await submitFeedback(form);
      setForm({ courseId: "", rating: 5, comment: "" });
      fetchFeedbacks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">My Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input type="text" name="courseId" placeholder="Course ID" value={form.courseId} onChange={handleChange} required className="border px-3 py-2 rounded w-full"/>
        <input type="number" name="rating" value={form.rating} onChange={handleChange} min={1} max={5} className="border px-3 py-2 rounded w-full"/>
        <textarea name="comment" placeholder="Comment" value={form.comment} onChange={handleChange} className="border px-3 py-2 rounded w-full"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit Feedback</button>
      </form>
      <ul className="space-y-2">
        {feedbacks.map(f => <li key={f._id}>{f.courseId} — {f.rating} stars — {f.comment}</li>)}
      </ul>
    </div>
  );
}
