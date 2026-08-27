'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type FormData = z.infer<typeof schema>

function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { toast.error(error.message); return }
    router.push('/onboarding')
  }

  const strengthChecks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
  ]

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="h-7 w-7 rounded-lg bg-[#4f46e5] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
            <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
            <circle cx="18" cy="16" r="4" fill="white"/>
          </svg>
        </div>
        <span className="text-sm font-bold text-[#1a1a2e]">Support Genius AI</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">Create your account</h1>
        <p className="text-sm text-neutral-500">Start building your AI support frontline — free for 14 days.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="mb-1.5 block">Full name</Label>
          <Input id="fullName" placeholder="Jane Smith" autoComplete="name" {...register('fullName')} />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="mb-1.5 block">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5 block">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" autoComplete="new-password" {...register('password')} className="pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-2 space-y-1">
              {strengthChecks.map(c => (
                <div key={c.label} className={`flex items-center gap-1.5 text-xs ${c.pass ? 'text-emerald-600' : 'text-neutral-400'}`}>
                  <CheckCircle className={`h-3 w-3 ${c.pass ? 'text-emerald-500' : 'text-neutral-300'}`} />
                  {c.label}
                </div>
              ))}
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="mb-1.5 block">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="Repeat your password" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting}>
          Create account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-neutral-400">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="underline hover:text-neutral-700">Terms</Link> and{' '}
        <Link href="/privacy" className="underline hover:text-neutral-700">Privacy Policy</Link>
      </p>
      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[#4f46e5] hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[420px] flex-col bg-[#1a1a2e] p-10 justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
              <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
              <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
              <circle cx="18" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">Support Genius AI</span>
        </Link>
        <div className="space-y-5">
          {['Build your AI agent in minutes, not weeks', 'Handles 90%+ of conversations automatically', 'Voice + chat support out of the box', 'Real-time analytics and improvement'].map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-[#4f46e5]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-3 w-3 text-[#4f46e5]" />
              </div>
              <span className="text-sm text-neutral-300">{item}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-neutral-600">© {new Date().getFullYear()} Support Genius AI</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div className="w-full max-w-sm animate-pulse"><div className="h-8 bg-neutral-100 rounded w-3/4 mb-4" /></div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
