import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: parseInt(params.id) },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const articleId = parseInt(params.id)

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const articleId = parseInt(params.id)

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
    console.error('Error updating news article publish status:', error)
    return NextResponse.json(
      { error: 'Failed to update news article publish status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const articleId = parseInt(params.id)

    await prisma.newsArticle.delete({
      where: { id: articleId }
    })

    return NextResponse.json({ message: 'News article deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    )
  }
}