"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Committee {
  id: number
  name: string
  description?: string
  sessionYear: string
  posterImageUrl?: string
  isActive: boolean
  displayOrder: number
}

interface CommitteeCarouselProps {
  committees: Committee[]
  height?: string
  autoPlayInterval?: number
}

export default function CommitteeCarousel({ 
  committees, 
  height = "h-96 md:h-[600px]", 
  autoPlayInterval = 5000 
}: CommitteeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const activeCommittees = committees.filter(committee => 
    committee.isActive && committee.posterImageUrl
  ).sort((a, b) => a.displayOrder - b.displayOrder)

  useEffect(() => {
    if (!isAutoPlaying || activeCommittees.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === activeCommittees.length - 1 ? 0 : prevIndex + 1
      )
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, activeCommittees.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? activeCommittees.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === activeCommittees.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (activeCommittees.length === 0) {
    return (
      <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500 text-lg">No committee images available</p>
      </div>
    )
  }

  return (
    <div 
      className={`relative ${height} overflow-hidden rounded-lg shadow-lg bg-gray-900`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main carousel */}
      <div className="relative h-full">
        {activeCommittees.map((committee, index) => (
          <div
            key={committee.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {committee.posterImageUrl && (
              <img
                src={committee.posterImageUrl}
                alt={committee.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            
            {/* Overlay with committee info */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="w-full p-8 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2">
                  {committee.name}
                </h3>
                <p className="text-lg md:text-xl mb-1">
                  Session: {committee.sessionYear}
                </p>
                {committee.description && (
                  <p className="text-sm md:text-base opacity-90 max-w-2xl">
                    {committee.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {activeCommittees.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Previous committee"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Next committee"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {activeCommittees.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeCommittees.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}