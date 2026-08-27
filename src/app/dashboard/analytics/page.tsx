'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, MessageSquare, CheckCircle, Clock, AlertTriangle, Brain, Mic } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns'

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).single()
      if (!membership) return

      await fetchData(membership.organization_id, parseInt(period))
    }
    init()
  }, [])

  async function fetchData(orgId: string, days: number) {
    setLoading(true)
    const since = subDays(new Date(), days).toISOString()
    const { data } = await supabase.from('conversations').select('*').eq('organization_id', orgId).gte('created_at', since)
    setConversations(data || [])
    setLoading(false)
  }

  // Compute analytics
  const total = conversations.length
  const resolved = conversations.filter(c => c.status === 'resolved').length
  const escalated = conversations.filter(c => c.status === 'escalated').length
  const voice = conversations.filter(c => c.channel === 'voice').length
  const widget = conversations.filter(c => c.channel === 'widget').length
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const escalationRate = total > 0 ? Math.round((escalated / total) * 100) : 0
  const avgDuration = conversations.filter(c => c.duration_seconds).reduce((acc, c) => acc + (c.duration_seconds || 0), 0) / (conversations.filter(c => c.duration_seconds).length || 1)
  const positive = conversations.filter(c => c.sentiment === 'positive').length
  const negative = conversations.filter(c => c.sentiment === 'negative').length
  const satisfactionRate = total > 0 ? Math.round((positive / (positive + negative || 1)) * 100) : 0

  // Volume by day
  const days = parseInt(period)
  const dateRange = eachDayOfInterval({ start: subDays(new Date(), days - 1), end: new Date() })
  const volumeData = dateRange.map(date => {
    const dayStr = format(date, 'yyyy-MM-dd')
    const dayConvs = conversations.filter(c => c.created_at.startsWith(dayStr))
    return {
      date: format(date, 'MMM d'),
      total: dayConvs.length,
      resolved: dayConvs.filter(c => c.status === 'resolved').length,
      escalated: dayConvs.filter(c => c.status === 'escalated').length,
    }
  })

  // Intent breakdown
  const intentCounts: Record<string, number> = {}
  conversations.forEach(c => {
    if (c.intent) {
      intentCounts[c.intent] = (intentCounts[c.intent] || 0) + 1
    }
  })
  const intentData = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  // Channel distribution
  const channelData = [
    { name: 'Voice', value: voice, color: '#4f46e5' },
    { name: 'Widget', value: widget, color: '#10b981' },
  ].filter(c => c.value > 0)

  // Sentiment distribution
  const sentimentData = [
    { name: 'Positive', value: positive, color: '#10b981' },
    { name: 'Neutral', value: total - positive - negative, color: '#94a3b8' },
    { name: 'Negative', value: negative, color: '#ef4444' },
  ].filter(c => c.value > 0)

  const statCards = [
    {
      label: 'Total Conversations',
      value: total.toLocaleString(),
      sub: `in last ${period} days`,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: null,
    },
    {
      label: 'AI Resolution Rate',
      value: `${resolutionRate}%`,
      sub: `${resolved} resolved automatically`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: resolutionRate >= 80 ? 'up' : 'down',
    },
    {
      label: 'Escalation Rate',
      value: `${escalationRate}%`,
      sub: `${escalated} required humans`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: escalationRate <= 10 ? 'up' : 'down',
    },
    {
      label: 'Customer Satisfaction',
      value: `${satisfactionRate}%`,
      sub: `${positive} positive · ${negative} negative`,
      icon: Brain,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      trend: satisfactionRate >= 75 ? 'up' : 'down',
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Period selector */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">{total} conversations analyzed</p>
          <Select value={period} onValueChange={v => { setPeriod(v) }}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  {s.trend && (
                    s.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )
                  )}
                </div>
                <div className="text-2xl font-bold text-neutral-900 mb-0.5">{s.value}</div>
                <div className="text-xs text-neutral-500">{s.label}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{s.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Volume chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Volume</CardTitle>
            <CardDescription>Daily breakdown — resolved vs. escalated</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 bg-neutral-50 rounded animate-pulse" />
            ) : total === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-neutral-400">No data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={volumeData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="resolved" fill="#4f46e5" name="Resolved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="escalated" fill="#f59e0b" name="Escalated" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Top intents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Customer Intents</CardTitle>
              <CardDescription>Most common reasons customers contact support</CardDescription>
            </CardHeader>
            <CardContent>
              {intentData.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-400">No intent data yet</div>
              ) : (
                <div className="space-y-3">
                  {intentData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-4 text-xs text-neutral-400 font-mono">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-neutral-800 truncate">{item.name}</span>
                          <span className="text-xs text-neutral-500 ml-2">{item.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#4f46e5]"
                            style={{ width: `${(item.value / (intentData[0]?.value || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-neutral-400 w-10 text-right">
                        {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Channel breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Channels</CardTitle>
              </CardHeader>
              <CardContent>
                {channelData.length === 0 ? (
                  <div className="py-4 text-center text-sm text-neutral-400">No data</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie data={channelData} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                          {channelData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                      {channelData.map(c => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                            <span className="text-neutral-700">{c.name}</span>
                          </div>
                          <span className="font-medium text-neutral-900">{total > 0 ? Math.round((c.value / total) * 100) : 0}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Sentiment */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Customer Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                {sentimentData.length === 0 ? (
                  <div className="py-4 text-center text-sm text-neutral-400">No data</div>
                ) : (
                  <div className="space-y-2">
                    {sentimentData.map(s => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-neutral-600">{s.name}</span>
                            <span className="font-medium">{s.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-neutral-100">
                            <div className="h-full rounded-full" style={{ background: s.color, width: `${total > 0 ? (s.value / total) * 100 : 0}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#4f46e5]" /> Support Intelligence
            </CardTitle>
            <CardDescription>Automatically identified patterns and opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: CheckCircle,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  title: 'AI performing well',
                  desc: resolutionRate >= 70 ? `${resolutionRate}% resolution rate — your agent is handling the majority of conversations independently.` : 'Resolution rate below 70%. Consider adding more knowledge sources to improve AI accuracy.',
                },
                {
                  icon: AlertTriangle,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                  title: escalationRate > 15 ? 'High escalation rate' : 'Escalation rate normal',
                  desc: escalationRate > 15 ? `${escalationRate}% of conversations escalate to humans. Review your escalation rules and improve agent knowledge.` : `${escalationRate}% escalation rate is within the healthy range.`,
                },
                {
                  icon: MessageSquare,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  title: 'Top opportunity',
                  desc: intentData[0] ? `"${intentData[0].name}" is your most common intent (${intentData[0].value} conversations). Ensure your agent has detailed knowledge about this topic.` : 'Add knowledge sources to start seeing intent patterns.',
                },
                {
                  icon: Brain,
                  color: 'text-violet-600',
                  bg: 'bg-violet-50',
                  title: 'Sentiment trend',
                  desc: satisfactionRate >= 75 ? `${satisfactionRate}% positive sentiment — customers are responding well to your AI agent.` : `Satisfaction at ${satisfactionRate}%. Review negative conversations to identify knowledge gaps.`,
                },
              ].map(insight => (
                <div key={insight.title} className="flex gap-3 rounded-xl border border-neutral-100 p-4">
                  <div className={`h-8 w-8 rounded-lg ${insight.bg} flex items-center justify-center flex-shrink-0`}>
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 mb-0.5">{insight.title}</div>
                    <div className="text-xs text-neutral-500 leading-relaxed">{insight.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
