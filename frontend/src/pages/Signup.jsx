import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await signup(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to student dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl mb-4">Signup</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Signup</button>
      </form>
    </div>
  );
}
