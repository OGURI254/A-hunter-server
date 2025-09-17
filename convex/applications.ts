import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Apply for a job
export const applyForJob = mutation({
  args: {
    worker: v.id("workerProfiles"),
    job: v.id("jobs"),
    proposal: v.string(),
    price: v.string(),
    status: v.string(), // pending, accepted, rejected
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// List applications for a job
export const listJobApplications = query({
  args: { job: v.id("jobs") },
  handler: async (ctx, { job }) => {
    return await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("job"), job))
      .collect();
  },
});

// List applications by worker
export const listWorkerApplications = query({
  args: { worker: v.id("workerProfiles") },
  handler: async (ctx, { worker }) => {
    return await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("worker"), worker))
      .collect();
  },
});
