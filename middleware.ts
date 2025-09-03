// middleware.ts (Clerk v6)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;        // allow public routes

  // v6 pattern: read auth and redirect if not signed in
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();           // sends to Clerk sign-in
  }
  // otherwise continue
});

// Required matcher for the App Router
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
