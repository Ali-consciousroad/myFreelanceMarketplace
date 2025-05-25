import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";

// Define role-based route permissions
const rolePermissions = {
  [UserRole.ADMIN]: [
    "/api/admin",
    "/api/admin/**",
    "/api/users",
    "/api/users/**",
    "/api/missions",
    "/api/missions/**",
    "/api/contracts",
    "/api/contracts/**",
    "/api/payments",
    "/api/payments/**",
    "/admin/**",
    "/missions",
    "/missions/**",
  ],
  [UserRole.SUPPORT]: [
    "/api/support",
    "/api/support/**",
    "/api/missions",
    "/api/missions/**",
    "/api/contracts",
    "/api/contracts/**",
    "/api/payments",
    "/api/payments/**",
    "/support/**",
    "/missions",
    "/missions/**",
  ],
  [UserRole.CLIENT]: [
    "/api/missions",
    "/api/missions/**",
    "/api/contracts",
    "/api/contracts/**",
    "/api/payments",
    "/api/payments/**",
    "/client/**",
    "/missions",
    "/missions/**",
  ],
  [UserRole.FREELANCER]: [
    "/api/missions",
    "/api/missions/**",
    "/api/contracts",
    "/api/contracts/**",
    "/api/portfolio",
    "/api/portfolio/**",
    "/api/services",
    "/api/services/**",
    "/freelancer/**",
    "/missions",
    "/missions/**",
  ],
};

// Helper function to check if a path matches any of the allowed patterns
function isPathAllowed(path: string, allowedPatterns: string[]): boolean {
  console.log(`Checking if path ${path} matches any of:`, allowedPatterns);
  return allowedPatterns.some(pattern => {
    // Convert pattern to regex, handling both exact matches and wildcards
    const regexPattern = pattern
      .replace(/\*/g, ".*") // Convert * to .* for regex
      .replace(/\//g, "\\/") // Escape forward slashes
      .replace(/\*\*/g, ".*"); // Handle double asterisks
    const regex = new RegExp(`^${regexPattern}$`);
    const matches = regex.test(path);
    console.log(`Pattern ${pattern} (regex: ${regex}) matches: ${matches}`);
    return matches;
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
    console.log(`Path ${req.nextUrl.pathname} is public, allowing access`);
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
  
  const isAllowed = isPathAllowed(path, allowedPatterns);
  console.log(`Path ${path} is ${isAllowed ? 'allowed' : 'forbidden'} for role ${userRole}`);
  
  if (!isAllowed) {
    console.error(`User ${userId} with role ${userRole} tried to access unauthorized path: ${path}`);
    return new NextResponse("Forbidden - Insufficient permissions", { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
