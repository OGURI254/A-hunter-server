import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLesson = mutation({
  args: {
    moduleId: v.id("modules"),
    title: v.string(),
    content: v.string(),
    
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get max order for this course
    const lastLesson = await ctx.db
      .query("lessons")
      .withIndex("by_moduleId", (q) => q.eq("moduleId", args.moduleId))
      .order("desc")
      .first();

    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    return await ctx.db.insert("lessons", {
      ...args,
      order:nextOrder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listLessons = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, { moduleId }) => {
    return await ctx.db.query("lessons").withIndex("by_moduleId", q => q.eq("moduleId", moduleId)).collect();
  },
});

export const getLesson = query({
  args: { id: v.id("lessons") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const updateLesson = mutation({
  args: {
    id: v.id("lessons"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, title, content, order }) => {
    const lesson = await ctx.db.get(id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return await ctx.db.patch(id, {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(order !== undefined ? { order } : {}),
      updatedAt: Date.now(),
    });
  },
});



export const getCourseWithContent = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, { moduleId }) => {
    // Get course
    const module = await ctx.db.get(moduleId);
    if (!module) return null;

    // Get modules for this course
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_moduleId", (q) => q.eq("moduleId", moduleId))
      .order("asc") // optional if you want ordering
      .collect();
    

    return {
      ...module,
      lessons:lessons,
    };
  },
});