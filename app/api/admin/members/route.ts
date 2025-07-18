import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const members = await prisma.member.findMany({
      include: {
        membershipType: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'Super Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const member = await prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        nativePlace: data.nativePlace,
        dob: new Date(data.dob),
        gender: data.gender,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        phonePrimary: data.phonePrimary,
        phoneSecondary: data.phoneSecondary,
        email: data.email,
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        membershipTypeId: data.membershipTypeId,
        isActive: data.isActive ?? true
      },
      include: {
        membershipType: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}