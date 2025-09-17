"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";


export default function CourseForm() {
  const createCourse = useMutation(api.courses.createCourse);
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    tutor: "",
  });
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseId = await createCourse({
        ...form        
      });
      router.push(`/admin/courses/${courseId}`)
      setForm({ title: "", description: "", tutor: "" });
    } catch (err) {
      console.error("Error creating course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold">Create New Course</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Tutor</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Tutor name"
          value={form.tutor}
          onChange={(e) => setForm({ ...form, tutor: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="border rounded p-2 w-full"
          placeholder="Course description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}
