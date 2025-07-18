import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt-utils"

export async function GET(request: Request) {
  try {
    // Verify JWT token
    const authResult = await verifyJWT(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get upcoming events
    const events = await prisma.event.findMany({
      where: {
        startDatetime: { gte: new Date() }
      },
      orderBy: {
        startDatetime: 'asc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        venue: true,
        startDatetime: true,
        endDatetime: true,
        imageUrl: true
      }
    })

    const total = await prisma.event.count({
      where: {
        startDatetime: { gte: new Date() }
      }
    })

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}