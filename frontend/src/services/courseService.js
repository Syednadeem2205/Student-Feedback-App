import api from "../api";

export const getCourses = () => api.get("/courses");

export const addCourse = (data) => api.post("/courses", data);

export const deleteCourse = (id) => api.delete(`/courses/${id}`);
