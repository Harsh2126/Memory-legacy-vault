"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"

export default function TypingIndicator({ vaultId }: { vaultId: string }) {
  const [typingUsers, setTypingUsers] = useState<{ id: string; name: string }[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, this would listen for typing events from other users
    // For demo purposes, we'll simulate typing events

    const simulateTyping = () => {
      // Simulate random users typing
      const mockUsers = [
        { id: "user_123", name: "Emma Johnson" },
        { id: "user_456", name: "Michael Smith" },
        { id: "user_789", name: "Sophia Williams" },
      ]

      // Filter out the current user
      const otherUsers = mockUsers.filter((u) => u.id !== user?.id)

      // Randomly decide if someone is typing
      const randomIndex = Math.floor(Math.random() * (otherUsers.length + 1))

      if (randomIndex < otherUsers.length) {
        // Someone is typing
        setTypingUsers([otherUsers[randomIndex]])

        // Stop typing after a random time
        setTimeout(
          () => {
            setTypingUsers([])
          },
          Math.random() * 3000 + 1000,
        )
      }
    }

    // Simulate typing events occasionally
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateTyping()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user])

  if (typingUsers.length === 0) {
    return null
  }

  return (
    <div className="text-sm text-muted-foreground italic">
      {typingUsers.map((u) => u.name).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
      <span className="animate-pulse">...</span>
    </div>
  )
}
