"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Check } from "lucide-react";



export const BlockEditorReadLesson = ({lessonId}:{lessonId:any}) => {
  const lesson = useQuery(api.lessons.getLesson,{id:lessonId})

  // Editor initialization
  const editor = useCreateBlockNote({
    initialContent:
      [
          {
            type: "heading",
            content: "Scribble notes here",
          },
          {
            type: "paragraph",
            content: "Have fun and enjoy, you can have images, videos",
          },
        ],
  });  

  useEffect(() => {
    if (lesson?.content && lessonId !== null) {
      const parsed = JSON.parse(lesson.content);      
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

  

  return (
    <>
      <BlockNoteView editor={editor} theme="light" />      
      <Button><Check/> Mark as complete</Button>
    </>
  );
};

