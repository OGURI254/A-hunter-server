import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create booking
export const createBooking = mutation({
  args: {
    user: v.string(),
    worker: v.id("workerProfiles"),
    description: v.string(),
    status: v.string(), // pending, confirmed, completed, cancelled
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// List bookings for a worker
export const listWorkerBookings = query({
  args: { worker: v.id("workerProfiles") },
  handler: async (ctx, { worker }) => {
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("worker"), worker))
      .collect();
  },
});

// List bookings for a user
export const listUserBookings = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("user"), user))
      .collect();
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
    return id;
  },
});
