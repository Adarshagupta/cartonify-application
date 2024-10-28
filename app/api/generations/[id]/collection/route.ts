import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collectionId } = await request.json();
    
    const generation = await prisma.generation.update({
      where: { id: params.id },
      data: { collectionId }
    });

    return NextResponse.json(generation);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating generation" },
      { status: 500 }
    );
  }
}
