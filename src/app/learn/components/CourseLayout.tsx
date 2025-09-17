'use client'

import { ChevronRight, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useQuery } from "convex/react"
import { useParams, useSearchParams,useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import { api } from "../../../../convex/_generated/api"
import { BlockEditorReadLesson } from "./BlockEditor"


const CourseLayout = () => {
    const params = useParams()  
    const {id} = params
    const course = useQuery(api.courses.getCourseWithContent,{courseId:id})    

    const searchParams = useSearchParams();
    const moduleId = searchParams.get("m");   
    const lessonId = searchParams.get("l");
    const newLesson = searchParams.get("new");

  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {course?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {lessonId && (
            <BlockEditorReadLesson lessonId={lessonId}/>
          )}          

          {!moduleId && !lessonId &&  (
            <p>Please select a lesson</p>
          )}
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const params = useParams()  
    const router = useRouter()
    const searchParams = useSearchParams();

    const {id} = params
    const course = useQuery(api.courses.getCourseWithContent,{courseId:id})    

    const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());        
        params.set(key, value); // 👈 add or update param
        router.push(`?${params.toString()}`);
    };

    return (
        <Sidebar {...props}>
      <SidebarHeader>
        <Link href='/'>
            <img src="/images/logo-1.svg" alt="" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-2">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {course?.modules.map((module) => (
          <Collapsible
            key={module?.title}
            title={module?.title}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger
                onClick={() => {
                    setParam("m",module?._id)
                }}
                >
                  {module?.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {module?.lessons.map((lesson) => (
                      <SidebarMenuItem key={lesson?.title}>
                        <SidebarMenuButton asChild isActive={true}>
                          <p 
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());        
                            params.delete('new')
                            
                            params.set("l", lesson?._id); // 👈 add or update param                            
                            router.push(`?${params.toString()}`);
                          }}
                          className="cursor-pointer">
                            {lesson?.title}
                          </p>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
        
        
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    )
}

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
}

export default CourseLayout