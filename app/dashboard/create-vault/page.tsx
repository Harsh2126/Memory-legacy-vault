"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function CreateVaultPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [theme, setTheme] = useState("rose")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a new vault object
      const newVault = {
        id: "vault_" + Math.random().toString(36).substr(2, 9),
        name,
        description,
        theme,
        coverImage: "/placeholder.svg?height=400&width=600",
        createdAt: new Date().toISOString(),
        createdBy: user?.id || "",
        members: [
          {
            userId: user?.id || "",
            name: user?.name || "",
            email: user?.email || "",
            role: "admin" as const,
            joinedAt: new Date().toISOString(),
          },
        ],
      }

      // Get existing vaults from localStorage or use empty array
      const existingVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")

      // Add new vault to the array
      const updatedVaults = [newVault, ...existingVaults]

      // Save updated vaults to localStorage
      localStorage.setItem("userVaults", JSON.stringify(updatedVaults))

      toast({
        title: "Vault created",
        description: `Your vault "${name}" has been created successfully.`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Failed to create vault",
        description: "There was a problem creating your vault. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a New Vault</h1>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Vault Details</CardTitle>
                <CardDescription>Create a new vault to store and share your family memories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Vault Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Johnson Family Memories"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this vault is for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Theme Color</Label>
                  <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                    <Label
                      htmlFor="rose"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "rose" ? "border-rose-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="rose" id="rose" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-rose-500" />
                      <span className="mt-2">Rose</span>
                    </Label>
                    <Label
                      htmlFor="blue"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "blue" ? "border-blue-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="blue" id="blue" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-blue-500" />
                      <span className="mt-2">Blue</span>
                    </Label>
                    <Label
                      htmlFor="green"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "green" ? "border-green-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="green" id="green" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-green-500" />
                      <span className="mt-2">Green</span>
                    </Label>
                    <Label
                      htmlFor="purple"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "purple" ? "border-purple-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="purple" id="purple" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-purple-500" />
                      <span className="mt-2">Purple</span>
                    </Label>
                    <Label
                      htmlFor="amber"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "amber" ? "border-amber-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="amber" id="amber" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-amber-500" />
                      <span className="mt-2">Amber</span>
                    </Label>
                    <Label
                      htmlFor="teal"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        theme === "teal" ? "border-teal-500" : ""
                      }`}
                    >
                      <RadioGroupItem value="teal" id="teal" className="sr-only" />
                      <div className="h-6 w-6 rounded-full bg-teal-500" />
                      <span className="mt-2">Teal</span>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !name}>
                  {isSubmitting ? "Creating..." : "Create Vault"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
