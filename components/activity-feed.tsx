"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"

type ActivityEvent = {
  id: string
  type: "memory_uploaded" | "memory_deleted" | "user_joined" | "user_left" | "vault_updated"
  vaultId: string
  userId: string
  userName: string
  details: string
  timestamp: Date
}

export default function ActivityFeed({ vaultId }: { vaultId: string }) {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Set up event listeners for real-time activity updates
    const handleMemoryUploaded = (event: CustomEvent<any>) => {
      const memory = event.detail

      // Only update if it's for this vault
      if (memory.vaultId === vaultId) {
        const newActivity: ActivityEvent = {
          id: `activity_${Date.now()}`,
          type: "memory_uploaded",
          vaultId,
          userId: memory.createdBy.id,
          userName: memory.createdBy.name,
          details: `uploaded "${memory.title}"`,
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev])
      }
    }

    const handleMemoryDeleted = (event: CustomEvent<any>) => {
      const { vaultId: eventVaultId } = event.detail

      // Only update if it's for this vault
      if (eventVaultId === vaultId && user) {
        const newActivity: ActivityEvent = {
          id: `activity_${Date.now()}`,
          type: "memory_deleted",
          vaultId,
          userId: user.id,
          userName: user.name,
          details: "deleted a memory",
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev])
      }
    }

    const handleUserJoined = (event: CustomEvent<any>) => {
      const { vaultId: eventVaultId, user: joinedUser } = event.detail

      // Only update if it's for this vault
      if (eventVaultId === vaultId) {
        const newActivity: ActivityEvent = {
          id: `activity_${Date.now()}`,
          type: "user_joined",
          vaultId,
          userId: joinedUser.id,
          userName: joinedUser.name,
          details: "joined the vault",
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev])
      }
    }

    const handleUserLeft = (event: CustomEvent<any>) => {
      const { vaultId: eventVaultId, userId } = event.detail

      // Only update if it's for this vault
      if (eventVaultId === vaultId) {
        // Find user name from previous activities
        const userName = activities.find((a) => a.userId === userId)?.userName || "A user"

        const newActivity: ActivityEvent = {
          id: `activity_${Date.now()}`,
          type: "user_left",
          vaultId,
          userId,
          userName,
          details: "left the vault",
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev])
      }
    }

    const handleVaultUpdated = (event: CustomEvent<any>) => {
      const vault = event.detail

      // Only update if it's this vault
      if (vault.id === vaultId) {
        // Find the admin who likely updated the vault
        const admin = vault.members.find((m: any) => m.role === "admin")

        const newActivity: ActivityEvent = {
          id: `activity_${Date.now()}`,
          type: "vault_updated",
          vaultId,
          userId: admin?.userId || "unknown",
          userName: admin?.name || "An admin",
          details: "updated the vault settings",
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev])
      }
    }

    // Add event listeners
    window.addEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
    window.addEventListener("memory-deleted", handleMemoryDeleted as EventListener)
    window.addEventListener("user-joined", handleUserJoined as EventListener)
    window.addEventListener("user-left", handleUserLeft as EventListener)
    window.addEventListener("vault-updated", handleVaultUpdated as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
      window.removeEventListener("memory-deleted", handleMemoryDeleted as EventListener)
      window.removeEventListener("user-joined", handleUserJoined as EventListener)
      window.removeEventListener("user-left", handleUserLeft as EventListener)
      window.removeEventListener("vault-updated", handleVaultUpdated as EventListener)
    }
  }, [vaultId, activities, user])

  if (activities.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] overflow-auto">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{activity.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span> {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
