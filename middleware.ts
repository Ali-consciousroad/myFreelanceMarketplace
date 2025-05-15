import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhook",
    "/api/trpc/project.getAll",
    "/api/trpc/project.getById",
    "/api/trpc/category.getAll",
    "/api/trpc/user.getById",
    "/api/trpc/user.getProfile",
    "/api/trpc/review.getByProjectId",
    "/api/trpc/review.getByUserId",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 