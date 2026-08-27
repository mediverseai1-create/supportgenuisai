'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, Building2, Users, Globe, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STEPS = ['Your profile', 'Your business', 'Your team'] as const

const profileSchema = z.object({
  fullName: z.string().min(2, 'Required'),
  role: z.string().min(1, 'Select your role'),
})

const businessSchema = z.object({
  companyName: z.string().min(2, 'Required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Select your industry'),
  country: z.string().min(1, 'Select your country'),
})

const teamSchema = z.object({
  teamSize: z.string().min(1, 'Select your team size'),
  supportVolume: z.string().min(1, 'Select volume'),
})

type ProfileData = z.infer<typeof profileSchema>
type BusinessData = z.infer<typeof businessSchema>
type TeamData = z.infer<typeof teamSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const profileForm = useForm<ProfileData>({ resolver: zodResolver(profileSchema) })
  const businessForm = useForm<BusinessData>({ resolver: zodResolver(businessSchema) })
  const teamForm = useForm<TeamData>({ resolver: zodResolver(teamSchema) })

  function nextStep(data: ProfileData | BusinessData) {
    if (step === 0) setProfileData(data as ProfileData)
    if (step === 1) setBusinessData(data as BusinessData)
    setStep(s => s + 1)
  }

  async function handleFinish(teamData: TeamData) {
    if (!profileData || !businessData) return
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Update profile
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email!,
        full_name: profileData.fullName,
        role: profileData.role,
        company: businessData.companyName,
        industry: businessData.industry,
        country: businessData.country,
        team_size: teamData.teamSize,
        onboarding_completed: true,
      })

      // Create organization
      const orgSlug = slugify(businessData.companyName) + '-' + Math.random().toString(36).slice(2, 6)
      const { data: org, error: orgError } = await supabase.from('organizations').insert({
        name: businessData.companyName,
        slug: orgSlug,
        website: businessData.website || null,
        industry: businessData.industry,
        country: businessData.country,
        team_size: teamData.teamSize,
        owner_id: user.id,
        plan: 'free',
      }).select().single()

      if (orgError) throw orgError

      // Add as owner member
      await supabase.from('organization_members').insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'owner',
      })

      // Log activity
      await supabase.from('activity_logs').insert({
        organization_id: org.id,
        user_id: user.id,
        action: 'organization_created',
        entity_type: 'organization',
        entity_id: org.id,
        details: { name: org.name },
      })

      toast.success('Welcome to Support Genius! Let\'s build your first agent.')
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#4f46e5] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
                <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
                <rect x="3" y="14" width="6" height="2" rx="1" fill="white"/>
                <circle cx="18" cy="16" r="4" fill="white"/>
                <path d="M16.5 16l1 1 2-2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-base font-bold text-[#1a1a2e]">Support Genius AI</span>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold transition-colors ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-[#4f46e5] text-white' :
                'bg-neutral-200 text-neutral-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-neutral-900' : 'text-neutral-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="h-px w-8 bg-neutral-200 ml-2" />}
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          {/* Step 0: Profile */}
          {step === 0 && (
            <form onSubmit={profileForm.handleSubmit(nextStep)}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Tell us about yourself</h2>
                  <p className="text-sm text-neutral-500">We&apos;ll personalize your experience</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Full name</Label>
                  <Input placeholder="Jane Smith" {...profileForm.register('fullName')} />
                  {profileForm.formState.errors.fullName && <p className="mt-1 text-xs text-red-600">{profileForm.formState.errors.fullName.message}</p>}
                </div>
                <div>
                  <Label className="mb-1.5 block">Your role</Label>
                  <Select onValueChange={v => profileForm.setValue('role', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Head of Customer Support', 'Support Manager', 'Operations Manager', 'CX Director', 'COO / VP Operations', 'Founder / CEO', 'Product Manager', 'IT Manager', 'Other'].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileForm.formState.errors.role && <p className="mt-1 text-xs text-red-600">{profileForm.formState.errors.role.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Step 1: Business */}
          {step === 1 && (
            <form onSubmit={businessForm.handleSubmit(nextStep)}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">About your business</h2>
                  <p className="text-sm text-neutral-500">Help us understand your operation</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Company name</Label>
                  <Input placeholder="Acme Corporation" {...businessForm.register('companyName')} />
                  {businessForm.formState.errors.companyName && <p className="mt-1 text-xs text-red-600">{businessForm.formState.errors.companyName.message}</p>}
                </div>
                <div>
                  <Label className="mb-1.5 block">Website <span className="text-neutral-400 font-normal">(optional)</span></Label>
                  <Input placeholder="https://yourcompany.com" {...businessForm.register('website')} />
                  {businessForm.formState.errors.website && <p className="mt-1 text-xs text-red-600">{businessForm.formState.errors.website.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block">Industry</Label>
                    <Select onValueChange={v => businessForm.setValue('industry', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {['E-commerce & Retail', 'SaaS & Software', 'Healthcare', 'Finance & Banking', 'Travel & Hospitality', 'Telecommunications', 'Education', 'Real Estate', 'Insurance', 'Other'].map(i => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.industry && <p className="mt-1 text-xs text-red-600">{businessForm.formState.errors.industry.message}</p>}
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Country</Label>
                    <Select onValueChange={v => businessForm.setValue('country', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Netherlands', 'Singapore', 'Other'].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.country && <p className="mt-1 text-xs text-red-600">{businessForm.formState.errors.country.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Team */}
          {step === 2 && (
            <form onSubmit={teamForm.handleSubmit(handleFinish)}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Your support operation</h2>
                  <p className="text-sm text-neutral-500">Help us configure the right setup</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Support team size</Label>
                  <Select onValueChange={v => teamForm.setValue('teamSize', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Just me', '2–10 agents', '11–50 agents', '51–200 agents', '200+ agents'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teamForm.formState.errors.teamSize && <p className="mt-1 text-xs text-red-600">{teamForm.formState.errors.teamSize.message}</p>}
                </div>
                <div>
                  <Label className="mb-1.5 block">Monthly support volume</Label>
                  <Select onValueChange={v => teamForm.setValue('supportVolume', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select monthly volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Under 500', '500–2,000', '2,000–10,000', '10,000–50,000', '50,000+'].map(v => (
                        <SelectItem key={v} value={v}>{v} conversations/month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teamForm.formState.errors.supportVolume && <p className="mt-1 text-xs text-red-600">{teamForm.formState.errors.supportVolume.message}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1" size="lg" loading={saving}>
                  Launch dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Step {step + 1} of {STEPS.length} — your data is encrypted and secure
        </p>
      </div>
    </div>
  )
}
