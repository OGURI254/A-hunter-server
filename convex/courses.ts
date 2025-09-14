// convex/courses.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all courses (public only)
export const getAllPublic = query({
  args: {},
  handler: async (ctx) => {
    try {      
      const results = await ctx.db
        .query("courses")
        .filter((q) => q.eq(q.field("visibility"), "public"))
        .collect();
      return results
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

export const getAllByTutor = query({
  args: {
    tutor:v.string()
  },
  handler: async (ctx,args) => {
    try {
      const results = await ctx.db
        .query("courses")
        .withIndex("by_tutor", (q) => q.eq("tutor",args.tutor))
        .collect();
      return results      
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

// Get a single course by ID
export const getById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    try {      
      const result = await ctx.db.get(courseId);
      return result
    } catch (error) {
      console.log(error);
      return null
    }
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
    try {
      
      const result = await ctx.db.insert("courses", {
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  },
});

export const getCourseWithModules = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    // Fetch course
    try {
      
      const course = await ctx.db.get(courseId);
      if (!course) throw new Error("Course not found");
  
      // Fetch modules belonging to this course, ordered
      const modules = await ctx.db
        .query("modules")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .order("asc")
        .collect();
  
      const result = {
        ...course,
        modules,
      }
      return result;
    } catch (error) {
      console.log(error);
      return null
    }
  },
});
