"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CoverPhotoUploaderProps {
  currentImage: string
  onChange: (imageUrl: string) => void
  aspectRatio?: string
  className?: string
}

export default function CoverPhotoUploader({
  currentImage,
  onChange,
  aspectRatio = "3/1",
  className = "",
}: CoverPhotoUploaderProps) {
  const [image, setImage] = useState(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage = event.target.result as string
          setImage(newImage)
          onChange(newImage)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    const defaultImage = "/placeholder.svg?height=400&width=600"
    setImage(defaultImage)
    onChange(defaultImage)
    toast({
      title: "Cover image removed",
      description: "The default cover image has been restored.",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`relative aspect-[${aspectRatio}] overflow-hidden bg-muted`}>
        <img
          src={image || "/placeholder.svg?height=400&width=600"}
          alt="Cover photo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={triggerFileInput}
              className="flex items-center gap-1"
            >
              <Camera className="h-4 w-4" />
              Change Cover
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">Recommended size: 1200×400 pixels. Max file size: 5MB.</p>
        <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </CardContent>
    </Card>
  )
}
