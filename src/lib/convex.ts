// lib/convex.ts
import { ConvexHttpClient } from "convex/browser"; 
import { api } from "../../convex/_generated/api";

// Server-side client
export const db = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export { api };
