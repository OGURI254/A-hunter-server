
// Landing page - just view available courses if student, can view ongoing courses
// If tutor button to onboard

import CourseCard from "@/components/global/CourseCard";


const page = () => {
     
  return (
    <>            
        {/* Courses */}
        <div>
          <h2 className="font-semibold text-xl">Our Courses</h2>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            
          </section>
        </div>                  
    </>
  );
}

export default page