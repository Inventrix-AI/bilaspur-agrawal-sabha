import Link from "next/link"
import { Calendar, Users, Camera, Award, Phone, MapPin, Mail } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getActiveCommittees } from "@/lib/committees"
import CommitteeCarousel from "@/components/committee-carousel"

async function getLatestNews() {
  try {
    return await prisma.newsArticle.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take: 4,
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
      take: 4,
      select: {
        id: true,
        title: true,
        startDatetime: true,
        venue: true,
        imageUrl: true
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

async function getRecentGalleryAlbums() {
  try {
    return await prisma.galleryAlbum.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        photos: {
          take: 1,
          select: {
            imageUrl: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    return []
  }
}

export default async function Home() {
  let latestNews: any[] = []
  let upcomingEvents: any[] = []
  let committees: any[] = []
  let galleryAlbums: any[] = []

  try {
    const results = await Promise.all([
      getLatestNews(),
      getUpcomingEvents(),
      getActiveCommittees(),
      getRecentGalleryAlbums()
    ])
    latestNews = results[0]
    upcomingEvents = results[1]
    committees = results[2]
    galleryAlbums = results[3]
  } catch (error) {
    console.error('Error loading home page data:', error)
  }

  return (
    <div className="bg-white">
      {/* Hero Carousel Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <CommitteeCarousel 
          committees={committees}
          height="h-96 md:h-[600px]"
          autoPlayInterval={6000}
        />
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
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
                <Award className="h-8 w-8 text-orange-600" />
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
                    <div className="flex gap-4">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                    </div>
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
                    <div className="flex gap-4">
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                          <p className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.venue}
                          </p>
                        </div>
                      </div>
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

      {/* Gallery Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
            <Link href="/gallery" className="text-orange-600 hover:text-orange-500 font-medium">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {album.photos && album.photos.length > 0 ? (
                  <img
                    src={album.photos[0].imageUrl}
                    alt={album.name}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {album.name}
                  </h3>
                  
                  {album.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Community Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Community Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover what our community platform has to offer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

      {/* Contact Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-2 text-gray-600">+91 9876543210</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-gray-600">info@bilaspuragrawalsabha.com</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Location</h3>
              <p className="mt-2 text-gray-600">Bilaspur, Chhattisgarh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
