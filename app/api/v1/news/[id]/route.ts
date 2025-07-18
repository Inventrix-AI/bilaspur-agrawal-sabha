import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt-utils"

// Next.js 15 requires params to be a Promise
interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    // Verify JWT token
    const authResult = await verifyJWT(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const articleId = parseInt(id)
    
    const article = await prisma.newsArticle.findUnique({
      where: { 
        id: articleId,
        publishedAt: { not: null }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        publishedAt: true,
        author: {
          select: {
            name: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching news article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    )
  }
}