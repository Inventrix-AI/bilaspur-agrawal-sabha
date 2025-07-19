import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const diagnosis: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    nextAuthUrl: process.env.NEXTAUTH_URL,
    tests: {} as Record<string, any>
  }

  try {
    // Test 1: Database Connection
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    diagnosis.tests['database_connection'] = 'SUCCESS'
    
    // Test 2: Check if any users exist
    console.log('🔍 Checking for users...')
    const userCount = await prisma.user.count()
    diagnosis.tests['user_count'] = userCount
    
    // Test 3: Check for admin user specifically
    console.log('🔍 Looking for admin user...')
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@bilaspuragrawalsabha.com' }
    })
    
    if (adminUser) {
      diagnosis.tests['admin_user_exists'] = true
      diagnosis.tests['admin_user_id'] = adminUser.id
      diagnosis.tests['admin_password_length'] = adminUser.password.length
      diagnosis.tests['admin_password_starts_with'] = adminUser.password.substring(0, 7)
      
      // Test 4: Password verification
      console.log('🔍 Testing password...')
      const passwordTest = await bcrypt.compare('admin123', adminUser.password)
      diagnosis.tests['password_verification'] = passwordTest
      
      // Test 5: Create a new hash and compare
      console.log('🔍 Testing fresh hash...')
      const freshHash = await bcrypt.hash('admin123', 12)
      const freshTest = await bcrypt.compare('admin123', freshHash)
      diagnosis.tests['fresh_hash_test'] = freshTest
      
    } else {
      diagnosis.tests['admin_user_exists'] = false
      
      // Create admin user immediately
      console.log('🔧 Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const newAdmin = await prisma.user.create({
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
      
      // Create member profile
      await prisma.member.create({
        data: {
          userId: newAdmin.id,
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
      
      diagnosis.tests['admin_user_created'] = true
      diagnosis.tests['new_admin_id'] = newAdmin.id
      
      // Test the new password
      const newPasswordTest = await bcrypt.compare('admin123', newAdmin.password)
      diagnosis.tests['new_password_verification'] = newPasswordTest
    }
    
  } catch (error) {
    diagnosis.tests['error'] = error instanceof Error ? error.message : 'Unknown error'
    diagnosis.tests['error_stack'] = error instanceof Error ? error.stack : 'No stack'
  }
  
  return NextResponse.json(diagnosis, { 
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}