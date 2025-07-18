import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const posters = await prisma.poster.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json(posters)
  } catch (error) {
    console.error('Error fetching posters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posters' },
      { status: 500 }
    )
  }
}