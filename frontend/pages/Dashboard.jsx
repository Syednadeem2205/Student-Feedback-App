import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard(){
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId:'', rating:5, message:'' });
  const [msg, setMsg] = useState('');
  const [mine, setMine] = useState([]);

  useEffect(()=>{ fetchCourses(); loadMine(); }, []);

  async function fetchCourses(){
    const res = await api.get('/courses');
    setCourses(res.data);
    if(res.data[0]) setForm(f=>({ ...f, courseId: res.data[0]._id }));
  }

  async function loadMine(){
    const res = await api.get('/feedback/mine');
    setMine(res.data.items);
  }

  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/feedback', { courseId: form.courseId, rating: parseInt(form.rating,10), message: form.message });
      setMsg('Feedback submitted');
      setForm({ ...form, message:'' });
      loadMine();
    } catch(err){ setMsg(err.response?.data?.msg || 'Error'); }
  }

  async function startEdit(f){
    setForm({ courseId: f.course?._id || f.course, rating: f.rating, message: f.message, editId: f._id });
  }
  async function saveEdit(e){
    e.preventDefault();
    await api.put('/feedback/' + form.editId, { rating: form.rating, message: form.message });
    setForm({ courseId: courses[0]?._id || '', rating:5, message:'' });
    loadMine();
    setMsg('Edited');
  }

  return (
    <div className="card">
      <h2>Submit Feedback</h2>
      <form onSubmit={form.editId ? saveEdit : submit}>
        <select value={form.courseId} onChange={e=>setForm({...form, courseId:e.target.value})}>
          {courses.map(c=> <option key={c._id} value={c._id}>{c.code} - {c.name}</option>)}
        </select>
        <label>Rating
          <input type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form, rating: e.target.value})}/>
        </label>
        <textarea value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Message (optional)"/>
        <button type="submit">{form.editId ? 'Save Edit' : 'Submit'}</button>
      </form>
      {msg && <p>{msg}</p>}

      <h3>Your recent feedback</h3>
      <ul>
        {mine.map(f=>(
          <li key={f._id}>
            <strong>{f.course?.name || 'Course'}</strong> — {f.rating} ⭐
            <p>{f.message}</p>
            <small>{new Date(f.createdAt).toLocaleString()}</small>
            <div>
              <button onClick={()=>startEdit(f)}>Edit</button>
              <button onClick={async ()=>{ if(confirm('Delete?')) { await api.delete('/feedback/'+f._id); loadMine(); } }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
