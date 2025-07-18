import Link from "next/link"
import { Camera, Calendar, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getGalleryAlbums() {
  try {
    return await prisma.galleryAlbum.findMany({
      include: {
        event: {
          select: {
            title: true,
            startDatetime: true
          }
        },
        photos: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            photos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    return []
  }
}

export default async function GalleryPage() {
  const albums = await getGalleryAlbums()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Photo Gallery
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Browse through memories from our community events and celebrations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No photo albums yet</h3>
            <p className="mt-1 text-gray-500">
              Photo albums from events will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
              >
                <Link href={`/gallery/${album.id}`}>
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {album.coverImageUrl ? (
                      <img
                        src={album.coverImageUrl}
                        alt={album.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : album.photos[0] ? (
                      <img
                        src={album.photos[0].imageUrl}
                        alt={album.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Photo count overlay */}
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                      {album._count.photos} photos
                    </div>
                  </div>
                </Link>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link 
                      href={`/gallery/${album.id}`}
                      className="hover:text-orange-600 transition-colors"
                    >
                      {album.name}
                    </Link>
                  </h3>
                  
                  {album.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  {album.event && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(album.event.startDatetime).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  
                  <Link
                    href={`/gallery/${album.id}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
                  >
                    View Album
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}