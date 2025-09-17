"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Parastoo } from "next/font/google";

// export const BlockEditorTutor = () => {
//   const searchParams = useSearchParams();
//   const lessonId = searchParams.get("l");
//   const moduleId = searchParams.get("m");

//   // Always run queries/hooks unconditionally
//   const lesson = useQuery(api.lessons.getLesson, lessonId ? { lessonId });
//   const createLesson = useMutation(api.lessons.createLesson);
//   const updateLesson = useMutation(api.lessons.saveLessonNotes);

//   console.log(lesson);

//   // Editor initialization
//   const editor = useCreateBlockNote({
//     initialContent: lesson?.notes
//       ? JSON.parse(lesson.notes)
//       : [
//           {
//             type: "heading",
//             content: "This is your easy to use Text Editor",
//           },
//           {
//             type: "paragraph",
//             content: "Have fun and enjoy, you can have images, videos",
//           },
//         ],
//   });

//   useEffect(() => {
//     if (lesson?.notes && lessonId !== null) {
//       const parsed = JSON.parse(lesson.notes);      
//       editor.replaceBlocks(editor.document, parsed);
//     }

//     if (lessonId == null){
//       console.log('it is null');
//       editor.replaceBlocks(editor.document,[
//           {
//             type: "heading",
//             content: "This is your easy to use Text Editor",
//           },
//           {
//             type: "paragraph",
//             content: "Have fun and enjoy, you can have images, videos",
//           },
//       ],);
//     }
//   }, [lesson, editor,lessonId]);
//   // Save handler
//   const handleSave = async () => {
//     const notes = editor.document;
//     const title = notes[0]?.content?.[0]?.text || "Untitled";

//     if (!lessonId) {
//       // create new
//       await createLesson({
//         moduleId,
//         title,
//         notes: JSON.stringify(notes),
//       });
//     } else {
//       // update existing
//       await updateLesson({
//         lessonId,
//         notes: JSON.stringify(notes),
//       });
//     }
//   };

//   return (
//     <>
//       <BlockNoteView editor={editor} theme="light" />
//       <Button onClick={handleSave}>Save</Button>
//     </>
//   );
// };

// export const BlockEditorStudent = () => {
//   const searchParams = useSearchParams();
//   const lessonId = searchParams.get("l");
//   const moduleId = searchParams.get("m");

//   // Always run queries/hooks unconditionally
//   const lesson = useQuery(api.lessons.getLesson, lessonId ? { lessonId } : "skip");

//   console.log(lesson);

//   // Editor initialization
//   const editor = useCreateBlockNote({
//     initialContent: lesson?.notes
//       ? JSON.parse(lesson.notes)
//       : [
//           {
//             type: "heading",
//             content: "This is your easy to use Text Editor",
//           },
//           {
//             type: "paragraph",
//             content: "Have fun and enjoy, you can have images, videos",
//           },
//         ],
//   });

//   useEffect(() => {
//     if (lesson?.notes && lessonId !== null) {
//       const parsed = JSON.parse(lesson.notes);      
//       editor.replaceBlocks(editor.document, parsed);
//     }

//     if (lessonId == null){
//       console.log('it is null');
//       editor.replaceBlocks(editor.document,[
//           {
//             type: "heading",
//             content: "This is your easy to use Text Editor",
//           },
//           {
//             type: "paragraph",
//             content: "Have fun and enjoy, you can have images, videos",
//           },
//       ],);
//     }
//   }, [lesson, editor,lessonId]);
//   // Save handler
  

//   return (
//     <>
//       <BlockNoteView editor={editor} theme="light" />      
//     </>
//   );
// };

export const BlockEditorCreateLesson = ({moduleId}:{moduleId:any}) => {
  const searchParams = useSearchParams();
  const router = useRouter()

  const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('new')
        params.set(key, value); // 👈 add or update param
        router.push(`?${params.toString()}`);
   };

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
  const createLesson = useMutation(api.lessons.createLesson);

  const handleSave = async () => {
    const notes = editor.document;
    const title = notes[0]?.content?.[0]?.text || "Untitled";

    try {        
        const lessonId = await createLesson({
          moduleId:moduleId,
          title,
          content: JSON.stringify(notes),
        });
        setParam('l',lessonId)
    } catch (error) {
        
    }        
      // create new
    
  };
  

  return (
    <>
      <BlockNoteView editor={editor} theme="light" />      
      <Button 
      onClick={handleSave}
      className="cursor-pointer">Save Lesson</Button>
    </>
  );
};

export const BlockEditorUpdateLesson = ({lessonId}:{lessonId:any}) => {
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

  const updateLesson = useMutation(api.lessons.updateLesson);

  const handleSave = async () => {
    const notes = editor.document;
    const title = notes[0]?.content?.[0]?.text || "Untitled";

    try {        
        await updateLesson({
          lessonId,
          title,
          content: JSON.stringify(notes),
        });        
    } catch (error) {
        
    }        
      // create new
    
  };
  

  return (
    <>
      <BlockNoteView editor={editor} theme="light" />      
      <Button 
      onClick={handleSave}
      className="cursor-pointer">Update Lesson</Button>
    </>
  );
};

