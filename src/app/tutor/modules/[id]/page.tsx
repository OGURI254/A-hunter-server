import ModuleLayout from '@/components/global/layouts/Module/ModuleLayout'
import { getModuleById } from '@/lib/actions'


const page = async ({params}:{
  params: Promise <{id:string}>
}) => {
  const {id} = await params
  const module = await getModuleById(id)
  return (
    <div>
      <ModuleLayout/>
    </div>
  )
}

export default page