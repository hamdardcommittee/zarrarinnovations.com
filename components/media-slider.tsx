"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: string
  type: "image" | "video"
  src: string
  thumbnail?: string
  title?: string
  description?: string
}

interface MediaSliderProps {
  items: MediaItem[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function MediaSlider({
  items,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
}: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = useCallback((index: number) => {
    // Pause any playing video
    if (isPlaying) {
      const video = videoRefs.current[isPlaying]
      if (video) {
        video.pause()
      }
      setIsPlaying(null)
    }

    if (index < 0) {
      setCurrentIndex(items.length - 1)
    } else if (index >= items.length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(index)
    }
  }, [items.length, isPlaying])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isPaused && !isPlaying) {
      autoPlayRef.current = setInterval(next, autoPlayInterval)
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, isPaused, isPlaying, next])

  // Handle video play/pause
  const toggleVideo = (itemId: string) => {
    const video = videoRefs.current[itemId]
    if (!video) return

    if (isPlaying === itemId) {
      video.pause()
      setIsPlaying(null)
    } else {
      // Pause any other playing video
      if (isPlaying) {
        const otherVideo = videoRefs.current[isPlaying]
        if (otherVideo) otherVideo.pause()
      }
      video.play()
      setIsPlaying(itemId)
    }
  }

  // Touch/swipe handling
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next()
      } else {
        prev()
      }
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div
      className={cn("relative w-full py-8", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="relative mx-auto flex h-[400px] max-w-[1200px] items-center justify-center overflow-hidden px-4 md:h-[500px] lg:h-[550px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards */}
        <div className="relative flex h-full w-full items-center justify-center">
          {items.map((item, index) => {
            const offset = index - currentIndex
            const isActive = index === currentIndex
            const isAdjacent = Math.abs(offset) === 1
            const isVisible = Math.abs(offset) <= 1

            if (!isVisible) return null

            // Calculate transforms for 3D effect
            const translateX = offset * 85 // % offset
            const scale = isActive ? 1 : 0.75
            const zIndex = isActive ? 30 : 20
            const opacity = isActive ? 1 : 0.6
            const blur = isActive ? 0 : 2

            return (
              <div
                key={item.id}
                className="absolute h-[320px] w-[220px] transition-all duration-500 ease-out md:h-[420px] md:w-[280px] lg:h-[480px] lg:w-[320px]"
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : "none",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-3xl bg-secondary shadow-2xl">
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.title || `Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        ref={(el) => { videoRefs.current[item.id] = el }}
                        src={item.src}
                        poster={item.thumbnail}
                        className="h-full w-full object-cover"
                        loop
                        muted
                        playsInline
                        onEnded={() => setIsPlaying(null)}
                      />
                      {/* Video play/pause overlay */}
                      {isActive && (
                        <button
                          onClick={() => toggleVideo(item.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                        >
                          <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
                            {isPlaying === item.id ? (
                              <Pause className="size-7 text-foreground" />
                            ) : (
                              <Play className="ml-1 size-7 text-foreground" />
                            )}
                          </div>
                        </button>
                      )}
                    </>
                  )}

                  {/* Title overlay */}
                  {item.title && isActive && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                      <h3 className="text-center text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-center text-sm text-white/80">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:scale-110 md:left-8 md:size-12"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5 text-foreground md:size-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:scale-110 md:right-8 md:size-12"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5 text-foreground md:size-6" />
      </button>

      {/* Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              "size-2.5 rounded-full transition-all",
              index === currentIndex
                ? "w-8 bg-foreground"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Default sample data for demo purposes
export const sampleMediaItems: MediaItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/sample-1.jpg",
    title: "Web Development",
    description: "Modern websites that convert",
  },
  {
    id: "2",
    type: "image",
    src: "https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/sample-2.jpg",
    title: "UI/UX Design",
    description: "Beautiful user experiences",
  },
  {
    id: "3",
    type: "image",
    src: "https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/sample-3.jpg",
    title: "Mobile Apps",
    description: "Cross-platform solutions",
  },
]
