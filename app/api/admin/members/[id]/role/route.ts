import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Next.js 15 requires params to be a Promise
interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'Super Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()
    const memberId = parseInt(id)

    if (!role || !['Member', 'Committee Admin', 'Super Admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Get the member with user information
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { user: true }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Update the user's role
    await prisma.user.update({
      where: { id: member.userId },
      data: { role }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Role updated to ${role}` 
    })

  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json(
      { error: 'Failed to update member role' },
      { status: 500 }
    )
  }
}