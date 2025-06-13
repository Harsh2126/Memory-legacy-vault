"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Trash2 } from "lucide-react"
import type { Vault } from "@/lib/types"

interface VaultSettingsProps {
  vault: Vault
  onUpdate: (updatedVault: Vault) => void
}

export default function VaultSettings({ vault, onUpdate }: VaultSettingsProps) {
  const [name, setName] = useState(vault.name)
  const [description, setDescription] = useState(vault.description)
  const [requireApproval, setRequireApproval] = useState(vault.settings?.requireApproval ?? false)
  const [coverImage, setCoverImage] = useState(vault.coverImage)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedVault: Vault = {
        ...vault,
        name,
        description,
        coverImage,
        settings: {
          ...vault.settings,
          requireApproval,
        },
      }

      onUpdate(updatedVault)

      toast({
        title: "Vault updated",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating the vault. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCoverImage = () => {
    setCoverImage("/placeholder.svg?height=400&width=600")
    toast({
      title: "Cover image removed",
      description: "The default cover image has been restored.",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vault-name">Vault Name</Label>
            <Input id="vault-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-description">Description</Label>
            <Textarea
              id="vault-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="space-y-4">
            <Label>Cover Photo</Label>
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/1] overflow-hidden bg-muted">
                <img
                  src={coverImage || "/placeholder.svg?height=400&width=600"}
                  alt="Vault cover"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={triggerFileInput}
                      className="flex items-center gap-1"
                    >
                      <Camera className="h-4 w-4" />
                      Change Cover
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveCoverImage}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Recommended size: 1200×400 pixels. Max file size: 5MB.</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Content Moderation</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-approval">Require Content Approval</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, all uploaded memories must be approved by an admin before becoming visible to other
                  members.
                </p>
              </div>
              <Switch
                id="require-approval"
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
                aria-label="Require content approval"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
