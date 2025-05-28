export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma, { getUserWithRoleByClerkId } from "@/lib/prisma";
import { db } from "@/lib/db";

// GET /api/missions/[id] - Get a single mission
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
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

    if (!mission) {
      return new NextResponse(
        JSON.stringify({ error: "Mission not found" }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify(mission),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching mission:", error);
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

// PUT /api/missions/[id] - Update a mission
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedMission = await db.mission.update({
      where: {
        id: params.id,
      },
      data: {
        status: body.status,
        dailyRate: body.dailyRate,
        timeframe: body.timeframe,
        description: body.description,
      },
    });
    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error("Error updating mission:", error);
    return NextResponse.json(
      { error: "Failed to update mission" },
      { status: 500 }
    );
  }
}

// DELETE /api/missions/[id] - Delete a mission
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.mission.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mission:", error);
    return NextResponse.json(
      { error: "Failed to delete mission" },
      { status: 500 }
    );
  }
}
