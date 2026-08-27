'use client'
import { useState, useEffect, use, useRef } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Volume2, Bot, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'customer' | 'agent'
  content: string
  timestamp: Date
}

export default function CallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const supabase = createClient()
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [callActive, setCallActive] = useState(false)
  const [muted, setMuted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadAgent() {
      const { data, error } = await supabase.from('agents').select('*, organizations(name, logo_url)').eq('slug', slug).eq('is_published', true).single()
      if (error || !data) { setNotFound(true); setLoading(false); return }
      setAgent(data)
      setLoading(false)
    }
    loadAgent()
  }, [slug])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startCall() {
    if (!agent) return

    // Create conversation record
    const { data: conv } = await supabase.from('conversations').insert({
      agent_id: agent.id,
      organization_id: agent.organization_id,
      channel: 'voice',
      status: 'active',
      started_at: new Date().toISOString(),
    }).select().single()

    if (conv) setConversationId(conv.id)

    setCallActive(true)
    const greeting = agent.greeting_message || `Hi! I'm ${agent.name}, your AI support assistant. How can I help you today?`
    const greetingMsg: Message = { role: 'agent', content: greeting, timestamp: new Date() }
    setMessages([greetingMsg])

    // Store greeting message
    if (conv) {
      await supabase.from('messages').insert({
        conversation_id: conv.id,
        organization_id: agent.organization_id,
        role: 'agent',
        content: greeting,
      })
    }
  }

  async function endCall() {
    if (conversationId) {
      await supabase.from('conversations').update({
        status: 'resolved',
        ended_at: new Date().toISOString(),
        duration_seconds: Math.round((Date.now() - (messages[0]?.timestamp?.getTime() || Date.now())) / 1000),
        message_count: messages.length,
      }).eq('id', conversationId)
    }
    setCallActive(false)
    setMessages([])
    setConversationId(null)
  }

  async function sendMessage() {
    if (!input.trim() || !agent || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    const customerMsg: Message = { role: 'customer', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, customerMsg])

    // Store customer message
    if (conversationId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        organization_id: agent.organization_id,
        role: 'customer',
        content: text,
      })
    }

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, message: text, history }),
      })
      const data = await res.json()
      const response = data.response || 'I apologize, I encountered an error.'

      const agentMsg: Message = { role: 'agent', content: response, timestamp: new Date() }
      setMessages(prev => [...prev, agentMsg])

      if (conversationId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          organization_id: agent.organization_id,
          role: 'agent',
          content: response,
          confidence: data.confidence,
        })

        if (data.shouldEscalate) {
          await supabase.from('conversations').update({ status: 'escalated', escalated_at: new Date().toISOString() }).eq('id', conversationId)
        }
      }
    } catch {
      const errMsg: Message = { role: 'agent', content: 'I apologize, there was a technical issue. Please try again.', timestamp: new Date() }
      setMessages(prev => [...prev, errMsg])
    }

    setSending(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a2e] text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Agent not found</h1>
        <p className="text-neutral-400">This support agent link is not active or doesn&apos;t exist.</p>
      </div>
    )
  }

  const orgName = agent?.organizations?.name || 'Support'

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#4f46e5] flex items-center justify-center">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{agent.name}</div>
            <div className="text-xs text-neutral-500">{orgName} · AI Support</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {callActive && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Connected</span>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        {!callActive ? (
          /* Pre-call screen */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="h-24 w-24 rounded-full bg-[#4f46e5]/20 border border-[#4f46e5]/30 flex items-center justify-center">
                <Bot className="h-12 w-12 text-[#4f46e5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#1a1a2e]" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
            <p className="text-neutral-400 mb-2">{orgName} AI Support Agent</p>
            {agent.description && <p className="text-sm text-neutral-500 max-w-sm mb-8">{agent.description}</p>}

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available now
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                Powered by AI
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                Text conversation
              </div>
            </div>

            <button
              onClick={startCall}
              className="flex items-center gap-3 rounded-2xl bg-[#4f46e5] px-8 py-4 text-white font-semibold text-lg hover:bg-[#4338ca] transition-colors shadow-lg shadow-indigo-900/50"
            >
              <Phone className="h-5 w-5" />
              Start Support Chat
            </button>

            <p className="mt-5 text-xs text-neutral-600">No account required · Instant connection</p>
          </div>
        ) : (
          /* Active call screen */
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'customer' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'agent' && (
                    <div className="h-8 w-8 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'customer'
                      ? 'bg-white/10 text-white rounded-tr-sm'
                      : 'bg-[#4f46e5] text-white rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-[#4f46e5] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
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
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#4f46e5] transition-colors"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="h-12 w-12 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-40 transition-colors flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={endCall}
                  className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <PhoneOff className="h-4 w-4" /> End conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-xs text-neutral-700">
        Powered by <span className="text-neutral-500 font-medium">Support Genius AI</span>
      </div>
    </div>
  )
}
