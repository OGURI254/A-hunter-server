import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create review
export const createReview = mutation({
  args: {
    user: v.string(),
    worker: v.id("workerProfiles"),
    comment: v.string(),
    review: v.number(), // 1-5 stars
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// List reviews for worker
export const listReviews = query({
  args: { worker: v.id("workerProfiles") },
  handler: async (ctx, { worker }) => {
    return await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("worker"), worker))
      .collect();
  },
});
