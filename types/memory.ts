export type Memory = {
  id: string
  vaultId: string
  title: string
  description: string
  mediaUrl: string
  mediaType: "image" | "video" | "audio"
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
  tags: string[]
}
