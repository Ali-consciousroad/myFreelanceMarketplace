import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id: userId }, // Using id instead of clerkId for now
      include: {
        client: true,
        freelance: true
      }
    });

    if (!existingUser) {
      // Create new user with default role
      const newUser = await prisma.user.create({
        data: {
          id: userId, // Using userId as the id
          login: `user-${userId}`,
          password: 'placeholder', // We'll handle this differently in production
          role: 'CLIENT', // Default role
        },
        include: {
          client: true,
          freelance: true
        }
      });

      return NextResponse.json({ 
        success: true, 
        user: newUser,
        isNewUser: true 
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: existingUser,
      isNewUser: false 
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
} 