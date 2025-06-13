"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRBAC } from "@/components/rbac-provider"
import { useToast } from "@/components/ui/use-toast"
import type { Permission, Role } from "@/lib/rbac/types"
import { getPermissionsByCategory, getPermissionName, getPermissionDescription } from "@/lib/rbac/permissions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Plus, Shield, ShieldAlert, ShieldCheck, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function RolesManagement() {
  const { roles, createRole, updateRole, deleteRole } = useRBAC()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const permissionsByCategory = getPermissionsByCategory()

  // Handle role creation
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createRole({
        name: newRoleName,
        description: newRoleDescription,
        permissions: selectedPermissions,
      })

      // Reset form
      setNewRoleName("")
      setNewRoleDescription("")
      setSelectedPermissions([])
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle role update
  const handleUpdateRole = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
      await updateRole(selectedRole.id, {
        name: newRoleName,
        description: newRoleDescription,
        permissions: selectedPermissions,
      })

      // Reset form
      setNewRoleName("")
      setNewRoleDescription("")
      setSelectedPermissions([])
      setSelectedRole(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle role deletion
  const handleDeleteRole = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
      await deleteRole(selectedRole.id)

      // Reset form
      setSelectedRole(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open edit dialog with role data
  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setNewRoleName(role.name)
    setNewRoleDescription(role.description)
    setSelectedPermissions([...role.permissions])
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  // Open view permissions dialog
  const openViewPermissionsDialog = (role: Role) => {
    setSelectedRole(role)
    setIsViewPermissionsDialogOpen(true)
  }

  // Toggle permission selection
  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission)
      } else {
        return [...prev, permission]
      }
    })
  }

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (permissions: Permission[]) => {
    return permissions.every((permission) => selectedPermissions.includes(permission))
  }

  // Check if some permissions in a category are selected
  const isCategoryPartiallySelected = (permissions: Permission[]) => {
    return (
      permissions.some((permission) => selectedPermissions.includes(permission)) &&
      !permissions.every((permission) => selectedPermissions.includes(permission))
    )
  }

  // Toggle all permissions in a category
  const toggleCategory = (permissions: Permission[]) => {
    if (isCategoryFullySelected(permissions)) {
      // Remove all permissions in this category
      setSelectedPermissions((prev) => prev.filter((p) => !permissions.includes(p)))
    } else {
      // Add all permissions in this category
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev]
        permissions.forEach((permission) => {
          if (!newPermissions.includes(permission)) {
            newPermissions.push(permission)
          }
        })
        return newPermissions
      })
    }
  }

  // Get role icon based on role name
  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return <ShieldAlert className="h-4 w-4 mr-2" />
      case "moderator":
        return <ShieldCheck className="h-4 w-4 mr-2" />
      case "user":
        return <User className="h-4 w-4 mr-2" />
      default:
        return <Shield className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Manage roles and their permissions</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.name)}
                        <span className="font-medium">{role.name}</span>
                        {role.isSystem && (
                          <Badge variant="secondary" className="ml-2">
                            System
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{role.permissions.length}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewPermissionsDialog(role)}
                          className="h-7 px-2 text-xs"
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewPermissionsDialog(role)}>
                            View Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(role)} disabled={role.isSystem}>
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(role)}
                            disabled={role.isSystem}
                            className="text-destructive"
                          >
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Create a new role and assign permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g., Content Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Describe the purpose of this role"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={isCategoryFullySelected(permissions)}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = isCategoryPartiallySelected(permissions)
                            }
                          }}
                          onCheckedChange={() => toggleCategory(permissions)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-medium">
                          {category}
                        </Label>
                      </div>
                      <div className="ml-6 space-y-1">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <div>
                              <Label htmlFor={permission} className="text-sm">
                                {getPermissionName(permission)}
                              </Label>
                              <p className="text-xs text-muted-foreground">{getPermissionDescription(permission)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Modify role details and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input id="edit-role-name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-description">Description</Label>
              <Textarea
                id="edit-role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-category-${category}`}
                          checked={isCategoryFullySelected(permissions)}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = isCategoryPartiallySelected(permissions)
                            }
                          }}
                          onCheckedChange={() => toggleCategory(permissions)}
                        />
                        <Label htmlFor={`edit-category-${category}`} className="text-sm font-medium">
                          {category}
                        </Label>
                      </div>
                      <div className="ml-6 space-y-1">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${permission}`}
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <div>
                              <Label htmlFor={`edit-${permission}`} className="text-sm">
                                {getPermissionName(permission)}
                              </Label>
                              <p className="text-xs text-muted-foreground">{getPermissionDescription(permission)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRole && (
              <div className="flex items-center gap-2 p-4 border rounded-md">
                {getRoleIcon(selectedRole.name)}
                <div>
                  <p className="font-medium">{selectedRole.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog open={isViewPermissionsDialogOpen} onOpenChange={setIsViewPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Role Permissions</DialogTitle>
            <DialogDescription>
              {selectedRole ? `Permissions for ${selectedRole.name} role` : "Role permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRole && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getRoleIcon(selectedRole.name)}
                  <div>
                    <p className="font-medium">{selectedRole.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                  </div>
                </div>

                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-6">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                      // Filter permissions that this role has
                      const rolePermissions = permissions.filter((p) => selectedRole.permissions.includes(p))

                      // Skip categories where the role has no permissions
                      if (rolePermissions.length === 0) return null

                      return (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium">{category}</h4>
                          <div className="ml-4 space-y-1">
                            {rolePermissions.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Badge variant="outline" className="h-6">
                                  {getPermissionName(permission)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewPermissionsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
