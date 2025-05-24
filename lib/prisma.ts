import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Utility to get user and role by Clerk user ID
export async function getUserWithRoleByClerkId(clerkUserId: string) {
  return prisma.user.findUnique({
    where: { id: clerkUserId },
    select: {
      id: true,
      role: true,
      client: true,
      freelance: true,
    },
  });
}
 