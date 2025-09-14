import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ load(); }, []);
  async function load(){
    try{
      const s = await api.get('/admin/analytics/summary');
      setSummary(s.data);
      const u = await api.get('/admin/users');
      setUsers(u.data.items);
      const c = await api.get('/courses');
      setCourses(c.data);
    } catch(err){ console.error(err); if(err.response?.status===403) navigate('/'); }
  }

  async function exportCSV(){
    const res = await api.get('/admin/feedback/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `feedback_export.csv`);
    document.body.appendChild(link);
    link.click();
  }

  async function toggleBlock(id, block){
    await api.put(`/admin/users/${id}/block`, { block });
    load();
  }

  async function deleteUser(id){
    if(!confirm('Delete user?')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  }

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      {summary ? (
        <>
          <p>Total Feedback: {summary.totalFeedback}</p>
          <p>Total Students: {summary.totalStudents}</p>
          <h4>Avg Rating per Course</h4>
          <ul>{summary.avgRatingPerCourse.map(a=> <li key={a.courseId}>{a.courseName} — {a.avgRating.toFixed(2)} ({a.count})</li>)}</ul>
          <h4>Rating distribution</h4>
          <ul>{summary.ratingDistribution.map(r=> <li key={r._id}>{r._id} stars — {r.count}</li>)}</ul>
          <button onClick={exportCSV}>Export Feedback CSV</button>
        </>
      ) : <p>Loading...</p>}
      <h3>Students</h3>
      <ul>{users.map(u=>(
        <li key={u._id}>
          {u.name} — {u.email} — {u.isBlocked ? 'Blocked' : 'Active'}
          <button onClick={()=>toggleBlock(u._id, !u.isBlocked)}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
          <button onClick={()=>deleteUser(u._id)}>Delete</button>
        </li>
      ))}</ul>

      <h3>Courses</h3>
      <ul>{courses.map(c=> <li key={c._id}>{c.code} - {c.name}</li>)}</ul>
      <button onClick={()=>navigate('/admin/courses')}>Manage Courses</button>
    </div>
  );
}
