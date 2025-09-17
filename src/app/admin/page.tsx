'use client'

import CourseCard from "@/components/globals/CourseCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { api } from "../../../convex/_generated/api";

export default function AdminDashboard() {
  const courses = useQuery(api.courses.listCourses)
  console.log(courses);

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <a href="/admin/courses/new">
        <Button><Plus/> Course</Button>
      </a>
      <section className="flex flex-wrap gap-3 my-5">
        {courses?.map((course) => (
          <CourseCard {...course}/>
        ))}        
      </section>
    </div>
  );
}
