import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signJWT } from '@/lib/jwt-utils'

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Direct Login: Starting process')
    
    const { email, password } = await request.json()
    console.log('📧 Direct Login: Email:', email)
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    console.log('🔍 Direct Login: Searching for user...')
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase().trim() 
      },
      include: {
        member: true
      }
    })

    console.log('👤 Direct Login: User found:', !!user)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    console.log('🔐 Direct Login: Checking password...')
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('🔐 Direct Login: Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    console.log('✅ Direct Login: Login successful')

    // Create JWT token
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      memberId: user.member?.id
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberId: user.member?.id
      },
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('❌ Direct Login: Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}