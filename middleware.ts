// middleware.ts (Clerk v6)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // allow public routes
  if (isPublicRoute(req)) return;

  // require auth for everything else
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    // include returnBackUrl so user lands back on the page they wanted
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
