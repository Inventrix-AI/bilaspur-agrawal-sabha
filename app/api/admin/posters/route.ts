import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posters = await prisma.poster.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, imageUrl, linkUrl, displayOrder, isActive } = await request.json()

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
    }

    const poster = await prisma.poster.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        linkUrl: linkUrl || null,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(poster, { status: 201 })
  } catch (error) {
    console.error('Error creating poster:', error)
    return NextResponse.json(
      { error: 'Failed to create poster' },
      { status: 500 }
    )
  }
}