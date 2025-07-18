import { prisma } from "@/lib/prisma"

export async function getActiveCommittees() {
  try {
    return await prisma.committee.findMany({
      where: { 
        isActive: true,
        posterImageUrl: { not: null }
      },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        sessionYear: true,
        committeeImageUrl: true,
        posterImageUrl: true,
        isActive: true,
        displayOrder: true
      }
    })
  } catch (error) {
    console.error('Error fetching active committees:', error)
    return []
  }
}

export async function getAllCommittees() {
  try {
    return await prisma.committee.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        sessionYear: true,
        committeeImageUrl: true,
        posterImageUrl: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            committeeMembers: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching all committees:', error)
    return []
  }
}

export async function getCommitteeById(id: number) {
  try {
    return await prisma.committee.findUnique({
      where: { id },
      include: {
        committeeMembers: {
          include: {
            member: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    phone: true
                  }
                }
              }
            }
          },
          orderBy: { id: 'asc' }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching committee by ID:', error)
    return null
  }
}

export async function createCommittee(data: {
  name: string
  description?: string
  sessionYear: string
  committeeImageUrl?: string
  posterImageUrl?: string
  isActive?: boolean
  displayOrder?: number
}) {
  try {
    return await prisma.committee.create({
      data: {
        name: data.name,
        description: data.description,
        sessionYear: data.sessionYear,
        committeeImageUrl: data.committeeImageUrl,
        posterImageUrl: data.posterImageUrl,
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder ?? 0
      }
    })
  } catch (error) {
    console.error('Error creating committee:', error)
    throw error
  }
}

export async function updateCommittee(id: number, data: {
  name?: string
  description?: string
  sessionYear?: string
  committeeImageUrl?: string
  posterImageUrl?: string
  isActive?: boolean
  displayOrder?: number
}) {
  try {
    return await prisma.committee.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error('Error updating committee:', error)
    throw error
  }
}

export async function deleteCommittee(id: number) {
  try {
    return await prisma.committee.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting committee:', error)
    throw error
  }
}