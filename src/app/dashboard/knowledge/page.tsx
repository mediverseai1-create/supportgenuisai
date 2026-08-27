'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Globe, FileText, MessageSquare, BookOpen, Trash2, RefreshCw, Check, AlertCircle, Clock, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Topbar } from '@/components/layout/topbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SOURCE_TYPES = [
  { id: 'url', label: 'Website URL', icon: Globe, desc: 'Scrape and index a webpage or sitemap' },
  { id: 'text', label: 'Text / FAQ', icon: MessageSquare, desc: 'Paste questions and answers or free-form text' },
  { id: 'document', label: 'Document', icon: FileText, desc: 'Upload a PDF, Word document, or text file' },
]

export default function KnowledgePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const agentFilter = searchParams.get('agent')
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [sources, setSources] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState(agentFilter || '')
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState('url')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', url: '', content: '' })

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

      const { data: agentsData } = await supabase.from('agents').select('id, name').eq('organization_id', membership.organization_id).order('created_at', { ascending: false })
      setAgents(agentsData || [])

      if (!agentFilter && agentsData && agentsData.length > 0) {
        setSelectedAgent(agentsData[0].id)
      }

      await fetchSources(membership.organization_id, agentFilter || (agentsData?.[0]?.id ?? ''))
    }
    init()
  }, [])

  async function fetchSources(oid: string, agentId: string) {
    setLoading(true)
    let q = supabase.from('knowledge_sources').select('*').eq('organization_id', oid)
    if (agentId) q = q.eq('agent_id', agentId)
    const { data } = await q.order('created_at', { ascending: false })
    setSources(data || [])
    setLoading(false)
  }

  async function addSource() {
    if (!orgId || !userId || !selectedAgent || !form.title.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (addType === 'url' && !form.url.trim()) {
      toast.error('Enter a URL')
      return
    }
    if (addType !== 'url' && !form.content.trim()) {
      toast.error('Enter content')
      return
    }

    setAdding(true)

    const { data: source, error } = await supabase.from('knowledge_sources').insert({
      agent_id: selectedAgent,
      organization_id: orgId,
      type: addType as any,
      title: form.title.trim(),
      url: addType === 'url' ? form.url.trim() : null,
      content: addType !== 'url' ? form.content.trim() : null,
      status: 'pending',
      created_by: userId,
    }).select().single()

    if (error) {
      toast.error('Failed to add knowledge source')
      setAdding(false)
      return
    }

    // Simulate processing via API
    const res = await fetch('/api/knowledge/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: source.id }),
    }).catch(() => null)

    toast.success('Knowledge source added and being processed')
    setShowAdd(false)
    setForm({ title: '', url: '', content: '' })
    setSources(prev => [{ ...source, status: 'processing' }, ...prev])
    setAdding(false)

    // Refresh after a delay
    setTimeout(() => fetchSources(orgId, selectedAgent), 5000)
  }

  async function deleteSource(id: string) {
    if (!confirm('Delete this knowledge source?')) return
    await supabase.from('knowledge_sources').delete().eq('id', id)
    setSources(prev => prev.filter(s => s.id !== id))
    toast.success('Knowledge source removed')
  }

  async function reprocessSource(id: string) {
    await supabase.from('knowledge_sources').update({ status: 'pending' }).eq('id', id)
    await fetch('/api/knowledge/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: id }),
    }).catch(() => null)
    setSources(prev => prev.map(s => s.id === id ? { ...s, status: 'processing' } : s))
    toast.success('Reprocessing started')
  }

  const selectedAgentName = agents.find(a => a.id === selectedAgent)?.name || 'All agents'

  const statusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return <Check className="h-4 w-4 text-emerald-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default: return <Clock className="h-4 w-4 text-neutral-400" />
    }
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="h-4 w-4 text-blue-500" />
      case 'text': case 'faq': return <MessageSquare className="h-4 w-4 text-violet-500" />
      default: return <FileText className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Knowledge Base" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {agents.length > 1 && (
              <Select value={selectedAgent} onValueChange={v => { setSelectedAgent(v); if (orgId) fetchSources(orgId, v) }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <span className="text-sm text-neutral-500">
              {sources.length} source{sources.length !== 1 ? 's' : ''} · {sources.filter(s => s.status === 'indexed').length} indexed
            </span>
          </div>
          <Button variant="brand" onClick={() => setShowAdd(true)} disabled={!selectedAgent}>
            <Plus className="h-4 w-4" /> Add Knowledge
          </Button>
        </div>

        {/* Empty state */}
        {!loading && sources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
              <BookOpen className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Add your first knowledge source</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6">
              Your agent learns from your website, FAQs, documents, and policies. The more you add, the smarter it gets.
            </p>
            <Button variant="brand" onClick={() => setShowAdd(true)} disabled={!selectedAgent}>
              <Plus className="h-4 w-4" /> Add Knowledge Source
            </Button>
            {!selectedAgent && <p className="mt-3 text-xs text-neutral-400">Create an agent first to add knowledge</p>}
          </div>
        )}

        {/* Sources grid */}
        {!loading && sources.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sources.map(source => (
              <Card key={source.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0">
                        {typeIcon(source.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900 truncate max-w-[160px]">{source.title}</div>
                        <div className="text-xs text-neutral-500 capitalize">{source.type === 'url' ? 'Website URL' : source.type === 'faq' || source.type === 'text' ? 'Text / FAQ' : 'Document'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {statusIcon(source.status)}
                    </div>
                  </div>

                  {source.url && (
                    <div className="text-xs text-neutral-400 truncate mb-3 px-1">{source.url}</div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={source.status === 'indexed' ? 'success' : source.status === 'error' ? 'destructive' : 'warning'}>
                        {source.status}
                      </Badge>
                      {source.item_count > 0 && (
                        <span className="text-xs text-neutral-400">{source.item_count} items</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {(source.status === 'error' || source.status === 'pending') && (
                        <button onClick={() => reprocessSource(source.id)} className="h-7 w-7 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors" title="Reprocess">
                          <RefreshCw className="h-3.5 w-3.5 text-neutral-400" />
                        </button>
                      )}
                      <button onClick={() => deleteSource(source.id)} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-neutral-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {source.error_message && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1">{source.error_message}</div>
                  )}

                  <div className="mt-2 text-xs text-neutral-400">{formatRelativeTime(source.created_at)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Knowledge Source</DialogTitle>
            <DialogDescription>Add content your agent will use to answer customer questions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Type picker */}
            <div className="grid grid-cols-3 gap-2">
              {SOURCE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setAddType(type.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors ${addType === type.id ? 'border-[#4f46e5] bg-indigo-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <type.icon className={`h-5 w-5 ${addType === type.id ? 'text-[#4f46e5]' : 'text-neutral-400'}`} />
                  <span className={`text-xs font-medium ${addType === type.id ? 'text-indigo-700' : 'text-neutral-600'}`}>{type.label}</span>
                </button>
              ))}
            </div>

            <div>
              <Label className="mb-1.5 block">Title *</Label>
              <Input
                placeholder="e.g. Returns Policy, Product FAQ, Help Center"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            {addType === 'url' && (
              <div>
                <Label className="mb-1.5 block">Website URL *</Label>
                <Input
                  type="url"
                  placeholder="https://yoursite.com/help"
                  value={form.url}
                  onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                />
                <p className="mt-1 text-xs text-neutral-400">We&apos;ll automatically scrape and index this page.</p>
              </div>
            )}

            {addType !== 'url' && (
              <div>
                <Label className="mb-1.5 block">Content *</Label>
                <Textarea
                  rows={8}
                  placeholder={addType === 'text' ? 'Q: How do I return a product?\nA: Returns can be made within 30 days...\n\nQ: What payment methods do you accept?\nA: We accept Visa, Mastercard...' : 'Paste your policy, procedure, or document content here...'}
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="brand" className="flex-1" loading={adding} onClick={addSource}>
              Add Knowledge Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
