"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, X } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setProfilePicture(user.profilePicture || null)
    }
  }, [user])

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true)
      const file = e.target.files[0]

      // Create a FileReader to read the image as a data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          // In a real app, you would upload this to a storage service
          // and get back a URL. For now, we'll use the data URL.
          setProfilePicture(event.target.result as string)
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would call an API to update the user profile
      // For now, we'll just simulate a delay and show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in localStorage to persist changes
      if (user && updateUser) {
        const updatedUser = {
          ...user,
          name,
          email,
          profilePicture,
        }
        updateUser(updatedUser)
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container py-12">
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      {profilePicture ? (
                        <AvatarImage src={profilePicture || "/placeholder.svg"} alt={user?.name || "Profile"} />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-rose-100 text-rose-500">
                        {user?.name?.substring(0, 2).toUpperCase() || <User />}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={triggerFileInput}
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                  {isUploading ? (
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  ) : profilePicture ? (
                    <Button variant="outline" size="sm" onClick={handleRemoveProfilePicture} className="mt-2 text-xs">
                      <X className="h-3 w-3 mr-1" /> Remove Photo
                    </Button>
                  ) : null}
                  <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-2">User ID: {user?.id.substring(0, 8)}...</p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          {profilePicture ? (
                            <AvatarImage src={profilePicture || "/placeholder.svg"} alt={user?.name || "Profile"} />
                          ) : null}
                          <AvatarFallback className="text-xl bg-rose-100 text-rose-500">
                            {user?.name?.substring(0, 2).toUpperCase() || <User />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                            <Camera className="h-4 w-4 mr-2" /> Upload New Picture
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: Square image, at least 200x200 pixels
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
