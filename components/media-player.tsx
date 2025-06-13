"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { MediaType } from "@/lib/types"

interface MediaPlayerProps {
  mediaUrl: string
  mediaType: MediaType
  title: string
  autoPlay?: boolean
  onEnded?: () => void
  className?: string
}

export default function MediaPlayer({
  mediaUrl,
  mediaType,
  title,
  autoPlay = false,
  onEnded,
  className = "",
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null)

  useEffect(() => {
    if (mediaRef.current) {
      if (autoPlay) {
        try {
          const playPromise = mediaRef.current.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                console.error("Autoplay prevented:", error)
                setIsPlaying(false)
              })
          }
        } catch (error) {
          console.error("Error during autoplay:", error)
          setIsPlaying(false)
        }
      }
    }
  }, [autoPlay, mediaUrl])

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause()
      } else {
        mediaRef.current.play().catch((error) => {
          console.error("Error playing media:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (onEnded) {
      onEnded()
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const skipBackward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(0, mediaRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.min(duration, mediaRef.current.currentTime + 10)
    }
  }

  if (mediaType === "image") {
    return (
      <div className={`relative ${className}`}>
        <img src={mediaUrl || "/placeholder.svg"} alt={title} className="max-w-full max-h-[70vh] object-contain" />
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {mediaType === "video" && (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className="max-w-full max-h-[60vh] object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          muted={isMuted}
          playsInline
        />
      )}

      {mediaType === "audio" && (
        <div className="flex items-center justify-center py-8 bg-muted/30 rounded-lg">
          <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center">
            <Volume2 className="h-12 w-12 text-rose-500" />
          </div>
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={mediaUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            muted={isMuted}
            className="hidden"
          />
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-12">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={skipBackward}>
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Skip backward</span>
            </Button>
            <Button variant="default" size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Skip forward</span>
            </Button>
          </div>

          <div className="relative flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} onMouseEnter={() => setShowVolumeSlider(true)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            {showVolumeSlider && (
              <div
                className="absolute bottom-full mb-2 p-2 bg-background border rounded-md shadow-md"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  orientation="vertical"
                  className="h-24"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
