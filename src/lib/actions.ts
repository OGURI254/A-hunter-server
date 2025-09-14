'use server'

import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import convex from "./convexServer"

export const getCourseId = async (courseId:any) => {
    const course = await convex.query(api.courses.getById, {courseId})
    console.log(course);
    return course
}