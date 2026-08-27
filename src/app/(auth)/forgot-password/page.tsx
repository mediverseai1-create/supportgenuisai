'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="h-7 w-7 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
              <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
              <circle cx="18" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-[#1a1a2e]">Support Genius AI</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Check your email</h1>
            <p className="text-sm text-neutral-500 mb-8">We sent a password reset link to your email address.</p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#4f46e5] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">Reset your password</h1>
              <p className="text-sm text-neutral-500">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1.5 block">Email address</Label>
                <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Send reset link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-neutral-700 hover:text-neutral-900">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
