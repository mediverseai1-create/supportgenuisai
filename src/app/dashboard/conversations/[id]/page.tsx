'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime, formatDate, formatDuration } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Topbar } from '@/components/layout/topbar'
import { ArrowLeft, Bot, User, Clock, Mic, MessageSquare, AlertTriangle, CheckCircle, Brain } from 'lucide-react'
import { toast } from 'sonner'

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [conv, setConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [summarizing, setSummarizing] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const [convRes, msgRes] = await Promise.all([
        supabase.from('conversations').select('*, agents(name, slug)').eq('id', id).single(),
        supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true }),
      ])

      setConv(convRes.data)
      setMessages(msgRes.data || [])
      setLoading(false)
    }
    init()
  }, [id])

  async function generateSummary() {
    setSummarizing(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id }),
      })
      const data = await res.json()
      if (data.summary) {
        setConv((p: any) => ({ ...p, summary: data.summary, intent: data.intent, sentiment: data.sentiment }))
        toast.success('Summary generated')
      }
    } catch {
      toast.error('Failed to generate summary')
    }
    setSummarizing(false)
  }

  async function markResolved() {
    await supabase.from('conversations').update({ status: 'resolved', ended_at: new Date().toISOString() }).eq('id', id)
    setConv((p: any) => ({ ...p, status: 'resolved' }))
    toast.success('Conversation marked as resolved')
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-14 border-b bg-white flex items-center px-6">
          <div className="h-5 w-48 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-neutral-400">Loading conversation...</div>
        </div>
      </div>
    )
  }

  if (!conv) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-neutral-500 mb-4">Conversation not found</p>
        <Link href="/dashboard/conversations"><Button variant="outline">Back</Button></Link>
      </div>
    )
  }

  const statusVariant = (s: string) => {
    switch (s) {
      case 'active': return 'success'
      case 'escalated': return 'warning'
      case 'resolved': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Conversation" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="border-b border-neutral-100 bg-white px-6 py-2 flex items-center gap-3">
        <Link href="/dashboard/conversations">
          <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4" /> Conversations
          </button>
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-sm font-medium text-neutral-700 truncate">{conv.customer_name || conv.customer_email || 'Anonymous'}</span>
        <Badge variant={statusVariant(conv.status) as any}>{conv.status}</Badge>
      </div>

      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-neutral-100">
          <div className="border-b border-neutral-100 px-4 py-3 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              {conv.channel === 'voice' ? <Mic className="h-4 w-4 text-neutral-400" /> : <MessageSquare className="h-4 w-4 text-neutral-400" />}
              <span className="text-sm font-medium capitalize">{conv.channel} conversation</span>
              <span className="text-xs text-neutral-400">· {messages.length} messages</span>
            </div>
            {conv.status !== 'resolved' && (
              <Button variant="secondary" size="sm" onClick={markResolved}>
                <CheckCircle className="h-3.5 w-3.5" /> Mark resolved
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-neutral-400 py-10">No messages in this conversation</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'customer' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'customer' ? 'bg-neutral-200' :
                    msg.role === 'agent' ? 'bg-[#4f46e5]' :
                    'bg-neutral-100'
                  }`}>
                    {msg.role === 'customer' ? (
                      <User className="h-3.5 w-3.5 text-neutral-600" />
                    ) : msg.role === 'agent' ? (
                      <Bot className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-neutral-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'customer' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'customer' ? 'bg-neutral-100 text-neutral-900 rounded-tr-sm' :
                      msg.role === 'agent' ? 'bg-[#4f46e5] text-white rounded-tl-sm' :
                      'bg-neutral-50 text-neutral-500 text-xs italic border border-neutral-100'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                      {formatRelativeTime(msg.created_at)}
                      {msg.confidence && <span>· {Math.round(msg.confidence * 100)}% confidence</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto p-4 space-y-4">
          {/* Customer info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600">
                  {(conv.customer_name || conv.customer_email || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">{conv.customer_name || 'Anonymous'}</div>
                  {conv.customer_email && <div className="text-xs text-neutral-500">{conv.customer_email}</div>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Agent</dt>
                  <dd className="font-medium text-neutral-900">{conv.agents?.name || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Channel</dt>
                  <dd className="font-medium text-neutral-900 capitalize">{conv.channel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Started</dt>
                  <dd className="font-medium text-neutral-900">{formatRelativeTime(conv.created_at)}</dd>
                </div>
                {conv.duration_seconds && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Duration</dt>
                    <dd className="font-medium text-neutral-900">{formatDuration(conv.duration_seconds)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Messages</dt>
                  <dd className="font-medium text-neutral-900">{messages.length}</dd>
                </div>
                {conv.sentiment && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Sentiment</dt>
                    <dd className={`font-medium capitalize ${conv.sentiment === 'positive' ? 'text-emerald-600' : conv.sentiment === 'negative' ? 'text-red-600' : 'text-neutral-600'}`}>{conv.sentiment}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-[#4f46e5]" /> AI Summary
                </CardTitle>
                <button
                  onClick={generateSummary}
                  disabled={summarizing || messages.length === 0}
                  className="text-xs text-[#4f46e5] hover:opacity-70 disabled:opacity-40"
                >
                  {summarizing ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {conv.intent && (
                <div className="mb-2">
                  <div className="text-xs text-neutral-500 mb-0.5">Intent</div>
                  <div className="text-xs font-medium text-neutral-900">{conv.intent}</div>
                </div>
              )}
              {conv.summary ? (
                <p className="text-xs text-neutral-600 leading-relaxed">{conv.summary}</p>
              ) : (
                <p className="text-xs text-neutral-400 italic">Click &quot;Generate&quot; to create an AI summary of this conversation.</p>
              )}
              {conv.resolution && (
                <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-100 p-2">
                  <div className="text-xs text-emerald-700 font-medium mb-0.5">Resolution</div>
                  <div className="text-xs text-emerald-600">{conv.resolution}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {conv.status === 'escalated' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 text-amber-800 font-medium text-xs mb-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Escalated
              </div>
              <p className="text-xs text-amber-700">This conversation was escalated to a human agent{conv.escalated_at ? ` on ${formatDate(conv.escalated_at)}` : ''}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
