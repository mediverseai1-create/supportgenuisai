'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { User, Building2, CreditCard, Shield, Bell, ArrowRight, CheckCircle, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Topbar } from '@/components/layout/topbar'
import { PLANS } from '@/lib/utils'

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const defaultTab = searchParams.get('tab') || 'profile'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' })
  const [orgForm, setOrgForm] = useState({ name: '', website: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    escalations: true,
    weekly_digest: true,
    new_conversations: false,
    low_confidence: true,
  })

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) return router.push('/login')
      setUser(u)

      const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
      setProfile(p)
      setProfileForm({ full_name: p?.full_name || '', email: u.email || '' })
      setUserInfo({ name: p?.full_name || u.email || '', email: u.email || '' })

      const { data: membership } = await supabase.from('organization_members').select('*, organizations(*)').eq('user_id', u.id).single()
      const o = (membership as any)?.organizations
      setOrg(o)
      setOrgForm({ name: o?.name || '', website: o?.website || '' })

      setLoading(false)
    }
    init()
  }, [])

  async function saveProfile() {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: profileForm.full_name,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    if (error) toast.error('Failed to save profile')
    else { toast.success('Profile updated'); setUserInfo(p => ({ ...p, name: profileForm.full_name })) }
    setSaving(false)
  }

  async function saveOrg() {
    if (!org) return
    setSaving(true)
    const { error } = await supabase.from('organizations').update({
      name: orgForm.name,
      website: orgForm.website || null,
      updated_at: new Date().toISOString(),
    }).eq('id', org.id)
    if (error) toast.error('Failed to save organization')
    else toast.success('Organization updated')
    setSaving(false)
  }

  async function changePassword() {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new })
    if (error) toast.error(error.message)
    else {
      toast.success('Password changed successfully')
      setPasswordForm({ current: '', new: '', confirm: '' })
    }
    setSaving(false)
  }

  const plan = org?.plan || 'free'
  const planInfo = PLANS[plan as keyof typeof PLANS]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" userName={userInfo.name} userEmail={userInfo.email} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your name and account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">Full name</Label>
                    <Input value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Email address</Label>
                    <Input value={profileForm.email} disabled className="bg-neutral-50 text-neutral-500" />
                    <p className="mt-1 text-xs text-neutral-400">Contact support to change your email address.</p>
                  </div>
                  <Button variant="brand" loading={saving} onClick={saveProfile}>Save changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Member since</dt>
                      <dd className="font-medium">{user ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Account plan</dt>
                      <dd className="font-medium capitalize">{plan}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Role</dt>
                      <dd className="font-medium capitalize">{profile?.role || '—'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization */}
            <TabsContent value="organization" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>Your business information and workspace settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">Organization name</Label>
                    <Input value={orgForm.name} onChange={e => setOrgForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Website</Label>
                    <Input value={orgForm.website} onChange={e => setOrgForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yourcompany.com" />
                  </div>
                  <div className="pt-2 border-t border-neutral-100">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Industry</dt>
                        <dd className="font-medium">{org?.industry || '—'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Country</dt>
                        <dd className="font-medium">{org?.country || '—'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Team size</dt>
                        <dd className="font-medium">{org?.team_size || '—'}</dd>
                      </div>
                    </dl>
                  </div>
                  <Button variant="brand" loading={saving} onClick={saveOrg}>Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-neutral-900">{planInfo?.name || 'Free'}</span>
                        <Badge variant={plan === 'pro' ? 'brand' : plan === 'starter' ? 'info' : 'secondary'} className="capitalize">{plan}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-neutral-900">${planInfo?.price || 0}<span className="text-base font-normal text-neutral-500">/month</span></div>
                    </div>
                    {plan !== 'free' && (
                      <div className="text-xs text-neutral-500">Renews monthly</div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>{planInfo?.agents || 1} AI support agent{(planInfo?.agents || 1) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>{(planInfo?.conversations || 100).toLocaleString()} conversations/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Voice + chat support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {plan !== 'pro' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {plan === 'free' && (
                    <Card className="border-neutral-200">
                      <CardContent className="p-5">
                        <div className="text-sm font-semibold text-neutral-500 mb-1">Starter</div>
                        <div className="text-3xl font-bold text-neutral-900 mb-3">$57<span className="text-base font-normal text-neutral-500">/mo</span></div>
                        <div className="space-y-2 text-xs text-neutral-600 mb-5">
                          {['3 AI agents', '1,000 conversations/month', 'Voice + widget', '5 knowledge sources'].map(f => (
                            <div key={f} className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" />{f}</div>
                          ))}
                        </div>
                        <a href={process.env.NEXT_PUBLIC_STARTER_PAYMENT_LINK || '#'} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full">Upgrade to Starter</Button>
                        </a>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-2 border-[#4f46e5]">
                    <CardContent className="p-5">
                      <div className="text-sm font-semibold text-indigo-600 mb-1">Pro — Most Popular</div>
                      <div className="text-3xl font-bold text-neutral-900 mb-3">$97<span className="text-base font-normal text-neutral-500">/mo</span></div>
                      <div className="space-y-2 text-xs text-neutral-600 mb-5">
                        {['10 AI agents', '5,000 conversations/month', 'Unlimited knowledge', 'Phone number support', 'Customer memory', 'AI improvement'].map(f => (
                          <div key={f} className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-[#4f46e5]" />{f}</div>
                        ))}
                      </div>
                      <a href={process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK || '#'} target="_blank" rel="noopener noreferrer">
                        <Button variant="brand" className="w-full">
                          <Zap className="h-4 w-4" /> Upgrade to Pro
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>
              )}

              {plan === 'pro' && (
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm text-neutral-600">You&apos;re on the Pro plan with full access to all features. To manage your billing, cancel, or change your plan, please contact support.</p>
                    <Button variant="outline" className="mt-4">Contact support</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control what events trigger notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'escalations', label: 'Escalation alerts', desc: 'Notify when a conversation is escalated to a human' },
                    { key: 'weekly_digest', label: 'Weekly digest', desc: 'Weekly summary of support performance and insights' },
                    { key: 'new_conversations', label: 'New conversations', desc: 'Alert on every new conversation (high volume environments may find this noisy)' },
                    { key: 'low_confidence', label: 'Low confidence responses', desc: 'Alert when the AI responds with low confidence' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between rounded-lg border border-neutral-100 p-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{n.label}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{n.desc}</div>
                      </div>
                      <Switch
                        checked={notifications[n.key as keyof typeof notifications]}
                        onCheckedChange={v => setNotifications(p => ({ ...p, [n.key]: v }))}
                      />
                    </div>
                  ))}
                  <Button variant="brand" onClick={() => toast.success('Notification preferences saved')}>Save preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">New password</Label>
                    <Input type="password" placeholder="New password (min 8 characters)" value={passwordForm.new} onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Confirm new password</Label>
                    <Input type="password" placeholder="Repeat new password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                  <Button variant="brand" loading={saving} onClick={changePassword} disabled={!passwordForm.new || !passwordForm.confirm}>
                    Update password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>Manage active sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-4">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Current session</div>
                      <div className="text-xs text-neutral-500">Active now · {user?.email}</div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-700">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border border-red-100 p-4">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Delete account</div>
                      <div className="text-xs text-neutral-500">Permanently delete your account and all data. This cannot be undone.</div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => toast.error('Contact support@supportgenius.ai to delete your account')}>
                      Delete account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
