import api from "../api";

export const submitFeedback = (data) => api.post("/feedback", data);

export const getFeedbacks = () => api.get("/feedback");

export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);
