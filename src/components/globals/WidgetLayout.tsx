'use client'

import { usePathname } from "next/navigation"
import TutorChatWidget from "./TutorChatWidget"
import ChatWidget from "./ChatWidget"

const WidgetLayout = () => {
    const pathName = usePathname()
    const isLearning = pathName.includes('learn')
  return (
    <div>
        {isLearning ?
        <TutorChatWidget/>
        :
        <ChatWidget/>
        }
    </div>
  )
}

export default WidgetLayout