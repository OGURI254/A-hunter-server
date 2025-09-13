import { defineSchema,defineTable } from "convex/server";
import {v} from 'convex/values'

export default defineSchema({
    courses:defineTable({
        tutor:v.string(),
        title:v.string(),
        description:v.string(),
        tags: v.optional(v.array(v.string())),
        thumbnailUrl:v.optional(v.string()),
        thumbnailFileId:v.optional(v.id("_storage")),
        visibility: v.union(v.literal("public"), v.literal("private"), v.literal("draft")),
        createdAt:v.number(),
        updatedAt:v.number(),
    }).index("by_tutor",['tutor']),
    modules:defineTable({
        courseId:v.id("courses"),
        title:v.string(),
        overview:v.optional(v.string()),
        objectives: v.optional(v.array(v.string())),
        order: v.number(), 
        createdAt:v.number(),
        updatedAt:v.number(),
    })
})