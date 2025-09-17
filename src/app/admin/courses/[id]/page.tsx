'use client'

import { redirect, useParams } from 'next/navigation'
import React from 'react'
import CourseLayout from '../components/CourseLayout'

const page = () => {
  const params = useParams()  
  const {id} = params
  
  if (!id) redirect('/admin')
  return (
    <div>
      <CourseLayout/>      
    </div>
  )
}

export default page