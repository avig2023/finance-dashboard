// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Protect everything by default, but you can list public routes here.
export default clerkMiddleware({
  publicRoutes: ["/"], // add any paths that should be public
});

// Required matcher for app router (protects everything except assets/_next)
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/"],
};
