"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import type { Vault } from "@/lib/types"

interface VaultSettingsProps {
  vault: Vault
  onUpdate: (updatedVault: Vault) => void
}

export default function VaultSettings({ vault, onUpdate }: VaultSettingsProps) {
  const [name, setName] = useState(vault.name)
  const [description, setDescription] = useState(vault.description)
  const [requireApproval, setRequireApproval] = useState(vault.settings?.requireApproval ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedVault: Vault = {
        ...vault,
        name,
        description,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Moderation</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="require-approval">Require Content Approval</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, all uploaded memories must be approved by an admin before becoming visible to other members.
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
