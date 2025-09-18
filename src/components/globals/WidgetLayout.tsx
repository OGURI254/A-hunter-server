'use client'

import { usePathname, useSearchParams } from "next/navigation"
import ChatWidget from "./ChatWidget"
import CompanionComponent from "../VapiChat"


const WidgetLayout = () => {
    const pathName = usePathname()    
    const searchParams = useSearchParams();
    const lessonId = searchParams.get("l");
    
  return (
    <div>
        {!lessonId ?
        <ChatWidget/>
        :
        <CompanionComponent                    
          lessonId = {lessonId}
          voice="sarah"        
          style="formal"
        />        
        }
        
    </div>
  )
}

export default WidgetLayout