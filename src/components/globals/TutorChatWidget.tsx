"use client";

import { useQuery } from "convex/react";
import { Brain, X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function TutorChatWidget() {
  const [chatOpen,setChatOpen] = useState(false)
  const searchParams = useSearchParams();  
  const lessonId = searchParams.get("l");
  console.log("Lesson found",lessonId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,          
          question: input,
        }),
      });

      const data = await res.json();

      const tutorMessage: ChatMessage = {
        role: "assistant",
        content: data.answer ?? "⚠️ Sorry, I couldn’t find an answer.",
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      console.error("Tutor error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="fixed bottom-4 right-4">
      {chatOpen ?
        <div className={`  h-[400px] right-4 w-80 bg-white shadow-lg rounded-2xl border flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold flex items-center justify-between">
            <Button variant='link' className="text-white">
              📚 Tutor Assistant
            </Button>
            <X 
            onClick={() => setChatOpen(false)}
            className="cursor-pointer"/>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[80%] ${
                  m.role === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100 mr-auto"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-xs animate-pulse">
                Tutor is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex border-t border-gray-200 bg-gray-50"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your tutor..."
              className="flex-1 p-2 text-sm outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 text-blue-600 font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
        :
        <div 
        onClick={() => setChatOpen(true)}
        className="bg-red-600 text-white cursor-pointer w-10 h-10 flex items-center justify-center rounded-full">
          <Brain/>          
        </div>
      }
    </section>
  );
}
