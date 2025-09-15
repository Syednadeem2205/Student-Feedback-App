import React, { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Courses</h2>
      <ul className="list-disc ml-5 space-y-2">
        {courses.map(c => (
          <li key={c._id}>
            {c.name} — <Link to="/myfeedback" className="text-blue-500 underline">Give Feedback</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
