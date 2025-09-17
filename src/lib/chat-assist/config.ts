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
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";



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

    return results.map((r) => ({
      name: r.metadata.user,
      profession: r.metadata.category,
      location: r.metadata.residence,
      link: r.metadata._id,      
    }));
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
  const response = await modelWithTools.invoke(normalized);
  console.log(response);
  return { messages: [response] };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addNode("tools", toolNode) 
  .addEdge(START, "model")
  .addEdge("model", "tools")    
  .addEdge("model", END);

// Add memory




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


const memory = new MemorySaver()

export const app = workflow.compile({ checkpointer: memory });


