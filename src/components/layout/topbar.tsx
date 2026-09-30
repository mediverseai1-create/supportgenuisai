'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, Settings, User, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface TopbarProps {
  title: string
  subtitle?: string
  userEmail?: string
  userName?: string
}

export default function Topbar({ title, subtitle, userEmail, userName }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#08080f]/95 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h1 className="text-[15px] font-semibold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-colors relative">
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-300">
              {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs text-white/60 hidden sm:block max-w-[100px] truncate">{userName || userEmail}</span>
            <ChevronDown className="h-3 w-3 text-white/30" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-white/10 bg-[#0d0d1a] shadow-2xl shadow-black/60 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="text-xs font-medium text-white truncate">{userName || 'User'}</div>
                  <div className="text-[10px] text-white/35 truncate mt-0.5">{userEmail}</div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setOpen(false); router.push('/dashboard/settings') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <Settings className="h-3.5 w-3.5" /> Settings
                  </button>
                  <button
                    onClick={() => { setOpen(false); router.push('/dashboard/settings') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <User className="h-3.5 w-3.5" /> Profile
                  </button>
                  <div className="border-t border-white/[0.05] my-1.5" />
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
