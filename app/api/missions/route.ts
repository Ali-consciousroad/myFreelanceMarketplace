export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma, { getUserWithRoleByClerkId } from "@/lib/prisma";
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// GET /api/missions - List all missions
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missions = await prisma.mission.findMany({
      include: {
        client: true,
        categories: true,
      },
    });

    return NextResponse.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    );
  }
}

// POST /api/missions - Create a new mission
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user and check role
    const user = await getUserWithRoleByClerkId(userId);
    if (!user || (user.role !== "CLIENT" && user.role !== "ADMIN")) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Only clients or admins can create missions" }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const body = await request.json();
    const { status, dailyRate, timeframe, description, clientId, categoryIds } = body;

    // Validate required fields
    if (!description || !dailyRate || !timeframe || !clientId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create the mission
    const mission = await prisma.mission.create({
      data: {
        status,
        dailyRate,
        timeframe,
        description,
        client: {
          connect: { id: clientId },
        },
        categories: {
          connect: categoryIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        categories: true,
      },
    });

    return new NextResponse(
      JSON.stringify(mission),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error creating mission:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
