"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImageIcon, Mic, Video } from "lucide-react"

// Sample family images
const sampleFamilyImages = [
  {
    url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1470&auto=format&fit=crop",
    alt: "Family having picnic in the park",
    title: "Summer Picnic",
    description: "Annual family gathering at Central Park",
  },
  {
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1470&auto=format&fit=crop",
    alt: "Family on beach at sunset",
    title: "Beach Sunset",
    description: "Watching the sunset at Malibu Beach",
  },
  {
    url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1470&auto=format&fit=crop",
    alt: "Family playing in autumn leaves",
    title: "Autumn Fun",
    description: "Playing in the fallen leaves at Grandma's house",
  },
  {
    url: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1470&auto=format&fit=crop",
    alt: "Family cooking together in kitchen",
    title: "Baking Day",
    description: "Making Grandma's famous chocolate chip cookies",
  },
  {
    url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1471&auto=format&fit=crop",
    alt: "Grandparents with grandchildren",
    title: "Grandparents Day",
    description: "Visit to Grandpa and Grandma's farm",
  },
  {
    url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=1470&auto=format&fit=crop",
    alt: "Family hiking in mountains",
    title: "Mountain Hike",
    description: "Family hike in the Rocky Mountains",
  },
  {
    url: "https://images.unsplash.com/photo-1643818657367-491297f7c905?q=80&w=1470&auto=format&fit=crop",
    alt: "Family celebrating birthday",
    title: "Emma's Birthday",
    description: "Emma's 10th birthday celebration",
  },
  {
    url: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1470&auto=format&fit=crop",
    alt: "Family movie night",
    title: "Movie Night",
    description: "Friday family movie night tradition",
  },
  {
    url: "https://images.unsplash.com/photo-1506836467174-27f1042aa48c?q=80&w=1374&auto=format&fit=crop",
    alt: "Family camping trip",
    title: "Camping Adventure",
    description: "Summer camping trip at Lake Superior",
  },
  {
    url: "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=1470&auto=format&fit=crop",
    alt: "Family holiday gathering",
    title: "Holiday Dinner",
    description: "Annual holiday family reunion",
  },
  {
    url: "https://images.unsplash.com/photo-1484665754804-74b091211472?q=80&w=1470&auto=format&fit=crop",
    alt: "Family playing board games",
    title: "Game Night",
    description: "Weekly family game night",
  },
  {
    url: "https://images.unsplash.com/photo-1501927023255-9063be98970c?q=80&w=1470&auto=format&fit=crop",
    alt: "Family road trip",
    title: "Road Trip",
    description: "Cross-country family road trip",
  },
]

// Sample audio recordings
const sampleAudioRecordings = [
  {
    url: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
    title: "Grandpa's Stories",
    description: "Grandpa telling stories about his childhood",
  },
  {
    url: "https://cdn.freesound.org/previews/531/531947_11861866-lq.mp3",
    title: "Baby's First Words",
    description: "Recording of baby's first words",
  },
  {
    url: "https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3",
    title: "Family Sing-Along",
    description: "Family singing together at the reunion",
  },
  {
    url: "https://cdn.freesound.org/previews/612/612096_5674468-lq.mp3",
    title: "Holiday Message",
    description: "Holiday greetings from family members",
  },
  {
    url: "https://cdn.freesound.org/previews/612/612097_5674468-lq.mp3",
    title: "Family Recipe",
    description: "Grandma sharing her secret family recipe",
  },
  {
    url: "https://cdn.freesound.org/previews/531/531509_11861866-lq.mp3",
    title: "Bedtime Story",
    description: "Dad reading a bedtime story",
  },
]

// Sample video recordings
const sampleVideoRecordings = [
  {
    url: "https://download.samplelib.com/mp4/sample-5s.mp4",
    title: "First Steps",
    description: "Baby's first steps in the living room",
  },
  {
    url: "https://download.samplelib.com/mp4/sample-10s.mp4",
    title: "Birthday Party",
    description: "Jake's 5th birthday celebration",
  },
  {
    url: "https://download.samplelib.com/mp4/sample-15s.mp4",
    title: "Family Vacation",
    description: "Highlights from our trip to Hawaii",
  },
  {
    url: "https://download.samplelib.com/mp4/sample-20s.mp4",
    title: "Wedding Day",
    description: "Mom and Dad's wedding video from 1995",
  },
]

export function SampleContentGallery() {
  const [activeTab, setActiveTab] = useState("images")
  const [loadedImages, setLoadedImages] = useState<boolean[]>(Array(sampleFamilyImages.length).fill(false))

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
  }

  return (
    <div className="w-full space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="images" className="flex items-center gap-2 text-sm py-2">
            <ImageIcon className="h-4 w-4" />
            <span>Photos</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2 text-sm py-2">
            <Mic className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2 text-sm py-2">
            <Video className="h-4 w-4" />
            <span>Video</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sampleFamilyImages.map((image, index) => (
              <Card key={index} className="overflow-hidden aspect-[4/3] relative">
                {!loadedImages[index] && <Skeleton className="absolute inset-0 w-full h-full" />}
                <div className="relative h-full">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages[index] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(index)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white font-medium text-sm">{image.title}</h3>
                    <p className="text-white/80 text-xs truncate">{image.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleAudioRecordings.map((audio, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-1">{audio.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{audio.description}</p>
                  <audio controls className="w-full">
                    <source src={audio.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleVideoRecordings.map((video, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-1">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                  <video controls className="w-full aspect-video">
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Create your own family memories vault by uploading your photos, audio recordings, and videos
      </p>
    </div>
  )
}
