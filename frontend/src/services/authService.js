import api from '../api';

// Authentication
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (data) => api.post('/auth/signup', data);
export const changePassword = (data) => api.post('/auth/change-password', data);

// Optional: get current user profile
export const getProfile = () => api.get('/users/me');
