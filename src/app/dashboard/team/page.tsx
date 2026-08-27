'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Mail, MoreVertical, Trash2, Shield, User, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Topbar } from '@/components/layout/topbar'

const ROLE_CONFIG = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50' },
  admin: { label: 'Admin', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  member: { label: 'Member', icon: User, color: 'text-neutral-600', bg: 'bg-neutral-50' },
  viewer: { label: 'Viewer', icon: User, color: 'text-neutral-500', bg: 'bg-neutral-50' },
}

export default function TeamPage() {
  const router = useRouter()
  const supabase = createClient()
  const [members, setMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<string>('member')
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member' })

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setCurrentUserId(user.id)

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserInfo({ name: profile?.full_name || user.email || '', email: user.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('organization_id, role').eq('user_id', user.id).single()
      if (!membership) return

      setOrgId(membership.organization_id)
      setCurrentRole(membership.role)
      await fetchTeam(membership.organization_id)
    }
    init()
  }, [])

  async function fetchTeam(oid: string) {
    setLoading(true)
    const [membersRes, invitesRes] = await Promise.all([
      supabase.from('organization_members').select('*, profiles(full_name, email, avatar_url)').eq('organization_id', oid).order('created_at'),
      supabase.from('invitations').select('*').eq('organization_id', oid).is('accepted_at', null).order('created_at', { ascending: false }),
    ])
    setMembers(membersRes.data || [])
    setInvitations(invitesRes.data || [])
    setLoading(false)
  }

  async function inviteMember() {
    if (!orgId || !currentUserId || !inviteForm.email.trim()) return
    setInviting(true)

    const token = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase.from('invitations').insert({
      organization_id: orgId,
      email: inviteForm.email.trim().toLowerCase(),
      role: inviteForm.role as any,
      token,
      invited_by: currentUserId,
      expires_at: expires,
    })

    if (error) {
      toast.error('Failed to create invitation')
    } else {
      toast.success(`Invitation sent to ${inviteForm.email}`)
      setShowInvite(false)
      setInviteForm({ email: '', role: 'member' })
      if (orgId) await fetchTeam(orgId)
    }
    setInviting(false)
  }

  async function removeMember(memberId: string) {
    if (!confirm('Remove this team member?')) return
    await supabase.from('organization_members').delete().eq('id', memberId)
    setMembers(prev => prev.filter(m => m.id !== memberId))
    toast.success('Member removed')
  }

  async function changeRole(memberId: string, role: string) {
    await supabase.from('organization_members').update({ role } as any).eq('id', memberId)
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m))
    toast.success('Role updated')
  }

  async function cancelInvite(inviteId: string) {
    await supabase.from('invitations').delete().eq('id', inviteId)
    setInvitations(prev => prev.filter(i => i.id !== inviteId))
    toast.success('Invitation cancelled')
  }

  const canManage = currentRole === 'owner' || currentRole === 'admin'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Team" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">{members.length} member{members.length !== 1 ? 's' : ''} · {invitations.length} pending</p>
          </div>
          {canManage && (
            <Button variant="brand" onClick={() => setShowInvite(true)}>
              <Plus className="h-4 w-4" /> Invite Member
            </Button>
          )}
        </div>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People with access to your Support Genius workspace</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-neutral-50 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {members.map(member => {
                  const profile = (member as any).profiles
                  const role = member.role as keyof typeof ROLE_CONFIG
                  const config = ROLE_CONFIG[role] || ROLE_CONFIG.member
                  const initials = (profile?.full_name || profile?.email || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                  const isCurrentUser = member.user_id === currentUserId
                  const isOwner = member.role === 'owner'

                  return (
                    <div key={member.id} className="flex items-center gap-3 py-3">
                      <Avatar>
                        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900 truncate">{profile?.full_name || profile?.email || 'Unknown'}</span>
                          {isCurrentUser && <span className="text-xs text-neutral-400">(you)</span>}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">{profile?.email}</div>
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </div>
                      <div className="text-xs text-neutral-400">{formatRelativeTime(member.created_at)}</div>

                      {canManage && !isCurrentUser && !isOwner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-neutral-100">
                              <MoreVertical className="h-4 w-4 text-neutral-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => changeRole(member.id, 'admin')}>Make Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeRole(member.id, 'member')}>Make Member</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeRole(member.id, 'viewer')}>Make Viewer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => removeMember(member.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash2 className="h-4 w-4" /> Remove member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending invitations */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Invitations that haven&apos;t been accepted yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-neutral-50">
                {invitations.map(inv => (
                  <div key={inv.id} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900 truncate">{inv.email}</div>
                      <div className="text-xs text-neutral-500">Invited · expires {formatRelativeTime(inv.expires_at)}</div>
                    </div>
                    <Badge variant="warning" className="capitalize">{inv.role}</Badge>
                    {canManage && (
                      <button onClick={() => cancelInvite(inv.id)} className="text-xs text-red-500 hover:underline">Cancel</button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles info */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <div key={role} className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3">
                  <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{config.label}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {role === 'owner' ? 'Full access including billing and organization settings' :
                       role === 'admin' ? 'Manage agents, knowledge, team members, and settings' :
                       role === 'member' ? 'Access conversations, analytics, and agents. Cannot manage team' :
                       'Read-only access to conversations and analytics'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>They&apos;ll receive an email with instructions to join your workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="mb-1.5 block">Email address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Role</Label>
              <Select value={inviteForm.role} onValueChange={v => setInviteForm(p => ({ ...p, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full management access</SelectItem>
                  <SelectItem value="member">Member — operational access</SelectItem>
                  <SelectItem value="viewer">Viewer — read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button variant="brand" className="flex-1" loading={inviting} onClick={inviteMember} disabled={!inviteForm.email.trim()}>
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
