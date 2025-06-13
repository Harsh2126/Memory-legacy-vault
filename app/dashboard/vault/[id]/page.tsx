"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, Grid, Calendar, ImageIcon, Mic, Video, AlertCircle } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { mockVaults, mockMemories } from "@/lib/data"
import type { Vault, Memory, ApprovalStatus } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useRealtime } from "@/components/realtime-provider"
import OnlineUsers from "@/components/online-users"
import MemoryViewer from "@/components/memory-viewer"
import ActivityFeed from "@/components/activity-feed"
import UploadMemoryDialog from "@/components/upload-memory-dialog"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import PendingMemoriesPanel from "@/components/pending-memories-panel"
import RejectedMemoriesPanel from "@/components/rejected-memories-panel"
import VaultSettings from "@/components/vault-settings"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VaultPage() {
  const { id } = useParams()
  const vaultId = Array.isArray(id) ? id[0] : id
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { setActiveVaultId, notifyMemoryUploaded, notifyMemoryDeleted, notifyVaultUpdated } = useRealtime()

  const [vault, setVault] = useState<Vault | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid")
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "image" | "audio" | "video">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("approved")

  // Check if user is an admin
  const isAdmin = vault?.members.some((m) => m.userId === user?.id && m.role === "admin") || false

  // Set active vault for real-time updates
  useEffect(() => {
    if (vaultId) {
      setActiveVaultId(vaultId)
    }

    return () => {
      setActiveVaultId(null)
    }
  }, [vaultId, setActiveVaultId])

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Fetch vault and memories (using mock data and localStorage)
    if (user && vaultId) {
      // Check mock vaults first
      let foundVault = mockVaults.find((v) => v.id === vaultId)
      let foundMemories = mockMemories[vaultId] || []

      // If not found in mock data, check localStorage
      if (!foundVault) {
        const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")
        foundVault = userVaults.find((v: Vault) => v.id === vaultId)

        // Check for memories in localStorage
        const userMemories = JSON.parse(localStorage.getItem(`memories_${vaultId}`) || "[]")
        foundMemories = userMemories
      }

      // Ensure vault has settings
      if (foundVault && !foundVault.settings) {
        foundVault.settings = { requireApproval: false }
      }

      // Ensure memories have approval status
      foundMemories = foundMemories.map((memory: Memory) => {
        if (!memory.approvalStatus) {
          return { ...memory, approvalStatus: "approved" }
        }
        return memory
      })

      if (foundVault) {
        setVault(foundVault)
        setMemories(foundMemories)
      } else {
        // Vault not found
        router.push("/dashboard")
      }
    }

    // Set up event listeners for real-time memory updates
    const handleMemoryUploaded = (event: CustomEvent<Memory>) => {
      const memory = event.detail

      // Only update if it's for this vault
      if (memory.vaultId === vaultId) {
        setMemories((prev) => [memory, ...prev])
      }
    }

    const handleMemoryDeleted = (event: CustomEvent<{ memoryId: string; vaultId: string }>) => {
      const { memoryId, vaultId: eventVaultId } = event.detail

      // Only update if it's for this vault
      if (eventVaultId === vaultId) {
        setMemories((prev) => prev.filter((memory) => memory.id !== memoryId))
      }
    }

    const handleVaultUpdated = (event: CustomEvent<Vault>) => {
      const updatedVault = event.detail

      // Only update if it's this vault
      if (updatedVault.id === vaultId) {
        setVault(updatedVault)
      }
    }

    // Add event listeners
    window.addEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
    window.addEventListener("memory-deleted", handleMemoryDeleted as EventListener)
    window.addEventListener("vault-updated", handleVaultUpdated as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("memory-uploaded", handleMemoryUploaded as EventListener)
      window.removeEventListener("memory-deleted", handleMemoryDeleted as EventListener)
      window.removeEventListener("vault-updated", handleVaultUpdated as EventListener)
    }
  }, [user, isLoading, vaultId, router])

  const handleUpload = (newMemory: Memory) => {
    // Add the new memory to the list
    const updatedMemories = [newMemory, ...memories]
    setMemories(updatedMemories)

    // Save to localStorage
    localStorage.setItem(`memories_${vaultId}`, JSON.stringify(updatedMemories))

    // Notify other users about the new memory
    notifyMemoryUploaded(newMemory)
  }

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      // Remove the memory from the list
      const updatedMemories = memories.filter((memory) => memory.id !== memoryId)
      setMemories(updatedMemories)

      // Save to localStorage
      localStorage.setItem(`memories_${vaultId}`, JSON.stringify(updatedMemories))

      // Notify other users about the deleted memory
      notifyMemoryDeleted(memoryId, vaultId)

      toast({
        title: "Memory deleted",
        description: "The memory has been removed from the vault.",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the memory. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApproveMemory = (memoryId: string) => {
    if (!user) return

    const updatedMemories = memories.map((memory) => {
      if (memory.id === memoryId) {
        return {
          ...memory,
          approvalStatus: "approved" as ApprovalStatus,
          approvedBy: {
            id: user.id,
            name: user.name,
            date: new Date().toISOString(),
          },
        }
      }
      return memory
    })

    setMemories(updatedMemories)
    localStorage.setItem(`memories_${vaultId}`, JSON.stringify(updatedMemories))
    notifyMemoryUploaded(updatedMemories.find((m) => m.id === memoryId)!)
  }

  const handleRejectMemory = (memoryId: string, reason: string) => {
    const updatedMemories = memories.map((memory) => {
      if (memory.id === memoryId) {
        return {
          ...memory,
          approvalStatus: "rejected" as ApprovalStatus,
          rejectionReason: reason,
        }
      }
      return memory
    })

    setMemories(updatedMemories)
    localStorage.setItem(`memories_${vaultId}`, JSON.stringify(updatedMemories))
  }

  const handleResubmitMemory = (memoryId: string) => {
    const updatedMemories = memories.map((memory) => {
      if (memory.id === memoryId) {
        return {
          ...memory,
          approvalStatus: "pending" as ApprovalStatus,
          rejectionReason: undefined,
        }
      }
      return memory
    })

    setMemories(updatedMemories)
    localStorage.setItem(`memories_${vaultId}`, JSON.stringify(updatedMemories))
  }

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory)
    setViewerOpen(true)
  }

  const handleUpdateVault = (updatedVault: Vault) => {
    setVault(updatedVault)

    // Update in localStorage if it's a user-created vault
    const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")
    const updatedVaults = userVaults.map((v: Vault) => (v.id === vault?.id ? updatedVault : v))
    localStorage.setItem("userVaults", JSON.stringify(updatedVaults))

    // Notify other users
    notifyVaultUpdated(updatedVault)
  }

  // Filter memories based on type and status
  const filteredMemories = memories.filter((memory) => {
    const typeMatch = filterType === "all" || memory.mediaType === filterType
    const statusMatch = filterStatus === "all" || memory.approvalStatus === filterStatus

    // For non-admins, only show approved memories
    if (!isAdmin && memory.approvalStatus !== "approved") {
      return false
    }

    return typeMatch && statusMatch
  })

  // Get pending memories (for admin)
  const pendingMemories = isAdmin ? memories.filter((memory) => memory.approvalStatus === "pending") : []

  // Get rejected memories (for the current user)
  const rejectedMemories = memories.filter(
    (memory) => memory.approvalStatus === "rejected" && memory.createdBy.id === user?.id,
  )

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

  if (isLoading || !vault) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container py-12">
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="relative h-48 md:h-64 bg-muted overflow-hidden">
          <img src={vault.coverImage || "/placeholder.svg"} alt={vault.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{vault.name}</h1>
              <OnlineUsers vaultId={vaultId} />
            </div>
            <p className="text-muted-foreground">{vault.description}</p>
          </div>
        </div>

        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Tabs defaultValue="memories" className="w-full">
              <TabsList>
                <TabsTrigger value="memories">Memories</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="memories" className="mt-6 overflow-auto">
                {/* Admin Approval Panel */}
                {isAdmin && pendingMemories.length > 0 && (
                  <div className="mb-8">
                    <PendingMemoriesPanel
                      vaultId={vaultId}
                      pendingMemories={pendingMemories}
                      onApprove={handleApproveMemory}
                      onReject={handleRejectMemory}
                    />
                  </div>
                )}

                {/* Rejected Memories Panel (for the current user) */}
                {rejectedMemories.length > 0 && (
                  <div className="mb-8">
                    <RejectedMemoriesPanel
                      vaultId={vaultId}
                      rejectedMemories={rejectedMemories}
                      onDelete={handleDeleteMemory}
                      onResubmit={handleResubmitMemory}
                    />
                  </div>
                )}

                {/* Content Approval Notice */}
                {vault.settings?.requireApproval && !isAdmin && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Content Approval Required</AlertTitle>
                    <AlertDescription>
                      This vault requires admin approval for all uploads. Your memories will be reviewed before becoming
                      visible to other members.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Memory
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-2 mr-4">
                      <Button
                        variant={filterType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("all")}
                      >
                        All Types
                      </Button>
                      <Button
                        variant={filterType === "image" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("image")}
                        className="flex items-center gap-1"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Photos</span>
                      </Button>
                      <Button
                        variant={filterType === "audio" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("audio")}
                        className="flex items-center gap-1"
                      >
                        <Mic className="h-4 w-4" />
                        <span className="hidden sm:inline">Audio</span>
                      </Button>
                      <Button
                        variant={filterType === "video" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("video")}
                        className="flex items-center gap-1"
                      >
                        <Video className="h-4 w-4" />
                        <span className="hidden sm:inline">Videos</span>
                      </Button>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2 mr-4">
                        <Button
                          variant={filterStatus === "approved" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterStatus("approved")}
                        >
                          Approved
                        </Button>
                        <Button
                          variant={filterStatus === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterStatus("pending")}
                        >
                          Pending
                        </Button>
                        <Button
                          variant={filterStatus === "rejected" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterStatus("rejected")}
                        >
                          Rejected
                        </Button>
                      </div>
                    )}

                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === "timeline" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("timeline")}
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Timeline view</span>
                    </Button>
                  </div>
                </div>

                {filteredMemories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <p className="text-muted-foreground">
                      {filterType === "all"
                        ? "No memories in this vault yet."
                        : `No ${filterType} memories in this vault yet.`}
                    </p>
                    <Button onClick={() => setUploadDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Your First Memory
                    </Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMemories.map((memory) => (
                      <div
                        key={memory.id}
                        className="group relative overflow-hidden rounded-lg border bg-background cursor-pointer"
                        onClick={() => handleMemoryClick(memory)}
                      >
                        <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                          {memory.mediaType === "image" && (
                            <img
                              src={memory.mediaUrl || "/placeholder.svg"}
                              alt={memory.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          )}
                          {memory.mediaType === "audio" && (
                            <div className="flex flex-col items-center justify-center h-full w-full p-4">
                              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                                <Mic className="h-8 w-8 text-rose-500" />
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">Audio Recording</p>
                            </div>
                          )}
                          {memory.mediaType === "video" && (
                            <div className="relative h-full w-full bg-black">
                              <video
                                src={memory.mediaUrl}
                                className="h-full w-full object-contain"
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-background/80 p-3">
                                  <Play className="h-8 w-8" />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex gap-2">
                            <Badge className="flex items-center gap-1" variant="secondary">
                              {getMediaTypeIcon(memory.mediaType)}
                              <span className="capitalize">{memory.mediaType}</span>
                            </Badge>
                            {isAdmin && memory.approvalStatus !== "approved" && (
                              <Badge
                                className="capitalize"
                                variant={memory.approvalStatus === "pending" ? "outline" : "destructive"}
                              >
                                {memory.approvalStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{memory.title}</h3>
                          {memory.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{memory.description}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">by {memory.createdBy.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(memory.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {(user?.id === memory.createdBy.id || isAdmin) && (
                          <div
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteMemory(memory.id)
                            }}
                          >
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredMemories
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((memory) => (
                        <div
                          key={memory.id}
                          className="flex gap-4 p-4 border rounded-lg cursor-pointer"
                          onClick={() => handleMemoryClick(memory)}
                        >
                          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                            {memory.mediaType === "image" && (
                              <img
                                src={memory.mediaUrl || "/placeholder.svg"}
                                alt={memory.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                            {memory.mediaType === "audio" && (
                              <div className="flex items-center justify-center h-full w-full">
                                <Mic className="h-8 w-8 text-rose-500" />
                              </div>
                            )}
                            {memory.mediaType === "video" && (
                              <div className="flex items-center justify-center h-full w-full">
                                <Video className="h-8 w-8 text-rose-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{memory.title}</h3>
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getMediaTypeIcon(memory.mediaType)}
                                <span className="capitalize">{memory.mediaType}</span>
                              </Badge>
                              {isAdmin && memory.approvalStatus !== "approved" && (
                                <Badge
                                  className="capitalize"
                                  variant={memory.approvalStatus === "pending" ? "outline" : "destructive"}
                                >
                                  {memory.approvalStatus}
                                </Badge>
                              )}
                            </div>
                            {memory.description && (
                              <p className="mt-1 text-sm text-muted-foreground">{memory.description}</p>
                            )}
                            <div className="mt-2 flex items-center gap-4">
                              <p className="text-xs text-muted-foreground">by {memory.createdBy.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(memory.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {(user?.id === memory.createdBy.id || isAdmin) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteMemory(memory.id)
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Vault Members</h3>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Invite Member
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {vault.members.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              member.userId === user?.id ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              member.role === "admin" ? "bg-rose-100 text-rose-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  {isAdmin ? (
                    <>
                      <VaultSettings vault={vault} onUpdate={handleUpdateVault} />

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-destructive rounded-lg">
                            <h4 className="font-medium">Delete Vault</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Once you delete a vault, there is no going back. Please be certain.
                            </p>
                            <Button variant="destructive" className="mt-3">
                              Delete Vault
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground">Only vault admins can modify settings.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-8">
            <ActivityFeed vaultId={vaultId} />
          </div>
        </div>
      </main>

      {/* Memory Viewer */}
      <MemoryViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        memory={selectedMemory}
        memories={filteredMemories}
      />

      {/* Upload Memory Dialog */}
      <UploadMemoryDialog
        vaultId={vaultId}
        vault={vault}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
      />
    </div>
  )
}
