import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route permissions
const rolePermissions = {
  ADMIN: {
    pages: ["/admin", "/admin/**", "/test/missions"],
    api: ["/api/admin/**", "/api/users/**", "/api/missions/**"],
  },
  SUPPORT: {
    pages: ["/support", "/support/**", "/test/missions"],
    api: ["/api/support/**", "/api/missions/**"],
  },
  CLIENT: {
    pages: ["/client", "/client/**"],
    api: ["/api/client/**", "/api/missions/**"],
  },
  FREELANCER: {
    pages: ["/freelancer", "/freelancer/**"],
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
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    const { pathname } = req.nextUrl;

    // Allow public routes
    if (["/", "/sign-in", "/sign-up"].includes(pathname)) {
      return NextResponse.next();
    }

    if (!auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const userRole = getUserRole({ 
      userId: auth.userId, 
      publicMetadata: auth.sessionClaims?.publicMetadata as { role?: string } 
    });

    // If no role is found, deny access
    if (!userRole) {
      console.log("No role found for user:", auth.userId);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get allowed patterns for the user's role
    const roleConfig = rolePermissions[userRole as keyof typeof rolePermissions];
    if (!roleConfig) {
      console.log("No permissions found for role:", userRole);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check if the path is allowed
    const isApiRoute = pathname.startsWith("/api");
    const allowedPatterns = isApiRoute ? roleConfig.api : roleConfig.pages;
    const isAllowed = isPathAllowed(pathname, allowedPatterns);

    console.log("Auth check:", {
      path: pathname,
      role: userRole,
      allowedPatterns,
      isAllowed,
    });

    if (!isAllowed) {
      console.log("Access denied for path:", pathname);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
