import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";

// Define role-based route permissions
const rolePermissions = {
  [UserRole.ADMIN]: [
    "/api/admin/**",
    "/api/users/**",
    "/api/missions/**",
    "/api/contracts/**",
    "/api/payments/**",
    "/admin/**",
  ],
  [UserRole.SUPPORT]: [
    "/api/support/**",
    "/api/missions/**",
    "/api/contracts/**",
    "/api/payments/**",
    "/support/**",
  ],
  [UserRole.CLIENT]: [
    "/api/missions/**",
    "/api/contracts/**",
    "/api/payments/**",
    "/client/**",
  ],
  [UserRole.FREELANCER]: [
    "/api/missions/**",
    "/api/contracts/**",
    "/api/portfolio/**",
    "/api/services/**",
    "/freelancer/**",
  ],
};

// Helper function to check if a path matches any of the allowed patterns
function isPathAllowed(path: string, allowedPatterns: string[]): boolean {
  return allowedPatterns.some(pattern => {
    const regexPattern = pattern
      .replace(/\*/g, ".*") // Convert * to .* for regex
      .replace(/\//g, "\\/"); // Escape forward slashes
    return new RegExp(`^${regexPattern}$`).test(path);
  });
}

// Helper function to get user role from Clerk metadata
async function getUserRole(clerkId: string): Promise<UserRole | null> {
  try {
    // Use absolute URL to avoid issues with relative paths
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log(`Fetching role for user ${clerkId} from ${baseUrl}/api/users/role`);
    
    const response = await fetch(`${baseUrl}/api/users/role?clerkId=${clerkId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch user role: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(`Received role data:`, data);
    return data.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

// Create a matcher for public routes
const publicRoutes = createRouteMatcher([
  "/",
  "/api/public",
  "/api/public/:path*",
  "/api/users/role"
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId) {
    console.log("No userId found in auth");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const path = req.nextUrl.pathname;
  console.log(`Checking permissions for path: ${path}`);
  
  // Get user role from our database
  const userRole = await getUserRole(userId);
  console.log(`User ${userId} has role: ${userRole}`);
  
  if (!userRole) {
    console.error(`No role found for user ${userId}`);
    return new NextResponse("Unauthorized - No role found", { status: 401 });
  }

  // Check if the user has permission to access the route
  const allowedPatterns = rolePermissions[userRole] || [];
  console.log(`Allowed patterns for role ${userRole}:`, allowedPatterns);
  
  if (!isPathAllowed(path, allowedPatterns)) {
    console.error(`User ${userId} with role ${userRole} tried to access unauthorized path: ${path}`);
    return new NextResponse("Forbidden - Insufficient permissions", { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
