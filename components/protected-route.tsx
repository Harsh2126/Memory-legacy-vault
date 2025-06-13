"use client"

import type { ReactNode } from "react"
import { useRBAC } from "./rbac-provider"
import { useAuth } from "./auth-provider"
import type { Permission } from "@/lib/rbac/types"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermissions?: Permission[]
  requiredAnyPermission?: Permission[]
  fallback?: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredPermissions,
  requiredAnyPermission,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth()
  const { hasPermission, hasAllPermissions, hasAnyPermission, isLoading: rbacLoading } = useRBAC()
  const router = useRouter()

  const isLoading = authLoading || rbacLoading

  // If still loading, show nothing
  if (isLoading) {
    return null
  }

  // If not logged in, redirect to login
  if (!user) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }

    router.push("/login")
    return null
  }

  // Check permissions
  let hasAccess = true

  if (requiredPermissions && requiredPermissions.length > 0) {
    hasAccess = hasAllPermissions(requiredPermissions)
  }

  if (hasAccess && requiredAnyPermission && requiredAnyPermission.length > 0) {
    hasAccess = hasAnyPermission(requiredAnyPermission)
  }

  // If has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>
  }

  // If redirectTo is provided, redirect
  if (redirectTo) {
    router.push(redirectTo)
    return null
  }

  // Default fallback: access denied message
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </AlertDescription>
      </Alert>
      <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard")}>
        Return to Dashboard
      </Button>
    </div>
  )
}
