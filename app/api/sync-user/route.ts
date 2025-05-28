import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Syncing user:', userId);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        client: true,
        freelance: true
      }
    });

    if (!existingUser) {
      // Create new user with default role
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          login: `user-${userId}`,
          password: 'placeholder',
          role: 'ADMIN', // Set as ADMIN for testing
        },
        include: {
          client: true,
          freelance: true
        }
      });

      console.log('Created new user:', newUser);

      // Update Clerk metadata
      try {
        await clerkClient.users.updateUser(userId, {
          publicMetadata: { role: newUser.role }
        });
        console.log('Updated Clerk metadata for new user');
      } catch (error) {
        console.error('Error updating Clerk metadata:', error);
      }

      return NextResponse.json({ 
        success: true, 
        user: newUser,
        isNewUser: true 
      });
    }

    console.log('Found existing user:', existingUser);

    // Update Clerk metadata
    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { role: existingUser.role }
      });
      console.log('Updated Clerk metadata for existing user');
    } catch (error) {
      console.error('Error updating Clerk metadata:', error);
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