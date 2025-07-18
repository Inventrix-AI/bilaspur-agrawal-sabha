import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's member profile
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        member: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.member) {
      return NextResponse.json({ error: 'Member profile not found' }, { status: 404 })
    }

    // Return the member profile with user information
    const memberProfile = {
      ...user.member,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    }

    return NextResponse.json(memberProfile)

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}