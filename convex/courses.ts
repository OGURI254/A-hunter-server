// convex/courses.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all courses (public only)
export const getAllPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("visibility"), "public"))
      .collect();
  },
});

export const getAllByTutor = query({
  args: {
    tutor:v.string()
  },
  handler: async (ctx,args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_tutor", (q) => q.eq("tutor",args.tutor))
      .collect();
  },
});

// Get a single course by ID
export const getById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    return await ctx.db.get(courseId);
  },
});

// Create a new course
export const create = mutation({
  args: {
    tutor: v.string(),
    title: v.string(),
    description: v.string(),    
    tags: v.optional(v.array(v.string())),
    thumbnailUrl: v.optional(v.string()),
    thumbnailFileId: v.optional(v.id("_storage")),
    visibility: v.union(v.literal("public"), v.literal("private"), v.literal("draft")),    
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("courses", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
