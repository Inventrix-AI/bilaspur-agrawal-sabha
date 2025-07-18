import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a sample super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bilaspuragrawalsabha.com' },
    update: {},
    create: {
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
  await prisma.member.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
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

  // Create sample committees
  const executiveCommittee = await prisma.committee.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Executive Committee',
      description: 'Main governing body of the Sabha',
      sessionYear: '2024-2025'
    }
  })

  const culturalCommittee = await prisma.committee.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Cultural Committee',
      description: 'Organizes cultural events and programs',
      sessionYear: '2024-2025'
    }
  })

  // Create sample regular user
  const userPassword = await bcrypt.hash('password123', 12)
  
  const sampleUser = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      name: 'Sample Member',
      email: 'member@example.com',
      password: userPassword,
      role: 'Member',
      status: 'Active',
      isEmailVerified: true,
      phone: '9876543211'
    }
  })

  // Create member profile for sample user
  await prisma.member.upsert({
    where: { userId: sampleUser.id },
    update: {},
    create: {
      userId: sampleUser.id,
      firstName: 'Sample',
      lastName: 'Member',
      fatherName: 'Sample Father',
      nativePlace: 'Bilaspur',
      dob: new Date('1985-01-15'),
      gender: 'Male',
      address: 'Sample Address, Bilaspur',
      locality: 'Railway Colony',
      city: 'Bilaspur',
      pincode: '495001',
      phonePrimary: '9876543211',
      email: 'member@example.com',
      businessName: 'Sample Enterprises',
      businessCategory: 'Trading',
      gotra: 'Mittal',
      membershipType: 'Lifetime',
      status: 'Active',
      isApproved: true,
      isActive: true
    }
  })

  // Create sample news article
  await prisma.newsArticle.upsert({
    where: { slug: 'welcome-to-bilaspur-agrawal-sabha-portal' },
    update: {
      title: 'Welcome to Bilaspur Agrawal Sabha Portal',
      content: 'We are excited to launch our new community portal. This platform will serve as the central hub for all community activities, news, and member interactions. Members can now register online, view events, read news, and connect with the community digitally.',
      authorId: adminUser.id,
      publishedAt: new Date()
    },
    create: {
      title: 'Welcome to Bilaspur Agrawal Sabha Portal',
      slug: 'welcome-to-bilaspur-agrawal-sabha-portal',
      content: 'We are excited to launch our new community portal. This platform will serve as the central hub for all community activities, news, and member interactions. Members can now register online, view events, read news, and connect with the community digitally.',
      authorId: adminUser.id,
      publishedAt: new Date()
    }
  })

  // Create sample event
  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Agrasen Jayanti Celebration 2024',
      description: 'Annual celebration of Maharaja Agrasen Jayanti with cultural programs, community gathering, and traditional festivities. Join us for an evening of cultural performances, community bonding, and celebration of our heritage.',
      venue: 'Agrasen Bhawan, Bilaspur',
      startDatetime: new Date('2024-09-17T18:00:00'),
      endDatetime: new Date('2024-09-17T21:00:00')
    }
  })

  // Create another event
  await prisma.event.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Annual General Meeting 2024',
      description: 'Annual General Meeting of Bilaspur Agrawal Sabha. All members are invited to participate in the important discussions about community development and upcoming initiatives.',
      venue: 'Community Hall, Bilaspur',
      startDatetime: new Date('2024-12-15T17:00:00'),
      endDatetime: new Date('2024-12-15T19:00:00')
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('📧 Admin login: admin@bilaspuragrawalsabha.com')
  console.log('🔑 Admin password: admin123')
  console.log('👤 Admin user ID:', adminUser.id)
  console.log('📧 Sample member login: member@example.com')
  console.log('🔑 Sample member password: password123')
  console.log('👤 Sample user ID:', sampleUser.id)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })