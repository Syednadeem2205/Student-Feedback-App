import React, { useState, useEffect } from "react";
import api from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setForm({
        name: res.data.name,
        phone: res.data.phone || "",
        dob: res.data.dob || "",
        address: res.data.address || "",
      });
    } catch (err) {
      setError("Failed to load profile");
    }
  }

  async function save(e) {
    e.preventDefault();
    try {
      await api.put("/users/me", form);
      setMsg("Profile saved");
      load();
    } catch (err) {
      setError(err.response?.data?.msg || "Save failed");
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    try {
      await api.post("/auth/change-password", pw);
      setMsg("Password changed");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Password change failed");
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      await api.post("/users/me/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Avatar uploaded");
      load();
    } catch (err) {
      setError(err.response?.data?.msg || "Upload failed");
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={save} className="space-y-3">
        <input
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={user.email}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
        <input
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          value={form.dob ? form.dob.split("T")[0] : ""}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-2 mt-2">
          <input
            type="password"
            placeholder="Current password"
            value={pw.currentPassword}
            onChange={(e) =>
              setPw({ ...pw, currentPassword: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder="New (min 8, 1 num, 1 special)"
            value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Change
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Avatar</h3>
        <input type="file" onChange={uploadAvatar} />
        {user.avatarUrl && (
          <img
            src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
            className="mt-2 rounded-full w-24 h-24 object-cover"
            alt="avatar"
          />
        )}
      </div>
    </div>
  );
}
