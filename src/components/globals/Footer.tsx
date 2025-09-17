import Link from 'next/link'
import React from 'react'
import { FaLinkedin,FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='border-t-2'>
      <footer className='py-8 flex flex-col gap-6 max-w-5xl mx-auto px-4 bg-white '>
        <section className='grid grid-cols-4'>
          <div>
            <p className='text-[#F50516] font-semibold'>About Us</p>
            <div className='flex flex-col gap-1'>
              <Link href='/about'>About</Link>
              <Link href='/pros'>Pros</Link>
              <Link href='/learn'>Learn</Link>
              <Link href='/community'>Community</Link>
            </div>
          </div>

          <div>
            <p className='text-[#F50516] font-semibold'>Support</p>
            <div  className='flex flex-col gap-1'>
              <Link href='#'>Frequently Asked Questions</Link>
              <Link href='#'>Contact Us</Link>
              <Link href='#'>Terms of Service</Link>
              <Link href='#'>Privacy Policy</Link>
            </div>
          </div>

          <div>
            <p className='text-[#F50516] font-semibold'>Explore</p>
            <div  className='flex flex-col gap-1'>
              <Link href='#'>Careers</Link>
              <Link href='#'>Hire as individual</Link>
              <Link href='#'>Hire as organization</Link>          
            </div>
          </div>
        </section>

        <section>
          <img
          src='/images/logo-1.svg'
          alt='logo'
          />
          <div className='flex items-center gap-1.5 mt-2'>
            <a href="#">
              <FaLinkedin className='size-6'/>
            </a>
            <a href="#">
              <FaYoutube className='size-6'/>
            </a>
            <a href="#">
              <FaSquareXTwitter className='size-6'/>
            </a>
          </div>
        </section>
        
      </footer>
    </div>
  )
}

export default Footer