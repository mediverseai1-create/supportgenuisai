'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime, formatDuration } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Topbar } from '@/components/layout/topbar'
import { MessageSquare, Mic, Phone, Search, Filter, User, Clock, Bot, ArrowRight } from 'lucide-react'

export default function ConversationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).single()
      if (!membership) return

      const [convRes, agentRes] = await Promise.all([
        supabase.from('conversations').select('*, agents(name)').eq('organization_id', membership.organization_id).order('created_at', { ascending: false }).limit(200),
        supabase.from('agents').select('id, name').eq('organization_id', membership.organization_id),
      ])

      setConversations(convRes.data || [])
      setFiltered(convRes.data || [])
      setAgents(agentRes.data || [])
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    let result = conversations
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.customer_name?.toLowerCase().includes(q) ||
        c.customer_email?.toLowerCase().includes(q) ||
        c.intent?.toLowerCase().includes(q) ||
        c.summary?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter)
    if (channelFilter !== 'all') result = result.filter(c => c.channel === channelFilter)
    setFiltered(result)
  }, [search, statusFilter, channelFilter, conversations])

  const statusVariant = (s: string) => {
    switch (s) {
      case 'active': return 'success'
      case 'escalated': return 'warning'
      case 'resolved': return 'secondary'
      case 'abandoned': return 'outline'
      default: return 'outline'
    }
  }

  const sentimentColor = (s: string | null) => {
    switch (s) {
      case 'positive': return 'text-emerald-600'
      case 'negative': return 'text-red-600'
      default: return 'text-neutral-400'
    }
  }

  const channelIcon = (c: string) => {
    switch (c) {
      case 'voice': return <Mic className="h-3.5 w-3.5" />
      case 'widget': return <MessageSquare className="h-3.5 w-3.5" />
      default: return <Phone className="h-3.5 w-3.5" />
    }
  }

  const counts = {
    all: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    escalated: conversations.filter(c => c.status === 'escalated').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Conversations" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Filters bar */}
        <div className="border-b border-neutral-100 bg-white px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48 max-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-8 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1 rounded-lg border border-neutral-200 p-0.5 text-xs">
            {(['all', 'active', 'escalated', 'resolved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${statusFilter === s ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1 text-neutral-400">({counts[s]})</span>
              </button>
            ))}
          </div>

          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
              <SelectItem value="widget">Widget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 bg-neutral-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <MessageSquare className="h-12 w-12 text-neutral-200 mb-4" />
              <h3 className="text-base font-semibold text-neutral-900 mb-1">No conversations found</h3>
              <p className="text-sm text-neutral-500">
                {conversations.length === 0 ? 'Conversations will appear here once customers speak with your agent.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {/* Header */}
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-2 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider sticky top-0">
                <div className="w-2" />
                <div>Customer</div>
                <div className="w-24">Intent</div>
                <div className="w-20">Channel</div>
                <div className="w-20">Status</div>
                <div className="w-20">Time</div>
              </div>

              {filtered.map(conv => (
                <Link
                  key={conv.id}
                  href={`/dashboard/conversations/${conv.id}`}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3.5 items-center hover:bg-neutral-50 transition-colors group"
                >
                  {/* Status dot */}
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    conv.status === 'active' ? 'bg-emerald-500' :
                    conv.status === 'escalated' ? 'bg-amber-500' :
                    conv.status === 'resolved' ? 'bg-neutral-300' :
                    'bg-neutral-200'
                  }`} />

                  {/* Customer */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-neutral-500">
                        {(conv.customer_name || conv.customer_email || 'A')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-neutral-900 truncate">
                          {conv.customer_name || conv.customer_email || 'Anonymous customer'}
                        </div>
                        {conv.summary && (
                          <div className="text-xs text-neutral-500 truncate">{conv.summary}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Intent */}
                  <div className="w-24">
                    <span className="text-xs text-neutral-600 truncate block">{conv.intent || '—'}</span>
                  </div>

                  {/* Channel */}
                  <div className="w-20">
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      {channelIcon(conv.channel)}
                      <span className="capitalize">{conv.channel}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-20">
                    <Badge variant={statusVariant(conv.status) as any}>{conv.status}</Badge>
                  </div>

                  {/* Time */}
                  <div className="w-20 text-xs text-neutral-400">
                    <div>{formatRelativeTime(conv.created_at)}</div>
                    {conv.duration_seconds && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDuration(conv.duration_seconds)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
