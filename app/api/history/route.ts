import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const history = await prisma.generation.findMany({
    where: {
      userEmail: session.user.email
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(history)
}
