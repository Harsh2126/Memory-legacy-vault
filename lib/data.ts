import type { Vault, Memory } from "./types"

// Mock data for vaults
export const mockVaults: Vault[] = [
  {
    id: "vault_1",
    name: "Johnson Family",
    description: "Our family memories through the years",
    coverImage: "/placeholder.svg?height=400&width=600",
    theme: "rose",
    createdAt: "2023-01-15T12:00:00Z",
    createdBy: "user_1",
    members: [
      {
        userId: "user_1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "admin",
        joinedAt: "2023-01-15T12:00:00Z",
      },
      {
        userId: "user_2",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "member",
        joinedAt: "2023-01-16T10:30:00Z",
      },
    ],
  },
  {
    id: "vault_2",
    name: "Summer Vacation 2023",
    description: "Memories from our trip to Hawaii",
    coverImage: "/placeholder.svg?height=400&width=600",
    theme: "blue",
    createdAt: "2023-06-10T09:15:00Z",
    createdBy: "user_1",
    members: [
      {
        userId: "user_1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "admin",
        joinedAt: "2023-06-10T09:15:00Z",
      },
      {
        userId: "user_3",
        name: "Emma Johnson",
        email: "emma@example.com",
        role: "member",
        joinedAt: "2023-06-10T10:00:00Z",
      },
    ],
  },
]

// Mock data for memories
export const mockMemories: Record<string, Memory[]> = {
  vault_1: [
    {
      id: "memory_1",
      vaultId: "vault_1",
      title: "Christmas 2022",
      description: "Opening presents around the tree",
      mediaUrl: "/placeholder.svg?height=600&width=800",
      mediaType: "image",
      createdAt: "2023-01-15T14:30:00Z",
      createdBy: {
        id: "user_1",
        name: "Sarah Johnson",
      },
      tags: ["christmas", "family", "holiday"],
    },
    {
      id: "memory_2",
      vaultId: "vault_1",
      title: "Dad's 60th Birthday",
      description: "Surprise party at the lake house",
      mediaUrl: "/placeholder.svg?height=600&width=800",
      mediaType: "image",
      createdAt: "2023-02-20T18:45:00Z",
      createdBy: {
        id: "user_2",
        name: "Mike Johnson",
      },
      tags: ["birthday", "celebration"],
    },
    {
      id: "memory_3",
      vaultId: "vault_1",
      title: "Family Reunion",
      description: "Everyone together at Grandma's house",
      mediaUrl: "/placeholder.svg?height=600&width=800",
      mediaType: "image",
      createdAt: "2023-03-10T12:15:00Z",
      createdBy: {
        id: "user_1",
        name: "Sarah Johnson",
      },
      tags: ["reunion", "family"],
    },
    {
      id: "memory_4",
      vaultId: "vault_1",
      title: "Grandpa's Stories",
      description: "Grandpa sharing stories about his childhood",
      mediaUrl: "https://example.com/audio/grandpa-stories.mp3",
      mediaType: "audio",
      duration: 245, // 4:05 minutes
      createdAt: "2023-04-05T15:20:00Z",
      createdBy: {
        id: "user_1",
        name: "Sarah Johnson",
      },
      tags: ["grandpa", "stories", "history"],
    },
    {
      id: "memory_5",
      vaultId: "vault_1",
      title: "Baby's First Steps",
      description: "Little Emma taking her first steps",
      mediaUrl: "https://example.com/videos/first-steps.mp4",
      mediaType: "video",
      thumbnailUrl: "/placeholder.svg?height=600&width=800",
      duration: 32, // 32 seconds
      createdAt: "2023-05-12T09:45:00Z",
      createdBy: {
        id: "user_2",
        name: "Mike Johnson",
      },
      tags: ["baby", "milestone", "first steps"],
    },
  ],
  vault_2: [
    {
      id: "memory_6",
      vaultId: "vault_2",
      title: "Beach Day",
      description: "First day at Waikiki Beach",
      mediaUrl: "/placeholder.svg?height=600&width=800",
      mediaType: "image",
      createdAt: "2023-06-12T10:00:00Z",
      createdBy: {
        id: "user_1",
        name: "Sarah Johnson",
      },
      tags: ["beach", "hawaii", "vacation"],
    },
    {
      id: "memory_7",
      vaultId: "vault_2",
      title: "Hiking Volcano",
      description: "Our trek up to the volcano summit",
      mediaUrl: "/placeholder.svg?height=600&width=800",
      mediaType: "image",
      createdAt: "2023-06-14T16:20:00Z",
      createdBy: {
        id: "user_3",
        name: "Emma Johnson",
      },
      tags: ["hiking", "volcano", "adventure"],
    },
    {
      id: "memory_8",
      vaultId: "vault_2",
      title: "Ocean Sounds",
      description: "Relaxing sounds of the waves at sunset",
      mediaUrl: "https://example.com/audio/ocean-waves.mp3",
      mediaType: "audio",
      duration: 180, // 3 minutes
      createdAt: "2023-06-15T19:30:00Z",
      createdBy: {
        id: "user_3",
        name: "Emma Johnson",
      },
      tags: ["ocean", "relaxing", "sounds"],
    },
    {
      id: "memory_9",
      vaultId: "vault_2",
      title: "Snorkeling Adventure",
      description: "Swimming with tropical fish at Hanauma Bay",
      mediaUrl: "https://example.com/videos/snorkeling.mp4",
      mediaType: "video",
      thumbnailUrl: "/placeholder.svg?height=600&width=800",
      duration: 145, // 2:25 minutes
      createdAt: "2023-06-16T14:10:00Z",
      createdBy: {
        id: "user_1",
        name: "Sarah Johnson",
      },
      tags: ["snorkeling", "ocean", "fish"],
    },
  ],
}
