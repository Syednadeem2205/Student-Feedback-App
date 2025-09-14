import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyFeedbacks(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    try {
      const res = await api.get('/feedback/mine');
      setData(res.data.items);
    } catch(err){ console.error(err) }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function remove(id){
    if(!confirm('Delete feedback?')) return;
    await api.delete('/feedback/' + id);
    load();
  }

  return (
    <div className="card">
      <h2>My Feedbacks</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {data.map(f=>(
            <li key={f._id}>
              <strong>{f.course?.name || 'Course'}</strong> — {f.rating} ⭐
              <p>{f.message}</p>
              <small>{new Date(f.createdAt).toLocaleString()}</small>
              <div><button onClick={()=>remove(f._id)}>Delete</button></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
