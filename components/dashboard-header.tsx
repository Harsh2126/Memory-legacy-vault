"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, Plus, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Heart className="h-6 w-6 text-rose-500" />
                  <span className="text-xl font-bold">Legacy</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => setIsOpen(false)}
                  >
                    My Vaults
                  </Link>
                  <Link
                    href="/dashboard/create-vault"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Vault
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Legacy</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            My Vaults
          </Link>
          <Link href="/dashboard/create-vault" className="text-sm font-medium hover:underline underline-offset-4">
            Create Vault
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/create-vault">
            <Button size="sm" className="hidden md:flex">
              <Plus className="mr-2 h-4 w-4" />
              New Vault
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
