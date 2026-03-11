"use client"

import { useState, useEffect } from "react"
import { MediaSlider, type MediaItem } from "@/components/media-slider"
import { Loader2 } from "lucide-react"

// Default media items to show while loading or if no items exist
const defaultItems: MediaItem[] = [
  {
    id: "default-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=800&fit=crop",
    title: "Road to 7 Figure Agency",
    description: "Episode 4",
  },
  {
    id: "default-2",
    type: "image",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=800&fit=crop",
    title: "Team Collaboration",
    description: "Working together globally",
  },
  {
    id: "default-3",
    type: "image",
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=800&fit=crop",
    title: "Innovation Hub",
    description: "Building the future",
  },
  {
    id: "default-4",
    type: "image",
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop",
    title: "Client Success",
    description: "Wo bhi sirf 50,000 mein",
  },
  {
    id: "default-5",
    type: "image",
    src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=800&fit=crop",
    title: "Learning to Earn",
    description: "EP - 5",
  },
]

export function HomeMediaSlider() {
  const [items, setItems] = useState<MediaItem[]>(defaultItems)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("/api/media-slider")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setItems(
              data.map((item: {
                id: string
                type: "image" | "video"
                src: string
                thumbnail?: string
                title?: string
                description?: string
              }) => ({
                id: item.id,
                type: item.type,
                src: item.src,
                thumbnail: item.thumbnail,
                title: item.title,
                description: item.description,
              }))
            )
          }
        }
      } catch {
        // Use default items silently
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center md:h-[500px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <MediaSlider items={items} autoPlay autoPlayInterval={6000} />
}
