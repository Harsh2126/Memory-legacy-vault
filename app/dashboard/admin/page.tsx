"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRBAC } from "@/components/rbac-provider"
import { useAuth } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import UsersManagement from "@/components/admin/users-management"
import RolesManagement from "@/components/admin/roles-management"
import SystemSettings from "@/components/admin/system-settings"

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { hasPermission, isLoading: rbacLoading } = useRBAC()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    // Redirect to dashboard if not loading and no permission
    if (!authLoading && !rbacLoading && user && !hasPermission("admin:access")) {
      router.push("/dashboard")
    }
  }, [user, authLoading, rbacLoading, hasPermission, router])

  if (authLoading || rbacLoading) {
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
    <ProtectedRoute requiredPermission="admin:access" redirectTo="/dashboard">
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="settings">System Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <ProtectedRoute requiredPermission="admin:manage_users">
                  <UsersManagement />
                </ProtectedRoute>
              </TabsContent>

              <TabsContent value="roles">
                <ProtectedRoute requiredPermission="admin:manage_roles">
                  <RolesManagement />
                </ProtectedRoute>
              </TabsContent>

              <TabsContent value="settings">
                <ProtectedRoute requiredPermission="admin:system_settings">
                  <SystemSettings />
                </ProtectedRoute>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
