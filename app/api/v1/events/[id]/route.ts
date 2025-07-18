import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt-utils"

// Next.js 15 requires params to be a Promise
interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    // Verify JWT token
    const authResult = await verifyJWT(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const eventId = parseInt(id)
    
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}