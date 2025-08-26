import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Mark public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  "/api/health",
  "/api/db-ping",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Skip protection for public routes
  if (isPublicRoute(req)) return;

  // Protect everything else
  auth().protect();
});

export const config = {
  matcher: [
    // Run on all paths except static files and _next
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
  ],
};
