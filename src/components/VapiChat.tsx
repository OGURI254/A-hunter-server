'use client'

import { cn, configureAssistant } from '@/lib/utils'
import { vapi } from '@/lib/vapi'
import React, { useEffect, useRef, useState } from 'react'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import soundwaves from '@/constants/soundwaves.json'
import { Brain, Loader } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface CompanionComponentProps {
  style: string
  voice: string
  lessonId:any
}

const CompanionComponent: React.FC<CompanionComponentProps> = ({
  style,
  voice,
  lessonId
}) => {
  const lesson  = useQuery(api.lessons.getLesson,{id:lessonId})
  
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  )

  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)

    const assistantOverrides = {
      variableValues: {
        notes:lesson?.content,
        topic:lesson?.title
      },
      clientMessages: ['transcript'],
      serverMessages: [],
    }

    vapi.start(configureAssistant(voice, style), assistantOverrides)
  }

  const toggleMicrophone = () => {
    const currentlyMuted = vapi.isMuted()
    vapi.setMuted(!currentlyMuted)
    setIsMuted(!currentlyMuted)
  }

  useEffect(() => {
    if (!lottieRef.current) return

    if (isSpeaking) {
      lottieRef.current.play()
    } else {
      lottieRef.current.stop()
    }
  }, [isSpeaking])

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)
    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript }
        setMessages(prev => [newMessage, ...prev])
      }
    }
    const onError = (error: Error) => console.error('Error', error)
    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, [])

  return (
    <section className="fixed bottom-2 right-2 flex flex-col">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="flex flex-row gap-1 rounded-full h-10 w-10 items-center justify-center">
          <div className="companion-avatar">
  <div
    className={cn(
      'transition-opacity duration-300',
      // Show button for all statuses
      'opacity-100'
    )}
  >
    <button
      className={cn(
        'rounded-full h-10 w-10 bg-red-500 text-white flex items-center justify-center cursor-pointer',
        callStatus === CallStatus.CONNECTING && 'animate-pulse'
      )}
      onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
    >
      {callStatus === CallStatus.ACTIVE ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={soundwaves}
          autoPlay={false}
          loop
          className="h-10 w-10" // slightly smaller so you see button bg
        />
      ) : callStatus === CallStatus.CONNECTING ? (
        <Loader className="h-6 w-6 text-white" />
      ) : (
        <Brain className="h-6 w-6" />
      )}
    </button>
  </div>
</div>

        </div>
      </section>
    </section>
  )
}

export default CompanionComponent
