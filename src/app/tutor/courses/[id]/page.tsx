import ModuleManager from "@/components/global/ModuleManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseId } from "@/lib/actions";
import { Pencil } from "lucide-react";

const page = async ({params}:{
  params: Promise <{id:string}>
}) => {
  const {id} = await params
  const course = await getCourseId(id)  
  return (
    <>
    <section className="relative h-[60vh] bg-amber-500 rounded-md">
      <img 
      className="rounded-md object-cover  w-full h-full"      
      src={course?.thumbnailUrl} alt={course?.title} />
      <div className="bg-gradient-to-b from-transparent to-slate-900 absolute top-0 left-0 w-full h-full rounded-md flex items-end p-4">
        <div className="text-white">
          <h1 className="font-semibold text-xl">{course?.title}</h1>
        </div>
      </div>       
    </section>
    <section>
      <Tabs defaultValue="overview" className="">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-gray-700 mb-4">
            Strong communication is the foundation of collaboration, leadership, and productivity. 
            This course equips professionals with the skills to communicate clearly across email, 
            meetings, and presentations, while also developing active listening and empathy. 
            Learners will practice tailoring messages for diverse audiences, handling difficult 
            conversations, and building rapport across teams.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
              Communication Skills
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
              Soft Skills
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
              Team Collaboration
            </span>
          </div>

          <div className="flex gap-3">
            <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit <Pencil/>
            </Button>
            <Button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Publish
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="modules">
          <ModuleManager/>
        </TabsContent>
        <TabsContent value="students">Change your password here.</TabsContent>
      </Tabs>
    </section>
    </>
  )
}

export default page