export type Permission =
  // Vault permissions
  | "vault:create"
  | "vault:read"
  | "vault:update"
  | "vault:delete"
  | "vault:manage_members"

  // Memory permissions
  | "memory:create"
  | "memory:read"
  | "memory:update"
  | "memory:delete"
  | "memory:approve"

  // User permissions
  | "user:read"
  | "user:update"
  | "user:delete"

  // Admin permissions
  | "admin:access"
  | "admin:manage_users"
  | "admin:manage_roles"
  | "admin:system_settings"

export type Role = {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem?: boolean // System roles cannot be modified or deleted
}

export type UserRole = {
  userId: string
  roleId: string
  assignedAt: string
  assignedBy: string
}
