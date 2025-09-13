
// tutor dashboard, create & manage course as well as view student progress

import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";

const page = () => {
  
  return (
    <div>          
        <a href="/tutor/courses/new">
          <Button><Plus/> Course</Button>
        </a>

        {/* List courses */}
        <section></section>      
    </div>
  )
}

export default page