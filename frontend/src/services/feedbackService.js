import api from '../api';

// Submit new feedback
export const submitFeedback = (data) => api.post('/feedback', data);

// Get all feedbacks (or optionally /mine for current user)
export const getFeedbacks = () => api.get('/feedback');

// Delete a feedback by ID
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);

// Optional: fetch feedbacks of the current user
export const getMyFeedbacks = () => api.get('/feedback/mine');
