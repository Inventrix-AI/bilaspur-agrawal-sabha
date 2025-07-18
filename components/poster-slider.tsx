"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Poster {
  id: number
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  displayOrder: number
}

export default function PosterSlider() {
  const [posters, setPosters] = useState<Poster[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosters()
  }, [])

  const fetchPosters = async () => {
    try {
      const response = await fetch('/api/posters')
      if (response.ok) {
        const data = await response.json()
        setPosters(data.filter((poster: Poster) => poster.isActive))
      }
    } catch (error) {
      console.error('Error fetching posters:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (posters.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length)
      }, 5000) // Auto-slide every 5 seconds

      return () => clearInterval(timer)
    }
  }, [posters.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? posters.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length)
  }

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-orange-50 to-orange-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (posters.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Bilaspur Agrawal Sabha
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A unified digital platform serving the Agarwal community of Bilaspur. 
              Connecting hearts, celebrating our rich heritage, and building a stronger community together.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentPoster = posters[currentIndex]

  return (
    <div className="relative h-96 overflow-hidden bg-gray-900">
      {/* Poster Image */}
      <div className="relative h-full">
        <Image
          src={currentPoster.imageUrl}
          alt={currentPoster.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {currentPoster.title}
            </h1>
            {currentPoster.description && (
              <p className="text-lg md:text-xl mb-6 opacity-90">
                {currentPoster.description}
              </p>
            )}
            {currentPoster.linkUrl && (
              <Link
                href={currentPoster.linkUrl}
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {posters.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            aria-label="Previous poster"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            aria-label="Next poster"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {posters.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to poster ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}