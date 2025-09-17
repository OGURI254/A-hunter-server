import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create module
export const createModule = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    overview: v.string(),    
  },
  handler: async (ctx, args) => {

    const now = Date.now();

    // Get max order for this course
    const lastModule = await ctx.db
      .query("modules")
      .withIndex("by_courseId", (q) => q.eq("courseId", args.courseId))
      .order("desc")
      .first();

    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    return await ctx.db.insert("modules", {
      ...args,
      order:nextOrder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// List modules by course
export const listModules = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    return await ctx.db.query("modules").withIndex("by_courseId", q => q.eq("courseId", courseId)).collect();
  },
});
