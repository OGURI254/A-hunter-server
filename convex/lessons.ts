// convex/lessons.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveLessonNotes = mutation({
  args: {
    lessonId: v.id("lessons"),
    notes: v.string(), // raw JSON string
  },
  handler: async (ctx, { lessonId, notes }) => {
    await ctx.db.patch(lessonId, {
      notes,
      updatedAt: Date.now(),
    });
  },
});


export const createLesson = mutation({
  args: {
    moduleId: v.id("modules"),
    notes:v.string(),
    title: v.string(),    
  },
  handler: async (ctx, { moduleId, title,notes}) => {
    const now = Date.now();

    const lastLesson = await ctx.db
      .query("lessons")
      .withIndex("by_module", (q) => q.eq("moduleId",moduleId))
      .order("desc")
      .first();

    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lessonId = await ctx.db.insert("lessons", {
      moduleId,
      title,
      order:nextOrder,
      notes,            // empty BlockNote JSON
      createdAt: now,
      updatedAt: now,
    });
    return lessonId;
  },
});

// Fetch single lesson
export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, { lessonId }) => {
    try {
      
      const result = await ctx.db.get(lessonId);
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

// Fetch all lessons in a course
export const getLessonsByCourse = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, { moduleId }) => {
    try {
      if (!moduleId) return null
      const result = await ctx.db
        .query("lessons")
        .withIndex("by_module", (q) => q.eq("moduleId", moduleId))
        .order("asc") // uses default order or can sort by "order"
        .collect();
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  },
});