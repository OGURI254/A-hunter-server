'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { ChevronDown, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

const Header = () => {
  const pathName = usePathname()
  const [selectedOption,setSelectedOption] = useState('Employer')
  
  return (
    <header className='bg-white flex items-center justify-between max-w-5xl mx-auto p-4'>        
        <Link href='/'>
            <img src="/images/logo-1.svg" alt="" />
        </Link>
        <nav className='lg:flex items-center gap-2 font-semibold hidden'>
            <Link 
            href='/'
            className={`${pathName == '/' && "text-[#F50516] border-b-2 border-[#F50516]"}`}
            >Home</Link>
            {selectedOption == 'Employer' ? 
                <Link 
                href='/pros' 
                className={`${pathName == '/pros' && "text-[#F50516] border-b-2 border-[#F50516]"}`}>Pros</Link>
                :
                <Link 
                href='/jobs' 
                className={`${pathName == '/jobs' && "text-[#F50516] border-b-2 border-[#F50516]"}`}>Jobs</Link>
            }
            <Link 
            href='/learn'
            className={`${pathName == '/learn' && "text-[#F50516] border-b-2 border-[#F50516]"}`}
            >Learn</Link>

            
        </nav>
        <div className='lg:flex items-center gap-2 hidden'>
            {/* <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant='ghost'>
                        {selectedOption} <ChevronDown/> 
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Switch to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setSelectedOption("Employer")}>Employer</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedOption("Pro")}>Pro</DropdownMenuItem>                    
                </DropdownMenuContent>
            </DropdownMenu> */}
            
            <Button variant='ghost'>Log In</Button>
            <Button className='bg-[#F50516]'>Join Now</Button>
        </div>
        
        <div className='block lg:hidden'>
            <Sheet>
                <SheetTrigger>
                    <Menu/>
                </SheetTrigger>
                <SheetContent className='pt-10'>
                    <SheetHeader>
                        <SheetTitle>
                            <img src="/images/logo-1.svg" alt="" className='w-40' />
                        </SheetTitle>
                    </SheetHeader>
                    <div className='px-6 grid gap-4'>
                        <nav className='flex flex-col items-start gap-2 font-semibold'>
                            <Link 
                            href='/'
                            className={`${pathName == '/' && "text-[#F50516] border-b-2 border-[#F50516]"}`}
                            >Home</Link>
                            <Link 
                            href='/pros' 
                            className={`${pathName == '/pros' && "text-[#F50516] border-b-2 border-[#F50516]"}`}>Pros</Link>
                            <Link 
                            href='/learn'
                            className={`${pathName == '/learn' && "text-[#F50516] border-b-2 border-[#F50516]"}`}
                            >Learn</Link>

                            <Link 
                            href='/community'
                            className={`${pathName == '/community' && "text-[#F50516] border-b-2 border-[#F50516]"}`}
                            >Community</Link>
                        </nav>
                        <div className='flex flex-col items-start gap-2'>
                            <Button className='w-full' variant='outline'>Log In</Button>
                            <Button className='w-full bg-[#F50516]'>Join Now</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

    </header>
  )
}

export default Header