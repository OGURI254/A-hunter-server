import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Elearning
  courses: defineTable({
    tutor: v.string(),
    title: v.string(),
    description: v.string(),
    createdAt:v.number()    
  }),  
  modules: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    overview: v.string(),
    createdAt:v.number(),    
    updatedAt:v.number(),    
    order:v.number()    
  }).index("by_courseId",['courseId']),  
  lessons: defineTable({
    moduleId: v.id("modules"),
    title: v.string(),
    content:v.string(),
    createdAt:v.number(),    
    updatedAt:v.number(),    
    order:v.number()    
  }).index("by_moduleId",['moduleId']),  
  notes: defineTable({
    lessonId: v.id("lessons"),
    title: v.string(),
    content:v.string(),
    createdAt:v.number(),                  
  }).index("by_lessonId",['lessonId']),  
  materials: defineTable({
    lessonId: v.id("lessons"),
    title: v.string(),
    file:v.id("_storage"),
    createdAt:v.number(),              
  }).index("by_lessonId",['lessonId']),  

  enrollments: defineTable({    
    user: v.string(),
    courseId: v.id("courses"),
    enrolledAt:v.number(),    
    progress:v.number(),    
    lastAccessedAt:v.number()    
  })
  .index("by_courseId",['courseId'])
  .index("by_user",['user']),  
  lessonProgress: defineTable({    
    user: v.string(),
    lessonId: v.id("lessons"),
    status:v.string(),     
    completedAt:v.number()    
  })
  .index("by_user_lesson",['user','lessonId'])
  .index("by_lessonId",['lessonId']),  
  
  //   Worker
  workerProfiles: defineTable({    
    user: v.string(),
    phone: v.string(),
    description: v.string(),
    country: v.string(),
    category: v.string(),
    experience: v.string(),
    residence: v.string(),
    portfolio:v.array(v.id("_storage")),
    serviceAreas:v.array(v.string()),
    memberSince:v.number(),
    businessHours:v.string(),
    servicesOffered:v.array(
        v.object({
            title:v.string(),
            price:v.number(),
            description:v.string(),
        })
    ),
    embedding: v.optional(v.array(v.float64())),    
  }),
  bookings: defineTable({    
    user: v.string(), //customer/client
    worker: v.id("workerProfiles"),
    description: v.string(),
    status: v.string(),
    scheduledAt:v.number(),
    createdAt:v.number(),    
  }),
  reviews: defineTable({    
    user: v.string(), //reviewer
    worker: v.id("workerProfiles"),
    comment: v.string(),    
    review:v.number(),
    createdAt:v.number(),    
  }),

//   jobs
  jobs: defineTable({    
    user: v.string(), 
    title:v.string(),
    description:v.string(),
    budget:v.string(),
    location:v.string(),    
    status:v.string(),        
    createdAt:v.number(),    
  }),

  applications: defineTable({    
    worker: v.id("workerProfiles"), 
    job: v.id("jobs"), 
    proposal:v.string(),
    price:v.string(),    
    status:v.string(),        
    createdAt:v.number(),    
  }),
  
  conversations: defineTable({
    participants: v.array(v.string()), // user IDs
    createdAt: v.number(),
    lastMessageAt: v.number(),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    sender: v.string(), // user ID
    text: v.string(),
    createdAt: v.number(),
  }).index("by_conversationId",['conversationId']),
});