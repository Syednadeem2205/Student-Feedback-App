import api from '../api';

// Fetch all users
export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

// Fetch a user by ID
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// Update current user profile
export const updateProfile = async (data) => {
  const res = await api.put('/users/me', data);
  return res.data;
};

// Upload avatar for current user
export const uploadAvatar = async (formData) => {
  const res = await api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
