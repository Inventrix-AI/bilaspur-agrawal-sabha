import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt-utils"

export async function GET(request: Request) {
  try {
    // Verify JWT token
    const authResult = await verifyJWT(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get published news articles
    const articles = await prisma.newsArticle.findMany({
      where: {
        publishedAt: { not: null }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        publishedAt: true,
        content: true
      }
    })

    // Transform content to excerpt for list view
    const articlesWithExcerpt = articles.map(article => ({
      ...article,
      excerpt: article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    }))

    const total = await prisma.newsArticle.count({
      where: {
        publishedAt: { not: null }
      }
    })

    return NextResponse.json({
      articles: articlesWithExcerpt,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching news articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    )
  }
}