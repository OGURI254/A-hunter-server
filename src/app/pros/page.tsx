'use client'
import JobCard from '@/components/globals/JobCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from 'convex/react'
import { ChevronLeftCircle, File, Filter, MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

const page = () => {
  const [proSelected,setProSelected] = useState(false)
  const workers = useQuery(api.workers.listWorkers)
  const params = useParams()  
  const router = useRouter()
  const searchParams = useSearchParams();
  const pro = searchParams.get('pro')
  
  
  
  return (
    <section className='max-w-5xl mx-auto py-8 px-4'>
      <h1 className='font-bold text-2xl'>Find a pro near you</h1>
      {/* Input */}
      <div className='flex items-center gap-1'>
        <Input
        placeholder='Search here'
        className='w-[400px] my-2'
        />
        <Filter         
        className='cursor-pointer'/>
      </div>
      <p>Found <span className='text-[#F50516]'>10</span> pros</p>    
      <section className='flex items-start gap-8'>

        <section className={`mt-5 flex flex-col gap-1.5 
          ${proSelected ? "hidden" : "block"}
          `}>
            {workers?.map((worker) => (
              <JobCard 
              {...worker}
              key={worker._id}
              />
            ))}          
        </section>
        
        {
          workers?.filter(worker => worker?._id === pro)
          ?.map((worker) => (
            
            <section className={`shadow-md rounded-xl p-4 w-full  lg:block 
            `}>            
               <div className='flex items-start justify-between w-full'>
                 <div className='flex flex-col gap-1'>
                   <ChevronLeftCircle
                   className='cursor-pointer'
                   onClick={() => setProSelected(false)}
                   />
                   <div className='flex items-start gap-2'>
                     <Avatar>
                       <AvatarImage src="https:github.com/shadcn.png" />
                       <AvatarFallback>CN</AvatarFallback>
                     </Avatar>
                     <div className='flex flex-col gap-0'>
                       <p className='font-semibold text-xl'>{worker.category}</p>
                       <div>
                         <a href={`/pros/${worker._id}`}>
                           <Button variant='link' className='justify-start py-0 text-blue-500'><File/> Profile</Button>
                         </a>
                         <Button variant='link' className='justify-start py-0'><MapPin/> {worker.residence}, {worker.country}</Button>
                       </div>
                       <Button className='mt-2 bg-[#F50516]'> Sign In to Book</Button>
                     </div>
                   </div>
                 </div>
  
                 <div>
                   <p className=''>Starts from </p>
                   <p className='font-semibold text-lg'>Ksh 400</p>
                 </div>
               </div>
  
               <div></div>
  
  
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
  
              
               <div className='py-2 '>
                 <h3 className='font-semibold'>Service overview</h3>
                 <p>{worker.description}</p>
               </div>
              
               {/* <div className='py-2 '>
                 <h3 className='font-semibold'>Services offered</h3>
                 <ul className='list-disc pl-4'>
                   <li>Install and repair bathroom piping and fixtures</li>
                   <li>Install and repair bathroom piping and fixtures</li>
                   <li>Install and repair bathroom piping and fixtures</li>
                 </ul>            
               </div>
          
               <div className='py-2 '>
                 <h3 className='font-semibold'>Includes</h3>
                 <ul className='list-disc pl-4'>
                   <li>Haircut & Hair Styles</li>
                   <li>Haircut & Hair Styles</li>
                   <li>Haircut & Hair Styles</li>              
                 </ul>            
               </div> */}
  
              
             </section>  
          ))
        }
      </section>
      

    </section>
  )
}

export default page