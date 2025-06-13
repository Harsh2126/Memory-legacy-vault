"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import type { Memory } from "@/lib/types"
import MemoryComments from "./memory-comments"
import MediaPlayer from "./media-player"

interface MemoryViewerProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  memories: Memory[]
}

export default function MemoryViewer({ isOpen, onClose, memory, memories }: MemoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!memory) return 0
    return memories.findIndex((m) => m.id === memory.id)
  })

  // Update index when memory changes
  useState(() => {
    if (!memory) return
    const index = memories.findIndex((m) => m.id === memory.id)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  })

  const currentMemory = memories[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : memories.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < memories.length - 1 ? prev + 1 : 0))
  }

  if (!currentMemory) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw] p-0 bg-background/95 backdrop-blur-sm max-h-[90vh] overflow-auto">
        <div className="relative flex flex-col h-full">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-background/50 hover:bg-background/80"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
            <div className="relative flex items-center justify-center overflow-auto">
              <MediaPlayer
                mediaUrl={currentMemory.mediaUrl}
                mediaType={currentMemory.mediaType}
                title={currentMemory.title}
              />

              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  disabled={memories.length <= 1}
                  className="rounded-full bg-background/50 hover:bg-background/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
              </div>

              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  disabled={memories.length <= 1}
                  className="rounded-full bg-background/50 hover:bg-background/80"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col h-full overflow-auto">
              <div className="mb-4 overflow-hidden">
                <h2 className="text-xl font-semibold">{currentMemory.title}</h2>
                {currentMemory.description && <p className="mt-1 text-muted-foreground">{currentMemory.description}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    By {currentMemory.createdBy.name} • {new Date(currentMemory.createdAt).toLocaleDateString()}
                  </p>
                  <span className="text-sm">
                    {currentIndex + 1} / {memories.length}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 flex-1 overflow-hidden">
                <MemoryComments memoryId={currentMemory.id} vaultId={currentMemory.vaultId} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
