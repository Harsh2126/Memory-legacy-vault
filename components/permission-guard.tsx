"use client"

import type { ReactNode } from "react"
import { useRBAC } from "./rbac-provider"
import type { Permission } from "@/lib/rbac/types"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requiredAnyPermission?: Permission[]
  fallback?: ReactNode
}

export default function PermissionGuard({
  children,
  requiredPermission,
  requiredPermissions,
  requiredAnyPermission,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useRBAC()

  // Check permissions
  let hasAccess = true

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission)
  }

  if (hasAccess && requiredPermissions && requiredPermissions.length > 0) {
    hasAccess = hasAllPermissions(requiredPermissions)
  }

  if (hasAccess && requiredAnyPermission && requiredAnyPermission.length > 0) {
    hasAccess = hasAnyPermission(requiredAnyPermission)
  }

  // If has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // Otherwise, render fallback
  return <>{fallback}</>
}
