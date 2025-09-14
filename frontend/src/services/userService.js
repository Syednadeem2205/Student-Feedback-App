import api from '../api';

// Fetch all users
export const getUsers = () => api.get('/users');

// Fetch a user by ID
export const getUserById = (id) => api.get(`/users/${id}`);

// Update current user profile
export const updateProfile = (data) => api.put('/users/me', data);

// Upload avatar for current user
export const uploadAvatar = (formData) =>
  api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
