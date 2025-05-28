import { authMiddleware } from "@clerk/nextjs";

// To learn more how to use clerkMiddleware to protect pages in your app, check out https://clerk.com/docs/references/nextjs/clerk-middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/test-auth", "/test/missions", "/api/test/create-client", "/api/missions", "/test/missions/page", "/test-page"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
