"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-provider"
import { mockSocketEvents } from "@/lib/socket"
import { useToast } from "@/components/ui/use-toast"
import type { Memory, Vault } from "@/lib/types"

type OnlineUser = {
  id: string
  name: string
  lastActive: Date
}

type RealtimeContextType = {
  onlineUsers: Record<string, OnlineUser[]> // vaultId -> online users
  isConnected: boolean
  activeVaultId: string | null
  setActiveVaultId: (vaultId: string | null) => void
  notifyMemoryUploaded: (memory: Memory) => void
  notifyMemoryDeleted: (memoryId: string, vaultId: string) => void
  notifyVaultUpdated: (vault: Vault) => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlineUser[]>>({})

  // For demo purposes, we'll use the mock socket events
  const mockSocket = mockSocketEvents()

  useEffect(() => {
    if (!user) return

    // In a real app, this would initialize a real socket connection
    // For demo purposes, we're just setting isConnected to true
    setIsConnected(true)

    // Set up event listeners for real-time updates
    const handleMemoryUploaded = (event: CustomEvent<Memory>) => {
      const memory = event.detail

      // Only show notification if we're in the relevant vault
      if (activeVaultId === memory.vaultId) {
        toast({
          title: "New memory added",
          description: `${memory.createdBy.name} added "${memory.title}"`,
        })
      }
    }

    const handleMemoryDeleted = (event: CustomEvent<{ memoryId: string; vaultId: string }>) => {
      const { vaultId } = event.detail

      // Only show notification if we're in the relevant vault
      if (activeVaultId === vaultId) {
        toast({
          title: "Memory deleted",
          description: "A memory was removed from this vault",
        })
      }
    }

    const handleVaultUpdated = (event: CustomEvent<Vault>) => {
      const vault = event.detail

      toast({
        title: "Vault updated",
        description: `"${vault.name}" has been updated`,
      })
    }

    const handleUserJoined = (event: CustomEvent<{ vaultId: string; user: { id: string; name: string } }>) => {
      const { vaultId, user: joinedUser } = event.detail

      setOnlineUsers((prev) => {
        const vaultUsers = [...(prev[vaultId] || [])]

        // Add user if not already in the list
        if (!vaultUsers.some((u) => u.id === joinedUser.id)) {
          vaultUsers.push({
            ...joinedUser,
            lastActive: new Date(),
          })
        }

        return {
          ...prev,
          [vaultId]: vaultUsers,
        }
      })

      // Only show notification if we're in the relevant vault
      if (activeVaultId === vaultId) {
        toast({
          title: "User joined",
          description: `${joinedUser.name} is now viewing this vault`,
        })
      }
    }

    const handleUserLeft = (event: CustomEvent<{ vaultId: string; userId: string }>) => {
      const { vaultId, userId } = event.detail

      setOnlineUsers((prev) => {
        const vaultUsers = [...(prev[vaultId] || [])]
        const updatedUsers = vaultUsers.filter((u) => u.id !== userId)

        return {
          ...prev,
          [vaultId]: updatedUsers,
        }
      })
    }

    // Add event listeners
    window.addEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
    window.addEventListener("memory-deleted", handleMemoryDeleted as EventListener)
    window.addEventListener("vault-updated", handleVaultUpdated as EventListener)
    window.addEventListener("user-joined", handleUserJoined as EventListener)
    window.addEventListener("user-left", handleUserLeft as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
      window.removeEventListener("memory-deleted", handleMemoryDeleted as EventListener)
      window.removeEventListener("vault-updated", handleVaultUpdated as EventListener)
      window.removeEventListener("user-joined", handleUserJoined as EventListener)
      window.removeEventListener("user-left", handleUserLeft as EventListener)
      setIsConnected(false)
    }
  }, [user, activeVaultId, toast])

  // When active vault changes, simulate joining that vault
  useEffect(() => {
    if (!activeVaultId || !user) return

    // Simulate user joining the vault
    if (user) {
      mockSocket.emitUserJoined(activeVaultId, { id: user.id, name: user.name })
    }

    // Simulate cleanup when leaving the vault
    return () => {
      if (user) {
        mockSocket.emitUserLeft(activeVaultId, user.id)
      }
    }
  }, [activeVaultId, user])

  // Functions to notify other users about actions
  const notifyMemoryUploaded = (memory: Memory) => {
    mockSocket.emitMemoryUploaded(memory)
  }

  const notifyMemoryDeleted = (memoryId: string, vaultId: string) => {
    mockSocket.emitMemoryDeleted(memoryId, vaultId)
  }

  const notifyVaultUpdated = (vault: Vault) => {
    mockSocket.emitVaultUpdated(vault)
  }

  return (
    <RealtimeContext.Provider
      value={{
        onlineUsers,
        isConnected,
        activeVaultId,
        setActiveVaultId,
        notifyMemoryUploaded,
        notifyMemoryDeleted,
        notifyVaultUpdated,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
