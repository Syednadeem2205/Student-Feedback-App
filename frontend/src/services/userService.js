import api from "../api";

export const getUsers = () => api.get("/users");

export const getUserById = (id) => api.get(`/users/${id}`);
