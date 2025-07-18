import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Camera } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getGalleryAlbum(id: string) {
  try {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDatetime: true
          }
        },
        photos: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    return album
  } catch (error) {
    console.error('Error fetching gallery album:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GalleryAlbumPage({ params }: PageProps) {
  const { id } = await params
  const album = await getGalleryAlbum(id)

  if (!album) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-6">
            <Link
              href="/gallery"
              className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {album.name}
            </h1>
            
            {album.description && (
              <p className="mt-6 text-xl leading-8 text-gray-600">
                {album.description}
              </p>
            )}
            
            <div className="mt-6 flex items-center space-x-6 text-gray-600">
              {album.event && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(album.event.startDatetime).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              
              <div className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                {album.photos.length} photos
              </div>
            </div>
            
            {album.event && (
              <div className="mt-4">
                <Link
                  href={`/events/${album.event.id}`}
                  className="text-orange-600 hover:text-orange-500 font-medium"
                >
                  View Event Details →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {album.photos.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No photos in this album</h3>
            <p className="mt-1 text-gray-500">
              Photos will appear here once they are uploaded.
            </p>
          </div>
        ) : (
          <>
            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={index < 8 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Photo Captions (if any) */}
            {album.photos.some(photo => photo.caption) && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Captions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {album.photos
                    .filter(photo => photo.caption)
                    .map((photo, index) => (
                      <div key={photo.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption || ''}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{photo.caption}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}