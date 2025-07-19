import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        createdAt: true
      }
    })
    
    // Test password for admin user
    const adminUser = users.find(u => u.email === 'admin@bilaspuragrawalsabha.com')
    let passwordTest = null
    
    if (adminUser) {
      passwordTest = {
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length || 0,
        isValidBcrypt: adminUser.password?.startsWith('$2') || false,
        testPassword: await bcrypt.compare('admin123', adminUser.password || '')
      }
    }
    
    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        ...u,
        password: u.password ? '***HIDDEN***' : null
      })),
      adminPasswordTest: passwordTest,
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@')
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}