import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMaterial = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.string(),
    file: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("materials", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listMaterials = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, { lessonId }) => {
    return await ctx.db.query("materials").withIndex("by_lessonId", q => q.eq("lessonId", lessonId)).collect();
  },
});
