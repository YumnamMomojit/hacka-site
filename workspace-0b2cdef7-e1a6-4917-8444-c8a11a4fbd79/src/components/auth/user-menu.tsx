'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/auth-context'
import { AuthModal } from './auth-modal'
import { User, Settings, LogOut, Wallet, Trophy } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  if (!isAuthenticated || !user) {
    return (
      <AuthModal>
        <Button size="sm">
          Sign In
        </Button>
      </AuthModal>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-red-500'
      case 'ADMIN':
        return 'bg-orange-500'
      case 'ORGANIZER':
        return 'bg-blue-500'
      case 'JUDGE':
        return 'bg-purple-500'
      case 'MENTOR':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Administrator'
      case 'ORGANIZER':
        return 'Organizer'
      case 'JUDGE':
        return 'Judge'
      case 'MENTOR':
        return 'Mentor'
      case 'PARTICIPANT':
        return 'Participant'
      default:
        return role
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name || 'User'} />
            <AvatarFallback>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {user.name || 'Anonymous User'}
              </p>
              <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
            {user.walletAddress && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.walletAddress.substr(0, 6)}...{user.walletAddress.substr(-4)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-hackathons">
            <Trophy className="mr-2 h-4 w-4" />
            <span>My Hackathons</span>
          </Link>
        </DropdownMenuItem>
        {user.walletAddress && (
          <DropdownMenuItem asChild>
            <Link href="/wallet">
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}