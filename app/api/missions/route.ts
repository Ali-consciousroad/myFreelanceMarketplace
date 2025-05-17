import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// GET /api/missions - List all missions
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const missions = await prisma.mission.findMany({
      include: {
        client: {
          include: {
            user: true,
          },
        },
        categories: true,
        contract: true,
        payments: true,
      },
    });

    return NextResponse.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/missions - Create a new mission
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, dailyRate, timeframe, description, clientId, categoryIds } =
      body;

    // Validate required fields
    if (!description || !dailyRate || !timeframe || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create the mission
    const mission = await prisma.mission.create({
      data: {
        status: status || "OPEN",
        dailyRate,
        timeframe,
        description,
        clientId,
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

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error("Error creating mission:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
