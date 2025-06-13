import { io, type Socket } from "socket.io-client"
import type { Memory, Vault } from "./types"

// Socket.io client instance
let socket: Socket | null = null

// Initialize socket connection
export const initializeSocket = (userId: string) => {
  if (socket) return socket

  // In a production app, this would be your actual WebSocket server URL
  socket = io("https://your-websocket-server.com", {
    auth: {
      userId,
    },
    autoConnect: true,
  })

  socket.on("connect", () => {
    console.log("Socket connected")
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  return socket
}

// Get the socket instance
export const getSocket = () => socket

// Join a specific vault room to receive updates for that vault
export const joinVault = (vaultId: string) => {
  if (!socket) return
  socket.emit("join-vault", { vaultId })
}

// Leave a vault room
export const leaveVault = (vaultId: string) => {
  if (!socket) return
  socket.emit("leave-vault", { vaultId })
}

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Mock implementation for demo purposes
// In a real app, these would communicate with a real WebSocket server
export const mockSocketEvents = () => {
  // Mock memory upload event
  const emitMemoryUploaded = (memory: Memory) => {
    const event = new CustomEvent("memory-uploaded", { detail: memory })
    window.dispatchEvent(event)
  }

  // Mock memory deleted event
  const emitMemoryDeleted = (memoryId: string, vaultId: string) => {
    const event = new CustomEvent("memory-deleted", { detail: { memoryId, vaultId } })
    window.dispatchEvent(event)
  }

  // Mock vault updated event
  const emitVaultUpdated = (vault: Vault) => {
    const event = new CustomEvent("vault-updated", { detail: vault })
    window.dispatchEvent(event)
  }

  // Mock user joined event
  const emitUserJoined = (vaultId: string, user: { id: string; name: string }) => {
    const event = new CustomEvent("user-joined", { detail: { vaultId, user } })
    window.dispatchEvent(event)
  }

  // Mock user left event
  const emitUserLeft = (vaultId: string, userId: string) => {
    const event = new CustomEvent("user-left", { detail: { vaultId, userId } })
    window.dispatchEvent(event)
  }

  return {
    emitMemoryUploaded,
    emitMemoryDeleted,
    emitVaultUpdated,
    emitUserJoined,
    emitUserLeft,
  }
}
