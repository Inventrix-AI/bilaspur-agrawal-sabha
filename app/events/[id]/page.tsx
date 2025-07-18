import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Next.js 15 requires params to be a Promise for page components
interface PageProps {
  params: Promise<{ id: string }>
}

async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        galleryAlbums: {
          include: {
            photos: {
              take: 6
            }
          }
        }
      }
    })
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export default async function EventPage({ params }: PageProps) {
  // Must await params in Next.js 15
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const isPastEvent = new Date(event.startDatetime) < new Date()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-6">
            <Link
              href="/events"
              className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {event.title}
            </h1>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-lg text-gray-600">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center text-lg text-gray-600">
                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                {new Date(event.startDatetime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {event.endDatetime && (
                  <> - {new Date(event.endDatetime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</>
                )}
              </div>
              
              <div className="flex items-center text-lg text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                {event.venue}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Event Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Date & Time</span>
                  <p className="text-gray-900">
                    {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    <br />
                    {new Date(event.startDatetime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {event.endDatetime && (
                      <> - {new Date(event.endDatetime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</>
                    )}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Venue</span>
                  <p className="text-gray-900">{event.venue}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className={`font-medium ${isPastEvent ? 'text-gray-600' : 'text-green-600'}`}>
                    {isPastEvent ? 'Past Event' : 'Upcoming Event'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Albums */}
        {event.galleryAlbums && event.galleryAlbums.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Event Gallery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.galleryAlbums.map((album) => (
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
                      <span className="text-gray-400">No photos</span>
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
                    
                    <p className="text-sm text-gray-500 mt-2">
                      {album.photos?.length || 0} photos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}