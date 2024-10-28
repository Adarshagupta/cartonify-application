import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collections = await prisma.collection.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        _count: {
          select: { images: true }
        }
      }
    });

    return NextResponse.json(collections.map(collection => ({
      ...collection,
      imageCount: collection._count.images
    })));
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: user!.id
      }
    });

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating collection" },
      { status: 500 }
    );
  }
}
