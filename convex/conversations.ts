// convex/messages.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new conversation between participants
export const createConversation = mutation({
  args: { participants: v.array(v.string()) },
  handler: async (ctx, { participants }) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      participants,
      createdAt: now,
      lastMessageAt: now,
    });
  },
});

// Send a message in a conversation
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    sender: v.string(),
    text: v.string(),
  },
  handler: async (ctx, { conversationId, sender, text }) => {
    const now = Date.now();

    // insert message
    const messageId = await ctx.db.insert("messages", {
      conversationId,
      sender,
      text,
      createdAt: now,
    });

    // update conversation timestamp
    await ctx.db.patch(conversationId, { lastMessageAt: now });

    return messageId;
  },
});
// convex/messages.ts (continue)


// List all conversations for a user
export const listConversations = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    const convos = await ctx.db.query("conversations").collect();

    // filter conversations that include the user
    const userConvos = convos.filter(c => c.participants.includes(user));

    return userConvos;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .order("asc")
      .collect();
  },
});
