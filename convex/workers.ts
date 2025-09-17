import { query, mutation } from "./_generated/server";
import OpenAI from "openai";
import { v } from "convex/values";

// Create worker profile
export const createWorkerProfile = mutation({
  args: {
    user: v.string(),
    phone: v.string(),
    description: v.string(),
    country: v.string(),
    category: v.string(),
    experience: v.string(),
    residence: v.string(),
    portfolio: v.array(v.id("_storage")),
    serviceAreas: v.array(v.string()),
    memberSince: v.number(),
    businessHours: v.string(),
    servicesOffered: v.array(
      v.object({
        title: v.string(),
        price: v.number(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workerProfiles", args);
  },
});

// Get single worker
export const getWorkerProfile = query({
  args: { id: v.id("workerProfiles") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// List all workers
export const listWorkers = query({
  handler: async (ctx) => {
    return await ctx.db.query("workerProfiles").collect();
  },
});

// Update worker
export const updateWorkerProfile = mutation({
  args: {
    id: v.id("workerProfiles"),
    phone: v.optional(v.string()),
    description: v.optional(v.string()),
    country: v.optional(v.string()),
    category: v.optional(v.string()),
    experience: v.optional(v.string()),
    residence: v.optional(v.string()),
    portfolio: v.optional(v.array(v.id("_storage"))),
    serviceAreas: v.optional(v.array(v.string())),
    businessHours: v.optional(v.string()),
    servicesOffered: v.optional(
      v.array(
        v.object({
          title: v.string(),
          price: v.number(),
          description: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete worker
export const deleteWorkerProfile = mutation({
  args: { id: v.id("workerProfiles") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});


function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (normA * normB);
}

export const semanticSearch = query({
  args: { query: v.string(), topK: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const openai = new OpenAI();

    // Embed user query
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.query,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    // Fetch all workers with embeddings
    const workers = await ctx.db.query("workerProfiles").collect();
    const withEmbeddings = workers.filter(w => w.embedding);

    // Rank by similarity
    const scored = withEmbeddings.map(w => ({
      worker: w,
      score: cosineSimilarity(queryEmbedding, w.embedding!),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, args.topK ?? 5).map(s => s.worker);
  },
});
