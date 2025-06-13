"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"
import TypingIndicator from "./typing-indicator"

type Comment = {
  id: string
  memoryId: string
  userId: string
  userName: string
  text: string
  createdAt: Date
}

export default function MemoryComments({ memoryId, vaultId }: { memoryId: string; vaultId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const { user } = useAuth()

  const handleAddComment = () => {
    if (!user || !newComment.trim()) return

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      memoryId,
      userId: user.id,
      userName: user.name,
      text: newComment,
      createdAt: new Date(),
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")

    // In a real app, you would emit a socket event here
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Comments</h3>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">{comment.createdAt.toLocaleTimeString()}</p>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <TypingIndicator vaultId={vaultId} />

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
        Post Comment
      </Button>
    </div>
  )
}
