'use server'

import { currentUser } from "@clerk/nextjs/server"
import { api } from "../../convex/_generated/api"
import convex from "./convexServer"

export const getCourseId = async (courseId:any) => {
    const course = await convex.query(api.courses.getById, {courseId})
    // console.log(course);
    return course
}

export const getCoursesTutor = async () => {
    const user = await currentUser()
    const courses = await convex.query(api.courses.getAllByTutor,{tutor:user?.id})
    return courses
}

export const getModules = async(courseId:any) => {
    console.log('getting modules');
    const modules = await convex.query(api.modules.getModulesByCourse,{courseId})
    console.log(modules);    
    return modules
}

export const getModuleById = async(moduleId:any) => {
    const module = await convex.query(api.modules.getById,{moduleId})
    console.log(module);
    return module
}