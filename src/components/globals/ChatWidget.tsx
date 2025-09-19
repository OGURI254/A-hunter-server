"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeftCircle, MessageCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AskAI } from "@/lib/chat-assist/chat";

// Types
interface WorkerResult {
  id: string;
  name: string;
  profession: string;
  location: string;
}

interface Message {
  id: number;
  sender: string; // "Me" | agent name | worker name
  text?: string;
  time: string;
  workers?: WorkerResult[]; // optional structured content
}

interface Conversation {
  id: number;
  name: string;
  url?: string;
  messages: Message[];
}

// Initial conversations (seed)
const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "A-Hunter",
    url: "https://github.com/shadcn.png",
    messages: [
      {
        id: 1,
        sender: "A-Hunter",
        text: "How can I assist?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ],
  },
  {
    id: 2,
    name: "Alice",
    url: "https://github.com/evilrabbit.png",
    messages: [
      { id: 1, sender: "Alice", text: "Hey! How are you?", time: "10:00 AM" },
      { id: 2, sender: "Me", text: "I’m good, thanks. You?", time: "10:01 AM" },
    ],
  },
  {
    id: 3,
    name: "Bob",
    url: "https://github.com/leerob.png",
    messages: [
      { id: 1, sender: "Bob", text: "Ready for the meeting?", time: "9:30 AM" },
      { id: 2, sender: "Me", text: "Yes, almost!", time: "9:35 AM" },
    ],
  },
];

export default function ChatWidget() {
  const [chatOpen,setChatOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeChatId, setActiveChatId] = useState<number>(initialConversations[0].id);
  const [conversationSelected, setConversationSelected] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeChat = conversations.find((c) => c.id === activeChatId) ?? null;

  useEffect(() => {
    // scroll to bottom when active chat or messages change
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTop = el.scrollHeight;
  }, [activeChat?.messages.length, conversationSelected]);

  const addMessageToConversation = (convId: number, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, message] } : c))
    );
  };

  const createConversationForWorker = (worker: WorkerResult) => {
    // If conversation with same name exists, reuse it
    const existing = conversations.find((c) => c.name === worker.name);
    if (existing) {
      setActiveChatId(existing.id);
      setConversationSelected(true);
      return existing;
    }

    const newConv: Conversation = {
      id: Date.now(),
      name: worker.name,
      url: undefined,
      messages: [
        {
          id: 1,
          sender: worker.name,
          text: `Hi, I am ${worker.name}, a ${worker.profession} based in ${worker.location}. How can I help you today?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setConversations((prev) => [...prev, newConv]);
    setActiveChatId(newConv.id);
    setConversationSelected(true);
    return newConv;
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    if (isSending) return;

    setIsSending(true);

    const messageToSend: Message = {
      id: (activeChat.messages.length ?? 0) + 1,
      sender: "Me",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // optimistic UI update
    addMessageToConversation(activeChat.id, messageToSend);
    setInput("");

    try {
      // AskAI should return either a string or an array of worker-like objects
      const aiResponse: any = await AskAI({ content: messageToSend.text || "" });

      if (Array.isArray(aiResponse) && aiResponse.every((m) => m?.name)) {
        // Build structured worker message
        const workers: WorkerResult[] = aiResponse.map((w: any, idx: number) => ({
          id: w.id ?? w.name ?? `${activeChat.id}-w-${idx}`,
          name: w.name,
          profession: w.profession ?? w.category ?? "",
          location: w.location ?? w.residence ?? "",
        }));

        const workerMessage: Message = {
          id: (activeChat.messages.length ?? 0) + 2,
          sender: "A-Hunter",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          workers,
        };

        addMessageToConversation(activeChat.id, workerMessage);
      } else {
        // Plain text reply
        const reply: Message = {
          id: (activeChat.messages.length ?? 0) + 2,
          sender: "A-Hunter",
          text: typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        addMessageToConversation(activeChat.id, reply);
      }
    } catch (err) {
      const errMsg: Message = {
        id: (activeChat.messages.length ?? 0) + 2,
        sender: "A-Hunter",
        text: "Sorry, something went wrong while processing your request.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      addMessageToConversation(activeChat.id, errMsg);
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // console.log(activeChat?.messages);

  return (
    <section className="fixed bottom-3 right-2">
      {chatOpen ?
      <div className="flex w-[400px] h-[480px] border rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        {!conversationSelected && (
          <div className="w-full border-r bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="p-3 font-bold text-lg border-b">Chats</h2>
              <X 
              onClick={() => setChatOpen(false)}
              className="cursor-pointer"/>
            </div>
            <ul>
              {conversations.map((chat) => (
                <li
                  key={chat.id}
                  className={`p-3 cursor-pointer hover:bg-gray-200 flex items-center gap-2 ${
                    activeChatId === chat.id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setConversationSelected(true);
                    setActiveChatId(chat.id);
                  }}
                >
                  <Avatar>
                    <AvatarImage src={chat.url} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{chat.name}</span>
                    <span className="text-xs text-gray-600">{chat.messages[chat.messages.length - 1]?.text ?? ""}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat window */}
        {conversationSelected && activeChat && (
          <div className="flex bg-white flex-col flex-1">
            <div className="p-3 border-b font-semibold flex items-center gap-2">
              <ChevronLeftCircle
                className="cursor-pointer"
                onClick={() => setConversationSelected(false)}
              />
              {activeChat.name}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "Me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] ${
                      msg.sender === "Me" ? "bg-blue-500 text-white" : "bg-white text-black border"
                    }`}
                  >
                    {/* Text message */}
                    {msg.text && (
                      <>
                        <p>{msg.text}</p>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </>
                    )}

                    {/* Worker cards */}
                    {msg.workers && (
                      <div className="space-y-2 mt-2">
                        {msg.workers.map((worker) => (
                          <div
                            key={worker.id}
                            onClick={() => createConversationForWorker(worker)}
                            className="flex items-center gap-3 p-2 rounded-md border hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex-1">
                              <div className="font-semibold">{worker.name}</div>
                              <div className="text-sm text-gray-600">{worker.profession}</div>
                              <div className="text-xs text-gray-500">{worker.location}</div>
                            </div>
                            <div className="text-xs text-blue-600">Chat</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex p-2 border-t items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 mr-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button
                onClick={sendMessage}
                className={`px-4 py-2 rounded-lg text-white ${isSending ? "bg-gray-400" : "bg-blue-500"}`}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
      :
      <div 
      onClick={() => setChatOpen(true)}
      className="bg-red-600 text-white cursor-pointer w-10 h-10 flex items-center justify-center rounded-full">
        <MessageCircle/>
      </div>
      }
    </section>
  );
}
