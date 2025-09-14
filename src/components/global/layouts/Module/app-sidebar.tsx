'use client'
import * as React from "react"

import { SearchForm } from "./search-form"
import { VersionSwitcher } from "./version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Check, CheckCircle, Plus, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogCreateModule } from "../../FormCreateModule"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams.toString())
  const moduleId = searchParams.get("m")
  const lessons = useQuery(api.lessons.getLessonsByCourse, moduleId ? {moduleId} : "skip")
  console.log(lessons);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher/>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}        

        <SidebarGroup>
          <SidebarGroupLabel>Lessons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lessons && (
                <>
                {lessons.map((lesson) => (
                  <SidebarMenuItem key={lesson._id}>
                    <SidebarMenuButton 
                    className="flex items-center justify-between"
                    onClick = {() => {
                      params.set("l",lesson._id)
                      router.push(pathname + '?' + params.toString())
                    }}
                    >
                      {lesson.title}
                      <CheckCircle className="text-slate-900/30"/>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}            
                </>
              )}

              {/* Create lesson */}
              <SidebarMenuItem>                
                  <Button 
                  onClick={() => {
                    params.delete("l")
                    router.push('?' + params.toString())
                  }}
                  className="w-full">
                    <Plus/> Lesson
                  </Button>                                             
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
