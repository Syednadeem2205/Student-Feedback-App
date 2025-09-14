import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Profile(){
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [pw, setPw] = useState({ currentPassword:'', newPassword:'' });
  const [msg, setMsg] = useState('');

  useEffect(()=>{ load(); }, []);
  async function load(){
    const res = await api.get('/users/me');
    setUser(res.data);
    setForm({ name: res.data.name, phone: res.data.phone||'', dob: res.data.dob||'', address: res.data.address||'' });
  }

  async function save(e){
    e.preventDefault();
    await api.put('/users/me', form);
    setMsg('Saved');
    load();
  }

  async function changePassword(e){
    e.preventDefault();
    try {
      await api.post('/auth/change-password', pw);
      setMsg('Password changed');
      setPw({ currentPassword:'', newPassword:'' });
    } catch(err){ setMsg(err.response?.data?.msg || 'Error'); }
  }

  async function uploadAvatar(e){
    const file = e.target.files[0];
    if(!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    const res = await api.post('/users/me/avatar', fd, { headers: {'Content-Type':'multipart/form-data'} });
    setMsg('Avatar uploaded');
    load();
  }

  if(!user) return <p>Loading...</p>;
  return (
    <div className="card">
      <h2>Profile</h2>
      <form onSubmit={save}>
        <input value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" required />
        <input value={user.email} readOnly />
        <input value={form.phone||''} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" />
        <input type="date" value={form.dob?form.dob.split('T')[0]:''} onChange={e=>setForm({...form, dob:e.target.value})} />
        <textarea value={form.address||''} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Address" />
        <button type="submit">Save</button>
      </form>

      <div>
        <h3>Change Password</h3>
        <form onSubmit={changePassword}>
          <input type="password" placeholder="Current" value={pw.currentPassword} onChange={e=>setPw({...pw, currentPassword:e.target.value})}/>
          <input type="password" placeholder="New (min 8, 1 num, 1 special)" value={pw.newPassword} onChange={e=>setPw({...pw, newPassword:e.target.value})}/>
          <button type="submit">Change</button>
        </form>
      </div>

      <div>
        <h3>Avatar</h3>
        <input type="file" onChange={uploadAvatar}/>
        {user.avatarUrl && <img src={`http://localhost:5000${user.avatarUrl}`} style={{width:100}} alt="avatar"/>}
      </div>
      {msg && <p>{msg}</p>}
    </div>
  );
}
