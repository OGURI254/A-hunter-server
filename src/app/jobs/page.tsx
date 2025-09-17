'use client'
import JobCard from '@/components/globals/JobCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { File, Filter, MapPin } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
  const [jobSelected,setJobSelected] = useState(1)
  return (
    <section className='max-w-5xl mx-auto py-8 px-4'>
      <h1 className='font-bold text-2xl'>Find a job near you</h1>
      {/* Input */}
      <div className='flex items-center gap-1'>
        <Input
        placeholder='Search here'
        className='w-[400px] my-2'
        />
        <Filter/>
      </div>
      <p>Found <span className='text-[#F50516]'>10</span> jobs</p>    
      <section className='flex items-start gap-8'>

        <section className='mt-5 flex flex-col gap-1.5'>
          <JobCard selected={true}/>
          <JobCard/>
          <JobCard/>
          <JobCard/>
          <JobCard/>
        </section>
      
        <section className='shadow-md rounded-xl p-4 w-full '>
          {/* job details */}
          <div className='flex items-start justify-between w-full'>
            <div className='flex items-start gap-2'>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0'>
                <p className='font-semibold text-xl'>Plumber</p>
                <div>
                  <Button variant='link' className='justify-start py-0'><File/> Profile</Button>
                  <Button variant='link' className='justify-start py-0'><MapPin/> Nairobi, Ke</Button>
                </div>
                <Button className='mt-2 bg-[#F50516]'> Sign In to Book</Button>
              </div>
            </div>

            <div>
              <p className=''>Starts from </p>
              <p className='font-semibold text-lg'>Ksh 400</p>
            </div>
          </div>

          <div></div>

          {/* job description */}
          <div className='pb-2 pt-4'>
            <h3 className='font-semibold'>Description</h3>
            <div className='grid grid-cols-2'>
              <div className='flex items-center gap-2'>
                <p>Contract Type :</p>
                <p>Freelance</p>
              </div>
              <div className='flex items-center gap-2'>
                <p>Qualification :</p>
                <p>Freelance</p>
              </div>
              <div className='flex items-center gap-2'>
                <p>Work Experience :</p>
                <p>5 years</p>
              </div>
              <div className='flex items-center gap-2'>
                <p>Hourly rate :</p>
                <p>100Kshs per hour</p>
              </div>
            </div>
          </div>

          {/* Service overview */}
          <div className='py-2 '>
            <h3 className='font-semibold'>Service overview</h3>
            <p>We’re renovating a bathroom and need a skilled plumber to install tiles, fix plumbing fixtures,and ensure water tightness. The role includes working on both copper and PVC piping. Materials will be provided you bring your expertise.</p>
          </div>

          {/* Services offered */}
          <div className='py-2 '>
            <h3 className='font-semibold'>Services offered</h3>
            <ul className='list-disc pl-4'>
              <li>Install and repair bathroom piping and fixtures</li>
              <li>Install and repair bathroom piping and fixtures</li>
              <li>Install and repair bathroom piping and fixtures</li>
            </ul>            
          </div>

          {/* job requirements*/}
          {/* Services offered */}
          <div className='py-2 '>
            <h3 className='font-semibold'>Includes</h3>
            <ul className='list-disc pl-4'>
              <li>Haircut & Hair Styles</li>
              <li>Haircut & Hair Styles</li>
              <li>Haircut & Hair Styles</li>              
            </ul>            
          </div>

          
        </section>
      </section>
      

    </section>
  )
}

export default page