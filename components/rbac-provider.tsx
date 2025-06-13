"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-provider"
import type { Permission, Role } from "@/lib/rbac/types"
import { SYSTEM_ROLES, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/rbac/permissions"
import { useToast } from "@/components/ui/use-toast"

type RBACContextType = {
  roles: Role[]
  userRoles: Role[]
  userPermissions: Permission[]
  createRole: (role: Omit<Role, "id">) => Promise<Role>
  updateRole: (id: string, role: Partial<Omit<Role, "id">>) => Promise<Role>
  deleteRole: (id: string) => Promise<void>
  assignRoleToUser: (userId: string, roleId: string) => Promise<void>
  removeRoleFromUser: (userId: string, roleId: string) => Promise<void>
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  isLoading: boolean
}

const RBACContext = createContext<RBACContextType | undefined>(undefined)

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>(SYSTEM_ROLES)
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load roles from localStorage on mount
  useEffect(() => {
    const storedRoles = localStorage.getItem("roles")
    if (storedRoles) {
      // Merge system roles with stored custom roles
      const customRoles = JSON.parse(storedRoles) as Role[]
      const mergedRoles = [...SYSTEM_ROLES]

      // Add any custom roles that don't conflict with system roles
      customRoles.forEach((role) => {
        if (!mergedRoles.some((r) => r.id === role.id)) {
          mergedRoles.push(role)
        }
      })

      setRoles(mergedRoles)
    }
    setIsLoading(false)
  }, [])

  // Update user roles and permissions when user changes
  useEffect(() => {
    if (user) {
      // Get user role assignments from localStorage
      const storedUserRoles = localStorage.getItem("userRoles")
      const userRoleAssignments = storedUserRoles ? JSON.parse(storedUserRoles) : {}

      // Get role IDs assigned to the user
      const userRoleIds = userRoleAssignments[user.id] || ["role_user"] // Default to 'user' role

      // Get the actual role objects
      const userRoleObjects = roles.filter((role) => userRoleIds.includes(role.id))
      setUserRoles(userRoleObjects)

      // Calculate all permissions the user has
      const allPermissions = new Set<Permission>()
      userRoleObjects.forEach((role) => {
        role.permissions.forEach((permission) => {
          allPermissions.add(permission)
        })
      })

      setUserPermissions(Array.from(allPermissions))
    } else {
      setUserRoles([])
      setUserPermissions([])
    }
  }, [user, roles])

  // Create a new role
  const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
    setIsLoading(true)
    try {
      // Generate a unique ID for the role
      const newRole: Role = {
        ...role,
        id: `role_${Math.random().toString(36).substring(2, 9)}`,
      }

      // Add the new role to the roles list
      const updatedRoles = [...roles, newRole]
      setRoles(updatedRoles)

      // Save custom roles to localStorage
      const customRoles = updatedRoles.filter((r) => !r.isSystem)
      localStorage.setItem("roles", JSON.stringify(customRoles))

      toast({
        title: "Role created",
        description: `The role "${newRole.name}" has been created successfully.`,
      })

      return newRole
    } catch (error) {
      toast({
        title: "Failed to create role",
        description: "There was a problem creating the role. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing role
  const updateRole = async (id: string, roleUpdate: Partial<Omit<Role, "id">>): Promise<Role> => {
    setIsLoading(true)
    try {
      // Find the role to update
      const roleIndex = roles.findIndex((r) => r.id === id)
      if (roleIndex === -1) {
        throw new Error(`Role with ID ${id} not found`)
      }

      // Check if it's a system role
      if (roles[roleIndex].isSystem) {
        throw new Error("System roles cannot be modified")
      }

      // Update the role
      const updatedRole = {
        ...roles[roleIndex],
        ...roleUpdate,
      }

      // Update the roles list
      const updatedRoles = [...roles]
      updatedRoles[roleIndex] = updatedRole
      setRoles(updatedRoles)

      // Save custom roles to localStorage
      const customRoles = updatedRoles.filter((r) => !r.isSystem)
      localStorage.setItem("roles", JSON.stringify(customRoles))

      toast({
        title: "Role updated",
        description: `The role "${updatedRole.name}" has been updated successfully.`,
      })

      return updatedRole
    } catch (error) {
      toast({
        title: "Failed to update role",
        description: error instanceof Error ? error.message : "There was a problem updating the role.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a role
  const deleteRole = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Find the role to delete
      const role = roles.find((r) => r.id === id)
      if (!role) {
        throw new Error(`Role with ID ${id} not found`)
      }

      // Check if it's a system role
      if (role.isSystem) {
        throw new Error("System roles cannot be deleted")
      }

      // Remove the role from the roles list
      const updatedRoles = roles.filter((r) => r.id !== id)
      setRoles(updatedRoles)

      // Save custom roles to localStorage
      const customRoles = updatedRoles.filter((r) => !r.isSystem)
      localStorage.setItem("roles", JSON.stringify(customRoles))

      // Remove the role from all users
      const storedUserRoles = localStorage.getItem("userRoles")
      if (storedUserRoles) {
        const userRoleAssignments = JSON.parse(storedUserRoles)

        // Remove the role from all users
        Object.keys(userRoleAssignments).forEach((userId) => {
          userRoleAssignments[userId] = userRoleAssignments[userId].filter((roleId: string) => roleId !== id)
        })

        localStorage.setItem("userRoles", JSON.stringify(userRoleAssignments))
      }

      toast({
        title: "Role deleted",
        description: `The role "${role.name}" has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Failed to delete role",
        description: error instanceof Error ? error.message : "There was a problem deleting the role.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Assign a role to a user
  const assignRoleToUser = async (userId: string, roleId: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Check if the role exists
      const role = roles.find((r) => r.id === roleId)
      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`)
      }

      // Get user role assignments from localStorage
      const storedUserRoles = localStorage.getItem("userRoles")
      const userRoleAssignments = storedUserRoles ? JSON.parse(storedUserRoles) : {}

      // Get current role assignments for the user
      const userRoleIds = userRoleAssignments[userId] || []

      // Check if the user already has this role
      if (userRoleIds.includes(roleId)) {
        throw new Error(`User already has the role "${role.name}"`)
      }

      // Add the role to the user
      userRoleAssignments[userId] = [...userRoleIds, roleId]

      // Save to localStorage
      localStorage.setItem("userRoles", JSON.stringify(userRoleAssignments))

      // Update user roles if this is the current user
      if (user && user.id === userId) {
        const updatedUserRoles = [...userRoles, role]
        setUserRoles(updatedUserRoles)

        // Update user permissions
        const allPermissions = new Set<Permission>(userPermissions)
        role.permissions.forEach((permission) => {
          allPermissions.add(permission)
        })
        setUserPermissions(Array.from(allPermissions))
      }

      toast({
        title: "Role assigned",
        description: `The role "${role.name}" has been assigned successfully.`,
      })
    } catch (error) {
      toast({
        title: "Failed to assign role",
        description: error instanceof Error ? error.message : "There was a problem assigning the role.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Remove a role from a user
  const removeRoleFromUser = async (userId: string, roleId: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Check if the role exists
      const role = roles.find((r) => r.id === roleId)
      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`)
      }

      // Get user role assignments from localStorage
      const storedUserRoles = localStorage.getItem("userRoles")
      const userRoleAssignments = storedUserRoles ? JSON.parse(storedUserRoles) : {}

      // Get current role assignments for the user
      const userRoleIds = userRoleAssignments[userId] || []

      // Check if the user has this role
      if (!userRoleIds.includes(roleId)) {
        throw new Error(`User does not have the role "${role.name}"`)
      }

      // Check if this is the user's only role
      if (userRoleIds.length === 1) {
        throw new Error("Cannot remove the user's only role")
      }

      // Remove the role from the user
      userRoleAssignments[userId] = userRoleIds.filter((id: string) => id !== roleId)

      // Save to localStorage
      localStorage.setItem("userRoles", JSON.stringify(userRoleAssignments))

      // Update user roles if this is the current user
      if (user && user.id === userId) {
        const updatedUserRoles = userRoles.filter((r) => r.id !== roleId)
        setUserRoles(updatedUserRoles)

        // Recalculate user permissions
        const allPermissions = new Set<Permission>()
        updatedUserRoles.forEach((r) => {
          r.permissions.forEach((permission) => {
            allPermissions.add(permission)
          })
        })
        setUserPermissions(Array.from(allPermissions))
      }

      toast({
        title: "Role removed",
        description: `The role "${role.name}" has been removed successfully.`,
      })
    } catch (error) {
      toast({
        title: "Failed to remove role",
        description: error instanceof Error ? error.message : "There was a problem removing the role.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Check if the current user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(userPermissions, permission)
  }

  // Check if the current user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(userPermissions, permissions)
  }

  // Check if the current user has all of the specified permissions
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(userPermissions, permissions)
  }

  return (
    <RBACContext.Provider
      value={{
        roles,
        userRoles,
        userPermissions,
        createRole,
        updateRole,
        deleteRole,
        assignRoleToUser,
        removeRoleFromUser,
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        hasAllPermissions: checkAllPermissions,
        isLoading,
      }}
    >
      {children}
    </RBACContext.Provider>
  )
}

export const useRBAC = () => {
  const context = useContext(RBACContext)
  if (context === undefined) {
    throw new Error("useRBAC must be used within a RBACProvider")
  }
  return context
}
