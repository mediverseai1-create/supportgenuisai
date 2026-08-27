'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

interface TopbarProps {
  title: string
  userName: string
  userEmail: string
}

export function Topbar({ title, userName, userEmail }: TopbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-neutral-100 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-neutral-900">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
          <Bell className="h-4 w-4 text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#4f46e5]" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-100 transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-[#4f46e5] text-white">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">{userName.split(' ')[0]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="text-xs font-semibold text-neutral-900">{userName}</div>
              <div className="text-xs text-neutral-500 truncate">{userEmail}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
