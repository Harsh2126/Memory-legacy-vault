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

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void
  userEmail: string
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirmDelete,
  userEmail,
}: DeleteAccountDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmEmail !== userEmail) return

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
      setConfirmEmail("")
      onOpenChange(open)
    }
  }

  const isConfirmDisabled = confirmEmail !== userEmail || isDeleting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
            <p>
              <strong>Warning:</strong> Deleting your account will:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Remove all your personal information</li>
              <li>Remove you from all family vaults</li>
              <li>Delete any vaults where you are the only admin</li>
              <li>Make this action permanent and irreversible</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-email">
              To confirm, please type <span className="font-medium">{userEmail}</span> below:
            </Label>
            <Input
              id="confirm-email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Enter your email"
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
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
