import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt-utils"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify JWT token
    const authResult = await verifyJWT(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const albumId = parseInt(params.id)
    
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
      select: {
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        event: {
          select: {
            title: true,
            startDatetime: true
          }
        },
        photos: {
          select: {
            id: true,
            imageUrl: true,
            caption: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      album_name: album.name,
      album_description: album.description,
      event: album.event,
      photos: album.photos
    })
  } catch (error) {
    console.error('Error fetching gallery album:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery album' },
      { status: 500 }
    )
  }
}