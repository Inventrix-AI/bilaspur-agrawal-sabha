import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const articles = await prisma.newsArticle.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching news articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const article = await prisma.newsArticle.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        imageUrl: data.imageUrl || null,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        authorId: parseInt(session.user.id)
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    )
  }
}