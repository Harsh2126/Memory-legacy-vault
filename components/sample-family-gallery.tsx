"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Sample family images from various free stock photo sites
const sampleFamilyImages = [
  {
    url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1470&auto=format&fit=crop",
    alt: "Family having picnic in the park",
  },
  {
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1470&auto=format&fit=crop",
    alt: "Family on beach at sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1470&auto=format&fit=crop",
    alt: "Family playing in autumn leaves",
  },
  {
    url: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1470&auto=format&fit=crop",
    alt: "Family cooking together in kitchen",
  },
  {
    url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1471&auto=format&fit=crop",
    alt: "Grandparents with grandchildren",
  },
  {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=1470&auto=format&fit=crop",
    alt: "Family hiking in mountains",
  },
  {
    url: "https://images.unsplash.com/photo-1643818657367-491297f7c905?q=80&w=1470&auto=format&fit=crop",
    alt: "Family celebrating birthday",
  },
  {
    url: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1470&auto=format&fit=crop",
    alt: "Family movie night",
  },
  {
    url: "https://images.unsplash.com/photo-1506836467174-27f1042aa48c?q=80&w=1374&auto=format&fit=crop",
    alt: "Family camping trip",
  },
]

export function SampleFamilyGallery() {
  const [loaded, setLoaded] = useState<boolean[]>(Array(sampleFamilyImages.length).fill(false))

  const handleImageLoad = (index: number) => {
    setLoaded((prev) => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sampleFamilyImages.map((image, index) => (
          <Card key={index} className="overflow-hidden aspect-[4/3] relative">
            {!loaded[index] && <Skeleton className="absolute inset-0 w-full h-full" />}
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loaded[index] ? "opacity-100" : "opacity-0"}`}
              onLoad={() => handleImageLoad(index)}
            />
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Create your own family memories vault by uploading your photos
      </p>
    </div>
  )
}
