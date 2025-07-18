import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Full access to all system features'
    }
  })

  const committeeAdminRole = await prisma.role.upsert({
    where: { name: 'Committee Admin' },
    update: {},
    create: {
      name: 'Committee Admin',
      description: 'Limited admin access for committee management'
    }
  })

  const memberRole = await prisma.role.upsert({
    where: { name: 'Member' },
    update: {},
    create: {
      name: 'Member',
      description: 'Regular community member access'
    }
  })

  // Create membership types
  const patronMembership = await prisma.membershipType.upsert({
    where: { name: 'Patron' },
    update: {},
    create: { name: 'Patron' }
  })

  const lifetimeMembership = await prisma.membershipType.upsert({
    where: { name: 'Lifetime' },
    update: {},
    create: { name: 'Lifetime' }
  })

  const twoYearMembership = await prisma.membershipType.upsert({
    where: { name: '2-Year' },
    update: {},
    create: { name: '2-Year' }
  })

  // Create a sample super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bilaspuragrawalsabha.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@bilaspuragrawalsabha.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
      emailVerifiedAt: new Date()
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

  // Create sample member
  const sampleMember = await prisma.member.create({
    data: {
      firstName: 'Sample',
      lastName: 'Member',
      fatherName: 'Sample Father',
      nativePlace: 'Bilaspur',
      dob: new Date('1980-01-01'),
      gender: 'Male',
      address: 'Sample Address, Bilaspur',
      city: 'Bilaspur',
      pincode: '495001',
      phonePrimary: '9876543210',
      email: 'sample@example.com',
      businessName: 'Sample Business',
      businessCategory: 'Trading',
      membershipTypeId: lifetimeMembership.id
    }
  })

  // Create sample news article
  await prisma.newsArticle.create({
    data: {
      title: 'Welcome to Bilaspur Agrawal Sabha Portal',
      slug: 'welcome-to-bilaspur-agrawal-sabha-portal',
      content: 'We are excited to launch our new community portal. This platform will serve as the central hub for all community activities, news, and member interactions.',
      authorId: adminUser.id,
      publishedAt: new Date()
    }
  })

  // Create sample event
  await prisma.event.create({
    data: {
      title: 'Agrasen Jayanti Celebration',
      description: 'Annual celebration of Maharaja Agrasen Jayanti with cultural programs and community gathering.',
      venue: 'Agrasen Bhawan, Bilaspur',
      startDatetime: new Date('2024-09-17T18:00:00'),
      endDatetime: new Date('2024-09-17T21:00:00')
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('📧 Admin login: admin@bilaspuragrawalsabha.com')
  console.log('🔑 Admin password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })