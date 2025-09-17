'use client'
import CourseCard from '@/components/globals/CourseCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { Brain, MessageCircle, Mic, PenToolIcon, Star, StarsIcon, Users } from 'lucide-react'
import React, { Suspense } from 'react'
import { api } from '../../../convex/_generated/api'

const page = () => {
  const courses = useQuery(api.courses.listCourses)
  console.log(courses);
  return (
    <Suspense fallback={
      <div>Loading...</div>
    }>
    <section className='min-h-[60vh] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-[#F50516]/10 p-8'>
      <div className='grid gap-1.5'>
        <div className='flex items-center gap-1 text-[#F50516]'>
          <StarsIcon/>
          <p className='font-semibold'>Welcome to AHunter Learn</p>
        </div>
        <h2 className='font-bold text-4xl'>Master new skills with <br/> <span className='text-[#F50516]'>AI-powered</span> learning</h2>
        <p>Experience interactive learning like never before. Our AI tutor adapts to you with voice, text, visual, and hands-on exercises that make every lesson engaging, practical, and fun.</p>
      </div>

      <Card className='bg-white w-[80%]'>
        <CardHeader className=''>
          <div className='flex items-center gap-4'>
            <Brain className='size-10'/>
            <div>
              <h3 className='font-semibold text-lg'>A-Hunter AI Tutor</h3>
              <p className=''>Ready to help you learn</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='grid gap-1.5'>
          <Button className='justify-start bg-[#F50516]/10 text-black'>
            <MessageCircle/>
            <p>Hi John! Ready to continue your plumbing course ?</p>
          </Button>
          <Button className='justify-start bg-[#F50516]/10 text-black'>
            <Mic/>
            <p>Show me pipe fitting techniques</p>
          </Button>
          <Button className='justify-start bg-[#F50516]/10 text-black'>
            <PenToolIcon/>
            <p>Draw a plumbing diagram to practice</p>
          </Button>
        </CardContent>
      </Card>
    </section>

    <section className='px-4 py-8 gap-8 md:max-w-5xl mx-auto flex flex-col items-center'>
       <div className='flex flex-col md:flex-row md:items-center gap-4'>
        <div>
          <img src="/images/about-1.svg" alt="about-1" />
        </div>
        <div>      
          <p className='font-bold text-4xl'>Build in-demand skills to <br/> boost your career</p>
          <div className='pt-4 grid gap-2'>
            <p> Stand out in today’s job market by learning and growing your skills through hands-on projects that showcase what you can do. </p>
            <p>Each project adds to your portfolio, giving you real proof of your abilities and the confidence to take on new opportunities.</p>
          </div>
        </div>
      </div>      
    </section>

    {courses && (
      <section className='py-8 px-4 md:max-w-5xl mx-auto flex flex-col'>
        <h2 className='font-semibold text-2xl'>Popular Courses</h2>
        <section className='mt-4 flex flex-wrap gap-4'>
          {courses?.map((course) => (
            <CourseCard 
            key={course?._id}
            {...course}/>
          ))}        
        </section>
      </section>
    )}
    </Suspense>
  )
}

export default page