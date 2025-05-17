export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// GET /api/missions/[id] - Get a single mission
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const body = await request.json();
    const { status, dailyRate, timeframe, description, categoryIds } = body;

    const mission = await prisma.mission.update({
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
      JSON.stringify(mission),
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
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // First, check if the mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: {
        payments: true,
        contract: true,
        categories: true,
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

    console.log("Found mission:", mission);

    // Delete related records one by one with error handling
    try {
      // Delete payments
      if (mission.payments.length > 0) {
        console.log("Deleting payments...");
        await prisma.payment.deleteMany({
          where: { missionId: params.id },
        });
      }

      // Delete contract
      if (mission.contract) {
        console.log("Deleting contract...");
        await prisma.contract.delete({
          where: { missionId: params.id },
        });
      }

      // Delete mission
      console.log("Deleting mission...");
      await prisma.mission.delete({
        where: { id: params.id },
      });

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
      console.error("Error during deletion:", deleteError);
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
    console.error("Error in DELETE operation:", error);
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
