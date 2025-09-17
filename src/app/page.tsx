import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <>
    {/*cover*/}
    <section className='relative h-[60vh] lg:h-[80vh] bg-slate-900'>
      <img 
      className='object-cover h-full w-full'
      src="/images/cover.png" alt="cover" />
      <div className='absolute top-0 left-0 h-full w-full bg-slate-100/80 flex flex-col justify-center px-4  md:px-10'>
        <div className='max-w-md md:max-w-xl flex flex-col gap-2'>        
          <div className='flex items-center gap-1.5'>
            <p>Find your match</p>
            <div className='h-1 w-10 rounded-md bg-[#F50516]'></div>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold'>Find Trusted Workers.<br/> Get Jobs Done</h2>        
          <p>Connect with verified professionals and casual workers across every field from fundis and service providers to skilled specialists. Book, pay, and track jobs with confidence, all in one powerful platform.</p>
          <div className='flex items-center gap-1.5'>
            <Button variant='outline'>Find work</Button>
            <Button className='bg-[#F50516]'>Hire Talent</Button>
          </div>
        </div>
      </div>
    </section>
    {/*about*/}
    <section className='px-4 py-8 gap-8 md:max-w-5xl mx-auto flex flex-col items-center'>
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        <div>
          <img src="/images/about-1.svg" alt="about-1" />
        </div>
        <div>
          <p className='font-bold text-4xl'>10,000+</p>
          <p className='font-bold text-xl'>trusted workers and jobs across Kenya</p>
          <div className='my-2 flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Hire verified casual and skilled professionals near you</p>
            </div>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Book jobs instantly and pay securely with M-Pesa, bank or card</p>
            </div>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Track progress and confirm completion with full transparency</p>
            </div>
          </div>
          <Button className='bg-[#F50516]'>Find Work</Button>
        </div>
      </div>      

      <div className='flex flex-col w-full md:flex-row md:items-center justify-between'>
        <div className='flex flex-col  items-start'>          
          <p className='font-bold text-4xl'>Learn smarter with AI <br/> guidance</p>
          <div className='my-2 flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Personalized learning paths</p>
            </div>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Step-by-step guidance from an AI tutor</p>
            </div>
            <div className='flex items-center gap-1'>
              <CheckCircle/> 
              <p>Practical tips and resources</p>
            </div>
          </div>
          <Button className='bg-[#F50516]'>Start Learning</Button>
        </div>
        <div>
          <img 
          className='w-[400px]'
          src="/images/about-2.png" alt="about-1" />
        </div>
      </div>
      
      <div className='flex flex-col md:flex-row md:items-center gap-4 rounded-md bg-[#FEE6E8]'>
        <div>
          <img 
          className='rounded-md md:w-[800px]'
          src="/images/about-3.png" alt="about-1" />
        </div>
        <div className='flex flex-col  items-start  text-black p-3 gap-2'>          
          <p className='font-bold text-4xl'>Connect and Grow <br/>Together</p>
          <p>Ahunter is more than a platform it’s a network of workers, clients, and institutions supporting each other. Connect, share experiences, and grow through events, discussions, and collaborations.</p>
          <Button className='bg-[#F50516]'>Join the community</Button>
        </div>
        
      </div>
    </section>
    </>
  )
}

export default page