
// tutor dashboard, create & manage course as well as view student progress

import CourseCard from "@/components/global/CourseCard";
import { Button } from "@/components/ui/button";
import { getCoursesTutor } from "@/lib/actions";
import { Plus} from "lucide-react";

const page = async () => {
  const courses = await getCoursesTutor()
  console.log(courses);
  return (
    <div>          
        <a href="/tutor/courses/new">
          <Button><Plus/> Course</Button>
        </a>

        {/* List courses */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {courses.map((course) => (
            <CourseCard             
            key={course._id}
            {...course}
            />
          ))}
        </section>      
    </div>
  )
}

export default page