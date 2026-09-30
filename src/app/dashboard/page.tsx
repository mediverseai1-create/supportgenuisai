import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/topbar'
import { MessageSquare, Brain, TrendingUp, AlertTriangle, ChevronRight, Zap, Clock, ArrowUpRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: membership } = await supabase
    .from('organization_members').select('*, organizations(*)').eq('user_id', user.id).single()
  const org = (membership as any)?.organizations

  const [{ data: agents }, { data: conversations }, { data: activity }] = await Promise.all([
    supabase.from('agents').select('*').eq('organization_id', org?.id).order('created_at', { ascending: false }),
    supabase.from('conversations').select('*').eq('organization_id', org?.id).order('created_at', { ascending: false }).limit(6),
    supabase.from('activity_logs').select('*').eq('organization_id', org?.id).order('created_at', { ascending: false }).limit(8),
  ])

  const total = conversations?.length || 0
  const escalated = conversations?.filter(c => c.status === 'escalated').length || 0
  const resolved = conversations?.filter(c => c.status === 'resolved').length || 0
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const activeAgents = agents?.filter(a => a.status === 'active').length || 0

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#08080f]">
      <Topbar
        title="Overview"
        subtitle={org?.name}
        userEmail={user.email}
        userName={profile?.full_name || user.email}
      />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Welcome */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Good to see you, {firstName}.</h2>
              <p className="text-sm text-white/35 mt-1">Here&apos;s what your conversations are telling you.</p>
            </div>
            <Link href="/dashboard/agents" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors border border-violet-500/30 hover:border-violet-400/50 px-3 py-1.5 rounded-lg bg-violet-500/5">
              <Brain className="h-3.5 w-3.5" /> New agent
            </Link>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total conversations', value: total, icon: MessageSquare, color: 'violet', trend: null },
              { label: 'Resolution rate', value: `${resolutionRate}%`, icon: TrendingUp, color: 'emerald', trend: resolutionRate > 70 ? 'strong' : null },
              { label: 'Escalations', value: escalated, icon: AlertTriangle, color: escalated > 0 ? 'amber' : 'white', trend: null },
              { label: 'Active agents', value: activeAgents, icon: Brain, color: 'violet', trend: null },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 hover:border-violet-500/20 transition-colors">
                <div className={`flex items-center justify-between mb-4`}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">{item.label}</span>
                  <item.icon className={`h-3.5 w-3.5 ${item.color === 'violet' ? 'text-violet-400/60' : item.color === 'emerald' ? 'text-emerald-400/60' : item.color === 'amber' ? 'text-amber-400/60' : 'text-white/20'}`} />
                </div>
                <div className="text-3xl font-bold text-white tracking-tight">{item.value}</div>
                {item.trend === 'strong' && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" /> Above target
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent conversations */}
            <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-white">Recent conversations</h3>
                <Link href="/dashboard/conversations" className="text-xs text-violet-400/70 hover:text-violet-400 flex items-center gap-1">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {!conversations || conversations.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-5 w-5 text-violet-400/60" />
                  </div>
                  <p className="text-sm font-medium text-white/40 mb-1">No conversations yet</p>
                  <p className="text-xs text-white/25 mb-5">Deploy an agent to start receiving conversations.</p>
                  <Link href="/dashboard/agents" className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/5 hover:bg-violet-500/10 transition-colors">
                    <Brain className="h-3.5 w-3.5" /> Set up an agent
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {conversations.map(c => (
                    <Link key={c.id} href={`/dashboard/conversations/${c.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.025] transition-colors group">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${
                        c.status === 'active' ? 'bg-violet-400' :
                        c.status === 'escalated' ? 'bg-amber-400' :
                        c.status === 'resolved' ? 'bg-emerald-400' : 'bg-white/20'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors truncate">
                          {c.customer_name || c.customer_email || 'Anonymous visitor'}
                        </div>
                        <div className="text-xs text-white/30 mt-0.5 truncate">{c.intent || 'No intent extracted yet'}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          c.sentiment === 'positive' ? 'text-emerald-400 bg-emerald-500/10' :
                          c.sentiment === 'negative' ? 'text-red-400 bg-red-500/10' :
                          'text-white/30 bg-white/5'
                        }`}>
                          {c.sentiment || 'neutral'}
                        </div>
                        <div className="text-[10px] text-white/25 mt-1 flex items-center gap-1 justify-end">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Agents */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                  <h3 className="text-sm font-semibold text-white">AI Agents</h3>
                  <Link href="/dashboard/agents" className="text-xs text-violet-400/70 hover:text-violet-400 flex items-center gap-1">
                    Manage <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {!agents || agents.length === 0 ? (
                  <div className="py-10 text-center px-4">
                    <p className="text-xs text-white/30 mb-4">No agents built yet</p>
                    <Link href="/dashboard/agents" className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/5 hover:bg-violet-500/10 transition-colors">
                      <Brain className="h-3.5 w-3.5" /> Build your first agent
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {agents.slice(0, 4).map(agent => (
                      <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.025] transition-colors group">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${agent.status === 'active' ? 'bg-emerald-400' : agent.status === 'training' ? 'bg-amber-400 animate-pulse' : 'bg-white/20'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/65 group-hover:text-white/85 truncate">{agent.name}</div>
                        </div>
                        <div className="text-[10px] text-white/25 capitalize">{agent.status}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/30 mb-4">Quick actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Build an AI agent', href: '/dashboard/agents', icon: Brain },
                    { label: 'Add knowledge source', href: '/dashboard/knowledge', icon: Zap },
                    { label: 'Review conversations', href: '/dashboard/conversations', icon: MessageSquare },
                    { label: 'View analytics', href: '/dashboard/analytics', icon: TrendingUp },
                  ].map(action => (
                    <Link key={action.href} href={action.href} className="flex items-center gap-2.5 py-2 text-xs text-white/45 hover:text-white/80 transition-colors group">
                      <action.icon className="h-3.5 w-3.5 text-violet-500/50 group-hover:text-violet-400 transition-colors" />
                      {action.label}
                      <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity log */}
          {activity && activity.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-white">Activity</h3>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {activity.map(log => (
                  <div key={log.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500/40 shrink-0" />
                    <div className="text-xs text-white/45 flex-1">{log.action}</div>
                    <div className="text-[10px] text-white/20 shrink-0">
                      {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
