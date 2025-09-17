"use client";
import { useQuery, useMutation } from "convex/react";

import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function CoursesAdmin() {
  const courses = useQuery(api.courses.listCourses);
  const createCourse = useMutation(api.courses.createCourse);
  const [form, setForm] = useState({ title: "", description: "", tutor: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse(form);
    setForm({ title: "", description: "", tutor: "" });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Courses</h2>

      {/* Create form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Tutor"
          value={form.tutor}
          onChange={(e) => setForm({ ...form, tutor: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Course
        </button>
      </form>

      {/* List courses */}
      <ul className="space-y-2">
        {courses?.map((course) => (
          <li key={course._id} className="bg-white shadow p-3 rounded">
            <p className="font-semibold">{course.title}</p>
            <p className="text-sm">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
