import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, ensure the user exists
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        login: `user-${userId}`,
        password: 'placeholder',
        role: 'ADMIN',
      },
    });

    console.log('User created/found:', user);

    // Check if user already has a client profile
    const existingClient = await prisma.client.findFirst({
      where: { userId: user.id },
    });

    if (existingClient) {
      console.log('Existing client found:', existingClient);
      return NextResponse.json({ clientId: existingClient.id });
    }

    // Create a new client profile
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        company: "Test Company",
        vat: "FR12345678900",
      },
    });

    console.log('Client created:', client);

    return NextResponse.json({ clientId: client.id });
  } catch (error) {
    console.error("Error creating test client:", error);
    return NextResponse.json(
      { error: "Failed to create test client" },
      { status: 500 }
    );
  }
} 