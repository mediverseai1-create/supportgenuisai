'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (error) { toast.error(error.message); return }
    router.push(redirectTo)
    router.refresh()
  }

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
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">Welcome back</h1>
        <p className="text-sm text-neutral-500">Sign in to your Support Genius account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1.5 block">Email address</Label>
          <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-[#4f46e5] hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" {...register('password')} className="pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Sign in <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-[#4f46e5] hover:underline">Create one free</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[420px] flex-col bg-[#1a1a2e] p-10 justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
              <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
              <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
              <circle cx="18" cy="16" r="4" fill="white"/>
              <path d="M16.5 16l1 1 2-2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">Support Genius AI</span>
        </Link>
        <div>
          <blockquote className="text-lg text-neutral-300 leading-relaxed mb-6">
            &quot;We deployed our AI support agent in 20 minutes. It now handles 89% of our customer conversations automatically.&quot;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-white">S</div>
            <div>
              <div className="text-sm font-semibold text-white">Sarah Chen</div>
              <div className="text-xs text-neutral-500">Head of Support, Acme Corp</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-neutral-600">© {new Date().getFullYear()} Support Genius AI</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div className="w-full max-w-sm animate-pulse"><div className="h-8 bg-neutral-100 rounded w-3/4 mb-4" /><div className="h-4 bg-neutral-100 rounded w-1/2" /></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
