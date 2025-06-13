export type User = {
  id: string
  name: string
  email: string
}

export type Vault = {
  id: string
  name: string
  description: string
  coverImage: string
  theme: string
  createdAt: string
  createdBy: string
  members: VaultMember[]
  settings?: {
    requireApproval: boolean
  }
}

export type VaultMember = {
  userId: string
  name: string
  email: string
  role: "admin" | "member"
  joinedAt: string
}

export type MediaType = "image" | "video" | "audio"

export type ApprovalStatus = "pending" | "approved" | "rejected"

export type Memory = {
  id: string
  vaultId: string
  title: string
  description: string
  mediaUrl: string
  mediaType: MediaType
  thumbnailUrl?: string // For video previews
  duration?: number // For audio/video duration in seconds
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
  tags: string[]
  approvalStatus: ApprovalStatus
  approvedBy?: {
    id: string
    name: string
    date: string
  }
  rejectionReason?: string
}
