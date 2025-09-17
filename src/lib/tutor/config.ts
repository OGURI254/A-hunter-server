import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import type { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { api, db } from "../convex";


// Thread configuration
export const config = { configurable: { thread_id: uuidv4() } };

// LLM setup
export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Embeddings + vector store
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
const vectorStore = new MemoryVectorStore(embeddings);

/**
 * Load lessons from Convex into memory for semantic lookup
 */
export async function loadLessons(moduleId: string) {
  // const lessons = await db.query("lessons:getLessonsByModule", { moduleId });
  const lessons = await db.query(api.lessons.getCourseWithContent,{moduleId});
  console.log(lessons);
  // const documents: Document[] = lessons?.map((l) => ({
  //   pageContent: `${l.title}\n\n${l.content}`,
  //   metadata: l,
  // }));
  // await vectorStore.addDocuments(documents);
}

/**
 * Tool: Search lessons (semantic search across content)
 */
export const lessonLookupTool = tool(
  async (input: unknown) => {
    const { query } = z
      .object({
        query: z.string(),
      })
      .parse(input);

    const results = await vectorStore.similaritySearch(query, 3);

    return results.map((r) => ({
      lessonId: r.metadata._id,
      title: r.metadata.title,
      order: r.metadata.order,
      snippet: r.pageContent.slice(0, 150) + "...",
    }));
  },
  {
    name: "lessonLookup",
    description: "Find lessons by topic, keywords, or concepts within a module.",
    schema: z.object({
      query: z.string().describe("The search query, e.g. 'photosynthesis basics'"),
    }),
  }
);

// Model with tools bound
const modelWithTools = model.bindTools([lessonLookupTool]);
const toolNode = new ToolNode([lessonLookupTool]);

/**
 * Core model call
 */
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const normalized = normalizeMessages(state.messages)
  const response = await modelWithTools.invoke(normalized);
  console.log(response);
  return { messages: [response] };
};

// Define LangGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "model")
  .addEdge("model", "tools")
  .addEdge("model", END);




function normalizeMessages(messages: any): BaseMessage[] {
  if (!messages) return [];

  // Already an array of BaseMessage
  if (Array.isArray(messages) && messages[0] instanceof BaseMessage) {
    return messages;
  }

  // If it's a single message, wrap in array
  if (messages instanceof BaseMessage) {
    return [messages];
  }

  // If it's raw object(s) with { role, content }
  if (Array.isArray(messages)) {
    return messages.map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content ?? "")
        : new AIMessage(m.content ?? "")
    );
  }

  // Default → treat as user text
  return [new HumanMessage(String(messages))];
}
// Add memory (keeps conversation context across turns)
const memory = new MemorySaver();

export const app = workflow.compile({ checkpointer: memory });


// 🔑 Usage Example:
// await loadLessons("abc123"); // load a module into memory
// const res = await app.invoke({ messages: [new HumanMessage("Explain the first lesson")] });
// console.log(res);
