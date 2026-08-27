'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Send, Bot, User, Mic, MicOff, RotateCcw, Zap, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  role: 'customer' | 'agent'
  content: string
  confidence?: number
  timestamp: Date
}

const SCENARIO_SUGGESTIONS = [
  'I want to return a product I bought last week',
  'My order hasn\'t arrived yet and it\'s been 2 weeks',
  'How do I cancel my subscription?',
  'I was charged twice for the same order',
  'I forgot my password and can\'t log in',
  'Can you explain your refund policy?',
  'I need to speak to a manager immediately',
  'My product is defective and I want a replacement',
]

export default function TestingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState(searchParams.get('agent') || '')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).single()
      if (!membership) return
      setOrgId(membership.organization_id)

      const { data: agentsData } = await supabase.from('agents').select('*').eq('organization_id', membership.organization_id).eq('status', 'active').order('created_at')
      setAgents(agentsData || [])

      if (!searchParams.get('agent') && agentsData && agentsData.length > 0) {
        setSelectedAgent(agentsData[0].id)
        startConversation(agentsData[0])
      } else if (searchParams.get('agent') && agentsData) {
        const agent = agentsData.find(a => a.id === searchParams.get('agent'))
        if (agent) startConversation(agent)
      }
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function startConversation(agent: any) {
    const greeting = agent.greeting_message || `Hi! I'm ${agent.name}, your AI support assistant. How can I help you today?`
    setMessages([{ role: 'agent', content: greeting, timestamp: new Date() }])
  }

  async function sendMessage(text?: string) {
    const messageText = (text || input).trim()
    if (!messageText || !selectedAgent) return

    setSending(true)
    setInput('')

    const customerMsg: Message = { role: 'customer', content: messageText, timestamp: new Date() }
    setMessages(prev => [...prev, customerMsg])

    try {
      const agent = agents.find(a => a.id === selectedAgent)
      const history = messages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent,
          message: messageText,
          history,
          testMode: true,
        }),
      })

      const data = await res.json()

      const agentMsg: Message = {
        role: 'agent',
        content: data.response || 'I apologize, I encountered an error. Please try again.',
        confidence: data.confidence,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMsg])
    } catch {
      const errMsg: Message = {
        role: 'agent',
        content: 'I apologize, there was an error processing your request. Please check your AI configuration.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    }

    setSending(false)
  }

  function resetConversation() {
    const agent = agents.find(a => a.id === selectedAgent)
    if (agent) startConversation(agent)
    else setMessages([])
  }

  function handleAgentChange(agentId: string) {
    setSelectedAgent(agentId)
    const agent = agents.find(a => a.id === agentId)
    if (agent) startConversation(agent)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Testing Lab" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-hidden flex">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col border-r border-neutral-100">
          {/* Toolbar */}
          <div className="border-b border-neutral-100 bg-white px-4 py-2.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {agents.length > 0 ? (
                <Select value={selectedAgent} onValueChange={handleAgentChange}>
                  <SelectTrigger className="h-8 w-52 text-sm">
                    <SelectValue placeholder="Select agent to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm text-neutral-500">No active agents</span>
              )}
              <Badge variant="info">Test Mode</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={resetConversation} disabled={!selectedAgent}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {!selectedAgent ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="h-12 w-12 text-neutral-200 mb-4" />
                <p className="text-sm text-neutral-500">Select an agent to start testing</p>
                {agents.length === 0 && (
                  <p className="text-xs text-neutral-400 mt-1">Create and publish an agent first</p>
                )}
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'customer' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'customer' ? 'bg-neutral-300' : 'bg-[#4f46e5]'
                  }`}>
                    {msg.role === 'customer' ? (
                      <User className="h-3.5 w-3.5 text-neutral-700" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] flex flex-col ${msg.role === 'customer' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'customer'
                        ? 'bg-white border border-neutral-200 text-neutral-900 rounded-tr-sm'
                        : 'bg-[#4f46e5] text-white rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.confidence !== undefined && (
                        <span className={`font-medium ${msg.confidence > 0.8 ? 'text-emerald-600' : msg.confidence > 0.6 ? 'text-amber-600' : 'text-red-600'}`}>
                          {Math.round(msg.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl bg-[#4f46e5] px-4 py-3 rounded-tl-sm">
                  <div className="flex gap-1 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-100 bg-white p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Type a test message as a customer..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                disabled={!selectedAgent || sending}
                className="flex-1"
              />
              <Button
                variant="brand"
                size="icon"
                onClick={() => sendMessage()}
                disabled={!input.trim() || !selectedAgent || sending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Scenarios */}
        <div className="w-64 flex-shrink-0 overflow-y-auto p-4 space-y-4 bg-white">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Test Scenarios</div>
            <div className="space-y-1.5">
              {SCENARIO_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  disabled={!selectedAgent || sending}
                  className="w-full text-left rounded-lg border border-neutral-100 px-3 py-2 text-xs text-neutral-700 hover:border-[#4f46e5] hover:text-[#4f46e5] hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Escalation Tests</div>
            <div className="space-y-1.5">
              {[
                'I want to speak to a human right now',
                'This is completely unacceptable, I\'ll be filing a complaint',
                'I need to cancel everything immediately',
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  disabled={!selectedAgent || sending}
                  className="w-full text-left rounded-lg border border-amber-100 px-3 py-2 text-xs text-amber-700 hover:border-amber-400 hover:bg-amber-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-neutral-700 mb-2">Testing Tips</div>
              <ul className="space-y-1.5 text-xs text-neutral-500">
                <li className="flex items-start gap-1.5">
                  <Zap className="h-3 w-3 text-[#4f46e5] mt-0.5 flex-shrink-0" />
                  Test with questions your real customers ask
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="h-3 w-3 text-[#4f46e5] mt-0.5 flex-shrink-0" />
                  Check confidence scores — low scores mean missing knowledge
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="h-3 w-3 text-[#4f46e5] mt-0.5 flex-shrink-0" />
                  Test escalation scenarios to verify rules work
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="h-3 w-3 text-[#4f46e5] mt-0.5 flex-shrink-0" />
                  Add more knowledge to improve weak areas
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
