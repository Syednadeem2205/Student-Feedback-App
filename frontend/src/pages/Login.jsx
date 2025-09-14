import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e=>{
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" required/>
        <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type="password" required/>
        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
