import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNote = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listNotes = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, { lessonId }) => {
    return await ctx.db.query("notes").withIndex("by_lessonId", q => q.eq("lessonId", lessonId)).collect();
  },
});
