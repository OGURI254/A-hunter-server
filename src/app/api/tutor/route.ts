// app/api/tutor/route.ts
import { NextResponse } from "next/server";
import { app, config, loadLessons } from "@/lib/tutor/config";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { api, db } from "@/lib/convex";

export async function POST(req: Request) {
  try {
    const { lessonId, question } = await req.json();

    if (!lessonId || !question) {
      return NextResponse.json(
        { error: "lessonId and question are required" },
        { status: 400 }
      );
    }

    // Fetch the lesson from Convex
    const lesson = await db.query(api.lessons.getLesson, { id:lessonId });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Ensure lessons for this module are loaded into memory vector store
    await loadLessons(lesson.moduleId);

    // Construct messages
    const system = new SystemMessage(
      "You are a helpful tutor. Use only the provided lesson content to answer. " +
        "If the question cannot be answered from this lesson, say so politely and suggest reviewing related lessons."
    );

    const human = new HumanMessage(
      `Lesson: ${lesson.title}\n\nContent:\n${lesson.content}\n\n---\nStudent question: ${question}`
    );

    // Call the tutor agent app
    const response = await app.invoke({messages:human},config);

    console.log("AI response");
    console.log(response);

    const last = response?.messages?.[response.messages.length - 1];
    const answer = last?.content ?? "Sorry, I couldn't generate an answer.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("Tutor API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
