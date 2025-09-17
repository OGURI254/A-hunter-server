import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create job
export const createJob = mutation({
  args: {
    user: v.string(),
    title: v.string(),
    description: v.string(),
    budget: v.string(),
    location: v.string(),
    status: v.string(), // open, assigned, closed
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// List all jobs
export const listJobs = query({
  handler: async (ctx) => {
    return await ctx.db.query("jobs").collect();
  },
});

// Get job by id
export const getJob = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
