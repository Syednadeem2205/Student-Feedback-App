import api from '../api';

// Submit new feedback
export const submitFeedback = async (data) => {
  const res = await api.post('/feedback', data);
  return res.data;
};

// Get all feedbacks
export const getFeedbacks = async () => {
  const res = await api.get('/feedback');
  return res.data;
};

// Delete a feedback by ID
export const deleteFeedback = async (id) => {
  const res = await api.delete(`/feedback/${id}`);
  return res.data;
};

// Fetch feedbacks of the current user
export const getMyFeedbacks = async () => {
  const res = await api.get('/feedback/mine');
  return res.data;
};
