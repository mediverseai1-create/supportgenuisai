import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import {
  MessageSquare, Bot, CheckCircle, AlertTriangle, TrendingUp,
  ArrowRight, Clock, Mic, BarChart3, Zap, Plus
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: membership } = await supabase.from('organization_members').select('*, organizations(*)').eq('user_id', user.id).single()
  const org = (membership as any)?.organizations

  if (!org) redirect('/onboarding')

  // Fetch data in parallel
  const [agentsRes, conversationsRes, activityRes] = await Promise.all([
    supabase.from('agents').select('*').eq('organization_id', org.id).order('created_at', { ascending: false }),
    supabase.from('conversations').select('*').eq('organization_id', org.id).order('created_at', { ascending: false }).limit(50),
    supabase.from('activity_logs').select('*, profiles(full_name)').eq('organization_id', org.id).order('created_at', { ascending: false }).limit(10),
  ])

  const agents = agentsRes.data || []
  const conversations = conversationsRes.data || []
  const activities = activityRes.data || []

  // Compute stats
  const totalConversations = conversations.length
  const resolved = conversations.filter(c => c.status === 'resolved').length
  const escalated = conversations.filter(c => c.status === 'escalated').length
  const active = conversations.filter(c => c.status === 'active').length
  const resolutionRate = totalConversations > 0 ? Math.round((resolved / totalConversations) * 100) : 0
  const activeAgents = agents.filter(a => a.status === 'active').length

  const userName = profile?.full_name || user.email || 'User'

  const statCards = [
    {
      label: 'Total Conversations',
      value: totalConversations.toLocaleString(),
      sub: `${active} active now`,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'AI Resolution Rate',
      value: `${resolutionRate}%`,
      sub: `${resolved} resolved automatically`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Escalated to Humans',
      value: escalated.toLocaleString(),
      sub: `${totalConversations > 0 ? Math.round((escalated / totalConversations) * 100) : 0}% of conversations`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Active Agents',
      value: activeAgents.toString(),
      sub: `${agents.length} agents total`,
      icon: Bot,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ]

  const actionItems = [
    ...(!agents.length ? [{ text: 'Create your first AI agent', href: '/dashboard/agents', icon: Bot, priority: 'high' }] : []),
    ...(agents.length && !agents.some(a => a.is_published) ? [{ text: 'Publish your agent to start receiving conversations', href: '/dashboard/agents', icon: Zap, priority: 'high' }] : []),
    ...(!conversations.length ? [{ text: 'Test your agent in the Testing Lab', href: '/dashboard/testing', icon: BarChart3, priority: 'medium' }] : []),
    ...(escalated > 3 ? [{ text: `${escalated} conversations need human attention`, href: '/dashboard/conversations?status=escalated', icon: AlertTriangle, priority: 'high' }] : []),
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Overview" userName={userName} userEmail={user.email || ''} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userName.split(' ')[0]}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">{org.name} · {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)} Plan</p>
          </div>
          <Link href="/dashboard/agents">
            <Button variant="brand" size="sm">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          </Link>
        </div>

        {/* Action items */}
        {actionItems.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">Action needed</span>
            </div>
            <div className="space-y-2">
              {actionItems.map((item, i) => (
                <Link key={i} href={item.href} className="flex items-center gap-2.5 rounded-lg bg-white border border-amber-100 px-3 py-2 hover:border-amber-200 transition-colors">
                  <item.icon className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 flex-1">{item.text}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-neutral-400 mt-1">{s.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Agents */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>AI Agents</CardTitle>
                <Link href="/dashboard/agents" className="text-xs text-[#4f46e5] hover:underline">Manage</Link>
              </div>
            </CardHeader>
            <CardContent>
              {agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 mb-4">No agents yet</p>
                  <Link href="/dashboard/agents">
                    <Button variant="brand" size="sm">
                      <Plus className="h-3.5 w-3.5" />
                      Create First Agent
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {agents.slice(0, 4).map(agent => (
                    <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-neutral-50 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-[#4f46e5]/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-[#4f46e5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 truncate">{agent.name}</div>
                        <div className="text-xs text-neutral-500">{agent.voice_enabled ? 'Voice + Chat' : 'Chat only'}</div>
                      </div>
                      <Badge variant={
                        agent.status === 'active' ? 'success' :
                        agent.status === 'training' ? 'warning' :
                        'secondary'
                      }>
                        {agent.status}
                      </Badge>
                    </Link>
                  ))}
                  {agents.length > 4 && (
                    <Link href="/dashboard/agents" className="block text-center text-xs text-[#4f46e5] hover:underline py-1">
                      View all {agents.length} agents
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent conversations */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Conversations</CardTitle>
                <Link href="/dashboard/conversations" className="text-xs text-[#4f46e5] hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 mb-1">No conversations yet</p>
                  <p className="text-xs text-neutral-400">Once customers speak with your agent, conversations appear here.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.slice(0, 6).map(conv => (
                    <Link key={conv.id} href={`/dashboard/conversations/${conv.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-50 transition-colors">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        conv.status === 'active' ? 'bg-emerald-500' :
                        conv.status === 'escalated' ? 'bg-amber-500' :
                        conv.status === 'resolved' ? 'bg-neutral-300' :
                        'bg-neutral-200'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 truncate">
                          {conv.customer_name || conv.customer_email || 'Anonymous customer'}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">{conv.intent || 'No intent detected'}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant={
                          conv.status === 'active' ? 'success' :
                          conv.status === 'escalated' ? 'warning' :
                          conv.status === 'resolved' ? 'secondary' :
                          'outline'
                        }>
                          {conv.status}
                        </Badge>
                        <div className="text-xs text-neutral-400 mt-0.5">{formatRelativeTime(conv.created_at)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity log */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {activities.map((act: any) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-[#4f46e5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-neutral-700">
                        <span className="font-medium">{act.profiles?.full_name || 'System'}</span>{' '}
                        {act.action.replace(/_/g, ' ')}
                        {act.details?.name && <span className="font-medium"> "{act.details.name}"</span>}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">{formatRelativeTime(act.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
