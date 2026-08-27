import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Support Genius AI — AI Customer Support Frontline',
    template: '%s | Support Genius AI',
  },
  description: 'Create your AI-powered customer support frontline. Voice agents that understand your business, resolve issues, and escalate intelligently.',
  keywords: ['AI customer support', 'voice AI', 'support automation', 'customer service AI'],
  authors: [{ name: 'Support Genius AI' }],
  openGraph: {
    type: 'website',
    title: 'Support Genius AI',
    description: 'Your AI Customer Support Frontline',
    siteName: 'Support Genius AI',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234f46e5'/><path d='M8 10h16M8 16h12M8 22h8' stroke='white' stroke-width='2.5' stroke-linecap='round'/><circle cx='23' cy='22' r='4' fill='white'/><path d='M21 22l1.5 1.5L25 20' stroke='%234f46e5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
