import api from '../api';

// Authentication

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  // Save JWT and user info
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const signup = async (data) => {
  const res = await api.post('/auth/signup', data);
  // Save JWT and user info
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.post('/auth/change-password', data);
  return res.data;
};

// Optional: get current user profile
export const getProfile = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
