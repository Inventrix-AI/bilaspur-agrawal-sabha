import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"

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

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {event.imageUrl && (
              <div className="mb-8">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-96 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
            
            <div className="prose prose-lg prose-orange max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="text-gray-600 whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Photo Gallery */}
            {event.galleryAlbums.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Gallery</h2>
                {event.galleryAlbums.map((album) => (
                  <div key={album.id} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{album.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {album.photos.map((photo) => (
                        <div key={photo.id} className="aspect-square">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption || ''}
                            className="w-full h-full object-cover rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                    {album.photos.length === 6 && (
                      <div className="mt-4">
                        <Link
                          href={`/gallery/${album.id}`}
                          className="text-orange-600 hover:text-orange-500 font-medium"
                        >
                          View all photos →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
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
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Venue</dt>
                  <dd className="mt-1 text-sm text-gray-900">{event.venue}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPastEvent 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isPastEvent ? 'Completed' : 'Upcoming'}
                    </span>
                  </dd>
                </div>
              </div>

              {!isPastEvent && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Mark your calendar and join us for this special event!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}