// convex/modules.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all modules for a given course, ordered by "order".
 */
export const getModulesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    try {
      
      const result = await ctx.db
        .query("modules")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .order("asc")
        .collect();
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

export const getById = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, { moduleId }) => {
    try {
      const result = await ctx.db.get(moduleId)          
      return result
      
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

/**
 * Create a new module in a course.
 */
export const createModule = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    overview: v.optional(v.string()),
    objectives: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get max order for this course
    const lastModule = await ctx.db
      .query("modules")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("desc")
      .first();

    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    return await ctx.db.insert("modules", {
      ...args,
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update an existing module.
 */
export const updateModule = mutation({
  args: {
    id: v.id("modules"),
    title: v.optional(v.string()),
    overview: v.optional(v.string()),
    objectives: v.string(),
  },
  handler: async (ctx, { id, ...updates }) => {
    const module = await ctx.db.get(id);
    if (!module) throw new Error("Module not found");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Reorder modules in a course.
 * Pass an array of module IDs in the new order.
 */
export const reorderModules = mutation({
  args: {
    courseId: v.id("courses"),
    moduleIds: v.array(v.id("modules")),
  },
  handler: async (ctx, { courseId, moduleIds }) => {
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();

    if (modules.length !== moduleIds.length) {
      throw new Error("Mismatch between modules and provided IDs");
    }

    // Assign new order values
    await Promise.all(
      moduleIds.map((id, idx) =>
        ctx.db.patch(id, {
          order: idx + 1,
          updatedAt: Date.now(),
        })
      )
    );
  },
});

/**
 * Delete a module.
 */
export const deleteModule = mutation({
  args: { id: v.id("modules") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
