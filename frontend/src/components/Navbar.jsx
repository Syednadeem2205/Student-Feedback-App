import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
  return (
    <nav className="nav">
      <div className="nav-left"><Link to="/">Feedback App</Link></div>
      <div>
        { token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-feedbacks">My Feedbacks</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
