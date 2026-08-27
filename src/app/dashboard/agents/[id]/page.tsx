'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Save, Globe, Copy, Bot, Mic, MessageSquare, Shield, Zap, BookOpen, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Topbar } from '@/components/layout/topbar'
import Link from 'next/link'

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [agent, setAgent] = useState<any>(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [knowledgeSources, setKnowledgeSources] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const [agentRes, sourcesRes, convsRes] = await Promise.all([
        supabase.from('agents').select('*').eq('id', id).single(),
        supabase.from('knowledge_sources').select('*').eq('agent_id', id).order('created_at', { ascending: false }),
        supabase.from('conversations').select('*').eq('agent_id', id).order('created_at', { ascending: false }).limit(10),
      ])

      setAgent(agentRes.data)
      setKnowledgeSources(sourcesRes.data || [])
      setConversations(convsRes.data || [])
      setLoading(false)
    }
    init()
  }, [id])

  async function saveAgent() {
    if (!agent) return
    setSaving(true)
    const { error } = await supabase.from('agents').update({
      name: agent.name,
      description: agent.description,
      persona: agent.persona,
      greeting_message: agent.greeting_message,
      voice_enabled: agent.voice_enabled,
      widget_enabled: agent.widget_enabled,
      escalation_rules: agent.escalation_rules,
      updated_at: new Date().toISOString(),
    }).eq('id', agent.id)

    if (error) toast.error('Failed to save')
    else toast.success('Agent saved')
    setSaving(false)
  }

  async function togglePublish() {
    if (!agent) return
    const newPublished = !agent.is_published
    const newStatus = newPublished ? 'active' : 'paused'
    await supabase.from('agents').update({ is_published: newPublished, status: newStatus }).eq('id', agent.id)
    setAgent((p: any) => ({ ...p, is_published: newPublished, status: newStatus }))
    toast.success(newPublished ? 'Agent is now live' : 'Agent paused')
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-14 border-b border-neutral-100 bg-white flex items-center px-6">
          <div className="h-5 w-40 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-neutral-400">Loading agent...</div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-neutral-500 mb-4">Agent not found</p>
        <Link href="/dashboard/agents"><Button variant="outline">Back to Agents</Button></Link>
      </div>
    )
  }

  const callUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/call/${agent.slug}`

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title={agent.name}
        userName={userInfo.name}
        userEmail={userInfo.email}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Sub header */}
        <div className="border-b border-neutral-100 bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agents">
              <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Agents
              </button>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-medium text-neutral-900">{agent.name}</span>
            <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'draft' ? 'secondary' : 'warning'}>
              {agent.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {agent.is_published && (
              <button
                onClick={() => { navigator.clipboard.writeText(callUrl); toast.success('Call link copied!') }}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" /> Copy call link
              </button>
            )}
            <Button variant={agent.is_published ? 'secondary' : 'brand'} size="sm" onClick={togglePublish}>
              {agent.is_published ? 'Pause' : 'Publish Agent'}
            </Button>
            <Button variant="brand" size="sm" loading={saving} onClick={saveAgent}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          <Tabs defaultValue="configuration">
            <TabsList className="mb-6">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge ({knowledgeSources.length})</TabsTrigger>
              <TabsTrigger value="escalation">Escalation Rules</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            {/* Configuration */}
            <TabsContent value="configuration" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Identity</CardTitle>
                  <CardDescription>How your agent presents itself to customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">Agent name</Label>
                    <Input value={agent.name} onChange={e => setAgent((p: any) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Description</Label>
                    <Textarea
                      rows={2}
                      placeholder="What this agent handles..."
                      value={agent.description || ''}
                      onChange={e => setAgent((p: any) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Greeting message</Label>
                    <Input
                      value={agent.greeting_message || ''}
                      onChange={e => setAgent((p: any) => ({ ...p, greeting_message: e.target.value }))}
                    />
                    <p className="mt-1 text-xs text-neutral-400">The first message customers hear/read when they start a conversation.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Persona</CardTitle>
                  <CardDescription>Instructions that define how your agent thinks and responds</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={8}
                    placeholder="You are a professional, friendly support agent for [Company]. You help customers with [topics]. Always be concise and accurate. If you don't know something, say so honestly. Never make up information."
                    value={agent.persona || ''}
                    onChange={e => setAgent((p: any) => ({ ...p, persona: e.target.value }))}
                  />
                  <p className="mt-2 text-xs text-neutral-400">
                    This persona guides every response. Include your brand voice, what topics to handle, what to avoid, and how formal/casual to be.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Channel Settings</CardTitle>
                  <CardDescription>How customers can reach this agent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Mic className="h-4.5 w-4.5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900">Voice Calling</div>
                        <div className="text-xs text-neutral-500">Customers can speak with this agent via the call link</div>
                      </div>
                    </div>
                    <Switch
                      checked={agent.voice_enabled}
                      onCheckedChange={v => setAgent((p: any) => ({ ...p, voice_enabled: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900">Chat Widget</div>
                        <div className="text-xs text-neutral-500">Embeddable chat widget for your website</div>
                      </div>
                    </div>
                    <Switch
                      checked={agent.widget_enabled}
                      onCheckedChange={v => setAgent((p: any) => ({ ...p, widget_enabled: v }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Knowledge */}
            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Knowledge Sources</CardTitle>
                      <CardDescription>Content your agent uses to answer customer questions</CardDescription>
                    </div>
                    <Link href={`/dashboard/knowledge?agent=${agent.id}`}>
                      <Button variant="brand" size="sm">Manage Knowledge</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {knowledgeSources.length === 0 ? (
                    <div className="text-center py-10">
                      <BookOpen className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                      <p className="text-sm text-neutral-500 mb-1">No knowledge sources yet</p>
                      <p className="text-xs text-neutral-400 mb-4">Add your website, FAQs, PDFs, and policies to train this agent.</p>
                      <Link href={`/dashboard/knowledge?agent=${agent.id}`}>
                        <Button variant="brand" size="sm">Add Knowledge</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {knowledgeSources.map(source => (
                        <div key={source.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3">
                          <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-4 w-4 text-neutral-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-neutral-900 truncate">{source.title}</div>
                            <div className="text-xs text-neutral-500">{source.type} · {source.item_count} items</div>
                          </div>
                          <Badge variant={source.status === 'indexed' ? 'success' : source.status === 'error' ? 'destructive' : 'warning'}>
                            {source.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Escalation */}
            <TabsContent value="escalation">
              <Card>
                <CardHeader>
                  <CardTitle>Escalation Rules</CardTitle>
                  <CardDescription>Define when and how this agent should transfer to a human</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={8}
                    placeholder={`Define your escalation rules. For example:\n\n- Always escalate if customer explicitly requests a human agent\n- Escalate billing disputes over $500\n- Escalate if customer sentiment is very negative after 3 failed attempts\n- Escalate legal or compliance inquiries\n- Escalate account cancellation requests\n- Never escalate general FAQ questions`}
                    value={typeof agent.escalation_rules === 'string' ? agent.escalation_rules : JSON.stringify(agent.escalation_rules || '', null, 2)}
                    onChange={e => setAgent((p: any) => ({ ...p, escalation_rules: e.target.value }))}
                    className="font-mono text-xs"
                  />
                  <p className="mt-2 text-xs text-neutral-400">Write your escalation rules in plain English. The AI will interpret and apply them.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment */}
            <TabsContent value="deployment" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Call Link</CardTitle>
                  <CardDescription>Share this link with customers to start a voice conversation</CardDescription>
                </CardHeader>
                <CardContent>
                  {!agent.is_published ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                      <Zap className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-amber-900 mb-1">Agent not published</p>
                      <p className="text-xs text-amber-700 mb-4">Publish your agent to activate the call link and widget.</p>
                      <Button variant="brand" size="sm" onClick={togglePublish}>Publish Agent</Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 mb-3">
                        <Globe className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                        <span className="text-sm text-neutral-700 flex-1 truncate font-mono">{callUrl}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(callUrl); toast.success('Link copied!') }}
                          className="flex items-center gap-1 text-xs font-medium text-[#4f46e5] hover:opacity-70"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400">Share this link anywhere — in emails, on social media, or on your website. Customers click once to talk.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Website Widget</CardTitle>
                  <CardDescription>Embed your agent on your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-neutral-900 p-4 font-mono text-xs text-emerald-400 mb-3 overflow-x-auto">
                    {`<script src="https://supportgenius.ai/widget.js"\n  data-agent="${agent.slug}"\n  data-color="#4f46e5"\n  async>\n</script>`}
                  </div>
                  <button
                    onClick={() => {
                      const code = `<script src="https://supportgenius.ai/widget.js" data-agent="${agent.slug}" data-color="#4f46e5" async></script>`
                      navigator.clipboard.writeText(code)
                      toast.success('Widget code copied!')
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#4f46e5] hover:opacity-70"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy embed code
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
