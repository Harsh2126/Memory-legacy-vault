"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { mockVaults } from "@/lib/data"
import type { Vault } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [vaults, setVaults] = useState<Vault[]>([])
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Fetch vaults (using mock data and localStorage)
    if (user) {
      // Get user-created vaults from localStorage
      const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")

      // Combine with mock vaults
      setVaults([...userVaults, ...mockVaults])
    }
  }, [user, isLoading, router])

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
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Vaults</h1>
            <Link href="/dashboard/create-vault">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Vault
              </Button>
            </Link>
          </div>

          {vaults.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <p className="text-muted-foreground">You don&apos;t have any vaults yet.</p>
              <Link href="/dashboard/create-vault">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Vault
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vaults.map((vault) => (
                <Link key={vault.id} href={`/dashboard/vault/${vault.id}`}>
                  <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={vault.coverImage || "/placeholder.svg"}
                        alt={vault.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{vault.name}</CardTitle>
                      <CardDescription>{vault.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {vault.members.length} member{vault.members.length !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">
                        View Vault
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
