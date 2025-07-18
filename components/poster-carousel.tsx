"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Poster {
  id: number
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  displayOrder: number
  isActive: boolean
}

interface PosterCarouselProps {
  posters: Poster[]
  autoPlayInterval?: number
  showIndicators?: boolean
  showNavigation?: boolean
  height?: string
}

export default function PosterCarousel({ 
  posters, 
  autoPlayInterval = 5000,
  showIndicators = true,
  showNavigation = true,
  height = "h-96 md:h-[500px]"
}: PosterCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activePosters = posters.filter(poster => poster.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  useEffect(() => {
    if (!isPaused && activePosters.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activePosters.length)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [isPaused, activePosters.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? activePosters.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePosters.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (activePosters.length === 0) {
    return (
      <div className={`${height} bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Bilaspur Agrawal Sabha</h2>
          <p className="text-gray-600">Connecting Hearts, Celebrating Heritage</p>
        </div>
      </div>
    )
  }

  const currentPoster = activePosters[currentIndex]

  return (
    <div 
      className={`relative ${height} overflow-hidden rounded-lg shadow-lg`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={currentPoster.imageUrl}
          alt={currentPoster.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {currentPoster.title}
            </h2>
            {currentPoster.description && (
              <p className="text-sm md:text-lg mb-4 drop-shadow-md opacity-90">
                {currentPoster.description}
              </p>
            )}
            {currentPoster.linkUrl && (
              <Link
                href={currentPoster.linkUrl}
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
              >
                Learn More
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && activePosters.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            aria-label="Previous poster"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            aria-label="Next poster"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && activePosters.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activePosters.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Pause indicator */}
      {isPaused && activePosters.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          Paused
        </div>
      )}
    </div>
  )
}