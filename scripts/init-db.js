const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log('🌱 Initializing database...')
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@bilaspuragrawalsabha.com' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return
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
    
    console.log('✅ Admin user created:', adminUser.email)
    
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
    
    console.log('✅ Database initialization completed')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

module.exports = { initDatabase }

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}