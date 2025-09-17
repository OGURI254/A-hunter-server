import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateLessonProgress = mutation({
  args: {
    user: v.string(),
    lessonId: v.id("lessons"),
    status: v.string(), // e.g. "in-progress", "completed"
  },
  handler: async (ctx, { user, lessonId, status }) => {
    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", q => q.eq("user", user).eq("lessonId", lessonId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status,
        completedAt: status === "completed" ? Date.now() : Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("lessonProgress", {
        user,
        lessonId,
        status,
        completedAt: status === "completed" ? Date.now() : Date.now(),
      });
    }
  },
});
