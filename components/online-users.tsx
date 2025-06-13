"use client"

import { useRealtime } from "./realtime-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "./auth-provider"

export default function OnlineUsers({ vaultId }: { vaultId: string }) {
  const { onlineUsers } = useRealtime()
  const { user } = useAuth()

  const vaultOnlineUsers = onlineUsers[vaultId] || []

  // Don't show if there are no other users online
  if (vaultOnlineUsers.length <= 1 && vaultOnlineUsers.some((u) => u.id === user?.id)) {
    return null
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      <TooltipProvider>
        {vaultOnlineUsers.map((onlineUser) => (
          <Tooltip key={onlineUser.id}>
            <TooltipTrigger asChild>
              <Avatar
                className={`border-2 border-background ${onlineUser.id === user?.id ? "ring-2 ring-green-500" : ""}`}
              >
                <AvatarFallback className="bg-rose-100 text-rose-800">
                  {onlineUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {onlineUser.name} {onlineUser.id === user?.id ? "(You)" : ""}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
