'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Brain, BarChart3,
  Settings, Users, Zap, BookOpen, ChevronRight
} from 'lucide-react'

const nav = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Brain },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Testing', href: '/dashboard/testing', icon: Zap },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  orgName?: string
  plan?: string
  userEmail?: string
  userName?: string
}

export default function Sidebar({ orgName, plan, userEmail, userName }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')
  }

  const planLabel = plan === 'pro' ? 'Business' : plan === 'starter' ? 'Professional' : 'Free'
  const planColor = plan === 'pro' ? 'text-violet-300 bg-violet-500/15 border-violet-500/30' :
                    plan === 'starter' ? 'text-purple-300 bg-purple-500/10 border-purple-500/25' :
                    'text-white/40 bg-white/5 border-white/10'

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-[#08080f] border-r border-white/[0.06] overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/60">
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
              <path d="M4 5h8M4 9h6M13 14a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.5 16.5l-1.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">SupportGenius</span>
        </Link>
      </div>

      {/* Org + plan */}
      <div className="px-4 py-4 border-b border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{orgName || 'Your workspace'}</div>
            <div className="text-[10px] text-white/35 mt-0.5">Workspace</div>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${planColor}`}>{planLabel}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(item => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                active
                  ? 'bg-violet-600/15 text-white border border-violet-500/25'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-violet-400' : 'text-white/30 group-hover:text-white/55'}`} />
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="h-3 w-3 ml-auto text-violet-400/60" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
            {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-white/70 truncate">{userName || 'User'}</div>
            <div className="text-[10px] text-white/30 truncate">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
