import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Next.js 15 requires params to be a Promise
interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posterId = parseInt(id)
    const data = await request.json()

    const poster = await prisma.poster.update({
      where: { id: posterId },
      data: {
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive
      }
    })

    return NextResponse.json(poster)
  } catch (error) {
    console.error('Error updating poster:', error)
    return NextResponse.json(
      { error: 'Failed to update poster' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posterId = parseInt(id)

    await prisma.poster.delete({
      where: { id: posterId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting poster:', error)
    return NextResponse.json(
      { error: 'Failed to delete poster' },
      { status: 500 }
    )
  }
}