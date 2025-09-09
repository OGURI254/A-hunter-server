import { Star } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"


const CourseCard = () => {
  return (
    <Card className="pt-0 ">
        <div className="bg-amber-600 h-[80%] aspect-video rounded-t-xl ">
        <img 
        src="https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXV0b21hdGlvbnxlbnwwfHwwfHx8MA%3D%3D" 
        alt="" 
        className="object-cover rounded-t-xl"
        />
        </div>
        <div className="px-4">
        <Link href='/courses/1'>
            <p className="font-semibold text-lg">The complete guide to Automation</p>
            <p className="text-sm">Lewis Gitonga, Joseph Oguri</p>
        </Link>
        <div className="flex items-center gap-1.5">
            <Star size={16} />
            <p>4.5 (300)</p>                  
        </div>
        <Badge>Best seller</Badge>
        </div>
    </Card>
  )
}

export default CourseCard