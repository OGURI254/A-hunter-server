import {ChatOpenAI, OpenAIEmbeddings} from '@langchain/openai'
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { workers } from '../seed';
import type { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";



export const config = { configurable: { thread_id: uuidv4() } };

export const model = new ChatOpenAI({
    model:"gpt-4o-mini"
})

const embeddings = new OpenAIEmbeddings({
  model:'text-embedding-3-small'
})

const vectorStore = new MemoryVectorStore(embeddings);

const documents: Document[] = workers.map((w) => ({
  pageContent: `${w.user}, ${w.category}, ${w.residence}, ${w.description}, ${w.experience}, ${w.country}`,
  metadata: w,
}));

await vectorStore.addDocuments(documents)

export const workerLookupTool = tool(
  async (input: unknown) => {
    // parse input with zod to enforce shape
    const { query } = z
      .object({
        query: z.string(),
      })
      .parse(input);

    const results = await vectorStore.similaritySearch(query, 3);

    return JSON.stringify(results.map((r) => ({
      name: r.metadata.user,
      profession: r.metadata.category,
      location: r.metadata.residence,
      link: r.metadata._id,      
    })));
  },
  {
    name: "workerLookup",
    description: "Find workers by profession, name, or location.",
    schema: z.object({
      query: z.string().describe("The search query, e.g. 'electrician in Thika'"),
    }),
  }
);

const modelWithTools = model.bindTools([workerLookupTool])
const toolNode = new ToolNode([workerLookupTool]);

const callModel = async (state: typeof MessagesAnnotation.State) => {  
  const normalized = normalizeMessages(state.messages)
  // console.log(JSON.stringify(
  //   normalized.map(msg => ({
  //     role: msg.getType(),  // or msg.role
  //     content: msg.content
  //   })),
  //   null,
  //   2
  // ));

  const response = await modelWithTools.invoke(normalized);
  
  if (!response) {
    return { messages: [new AIMessage("Sorry, I couldn’t generate a response.")] };
  }
  // console.log(state.messages);
  return { messages: [response] };
};

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const last = state.messages?.[state.messages.length - 1] as AIMessage | ToolMessage | undefined;

  if (!last) return END;

  // If the LLM produced a tool call → go to tools
  if (last instanceof AIMessage && (last as any).tool_calls?.length) {
    return "tools";
  }

  // If the last step produced tool results → go back to the model
  if (last instanceof ToolMessage) {
    return "model";
  }

  // Otherwise finish
  return END;
}



// const wrappedToolNode = async (state: typeof MessagesAnnotation.State) => {
//   const toolOutputs = await toolNode.invoke(state);

//   const outMessages: BaseMessage[] = [];

//   for (const m of toolOutputs.messages) {
//     if (m._getType?.() === "tool" || m instanceof ToolMessage) {
//       const callId = m.tool_call_id ?? m?.tool_call?.id ?? `tool-${Date.now()}`;
//       const contentString = typeof m.content === "string" ? m.content : JSON.stringify(m.content);

//       // Keep the ToolMessage in state
//       outMessages.push(new ToolMessage({ tool_call_id: callId, content: contentString }));

//       // Parse tool output
//       let parsedResults: any = [];
//       try {
//         parsedResults = typeof m.content === "string" ? JSON.parse(m.content) : m.content;
//       } catch {
//         parsedResults = [];
//       }

//       // Build a human-readable summary for model reasoning
//       let summaryText = "";
//       if (Array.isArray(parsedResults) && parsedResults.length) {
//         summaryText += `I found ${parsedResults.length} worker(s):\n`;
//         parsedResults.forEach((r: any, i: number) => {
//           const name = r.name ?? r.user ?? "unknown";
//           const prof = r.profession ?? r.category ?? "unknown";
//           const loc = r.location ?? r.residence ?? "unknown";
//           summaryText += `${i + 1}. ${name} — ${prof} — ${loc}\n`;
//         });
//       } else {
//         summaryText = "Tool returned no results.";
//       }

//       // AIMessage contains both a summary (text) and structured array (for UI)
//       const aiMessage = new AIMessage({
//         content: [
//           { type: "text", text: `Tool summary:\n${summaryText}` },
//           { type: "structured", data: parsedResults }, // <- structured array
//         ],
//       });

//       outMessages.push(aiMessage);
//     } else {
//       outMessages.push(m);
//     }
//   }

//   return { messages: outMessages };
// };





// then keep tools → model edge


// Define a new graph

