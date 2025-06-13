"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ImageIcon, Mic, Video, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Memory } from "@/lib/types"
import { useAuth } from "./auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RejectedMemoriesPanelProps {
  vaultId: string
  rejectedMemories: Memory[]
  onDelete: (memoryId: string) => void
  onResubmit: (memoryId: string) => void
}

export default function RejectedMemoriesPanel({
  vaultId,
  rejectedMemories,
  onDelete,
  onResubmit,
}: RejectedMemoriesPanelProps) {
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleDelete = () => {
    if (!selectedMemoryId) return

    onDelete(selectedMemoryId)
    toast({
      title: "Memory deleted",
      description: "The rejected memory has been permanently deleted.",
    })
    setIsDeleteDialogOpen(false)
  }

  const handleResubmit = (memoryId: string) => {
    onResubmit(memoryId)
    toast({
      title: "Memory resubmitted",
      description: "Your memory has been resubmitted for approval.",
    })
  }

  const openDeleteDialog = (memoryId: string) => {
    setSelectedMemoryId(memoryId)
    setIsDeleteDialogOpen(true)
  }

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  if (rejectedMemories.length === 0) {
    return null
  }

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Rejected Memories
          </CardTitle>
          <CardDescription>
            {rejectedMemories.length} {rejectedMemories.length === 1 ? "memory has" : "memories have"} been rejected
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-auto">
          <div className="space-y-4">
            {rejectedMemories.map((memory) => (
              <div key={memory.id} className="border border-red-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getMediaTypeIcon(memory.mediaType)}
                      <span className="capitalize">{memory.mediaType}</span>
                    </Badge>
                    <Badge variant="destructive">Rejected</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(memory.createdAt).toLocaleDateString()}</div>
                </div>
                <h3 className="text-lg font-medium">{memory.title}</h3>
                {memory.description && <p className="text-sm text-muted-foreground mt-1">{memory.description}</p>}

                {memory.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-800">Reason for rejection:</p>
                    <p className="text-sm text-red-700 mt-1">{memory.rejectionReason}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDeleteDialog(memory.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button size="sm" onClick={() => handleResubmit(memory.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resubmit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rejected Memory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this memory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
