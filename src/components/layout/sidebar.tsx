'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Bot, BookOpen, MessageSquare, BarChart3,
  FlaskConical, Users, Settings, Zap, HelpCircle, Bell, ChevronsUpDown
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Testing Lab', href: '/dashboard/testing', icon: FlaskConical },
]

const secondaryItems = [
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  orgName: string
  userName: string
  userEmail: string
  plan: string
}

export function Sidebar({ orgName, userName, userEmail, plan }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col bg-[#1a1a2e] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
        <div className="h-7 w-7 rounded-lg bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
            <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
            <rect x="3" y="14" width="6" height="2" rx="1" fill="white"/>
            <circle cx="18" cy="16" r="4" fill="white"/>
            <path d="M16.5 16l1 1 2-2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-white truncate">Support Genius</div>
          <div className="text-[10px] text-neutral-500 truncate">{orgName}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 mb-1 px-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">Management</span>
        </div>
        <div className="space-y-0.5">
          {secondaryItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Plan badge */}
      <div className="px-3 pb-2">
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white capitalize">{plan} Plan</span>
            {plan === 'free' && (
              <Link href="/dashboard/settings?tab=billing" className="text-[10px] font-semibold text-[#4f46e5] hover:underline">
                Upgrade
              </Link>
            )}
          </div>
          {plan === 'free' && (
            <div className="text-[10px] text-neutral-500 leading-tight">
              Upgrade for more agents, conversations, and advanced features.
            </div>
          )}
          {plan !== 'free' && (
            <div className="text-[10px] text-neutral-500 leading-tight">
              All features included. Manage in Settings → Billing.
            </div>
          )}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-white/5 p-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors">
          <div className="h-7 w-7 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs font-medium text-white truncate">{userName}</div>
            <div className="text-[10px] text-neutral-500 truncate">{userEmail}</div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-neutral-600 flex-shrink-0" />
        </button>
      </div>
    </aside>
  )
}
