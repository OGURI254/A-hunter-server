import BlockEditor from "@/components/global/BlockEditor";
import ModuleLayout from "@/components/global/layouts/Module/ModuleLayout";
import { getCourseId, getModules } from "@/lib/actions";


const page = async ({params}:{
  params: Promise <{id:string}>
}) => {
  const {id} = await params
  const course = await getCourseId(id)  
  const modules = await getModules(id)
  return (
    <>
    <ModuleLayout    
    >
      <div className="flex flex-col h-[80vh]">        
        <BlockEditor        
        />
      </div>
    </ModuleLayout>    
    </>
  )
}

export default page