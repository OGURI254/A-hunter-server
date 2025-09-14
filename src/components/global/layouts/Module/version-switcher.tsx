"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { DialogCreateForm } from "../../DialogFormLesson"
import { DialogCreateModule } from "../../FormCreateModule"

export function VersionSwitcher() {
  const [selectedVersion, setSelectedVersion] = React.useState('Overview')
  const [openDialog, setOpenDialog] = React.useState(false)
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const courseModules = useQuery(api.courses.getCourseWithModules,{courseId:params?.id})
  
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value); // 👈 add or update param
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Modules</span>
                  <span className="">{selectedVersion}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width)"
              align="start"
            >
              <DropdownMenuItem                
                  onSelect={() => {
                    setSelectedVersion('Overview')
                    setParam("m","overview")
                  }}
                >
                  {"Oveview"}
                  {"Overview" === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>

              {courseModules?.modules.map(({title,_id}) => (
                <DropdownMenuItem
                  key={_id}
                  onSelect={() => {
                    setSelectedVersion(title)
                    setParam("m",_id)
                  }}
                >
                  {title}{" "}
                  {title === selectedVersion && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem 
              onSelect={(e) => {
                  e.preventDefault() // prevent dropdown from auto-closing
                  setOpenDialog(true)
                }}
              >
                  <Plus className="mr-2 size-4" />
                  Add Module
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogCreateModule
       open={openDialog}
       onOpenChage={setOpenDialog}
      />
    </>
  )
}
