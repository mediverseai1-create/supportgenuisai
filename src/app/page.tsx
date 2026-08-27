import Link from 'next/link'
import { ArrowRight, CheckCircle, Mic, Brain, Zap, Shield, BarChart3, Users, MessageSquare, PhoneCall, Star, ChevronRight, Globe, FileText, Headphones } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                <rect x="3" y="4" width="12" height="2" rx="1" fill="white"/>
                <rect x="3" y="9" width="9" height="2" rx="1" fill="white"/>
                <rect x="3" y="14" width="6" height="2" rx="1" fill="white"/>
                <circle cx="18" cy="16" r="4" fill="white"/>
                <path d="M16.5 16l1 1 2-2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[#1a1a2e] tracking-tight">Support Genius AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="#features" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4338ca] transition-colors">
              Get started free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          <Link href="/signup" className="md:hidden inline-flex items-center rounded-lg bg-[#4f46e5] px-3 py-1.5 text-sm font-medium text-white">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            AI-Powered Customer Support — Always On
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a2e] leading-[1.08] tracking-tight mb-6">
            Your AI customer
            <span className="block text-[#4f46e5]">support frontline</span>
          </h1>

          <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Give Support Genius your business knowledge. It builds a natural-sounding AI agent that speaks with customers, resolves issues, and escalates intelligently — 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#4f46e5] px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-[#4338ca] transition-colors shadow-lg shadow-indigo-200">
              Build your AI agent — free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-7 py-3.5 text-[15px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              See how it works
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span>4.9/5 from 200+ reviews</span>
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <span>No credit card required</span>
            <div className="h-4 w-px bg-neutral-200" />
            <span>Setup in under 10 minutes</span>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mx-auto max-w-6xl mt-16">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2 shadow-2xl shadow-neutral-200">
            <div className="rounded-xl bg-white border border-neutral-100 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4 rounded-md bg-white border border-neutral-200 px-3 py-1 text-xs text-neutral-400">
                  app.supportgenius.ai/dashboard
                </div>
              </div>
              {/* App preview */}
              <div className="flex h-96">
                {/* Sidebar */}
                <div className="w-52 border-r border-neutral-100 bg-[#1a1a2e] flex flex-col p-4 gap-1">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="h-6 w-6 rounded bg-[#4f46e5] flex items-center justify-center">
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                        <rect x="2" y="3" width="8" height="1.5" rx="0.75" fill="white"/>
                        <rect x="2" y="7" width="6" height="1.5" rx="0.75" fill="white"/>
                        <circle cx="12" cy="11" r="3" fill="white"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-white">Support Genius</span>
                  </div>
                  {['Overview', 'AI Agents', 'Knowledge', 'Conversations', 'Analytics', 'Team'].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs ${i === 0 ? 'bg-[#4f46e5] text-white' : 'text-neutral-400 hover:text-white'}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div className="flex-1 p-5 bg-neutral-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">Overview</div>
                      <div className="text-xs text-neutral-500">Last 30 days</div>
                    </div>
                    <div className="h-7 w-24 rounded-md bg-[#4f46e5] opacity-90" />
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Conversations', val: '2,847', chg: '+18%' },
                      { label: 'Resolved by AI', val: '91.4%', chg: '+3.2%' },
                      { label: 'Avg. Handle Time', val: '2m 14s', chg: '-22%' },
                      { label: 'CSAT Score', val: '4.8/5', chg: '+0.4' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg bg-white border border-neutral-100 p-3">
                        <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                        <div className="text-base font-bold text-neutral-900">{s.val}</div>
                        <div className="text-xs text-emerald-600 font-medium mt-0.5">{s.chg}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 rounded-lg bg-white border border-neutral-100 p-3 h-32">
                      <div className="text-xs font-medium text-neutral-700 mb-2">Conversation volume</div>
                      <div className="flex items-end gap-1 h-20">
                        {[40,65,50,80,70,90,85,95,75,88,92,78].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `rgba(79,70,229,${0.3 + i * 0.05})` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white border border-neutral-100 p-3 h-32">
                      <div className="text-xs font-medium text-neutral-700 mb-2">Top intents</div>
                      {['Order status', 'Refunds', 'Account help', 'Technical'].map((intent, i) => (
                        <div key={intent} className="flex items-center gap-2 py-0.5">
                          <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                            <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: `${90 - i * 18}%` }} />
                          </div>
                          <span className="text-xs text-neutral-500 w-12 text-right">{90-i*18}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-14 border-y border-neutral-100">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-8">Trusted by customer support teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {['Acme Corp', 'Stellar Tech', 'Nova Retail', 'Apex Health', 'Quantum SaaS', 'Meridian Bank'].map(name => (
              <span key={name} className="text-sm font-bold text-neutral-500 tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">Everything your support team needs</h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto">A complete platform for building, deploying, and improving your AI customer support frontline.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Smart Knowledge Setup',
                desc: 'Add your website, PDFs, FAQs, and policies. Support Genius processes and organizes everything automatically.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                icon: Mic,
                title: 'Human-Like Voice Agent',
                desc: 'Fluid voice conversations with natural pacing, interruptions, and follow-ups — not a robotic IVR system.',
                color: 'bg-violet-50 text-violet-600',
              },
              {
                icon: Globe,
                title: 'Shareable Call Link',
                desc: 'Every business gets a branded voice support URL. Customers tap Start Call and instantly speak with your agent.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: MessageSquare,
                title: 'Website Widget',
                desc: 'Embed your AI agent on your website for both text and voice support with a single line of code.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Users,
                title: 'Customer Memory',
                desc: 'Remembers past conversations, resolutions, and preferences so customers never repeat themselves.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Zap,
                title: 'Autonomous Resolution',
                desc: 'Check orders, create cases, initiate refunds — the agent performs approved actions automatically.',
                color: 'bg-rose-50 text-rose-600',
              },
              {
                icon: PhoneCall,
                title: 'Smart Escalation',
                desc: 'Recognize when humans are needed and hand off with full context — no customer starts over.',
                color: 'bg-sky-50 text-sky-600',
              },
              {
                icon: BarChart3,
                title: 'Support Intelligence',
                desc: 'Identify recurring issues, frustration trends, and knowledge gaps across all your conversations.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: Shield,
                title: 'Continuous Improvement',
                desc: 'AI analyzes failed conversations and recommends knowledge updates to make your agent smarter.',
                color: 'bg-teal-50 text-teal-600',
              },
            ].map(f => (
              <div key={f.title} className="rounded-xl border border-neutral-100 p-6 hover:border-neutral-200 hover:shadow-sm transition-all">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.color} mb-4`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-neutral-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">From knowledge to live support in minutes</h2>
            <p className="text-lg text-neutral-500">No engineering required. No weeks of configuration.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Share your business knowledge',
                desc: 'Add your website URL, upload PDFs and documents, paste FAQs, or type in your policies. Support Genius automatically processes and indexes everything.',
                highlights: ['Website scraping', 'PDF/document upload', 'FAQ import', 'Policy management'],
              },
              {
                step: '02',
                title: 'Configure your AI agent',
                desc: 'Set your agent\'s name, persona, greeting, and escalation rules. Define what actions it can take, what it should never say, and when to involve a human.',
                highlights: ['Custom persona', 'Escalation rules', 'Approved actions', 'Response style'],
              },
              {
                step: '03',
                title: 'Test before you publish',
                desc: 'Use the Agent Testing Lab to simulate customer scenarios, test difficult questions, and identify weaknesses — before any real customer speaks with it.',
                highlights: ['Voice testing', 'Scenario simulation', 'Weakness identification', 'Confidence scoring'],
              },
              {
                step: '04',
                title: 'Deploy your support link',
                desc: 'Publish your branded support link and embed your widget. Customers tap once and speak with your AI agent — available 24/7, instantly.',
                highlights: ['Branded voice link', 'Embeddable widget', '24/7 availability', 'No downloads needed'],
              },
            ].map((s, i) => (
              <div key={s.step} className="flex gap-6 rounded-2xl bg-white border border-neutral-100 p-7">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-[#4f46e5] text-white font-bold text-lg">
                  {s.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.highlights.map(h => (
                      <span key={h} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        <CheckCircle className="h-3 w-3" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">Simple, predictable pricing</h2>
            <p className="text-lg text-neutral-500">Everything included. No per-conversation fees. No surprises.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="rounded-2xl border border-neutral-200 p-8">
              <div className="mb-6">
                <div className="text-sm font-semibold text-neutral-500 mb-1">Starter</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-neutral-900">$57</span>
                  <span className="text-neutral-500">/month</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">Perfect for small businesses getting started with AI support.</p>
              </div>
              <div className="space-y-3 mb-8">
                {['3 AI support agents', '1,000 conversations/month', 'Voice + widget support', 'Knowledge base (5 sources)', 'Smart escalation', 'Conversation analytics', 'Email support'].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className="block w-full rounded-lg border border-neutral-200 py-3 text-center text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors">
                Get started with Starter
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-[#4f46e5] p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-[#4f46e5] px-3 py-0.5 text-xs font-semibold text-white">Most Popular</span>
              </div>
              <div className="mb-6">
                <div className="text-sm font-semibold text-indigo-600 mb-1">Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-neutral-900">$97</span>
                  <span className="text-neutral-500">/month</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">For growing businesses that need the full platform.</p>
              </div>
              <div className="space-y-3 mb-8">
                {['10 AI support agents', '5,000 conversations/month', 'Voice + widget + phone support', 'Unlimited knowledge sources', 'Autonomous resolution actions', 'Advanced analytics & reports', 'Customer memory & history', 'AI continuous improvement', 'Priority support', 'Team management (unlimited)'].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-[#4f46e5] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className="block w-full rounded-lg bg-[#4f46e5] py-3 text-center text-sm font-semibold text-white hover:bg-[#4338ca] transition-colors">
                Get started with Pro
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-neutral-400 mt-8">
            Both plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1a1a2e]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to build your AI support frontline?</h2>
          <p className="text-lg text-neutral-400 mb-10">Join hundreds of businesses that have transformed their customer support with Support Genius AI.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#4f46e5] px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-[#4338ca] transition-colors">
              Start building for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-[15px] font-medium text-white hover:bg-white/10 transition-colors">
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-100 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#4f46e5] flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                <rect x="2" y="3" width="8" height="1.5" rx="0.75" fill="white"/>
                <rect x="2" y="7" width="6" height="1.5" rx="0.75" fill="white"/>
                <circle cx="12" cy="11" r="3" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-[#1a1a2e]">Support Genius AI</span>
          </div>
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} Support Genius AI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-sm text-neutral-400 hover:text-neutral-700">Privacy</Link>
            <Link href="/terms" className="text-sm text-neutral-400 hover:text-neutral-700">Terms</Link>
            <Link href="/contact" className="text-sm text-neutral-400 hover:text-neutral-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
