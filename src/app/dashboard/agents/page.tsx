'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Bot, Mic, MessageSquare, Globe, MoreVertical, Copy, ExternalLink, Trash2, Play, Pause, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify, formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Topbar } from '@/components/layout/topbar'

interface Agent {
  id: string
  name: string
  slug: string
  description: string | null
  persona: string | null
  greeting_message: string | null
  voice_enabled: boolean
  widget_enabled: boolean
  is_published: boolean
  status: string
  created_at: string
  updated_at: string
}

export default function AgentsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [creating, setCreating] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    persona: '',
    greeting_message: '',
    voice_enabled: true,
    widget_enabled: true,
  })

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUserId(user.id)

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).single()
      if (!membership) return

      setOrgId(membership.organization_id)
      await fetchAgents(membership.organization_id)
    }
    init()
  }, [])

  async function fetchAgents(oid: string) {
    setLoading(true)
    const { data } = await supabase.from('agents').select('*').eq('organization_id', oid).order('created_at', { ascending: false })
    setAgents(data || [])
    setLoading(false)
  }

  async function createAgent() {
    if (!orgId || !userId || !newAgent.name.trim()) return
    setCreating(true)

    const slug = slugify(newAgent.name) + '-' + Math.random().toString(36).slice(2, 6)

    const { data, error } = await supabase.from('agents').insert({
      organization_id: orgId,
      name: newAgent.name.trim(),
      slug,
      description: newAgent.description || null,
      persona: newAgent.persona || 'You are a helpful, professional customer support agent. Be friendly, concise, and accurate.',
      greeting_message: newAgent.greeting_message || `Hi! I'm ${newAgent.name}, your AI support assistant. How can I help you today?`,
      voice_enabled: newAgent.voice_enabled,
      widget_enabled: newAgent.widget_enabled,
      status: 'draft',
      created_by: userId,
    }).select().single()

    if (error) {
      toast.error('Failed to create agent')
      setCreating(false)
      return
    }

    await supabase.from('activity_logs').insert({
      organization_id: orgId,
      user_id: userId,
      action: 'agent_created',
      entity_type: 'agent',
      entity_id: data.id,
      details: { name: data.name },
    })

    toast.success('Agent created! Add knowledge to train it.')
    setShowCreate(false)
    setNewAgent({ name: '', description: '', persona: '', greeting_message: '', voice_enabled: true, widget_enabled: true })
    setAgents(prev => [data, ...prev])
    router.push(`/dashboard/agents/${data.id}`)
  }

  async function togglePublish(agent: Agent) {
    const newPublished = !agent.is_published
    const newStatus = newPublished ? 'active' : 'paused'
    const { error } = await supabase.from('agents').update({ is_published: newPublished, status: newStatus }).eq('id', agent.id)
    if (error) { toast.error('Failed to update agent'); return }
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_published: newPublished, status: newStatus } : a))
    toast.success(newPublished ? 'Agent is now live' : 'Agent paused')
  }

  async function deleteAgent(id: string) {
    if (!confirm('Delete this agent and all its knowledge? This cannot be undone.')) return
    const { error } = await supabase.from('agents').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    setAgents(prev => prev.filter(a => a.id !== id))
    toast.success('Agent deleted')
  }

  const statusColors: Record<string, string> = {
    active: 'success',
    draft: 'secondary',
    training: 'warning',
    paused: 'outline',
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="AI Agents" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-neutral-500">
              {agents.length} agent{agents.length !== 1 ? 's' : ''} · {agents.filter(a => a.is_published).length} live
            </p>
          </div>
          <Button variant="brand" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        </div>

        {/* Agents grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-5 bg-neutral-100 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
              <Bot className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Build your first AI agent</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6">
              Create an intelligent agent that understands your business and handles customer conversations automatically.
            </p>
            <Button variant="brand" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" />
              Create Your First Agent
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-[#4f46e5]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{agent.name}</h3>
                        <Badge variant={statusColors[agent.status] as any} className="mt-0.5">
                          {agent.status}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
                          <MoreVertical className="h-4 w-4 text-neutral-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/agents/${agent.id}`)}>
                          Edit agent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/knowledge?agent=${agent.id}`)}>
                          Manage knowledge
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/testing?agent=${agent.id}`)}>
                          Test agent
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => togglePublish(agent)}>
                          {agent.is_published ? (
                            <><Pause className="h-4 w-4" /> Pause agent</>
                          ) : (
                            <><Play className="h-4 w-4" /> Publish agent</>
                          )}
                        </DropdownMenuItem>
                        {agent.is_published && (
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/call/${agent.slug}`)
                            toast.success('Call link copied!')
                          }}>
                            <Copy className="h-4 w-4" /> Copy call link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteAgent(agent.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Delete agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {agent.description && (
                    <p className="text-xs text-neutral-500 mb-4 line-clamp-2">{agent.description}</p>
                  )}

                  {/* Capabilities */}
                  <div className="flex gap-2 mb-4">
                    {agent.voice_enabled && (
                      <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                        <Mic className="h-3 w-3" /> Voice
                      </div>
                    )}
                    {agent.widget_enabled && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        <MessageSquare className="h-3 w-3" /> Widget
                      </div>
                    )}
                  </div>

                  {/* Call link */}
                  {agent.is_published && (
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2 mb-4">
                      <Globe className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-xs text-neutral-500 truncate flex-1">/call/{agent.slug}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/call/${agent.slug}`)
                          toast.success('Copied!')
                        }}
                        className="text-[#4f46e5] hover:opacity-70"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => router.push(`/dashboard/agents/${agent.id}`)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant={agent.is_published ? 'secondary' : 'brand'}
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => togglePublish(agent)}
                    >
                      {agent.is_published ? 'Pause' : 'Publish'}
                    </Button>
                  </div>

                  <div className="mt-3 text-xs text-neutral-400">
                    Updated {formatRelativeTime(agent.updated_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create AI Agent</DialogTitle>
            <DialogDescription>Configure your new AI support agent. You can add knowledge and fine-tune it after creation.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label className="mb-1.5 block">Agent name *</Label>
              <Input
                placeholder="e.g. Acme Support, Aria, HelpBot"
                value={newAgent.name}
                onChange={e => setNewAgent(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-1.5 block">Description <span className="text-neutral-400 font-normal">(optional)</span></Label>
              <Textarea
                placeholder="What does this agent handle? e.g. handles e-commerce support for Acme Store"
                rows={2}
                value={newAgent.description}
                onChange={e => setNewAgent(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-1.5 block">Agent persona <span className="text-neutral-400 font-normal">(optional)</span></Label>
              <Textarea
                placeholder="You are a professional, friendly support agent for Acme Corp. Be concise and helpful. Avoid technical jargon."
                rows={3}
                value={newAgent.persona}
                onChange={e => setNewAgent(p => ({ ...p, persona: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-1.5 block">Greeting message <span className="text-neutral-400 font-normal">(optional)</span></Label>
              <Input
                placeholder={`Hi! I'm ${newAgent.name || 'your support agent'}. How can I help you today?`}
                value={newAgent.greeting_message}
                onChange={e => setNewAgent(p => ({ ...p, greeting_message: e.target.value }))}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={newAgent.voice_enabled}
                  onCheckedChange={v => setNewAgent(p => ({ ...p, voice_enabled: v }))}
                />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Voice support</div>
                  <div className="text-xs text-neutral-500">Enable voice calling</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={newAgent.widget_enabled}
                  onCheckedChange={v => setNewAgent(p => ({ ...p, widget_enabled: v }))}
                />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Chat widget</div>
                  <div className="text-xs text-neutral-500">Embed on website</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              variant="brand"
              className="flex-1"
              loading={creating}
              disabled={!newAgent.name.trim()}
              onClick={createAgent}
            >
              Create Agent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
