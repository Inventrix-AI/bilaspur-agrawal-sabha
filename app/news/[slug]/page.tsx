import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getNewsArticle(slug: string) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })
    return article
  } catch (error) {
    console.error('Error fetching news article:', error)
    return null
  }
}

async function getRelatedArticles(currentId: number) {
  try {
    return await prisma.newsArticle.findMany({
      where: {
        publishedAt: { not: null },
        id: { not: currentId }
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticle(params.slug)

  if (!article || !article.publishedAt) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-6">
            <Link
              href="/news"
              className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {article.author.name}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {article.imageUrl && (
              <div className="mb-8">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
            
            <div className="prose prose-lg prose-orange max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Details</h3>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Published</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Author</dt>
                  <dd className="mt-1 text-sm text-gray-900">{article.author.name}</dd>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <div key={related.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        <Link 
                          href={`/news/${related.slug}`}
                          className="hover:text-orange-600 transition-colors"
                        >
                          {related.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(related.publishedAt!).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}