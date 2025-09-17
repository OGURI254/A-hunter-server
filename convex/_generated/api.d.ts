/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as bookings from "../bookings.js";
import type * as conversations from "../conversations.js";
import type * as courses from "../courses.js";
import type * as enrollments from "../enrollments.js";
import type * as jobs from "../jobs.js";
import type * as lessons from "../lessons.js";
import type * as materials from "../materials.js";
import type * as modules from "../modules.js";
import type * as notes from "../notes.js";
import type * as progress from "../progress.js";
import type * as reviews from "../reviews.js";
import type * as workers from "../workers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  bookings: typeof bookings;
  conversations: typeof conversations;
  courses: typeof courses;
  enrollments: typeof enrollments;
  jobs: typeof jobs;
  lessons: typeof lessons;
  materials: typeof materials;
  modules: typeof modules;
  notes: typeof notes;
  progress: typeof progress;
  reviews: typeof reviews;
  workers: typeof workers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
