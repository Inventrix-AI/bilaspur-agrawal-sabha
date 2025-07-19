import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  return POST()
}

export async function POST() {
  try {
    console.log('🌱 Force seeding database...')
    
    // First, delete existing admin user if exists
    try {
      await prisma.member.deleteMany({
        where: {
          user: {
            email: 'admin@bilaspuragrawalsabha.com'
          }
        }
      })
      await prisma.user.deleteMany({
        where: {
          email: 'admin@bilaspuragrawalsabha.com'
        }
      })
      console.log('🗑️ Cleaned existing admin user')
    } catch (e) {
      console.log('ℹ️ No existing admin to clean')
    }
    
    // Create fresh admin user
    console.log('🔐 Creating admin password...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    console.log('✅ Password hashed')
    
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
    console.log('✅ Admin user created:', adminUser.id)
    
    // Create member profile
    const adminMember = await prisma.member.create({
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
    console.log('✅ Admin member created:', adminMember.id)
    
    // Test the password immediately
    const passwordTest = await bcrypt.compare('admin123', adminUser.password)
    console.log('🔐 Password test result:', passwordTest)
    
    return NextResponse.json({
      success: true,
      message: 'Database force seeded successfully',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        memberId: adminMember.id,
        passwordTest: passwordTest,
        passwordLength: adminUser.password.length,
        passwordHash: adminUser.password.substring(0, 10) + '...'
      },
      credentials: {
        email: 'admin@bilaspuragrawalsabha.com',
        password: 'admin123'
      }
    })
    
  } catch (error) {
    console.error('❌ Force seeding failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}