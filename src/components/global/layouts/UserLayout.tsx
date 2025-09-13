'use client'
import { Plus, School} from "lucide-react";
import { Button } from "@/components/ui/button";
import {Authenticated,Unauthenticated} from 'convex/react'
import { SignInButton, UserButton } from "@clerk/nextjs";

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
            <UserButton/>
          </div>
        </Authenticated>
      </header>
      <main className="max-w-5xl py-8 px-4 mx-auto">
        {children}
      </main>
    </>
  )
}

export default UserLayout