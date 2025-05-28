export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET /api/missions - List all missions
export async function GET() {
  try {
    const missions = await db.mission.findMany({
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

    const body = await request.json();
    const { status, dailyRate, timeframe, description, clientId } = body;

    // Validate required fields
    if (!description || !dailyRate || !timeframe || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the mission
    const mission = await db.mission.create({
      data: {
        status,
        dailyRate,
        timeframe,
        description,
        clientId,
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
