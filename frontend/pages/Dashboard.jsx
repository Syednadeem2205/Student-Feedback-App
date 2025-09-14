import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard(){
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId:'', rating:5, message:'' });
  const [msg, setMsg] = useState('');

  useEffect(()=>{ fetchCourses(); }, []);

  async function fetchCourses(){
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
      if(res.data[0]) setForm(f=>({ ...f, courseId: res.data[0]._id }));
    } catch(err){ console.error(err) }
  }

  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/feedback', { courseId: form.courseId, rating: form.rating, message: form.message });
      setMsg('Feedback submitted');
      setForm({ ...form, message: '' });
    } catch(err){ setMsg('Error submitting'); }
  }

  return (
    <div className="card">
      <h2>Submit Feedback</h2>
      <form onSubmit={submit}>
        <select value={form.courseId} onChange={e=>setForm({...form, courseId:e.target.value})}>
          {courses.map(c=> <option key={c._id} value={c._id}>{c.code} - {c.name}</option>)}
        </select>
        <label>Rating
          <input type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form, rating: e.target.value})}/>
        </label>
        <textarea value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Message (optional)"/>
        <button type="submit">Submit</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
