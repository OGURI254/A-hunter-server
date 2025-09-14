import { Star } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"


const CourseCard = ({_id,title,description,thumbnailUrl,tutor,visibility,createdAt}) => {
  return (
    <Card className="pt-0 w-[400px]">
        <div className="bg-amber-600 h-[60%] aspect-video rounded-t-xl ">
        <img 
        src={thumbnailUrl} 
        alt={title}
        className="object-cover rounded-t-xl"
        />
        </div>
        <div className="px-4">
        <Link href={`tutor/courses/${_id}`}>
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm">{description}</p>
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