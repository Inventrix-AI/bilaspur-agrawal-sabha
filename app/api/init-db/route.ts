import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  return POST()
}

export async function POST() {
  try {
    console.log('🌱 Initializing database via API...')
    console.log('🔗 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'))
    
    // Test database connection first
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@bilaspuragrawalsabha.com' }
    })
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists')
      
      // Test password
      const testPassword = await bcrypt.compare('admin123', existingAdmin.password)
      
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
          passwordTest: testPassword
        }
      })
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@bilaspuragrawalsabha.com',
        password: hashedPassword,
        role: 'Super Admin',
        status: 'Active',
        isEmailVerified: true,
        phone: '9876543210'
      }
    })
    
    // Create member profile for admin
    await prisma.member.create({
      data: {
        userId: adminUser.id,
        businessName: 'Administrator',
        businessCategory: 'System Administration',
        locality: 'Central Bilaspur',
        gotra: 'Admin',
        membershipType: 'Patron',
        status: 'Active',
        isApproved: true,
        isActive: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      }
    })
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}