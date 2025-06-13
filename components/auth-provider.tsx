"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updatedUser: User) => void
  deleteAccount: () => Promise<void>
  socialLogin: (provider: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This is a mock login - in a real app, you would call an API
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in localStorage (for demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = existingUsers.find((u: any) => u.email === email)

      // For demo purposes, we'll create a new user if one doesn't exist
      let mockUser: User

      if (existingUser) {
        mockUser = existingUser
      } else {
        // Mock user data - in a real app, this would come from your backend
        mockUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          name: email.split("@")[0],
          email,
          profilePicture: null,
          roles: ["role_user"], // Default role
        }

        // Save the new user to localStorage
        localStorage.setItem("users", JSON.stringify([...existingUsers, mockUser]))

        // Set up default role assignment
        const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}")
        userRoles[mockUser.id] = ["role_user"]
        localStorage.setItem("userRoles", JSON.stringify(userRoles))
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // This is a mock signup - in a real app, you would call an API
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error("User with this email already exists")
      }

      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        profilePicture: null,
        roles: ["role_user"], // Default role
      }

      // Save the new user to localStorage
      localStorage.setItem("users", JSON.stringify([...existingUsers, mockUser]))

      // Set up default role assignment
      const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}")
      userRoles[mockUser.id] = ["role_user"]
      localStorage.setItem("userRoles", JSON.stringify(userRoles))

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update user in users list
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = existingUsers.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  const deleteAccount = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call an API to delete the user's account
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!user) {
        throw new Error("No user logged in")
      }

      // Remove user from users list
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = existingUsers.filter((u: User) => u.id !== user.id)
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Remove user roles
      const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}")
      delete userRoles[user.id]
      localStorage.setItem("userRoles", JSON.stringify(userRoles))

      // Clean up user data from localStorage
      localStorage.removeItem("user")

      // Clean up user vaults
      const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")

      // Remove vaults where the user is the only admin
      const updatedVaults = userVaults.filter((vault: any) => {
        const admins = vault.members.filter((member: any) => member.role === "admin")
        return !(admins.length === 1 && admins[0].userId === user.id)
      })

      // For other vaults, remove the user from members
      updatedVaults.forEach((vault: any) => {
        vault.members = vault.members.filter((member: any) => member.userId !== user.id)
      })

      localStorage.setItem("userVaults", JSON.stringify(updatedVaults))

      // Reset user state
      setUser(null)

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Account deletion failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // This is a mock social login - in a real app, you would use OAuth
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random name based on the provider
      const randomName = `${provider}User${Math.floor(Math.random() * 1000)}`
      const email = `${randomName.toLowerCase()}@example.com`

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      let mockUser: User

      const existingUser = existingUsers.find((u: any) => u.email === email)
      if (existingUser) {
        mockUser = existingUser
      } else {
        // Mock user data - in a real app, this would come from the OAuth provider
        mockUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          name: randomName,
          email,
          profilePicture: null,
          provider: provider,
          roles: ["role_user"], // Default role
        }

        // Save the new user to localStorage
        localStorage.setItem("users", JSON.stringify([...existingUsers, mockUser]))

        // Set up default role assignment
        const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}")
        userRoles[mockUser.id] = ["role_user"]
        localStorage.setItem("userRoles", JSON.stringify(userRoles))
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error(`${provider} login failed:`, error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, deleteAccount, socialLogin, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
