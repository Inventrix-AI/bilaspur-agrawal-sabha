import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
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

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const articleId = parseInt(id)

    const article = await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        imageUrl: data.imageUrl || null,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
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
    console.error('Error updating news article:', error)
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const articleId = parseInt(id)

    const article = await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
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
    console.error('Error updating news article:', error)
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Must await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const articleId = parseInt(id)

    await prisma.newsArticle.delete({
      where: { id: articleId }
    })

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    )
  }
}