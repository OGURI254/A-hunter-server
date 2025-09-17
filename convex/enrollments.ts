import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const enroll = mutation({
  args: { user: v.string(), courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("enrollments", {
      ...args,
      enrolledAt: Date.now(),
      progress: 0,
      lastAccessedAt: Date.now(),
    });
  },
});

export const listEnrollments = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    return await ctx.db.query("enrollments").withIndex("by_user", q => q.eq("user", user)).collect();
  },
});