const wrappedToolNode = async (state: typeof MessagesAnnotation.State) => {
  const toolOutputs = await toolNode.invoke(state);

  const outMessages: BaseMessage[] = [];

  for (const m of toolOutputs.messages) {
    if (m._getType?.() === "tool" || m instanceof ToolMessage) {
      const callId = m.tool_call_id ?? m?.tool_call?.id ?? `tool-${Date.now()}`;
      
      // Ensure content is JSON-parsed
      let parsedResults: any;
      try {
        parsedResults = typeof m.content === "string" ? JSON.parse(m.content) : m.content;
      } catch {
        parsedResults = m.content;
      }

      // Convert to WorkerResult[] if it’s an array
      let workers:any = [];
      if (Array.isArray(parsedResults)) {
        workers = parsedResults.map((r: any, idx: number) => ({
          id: r._id ?? r.id ?? r.name ?? `${state.messages.length}-w-${idx}`,
          name: r.name ?? r.user ?? "unknown",
          profession: r.profession ?? r.category ?? "",
          location: r.location ?? r.residence ?? "",
        }));
      }

      // Push as a ToolMessage so state keeps track
      outMessages.push(new ToolMessage({
        tool_call_id: callId,
        content: workers, // now storing structured array
      }));

      // // Push an AIMessage that summarizes for reasoning (optional)
      // if (workers.length) {
      //   const summaryText = workers.map(
      //     (w, i) => `${i + 1}. ${w.name} — ${w.profession} — ${w.location}`
      //   ).join("\n");

      //   outMessages.push(new AIMessage({
      //     content: [{ type: "text", text: `${summaryText}` }],
      //   }));
      // }
    } else {
      outMessages.push(m); // pass other messages unchanged
    }
  }

  return { messages: outMessages };
};


const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addNode("tools", wrappedToolNode) 
  .addEdge(START, "model")  
  .addConditionalEdges("model",shouldContinue)  

// Add memory



/**
 * Return an array containing only HumanMessage | AIMessage (suitable for sending to the model).
 * - Filters out ToolMessage from the model input (ToolMessages must remain in state but are not sent).
 * - Always ensures content is string / properly wrapped so OpenAI sees content blocks with type.
 */
function normalizeMessages(messages: any): BaseMessage[] {
  if (!messages) return [];

  // 1) If we already have BaseMessage[]: filter to human/ai
  if (Array.isArray(messages) && messages.every(m => m instanceof BaseMessage)) {
    return messages.filter(m => m instanceof HumanMessage || m instanceof AIMessage)
      .map((m: any) => {
        // Ensure content is in safe shape (string -> constructor will handle serialization)
        if (m instanceof HumanMessage) {
          const text = typeof m.content === "string" ? m.content : extractTextFromContent(m.content);
          return new HumanMessage(String(text));
        } else {
          const text = typeof m.content === "string" ? m.content : extractTextFromContent(m.content);
          return new AIMessage(String(text), m.tool_calls ?? undefined);
        }
      });
  }

  // 2) Single BaseMessage
  if (messages instanceof BaseMessage) {
    if (messages instanceof HumanMessage || messages instanceof AIMessage) {
      return [messages];
    }
    return [];
  }

  // 3) Raw array of objects (mixed)
  if (Array.isArray(messages)) {
    const out: BaseMessage[] = [];
    for (const m of messages) {
      if (m instanceof BaseMessage) {
        if (m instanceof HumanMessage || m instanceof AIMessage) out.push(m);
        // ignore ToolMessage here (we don't send tool messages to model)
        continue;
      }

      const role = String((m.role ?? "user")).toLowerCase();

      // extract a safe text for content:
      const text = (() => {
        if (typeof m.content === "string") return m.content;
        if (typeof m.content === "object" && m.content !== null) {
          // If it's already an array of blocks with text fields -> join their text parts
          if (Array.isArray(m.content)) {
            try {
              const parts = m.content.map((c: any) => {
                if (typeof c === "string") return c;
                if (c && typeof c.text === "string") return c.text;
                if (c && typeof c.content === "string") return c.content;
                return JSON.stringify(c);
              });
              return parts.join("\n");
            } catch {
              return JSON.stringify(m.content);
            }
          }
          // object -> stringify
          return JSON.stringify(m.content);
        }
        return String(m.content ?? "");
      })();

      if (role === "tool") {
        // Ignore tool messages for model input — they must remain in state
        continue;
      }

      if (role === "ai" || role === "assistant") {
        out.push(new AIMessage(String(text), m.tool_calls ?? undefined));
      } else {
        // treat as user/human by default
        out.push(new HumanMessage(String(text)));
      }
    }
    return out;
  }

  // 4) Fallback: a raw string (treat as user)
  return [new HumanMessage(String(messages))];
}

/** helper to try to extract text when content is weird */
function extractTextFromContent(content: any): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    try {
      return content.map(c => (typeof c === "string" ? c : (c?.text ?? JSON.stringify(c)))).join("\n");
    } catch {
      return JSON.stringify(content);
    }
  }
  if (content && typeof content === "object") {
    return content.text ?? JSON.stringify(content);
  }
  return String(content ?? "");
}







const memory = new MemorySaver()

export const app = workflow.compile({ checkpointer: memory });


