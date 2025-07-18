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

    const albums = await prisma.galleryAlbum.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        createdAt: true,
        event: {
          select: {
            title: true,
            startDatetime: true
          }
        },
        _count: {
          select: {
            photos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(albums)
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery albums' },
      { status: 500 }
    )
  }
}