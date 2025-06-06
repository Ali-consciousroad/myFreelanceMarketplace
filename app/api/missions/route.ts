export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET /api/missions - List all missions
export async function GET() {
  try {
    const missions = await db.mission.findMany({
      include: {
        client: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch missions" },
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

    // Find or create the client record for this user
    let client = await db.client.findUnique({ where: { userId } });
    if (!client) {
      // Ensure a User record exists for this Clerk user
      let user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        user = await db.user.create({
          data: {
            id: userId,
            login: userId, // Use Clerk userId as login for now
            password: "placeholder", // Placeholder, not used with Clerk
            role: "CLIENT",
          },
        });
      }
      client = await db.client.create({
        data: {
          userId,
          company: "My Company", // Placeholder, user can edit later
          vat: "N/A", // Placeholder
        },
      });
    }

    const body = await request.json();
    const { title, status, dailyRate, timeframe, description } = body;

    // Validate required fields
    if (!title || !description || !dailyRate || !timeframe) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the mission
    const mission = await db.mission.create({
      data: {
        title,
        status,
        dailyRate,
        timeframe,
        description,
        clientId: client.id, // Use the Client.id, not Clerk userId
      },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error("Error creating mission:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
 