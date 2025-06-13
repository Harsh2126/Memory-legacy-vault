"use client"

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
import { AlertTriangle } from "lucide-react"

interface DeleteVaultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void
  vaultName: string
}

export default function DeleteVaultDialog({ open, onOpenChange, onConfirmDelete, vaultName }: DeleteVaultDialogProps) {
  const [confirmName, setConfirmName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmName !== vaultName) return

    setIsDeleting(true)
    try {
      await onConfirmDelete()
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      setConfirmName("")
      onOpenChange(open)
    }
  }

  const isConfirmDisabled = confirmName !== vaultName || isDeleting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Vault
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the vault and remove all memories stored within
            it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
            <p>
              <strong>Warning:</strong> Deleting this vault will:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Permanently remove all memories stored in the vault</li>
              <li>Remove all members from the vault</li>
              <li>Delete all comments and activity history</li>
              <li>This action is permanent and irreversible</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-vault-name">
              To confirm, please type <span className="font-medium">{vaultName}</span> below:
            </Label>
            <Input
              id="confirm-vault-name"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter vault name"
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isConfirmDisabled}
            className={isConfirmDisabled ? "opacity-50" : ""}
          >
            {isDeleting ? "Deleting..." : "Delete Vault"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
