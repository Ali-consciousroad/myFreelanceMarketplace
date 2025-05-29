import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route permissions
const rolePermissions = {
  ADMIN: {
    pages: ["/admin", "/admin/**", "/test/missions", "/sync"],
    api: ["/api/admin/**", "/api/users/**", "/api/missions/**"],
  },
  SUPPORT: {
    pages: ["/support", "/support/**", "/test/missions", "/sync"],
    api: ["/api/support/**", "/api/missions/**"],
  },
  CLIENT: {
    pages: ["/client", "/client/**", "/sync"],
    api: ["/api/client/**", "/api/missions/**"],
  },
  FREELANCER: {
    pages: ["/freelancer", "/freelancer/**", "/sync"],
    api: ["/api/freelancer/**", "/api/missions/**"],
  },
};

// Helper function to check if a path matches any of the allowed patterns
const isPathAllowed = (path: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    const regexPattern = pattern
      .replace(/\*\*/g, ".*") // Convert ** to .*
      .replace(/\*/g, "[^/]*"); // Convert * to [^/]*
    return new RegExp(`^${regexPattern}$`).test(path);
  });
};

// Helper function to get user role from Clerk metadata
const getUserRole = (auth: { userId?: string; publicMetadata?: { role?: string } }): string | null => {
  if (!auth?.userId) return null;
  return auth.publicMetadata?.role as string || null;
};

// Export the middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/test/missions", "/sync"],
  afterAuth(auth, req) {
    const { pathname } = req.nextUrl;
    if (pathname === "/") {
      return;
    }

    // Allow public routes
    if (["/", "/sign-in", "/sign-up", "/test/missions", "/sync"].includes(pathname)) {
      return NextResponse.next();
    }

    // For now, allow all authenticated users to access everything
    if (auth.userId) {
      return NextResponse.next();
    }

    // Redirect to sign-in if not authenticated
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
