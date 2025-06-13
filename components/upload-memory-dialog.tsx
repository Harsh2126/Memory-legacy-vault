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

  const requiresApproval = vault?.settings?.requireApproval ?? false
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

      // Create a new memory with a unique ID to prevent duplication
      const newMemory: Memory = {
        id: `memory_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Upload a Memory</DialogTitle>
            <DialogDescription className="text-sm">Add a new memory to your family vault.</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[50vh] sm:max-h-[60vh] pr-1 my-2 sm:my-4">
            {requiresApproval && !isAdmin && (
              <Alert className="mt-2 sm:mt-4 text-sm">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertTitle>Approval Required</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                  This vault requires admin approval for all uploads. Your memory will be reviewed before becoming
                  visible to other members.
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-2 sm:mt-4">
              <TabsList className="grid grid-cols-3 h-auto">
                <TabsTrigger
                  value="image"
                  className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Photo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="audio"
                  className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Audio</span>
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Video</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="image-file" className="text-sm">
                    Upload Photo
                  </Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm file:text-sm file:py-1 file:px-2"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-2 sm:mt-4 aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center max-h-[150px] sm:max-h-[200px]">
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-full object-contain" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="audio" className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm">Audio Recording</Label>
                  <div className="flex flex-col gap-2 sm:gap-4 items-center">
                    {!previewUrl ? (
                      <div className="flex items-center gap-2 sm:gap-4">
                        {!isRecording ? (
                          <Button
                            type="button"
                            onClick={() => startRecording("audio")}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <div className="text-rose-500 animate-pulse text-xs sm:text-sm">
                              ● Recording: {formatRecordingTime(recordingTime)}
                            </div>
                            <Button
                              type="button"
                              onClick={stopRecording}
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm h-8 sm:h-9"
                            >
                              Stop
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <audio src={previewUrl} controls className="w-full h-10 sm:h-12" />
                        <Button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null)
                            setSelectedFile(null)
                          }}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          Discard & Re-record
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="audio-file" className="text-sm">
                    Or Upload Audio File
                  </Label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="text-sm file:text-sm file:py-1 file:px-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm">Video Recording</Label>
                  <div className="flex flex-col gap-2 sm:gap-4 items-center">
                    {!previewUrl ? (
                      <div className="flex items-center gap-2 sm:gap-4">
                        {!isRecording ? (
                          <Button
                            type="button"
                            onClick={() => startRecording("video")}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <div className="text-rose-500 animate-pulse text-xs sm:text-sm">
                              ● Recording: {formatRecordingTime(recordingTime)}
                            </div>
                            <Button
                              type="button"
                              onClick={stopRecording}
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm h-8 sm:h-9"
                            >
                              Stop
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <video src={previewUrl} controls className="w-full max-h-[150px] sm:max-h-[200px]" />
                        <Button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null)
                            setSelectedFile(null)
                          }}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          Discard & Re-record
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="video-file" className="text-sm">
                    Or Upload Video File
                  </Label>
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="text-sm file:text-sm file:py-1 file:px-2"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="title" className="text-sm">
                  Title
                </Label>
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
                  className="text-sm h-8 sm:h-9"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story behind this memory..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="text-sm min-h-[60px] sm:min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2 sm:mt-4 pt-2 border-t bg-background flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            >
              {isUploading ? "Uploading..." : requiresApproval && !isAdmin ? "Submit for Approval" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
