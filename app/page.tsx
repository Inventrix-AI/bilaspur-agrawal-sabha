import Link from "next/link"
import { Calendar, Users, FileText, Camera } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getLatestNews() {
  try {
    return await prisma.newsArticle.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        imageUrl: true
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: { startDatetime: { gte: new Date() } },
      orderBy: { startDatetime: 'asc' },
      take: 3,
      select: {
        id: true,
        title: true,
        startDatetime: true,
        venue: true
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function Home() {
  const [latestNews, upcomingEvents] = await Promise.all([
    getLatestNews(),
    getUpcomingEvents()
  ])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to
              <span className="text-orange-600"> Bilaspur Agrawal Sabha</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              A unified digital platform serving the Agarwal community of Bilaspur. 
              Connecting hearts, celebrating our rich heritage, and building a stronger community together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/members"
                className="rounded-md bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
              >
                Explore Members
              </Link>
              <Link href="/about-us" className="text-base font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 p-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <dt className="mt-4 text-lg font-medium text-gray-900">Community Members</dt>
              <dd className="mt-2 text-3xl font-bold text-orange-600">500+</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 p-4">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <dt className="mt-4 text-lg font-medium text-gray-900">Annual Events</dt>
              <dd className="mt-2 text-3xl font-bold text-orange-600">12+</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 p-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <dt className="mt-4 text-lg font-medium text-gray-900">Years of Service</dt>
              <dd className="mt-2 text-3xl font-bold text-orange-600">25+</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 p-4">
                <Camera className="h-8 w-8 text-orange-600" />
              </div>
              <dt className="mt-4 text-lg font-medium text-gray-900">Photo Albums</dt>
              <dd className="mt-2 text-3xl font-bold text-orange-600">50+</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News & Upcoming Events */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
                <Link href="/news" className="text-orange-600 hover:text-orange-500 font-medium">
                  View all →
                </Link>
              </div>
              <div className="space-y-6">
                {latestNews.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/news/${article.slug}`} className="hover:text-orange-600">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Draft'}
                    </p>
                  </div>
                ))}
                {latestNews.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No news articles available yet.</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                <Link href="/events" className="text-orange-600 hover:text-orange-500 font-medium">
                  View all →
                </Link>
              </div>
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/events/${event.id}`} className="hover:text-orange-600">
                        {event.title}
                      </Link>
                    </h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p>{event.venue}</p>
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No upcoming events scheduled.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Community Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover what our community platform has to offer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Member Directory</h3>
              <p className="mt-2 text-gray-600">
                Connect with community members, search by location, profession, and more.
              </p>
              <Link href="/members" className="mt-4 inline-block text-orange-600 hover:text-orange-500">
                Explore Directory →
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Events & Programs</h3>
              <p className="mt-2 text-gray-600">
                Stay updated with cultural events, community gatherings, and celebrations.
              </p>
              <Link href="/events" className="mt-4 inline-block text-orange-600 hover:text-orange-500">
                View Events →
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Camera className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Photo Gallery</h3>
              <p className="mt-2 text-gray-600">
                Browse through memories from past events and community celebrations.
              </p>
              <Link href="/gallery" className="mt-4 inline-block text-orange-600 hover:text-orange-500">
                View Gallery →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
