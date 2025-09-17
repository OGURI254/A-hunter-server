'use client'

import { Clock, Star, Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const CourseCard = (
    {title,description,_id}: 
    {title:string,description:string,_id:string}
) => {
    const pathName = usePathname()
    const isAdmin = pathName.includes('admin')
  return (
    <div className='w-[300px] pb-2 rounded-xl shadow-sm'>
        <div className='w-full h-[140px] relative'>
        <img 
        className='object-cover w-full h-full rounded-t-xl'
        src="https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXV0b21hdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="course" />
        </div>
        <section className='grid gap-2 px-2'>
        <div>
            <p className='font-semibold text-lg'>{title}</p>
            <p className='text-sm line-clamp-3 '>{description}</p>
        </div>
        <div className='flex items-center gap-2.5'>
            <div className='flex items-center'>
            <Star className='size-4'/>
            <Star className='size-4'/>
            <Star className='size-4'/>
            <Star className='size-4'/>              
            </div>
            <p>4.5</p>
        </div>

        <div>
            <Button variant='link'>
                <Clock/>
                5 weeks
            </Button>
            <Button variant='link'>
                <Users/>
                346
            </Button>
        </div>
        {isAdmin ?
        <a href={`/admin/courses/${_id}`}>
            <Button className='bg-[#F50516]'>Enroll Course</Button>
        </a>
        :
        <a href={`/learn/course/${_id}`}>
            <Button className='bg-[#F50516]'>Enroll Course</Button>
        </a>
        }
        </section>

    </div>
  )
}

export default CourseCard