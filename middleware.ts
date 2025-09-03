// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (add more as needed)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/api/health", // example
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;    // allow public routes
  auth().protect();                  // protect everything else
});

// Required matcher for the App Router
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
