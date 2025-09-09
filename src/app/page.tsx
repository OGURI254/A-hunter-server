'use client'
// Landing page - just view available courses if student, can view ongoing courses
// If tutor button to onboard

import BlockEditor from "@/components/global/BlockEditor";
import CourseCard from "@/components/global/CourseCard";
import { Button } from "@/components/ui/button";
import { School, Star } from "lucide-react";

import {Authenticated,Unauthenticated} from 'convex/react'
import { SignInButton, UserButton } from "@clerk/nextjs";

const page = () => {
     
  return (
    <>
      <header className="flex items-center justify-between p-4 shadow-xl ">
        <div className="font-bold text-2xl">A-Hunter </div>
        <Unauthenticated>
          <SignInButton mode="modal">
            <Button>
              Join
            </Button>
          </SignInButton>
        </Unauthenticated>
        <Authenticated>
          <div className="flex items-center gap-2">
            <Button variant='outline'>Tutor <School/> </Button>
            <UserButton/>
          </div>
        </Authenticated>
      </header>
      <main className="max-w-5xl py-8 px-4">  
        {/* Courses */}
        <div>
          <h2 className="font-semibold text-xl">Our Courses</h2>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
          </section>
        </div>
      </main>
            
    </>
  );
}

export default page