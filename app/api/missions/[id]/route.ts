export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma, { getUserWithRoleByClerkId } from "@/lib/prisma";

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
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user and check role/ownership
    const user = await getUserWithRoleByClerkId(userId);
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: { client: true },
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
    if (!user || (user.role !== "ADMIN" && (!user.client || user.client.id !== mission.clientId))) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Only the owning client or admin can update this mission" }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const body = await request.json();
    const { status, dailyRate, timeframe, description, categoryIds } = body;

    const updatedMission = await prisma.mission.update({
      where: { id: params.id },
      data: {
        status,
        dailyRate,
        timeframe,
        description,
        categories: {
          set: categoryIds?.map((id: string) => ({ id })) || [],
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
      JSON.stringify(updatedMission),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error updating mission:", error);
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

// DELETE /api/missions/[id] - Delete a mission
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user and check role/ownership
    const user = await getUserWithRoleByClerkId(userId);
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: { client: true, payments: true, contract: true, categories: true },
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
    if (!user || (user.role !== "ADMIN" && (!user.client || user.client.id !== mission.clientId))) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Only the owning client or admin can delete this mission" }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Delete related records one by one with error handling
    try {
      // Delete payments
      if (mission.payments.length > 0) {
        await prisma.payment.deleteMany({ where: { missionId: params.id } });
      }
      // Delete contract
      if (mission.contract) {
        await prisma.contract.delete({ where: { missionId: params.id } });
      }
      // Delete mission
      await prisma.mission.delete({ where: { id: params.id } });
      return new NextResponse(
        JSON.stringify({ message: "Mission deleted successfully" }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (deleteError: any) {
      return new NextResponse(
        JSON.stringify({ error: `Error during deletion: ${deleteError.message}` }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
