import Link from "next/link"
import { Calendar, User, ArrowRight, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getNewsArticles() {
  try {
    return await prisma.newsArticle.findMany({
      where: {
        publishedAt: { not: null }
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
      }
    })
  } catch (error) {
    console.error('Error fetching news articles:', error)
    return []
  }
}

function NewsCard({ article }: { article: any }) {
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border overflow-hidden">
      {article.imageUrl && (
        <div className="aspect-video bg-gray-200">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(article.publishedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {article.author.name}
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          <Link 
            href={`/news/${article.slug}`}
            className="hover:text-orange-600 transition-colors"
          >
            {article.title}
          </Link>
        </h2>
        
        <div className="text-gray-600 mb-4 line-clamp-3">
          {article.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
        </div>
        
        <Link
          href={`/news/${article.slug}`}
          className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
        >
          Read More
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </article>
  )
}

export default async function NewsPage() {
  const articles = await getNewsArticles()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Community News
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, announcements, and stories from our community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No news articles yet</h3>
            <p className="mt-1 text-gray-500">
              News articles and announcements will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}