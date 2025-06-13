"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Mic, Video, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Memory, MediaType, Vault } from "@/lib/types"
import { useAuth } from "./auth-provider"

interface UploadMemoryDialogProps {
  vaultId: string
  vault: Vault
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (memory: Memory) => void
}

export default function UploadMemoryDialog({ vaultId, vault, open, onOpenChange, onUpload }: UploadMemoryDialogProps) {
  const [activeTab, setActiveTab] = useState<MediaType>("image")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const requiresApproval = vault.settings?.requireApproval ?? false
  const isAdmin = vault.members.some((m) => m.userId === user?.id && m.role === "admin")

  const handleTabChange = (value: string) => {
    setActiveTab(value as MediaType)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setSelectedFile(null)
    setPreviewUrl(null)
    stopRecording()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Use filename as default title if no title is set
      if (!title) {
        setTitle(file.name.split(".")[0])
      }
    }
  }

  const startRecording = async (type: "audio" | "video") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      })

      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: type === "audio" ? "audio/webm" : "video/webm" })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)

        // Create a file from the blob
        const fileName = `${type}-recording-${new Date().toISOString()}.webm`
        const file = new File([blob], fileName, { type: type === "audio" ? "audio/webm" : "video/webm" })
        setSelectedFile(file)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      recorder.start()
      setAudioRecorder(recorder)
      setIsRecording(true)
      setAudioChunks([])

      // Start timer
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      setRecordingInterval(interval)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      toast({
        title: "Recording failed",
        description: "Could not access your microphone or camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (audioRecorder && audioRecorder.state !== "inactive") {
      audioRecorder.stop()
    }

    if (recordingInterval) {
      clearInterval(recordingInterval)
    }

    setIsRecording(false)
    setRecordingTime(0)
    setRecordingInterval(null)
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select or record a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would upload the file to a storage service
      // For now, we'll use the object URL as the media URL

      // Create a new memory
      const newMemory: Memory = {
        id: `memory_${Date.now()}`,
        vaultId,
        title: title || selectedFile.name,
        description,
        mediaUrl: previewUrl || "",
        mediaType: activeTab,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: user!.id,
          name: user!.name,
        },
        tags: [],
        // Set approval status based on vault settings and user role
        approvalStatus: requiresApproval && !isAdmin ? "pending" : "approved",
      }

      // If the user is an admin and the vault requires approval, auto-approve their uploads
      if (isAdmin && requiresApproval && newMemory.approvalStatus === "approved") {
        newMemory.approvedBy = {
          id: user!.id,
          name: user!.name,
          date: new Date().toISOString(),
        }
      }

      // Call the onUpload callback
      onUpload(newMemory)

      // Show appropriate toast message
      if (newMemory.approvalStatus === "pending") {
        toast({
          title: "Memory submitted for approval",
          description: "Your memory will be visible once approved by an admin.",
        })
      } else {
        toast({
          title: "Memory uploaded",
          description: "Your memory has been added to the vault.",
        })
      }

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your memory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload a Memory</DialogTitle>
            <DialogDescription>Add a new memory to your family vault.</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-1 my-4">
            {requiresApproval && !isAdmin && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Approval Required</AlertTitle>
                <AlertDescription>
                  This vault requires admin approval for all uploads. Your memory will be reviewed before becoming
                  visible to other members.
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Photo</span>
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>Audio</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-file">Upload Photo</Label>
                  <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {previewUrl && (
                  <div className="mt-4 aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center max-h-[200px]">
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-full object-contain" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="audio" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Audio Recording</Label>
                  <div className="flex flex-col gap-4 items-center">
                    {!previewUrl ? (
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <Button
                            type="button"
                            onClick={() => startRecording("audio")}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Mic className="h-4 w-4" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <div className="text-rose-500 animate-pulse">
                              ● Recording: {formatRecordingTime(recordingTime)}
                            </div>
                            <Button type="button" onClick={stopRecording} variant="outline">
                              Stop
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <audio src={previewUrl} controls className="w-full" />
                        <Button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null)
                            setSelectedFile(null)
                          }}
                          variant="outline"
                          className="mt-2"
                        >
                          Discard & Re-record
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-file">Or Upload Audio File</Label>
                  <Input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} />
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Video Recording</Label>
                  <div className="flex flex-col gap-4 items-center">
                    {!previewUrl ? (
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <Button
                            type="button"
                            onClick={() => startRecording("video")}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Video className="h-4 w-4" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <div className="text-rose-500 animate-pulse">
                              ● Recording: {formatRecordingTime(recordingTime)}
                            </div>
                            <Button type="button" onClick={stopRecording} variant="outline">
                              Stop
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <video src={previewUrl} controls className="w-full max-h-[200px]" />
                        <Button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null)
                            setSelectedFile(null)
                          }}
                          variant="outline"
                          className="mt-2"
                        >
                          Discard & Re-record
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-file">Or Upload Video File</Label>
                  <Input id="video-file" type="file" accept="video/*" onChange={handleFileChange} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder={`e.g., ${
                    activeTab === "image"
                      ? "Summer Vacation 2023"
                      : activeTab === "audio"
                        ? "Grandma's Story"
                        : "Baby's First Steps"
                  }`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story behind this memory..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-2 border-t bg-background">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? "Uploading..." : requiresApproval && !isAdmin ? "Submit for Approval" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
