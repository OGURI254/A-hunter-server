'use client'
import React from 'react'
import { Button } from '../ui/button'
import { MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams, useRouter, useSearchParams } from 'next/navigation'


const JobCard = ({  
  user,
  _id,
  category,
  country,
  residence,
  description
}: {  
  user:string,
  _id:string,
  category:string,
  country:string,
  residence:string,
  description:string
}) => {
  
  const router = useRouter()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());   
  const pro = searchParams.get("pro");   

  return (
    <div 
    onClick={() => {
      params.set('pro',_id)
      router.push(`?${params.toString()}`);
    }}
    className={
    `shadow-md  w-[400px] rounded-md px-4 py-2
    cursor-pointer ${pro == _id && "bg-slate-800 text-white" }
    `}    
    >
        <div>
        <Button variant='link' ><User/> {user}</Button>
        </div>
        <p className='font-semibold text-2xl'>{category}</p>
        <p>{description}</p>
        <div className='flex flex-col items-start'>
        <Button variant='link' >
            <MapPin/>
            <p>{residence}, {country}</p>
        </Button>
        <Button variant='link' className='text-green-600'>
            Available
        </Button>
        </div>
    </div>
  )
}

export default JobCard