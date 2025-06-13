"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRBAC } from "@/components/rbac-provider"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/types"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, UserIcon, Shield, ShieldAlert, ShieldCheck } from "lucide-react"

export default function UsersManagement() {
  const { roles, assignRoleToUser, removeRoleFromUser } = useRBAC()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }

    const storedUserRoles = localStorage.getItem("userRoles")
    if (storedUserRoles) {
      setUserRoles(JSON.parse(storedUserRoles))
    }

    setIsLoading(false)
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
  })

  // Get role names for a user
  const getUserRoleNames = (userId: string) => {
    const userRoleIds = userRoles[userId] || []
    return userRoleIds.map((roleId) => {
      const role = roles.find((r) => r.id === roleId)
      return role ? role.name : roleId
    })
  }

  // Check if user has a specific role
  const userHasRole = (userId: string, roleId: string) => {
    const userRoleIds = userRoles[userId] || []
    return userRoleIds.includes(roleId)
  }

  // Handle role assignment
  const handleRoleChange = async (userId: string, roleId: string, hasRole: boolean) => {
    try {
      if (hasRole) {
        await removeRoleFromUser(userId, roleId)
      } else {
        await assignRoleToUser(userId, roleId)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  // Get role badge variant based on role name
  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return "destructive"
      case "moderator":
        return "warning"
      case "user":
        return "default"
      case "guest":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get role icon based on role name
  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return <ShieldAlert className="h-3 w-3 mr-1" />
      case "moderator":
        return <ShieldCheck className="h-3 w-3 mr-1" />
      case "user":
        return <UserIcon className="h-3 w-3 mr-1" />
      default:
        return <Shield className="h-3 w-3 mr-1" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>Manage users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.profilePicture ? (
                                <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                              ) : null}
                              <AvatarFallback className="text-xs">
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getUserRoleNames(user.id).map((roleName, index) => (
                              <Badge key={index} variant={getRoleBadgeVariant(roleName)} className="flex items-center">
                                {getRoleIcon(roleName)}
                                {roleName}
                              </Badge>
                            ))}
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsRoleDialogOpen(true)
                                }}
                              >
                                Manage Roles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Assign or remove roles for ${selectedUser.name}` : "Select roles for this user"}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  {selectedUser.profilePicture ? (
                    <AvatarImage src={selectedUser.profilePicture || "/placeholder.svg"} alt={selectedUser.name} />
                  ) : null}
                  <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium flex items-center">
                        {getRoleIcon(role.name)}
                        {role.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                    <Button
                      variant={userHasRole(selectedUser.id, role.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoleChange(selectedUser.id, role.id, userHasRole(selectedUser.id, role.id))}
                    >
                      {userHasRole(selectedUser.id, role.id) ? "Remove" : "Assign"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
