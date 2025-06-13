import type { Permission, Role } from "./types"

// Define system roles
export const SYSTEM_ROLES: Role[] = [
  {
    id: "role_admin",
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: [
      "vault:create",
      "vault:read",
      "vault:update",
      "vault:delete",
      "vault:manage_members",
      "memory:create",
      "memory:read",
      "memory:update",
      "memory:delete",
      "memory:approve",
      "user:read",
      "user:update",
      "user:delete",
      "admin:access",
      "admin:manage_users",
      "admin:manage_roles",
      "admin:system_settings",
    ],
    isSystem: true,
  },
  {
    id: "role_moderator",
    name: "Moderator",
    description: "Can moderate content and manage users",
    permissions: [
      "vault:read",
      "vault:update",
      "memory:create",
      "memory:read",
      "memory:update",
      "memory:delete",
      "memory:approve",
      "user:read",
    ],
    isSystem: true,
  },
  {
    id: "role_user",
    name: "User",
    description: "Standard user access",
    permissions: [
      "vault:create",
      "vault:read",
      "memory:create",
      "memory:read",
      "memory:update",
      "memory:delete",
      "user:read",
      "user:update",
    ],
    isSystem: true,
  },
  {
    id: "role_guest",
    name: "Guest",
    description: "Limited access for guests",
    permissions: ["vault:read", "memory:read"],
    isSystem: true,
  },
]

// Helper function to check if a user has a specific permission
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission)
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some((permission) => userPermissions.includes(permission))
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

// Get all available permissions
export function getAllPermissions(): Permission[] {
  return [
    "vault:create",
    "vault:read",
    "vault:update",
    "vault:delete",
    "vault:manage_members",
    "memory:create",
    "memory:read",
    "memory:update",
    "memory:delete",
    "memory:approve",
    "user:read",
    "user:update",
    "user:delete",
    "admin:access",
    "admin:manage_users",
    "admin:manage_roles",
    "admin:system_settings",
  ]
}

// Get permissions grouped by category
export function getPermissionsByCategory(): Record<string, Permission[]> {
  return {
    "Vault Permissions": ["vault:create", "vault:read", "vault:update", "vault:delete", "vault:manage_members"],
    "Memory Permissions": ["memory:create", "memory:read", "memory:update", "memory:delete", "memory:approve"],
    "User Permissions": ["user:read", "user:update", "user:delete"],
    "Admin Permissions": ["admin:access", "admin:manage_users", "admin:manage_roles", "admin:system_settings"],
  }
}

// Get a human-readable name for a permission
export function getPermissionName(permission: Permission): string {
  const permissionMap: Record<Permission, string> = {
    "vault:create": "Create Vaults",
    "vault:read": "View Vaults",
    "vault:update": "Edit Vaults",
    "vault:delete": "Delete Vaults",
    "vault:manage_members": "Manage Vault Members",

    "memory:create": "Create Memories",
    "memory:read": "View Memories",
    "memory:update": "Edit Memories",
    "memory:delete": "Delete Memories",
    "memory:approve": "Approve Memories",

    "user:read": "View User Profiles",
    "user:update": "Edit User Profiles",
    "user:delete": "Delete Users",

    "admin:access": "Access Admin Panel",
    "admin:manage_users": "Manage Users",
    "admin:manage_roles": "Manage Roles",
    "admin:system_settings": "Manage System Settings",
  }

  return permissionMap[permission] || permission
}

// Get a human-readable description for a permission
export function getPermissionDescription(permission: Permission): string {
  const descriptionMap: Record<Permission, string> = {
    "vault:create": "Ability to create new vaults",
    "vault:read": "Ability to view vaults",
    "vault:update": "Ability to edit vault details",
    "vault:delete": "Ability to delete vaults",
    "vault:manage_members": "Ability to add, remove, and manage vault members",

    "memory:create": "Ability to upload new memories",
    "memory:read": "Ability to view memories",
    "memory:update": "Ability to edit memory details",
    "memory:delete": "Ability to delete memories",
    "memory:approve": "Ability to approve or reject memories",

    "user:read": "Ability to view user profiles",
    "user:update": "Ability to edit user profiles",
    "user:delete": "Ability to delete user accounts",

    "admin:access": "Ability to access the admin panel",
    "admin:manage_users": "Ability to manage users and their roles",
    "admin:manage_roles": "Ability to create, edit, and delete roles",
    "admin:system_settings": "Ability to modify system settings",
  }

  return descriptionMap[permission] || "No description available"
}
