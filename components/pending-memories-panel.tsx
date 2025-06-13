"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, ImageIcon, Mic, Video } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Memory } from "@/lib/types"
import { useAuth } from "./auth-provider"
import MediaPlayer from "./media-player"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PendingMemoriesPanelProps {
  vaultId: string
  pendingMemories: Memory[]
  onApprove: (memoryId: string) => void
  onReject: (memoryId: string, reason: string) => void
}

export default function PendingMemoriesPanel({
  vaultId,
  pendingMemories,
  onApprove,
  onReject,
}: PendingMemoriesPanelProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleApprove = (memory: Memory) => {
    onApprove(memory.id)
    toast({
      title: "Memory approved",
      description: `"${memory.title}" is now visible to all vault members.`,
    })
  }

  const openRejectDialog = (memory: Memory) => {
    setSelectedMemory(memory)
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  const handleReject = () => {
    if (!selectedMemory) return

    onReject(selectedMemory.id, rejectionReason)
    toast({
      title: "Memory rejected",
      description: `"${selectedMemory.title}" has been rejected.`,
    })
    setIsRejectDialogOpen(false)
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

  if (pendingMemories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>All memories have been reviewed. No pending approvals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Check className="h-12 w-12 mb-4 text-green-500" />
            <p>All caught up! No memories waiting for approval.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>
            {pendingMemories.length} {pendingMemories.length === 1 ? "memory" : "memories"} waiting for your review
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-auto">
          <div className="space-y-4">
            {pendingMemories.map((memory) => (
              <div key={memory.id} className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getMediaTypeIcon(memory.mediaType)}
                        <span className="capitalize">{memory.mediaType}</span>
                      </Badge>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">{memory.title}</h3>
                  {memory.description && <p className="text-sm text-muted-foreground mt-1">{memory.description}</p>}
                  <p className="text-sm mt-2">
                    Uploaded by <span className="font-medium">{memory.createdBy.name}</span>
                  </p>
                </div>

                <div className="border-t p-4">
                  <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <MediaPlayer
                      mediaUrl={memory.mediaUrl}
                      mediaType={memory.mediaType}
                      title={memory.title}
                      className="max-h-[300px]"
                    />
                  </div>
                </div>

                <div className="border-t p-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => openRejectDialog(memory)}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(memory)}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Memory</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this memory. This will be shared with the uploader.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Reject Memory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
