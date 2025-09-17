import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a course
export const createCourse = mutation({
  args: {
    tutor: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("courses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get all courses
export const listCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

// Get single course
export const getCourse = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Update course
export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, { ...updates });
    return id;
  },
});

// Delete course
export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});


export const getCourseWithContent = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    // Get course
    const course = await ctx.db.get(courseId);
    if (!course) return null;

    // Get modules for this course
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_courseId", (q) => q.eq("courseId", courseId))
      .order("asc") // optional if you want ordering
      .collect();

    // For each module, fetch lessons
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_moduleId", (q) => q.eq("moduleId", mod._id))
          .order("asc")
          .collect();

        return {
          ...mod,
          lessons,
        };
      })
    );

    return {
      ...course,
      modules: modulesWithLessons,
    };
  },
});
