"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/components/auth-provider"
import { useRBAC } from "@/components/rbac-provider"
import { useToast } from "@/components/ui/use-toast"
import VaultSettings from "@/components/vault-settings"
import PermissionGuard from "@/components/permission-guard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Vault } from "@/lib/types"
import { mockVaults } from "@/lib/data"

export default function VaultSettingsPage() {
  const { id } = useParams()
  const vaultId = Array.isArray(id) ? id[0] : id
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { hasPermission } = useRBAC()
  const { toast } = useToast()

  const [vault, setVault] = useState<Vault | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && vaultId) {
      setIsLoading(true)

      // Check mock vaults first
      let foundVault = mockVaults.find((v) => v.id === vaultId)

      // If not found in mock data, check localStorage
      if (!foundVault) {
        const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")
        foundVault = userVaults.find((v: Vault) => v.id === vaultId)
      }

      // Ensure vault has settings
      if (foundVault && !foundVault.settings) {
        foundVault.settings = { requireApproval: false }
      }

      if (foundVault) {
        setVault(foundVault)
      } else {
        // Vault not found
        router.push("/dashboard")
      }

      setIsLoading(false)
    }
  }, [user, authLoading, vaultId, router])

  const handleUpdateVault = (updatedVault: Vault) => {
    setVault(updatedVault)

    // Update in localStorage if it's a user-created vault
    const userVaults = JSON.parse(localStorage.getItem("userVaults") || "[]")
    const updatedVaults = userVaults.map((v: Vault) => (v.id === vault?.id ? updatedVault : v))
    localStorage.setItem("userVaults", JSON.stringify(updatedVaults))

    toast({
      title: "Vault updated",
      description: "Your changes have been saved.",
    })
  }

  if (isLoading || !vault) {
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/vault/${vaultId}`)}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Vault Settings</h1>
          </div>

          <PermissionGuard
            requiredAnyPermission={["vault:update", "vault:delete", "vault:manage_members"]}
            fallback={
              <Alert>
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You don't have permission to access vault settings.</AlertDescription>
              </Alert>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Vault</CardTitle>
              </CardHeader>
              <CardContent>
                <VaultSettings vault={vault} onUpdate={handleUpdateVault} />
              </CardContent>
            </Card>
          </PermissionGuard>
        </div>
      </main>
    </div>
  )
}
