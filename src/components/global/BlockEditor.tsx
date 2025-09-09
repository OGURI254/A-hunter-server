'use client'
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

const BlockEditor = () => {
  const editor = useCreateBlockNote();
  return (
    <BlockNoteView
        editor={editor}
        shadCNComponents={
          {
            // Pass modified ShadCN components from your project here.
            // Otherwise, the default ShadCN components will be used.
          }
        }
      />
  )
}

export default BlockEditor