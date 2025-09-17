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
import { HumanMessage } from "@langchain/core/messages";
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
  const query = new HumanMessage(state.messages[0]);
  const response = await modelWithTools.invoke(state.messages);
  console.log(response);
  return { messages: response };
};

// Define LangGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "model")
  .addEdge("model", "tools")
  .addEdge("model", END);

// Add memory (keeps conversation context across turns)
const memory = new MemorySaver();

export const app = workflow.compile({ checkpointer: memory });

// 🔑 Usage Example:
// await loadLessons("abc123"); // load a module into memory
// const res = await app.invoke({ messages: [new HumanMessage("Explain the first lesson")] });
// console.log(res);
