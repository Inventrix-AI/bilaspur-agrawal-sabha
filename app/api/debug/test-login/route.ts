import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Testing login for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { member: true }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email
      })
    }
    
    console.log('👤 User found:', user.email, 'ID:', user.id)
    
    // Test password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log('🔐 Password valid:', isPasswordValid)
    
    return NextResponse.json({
      success: true,
      userFound: true,
      passwordValid: isPasswordValid,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password.length,
        passwordStartsWith: user.password.substring(0, 4),
        memberId: user.member?.id
      }
    })
    
  } catch (error) {
    console.error('❌ Test login error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}