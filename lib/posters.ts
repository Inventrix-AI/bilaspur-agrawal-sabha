import { prisma } from "@/lib/prisma"

export async function getActivePosters() {
  try {
    return await prisma.poster.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        linkUrl: true,
        displayOrder: true,
        isActive: true
      }
    })
  } catch (error) {
    console.error('Error fetching active posters:', error)
    return []
  }
}

export async function getAllPosters() {
  try {
    return await prisma.poster.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        linkUrl: true,
        displayOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  } catch (error) {
    console.error('Error fetching all posters:', error)
    return []
  }
}