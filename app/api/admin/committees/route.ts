import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllCommittees, createCommittee } from "@/lib/committees"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committees = await getAllCommittees()
    return NextResponse.json(committees)
  } catch (error) {
    console.error('Error fetching committees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch committees' },
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

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.sessionYear) {
      return NextResponse.json(
        { error: 'Name and session year are required' },
        { status: 400 }
      )
    }

    const committee = await createCommittee({
      name: data.name,
      description: data.description,
      sessionYear: data.sessionYear,
      committeeImageUrl: data.committeeImageUrl,
      posterImageUrl: data.posterImageUrl,
      isActive: data.isActive,
      displayOrder: data.displayOrder
    })

    return NextResponse.json(committee, { status: 201 })
  } catch (error) {
    console.error('Error creating committee:', error)
    return NextResponse.json(
      { error: 'Failed to create committee' },
      { status: 500 }
    )
  }
}