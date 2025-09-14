"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

const BlockEditor = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("l");
  const moduleId = searchParams.get("m");

  // Always run queries/hooks unconditionally
  const lesson = useQuery(api.lessons.getLesson, lessonId ? { lessonId } : "skip");
  const createLesson = useMutation(api.lessons.createLesson);
  const updateLesson = useMutation(api.lessons.saveLessonNotes);

  console.log(lesson);

  // Editor initialization
  const editor = useCreateBlockNote({
    initialContent: lesson?.notes
      ? JSON.parse(lesson.notes)
      : [
          {
            type: "heading",
            content: "This is your easy to use Text Editor",
          },
          {
            type: "paragraph",
            content: "Have fun and enjoy, you can have images, videos",
          },
        ],
  });

  useEffect(() => {
    if (lesson?.notes && lessonId !== null) {
      const parsed = JSON.parse(lesson.notes);      
      editor.replaceBlocks(editor.document, parsed);
    }

    if (lessonId == null){
      console.log('it is null');
      editor.replaceBlocks(editor.document,[
          {
            type: "heading",
            content: "This is your easy to use Text Editor",
          },
          {
            type: "paragraph",
            content: "Have fun and enjoy, you can have images, videos",
          },
      ],);
    }
  }, [lesson, editor,lessonId]);
  // Save handler
  const handleSave = async () => {
    const notes = editor.document;
    const title = notes[0]?.content?.[0]?.text || "Untitled";

    if (!lessonId) {
      // create new
      await createLesson({
        moduleId,
        title,
        notes: JSON.stringify(notes),
      });
    } else {
      // update existing
      await updateLesson({
        lessonId,
        notes: JSON.stringify(notes),
      });
    }
  };

  return (
    <>
      <BlockNoteView editor={editor} theme="light" />
      <Button onClick={handleSave}>Save</Button>
    </>
  );
};

export default BlockEditor;
