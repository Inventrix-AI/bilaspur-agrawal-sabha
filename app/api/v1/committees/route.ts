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

    const committees = await prisma.committee.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        sessionYear: true,
        committeeMembers: {
          select: {
            designation: true,
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
                phonePrimary: true,
                email: true,
                profileImageUrl: true
              }
            }
          },
          orderBy: [
            { designation: 'asc' },
            { member: { firstName: 'asc' } }
          ]
        }
      },
      orderBy: {
        sessionYear: 'desc'
      }
    })

    return NextResponse.json(committees)
  } catch (error) {
    console.error('Error fetching committees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch committees' },
      { status: 500 }
    )
  }
}