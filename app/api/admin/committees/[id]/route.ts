import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCommitteeById, updateCommittee, deleteCommittee } from "@/lib/committees"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committeeId = parseInt(id)
    const committee = await getCommitteeById(committeeId)
    
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 })
    }

    return NextResponse.json(committee)
  } catch (error) {
    console.error('Error fetching committee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch committee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committeeId = parseInt(id)
    const data = await request.json()

    const committee = await updateCommittee(committeeId, {
      name: data.name,
      description: data.description,
      sessionYear: data.sessionYear,
      committeeImageUrl: data.committeeImageUrl,
      posterImageUrl: data.posterImageUrl,
      isActive: data.isActive,
      displayOrder: data.displayOrder
    })

    return NextResponse.json(committee)
  } catch (error) {
    console.error('Error updating committee:', error)
    return NextResponse.json(
      { error: 'Failed to update committee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committeeId = parseInt(id)
    await deleteCommittee(committeeId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting committee:', error)
    return NextResponse.json(
      { error: 'Failed to delete committee' },
      { status: 500 }
    )
  }
}