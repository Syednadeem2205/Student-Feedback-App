import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e=>{
    e.preventDefault();
    setErr('');
    try{
      const res = await api.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    }catch(error){
      setErr(error.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" required/>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" required/>
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" required/>
        <button type="submit">Signup</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
