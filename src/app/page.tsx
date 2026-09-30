import Link from 'next/link'
import { Shield, Users, Lock, ChevronRight, Database } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0f0520] antialiased">

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-md shadow-purple-200">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M4 5h8M4 9h6M13 14a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M15.5 16.5l-1.5-1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[#0f0520]">SupportGenius AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0f0520]/55">
            <Link href="#features" className="hover:text-[#0f0520] transition-colors">Features</Link>
            <Link href="#how" className="hover:text-[#0f0520] transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-[#0f0520] transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-[#0f0520]/55 hover:text-[#0f0520] transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-50">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-violet-700 hover:bg-violet-600 transition-colors text-white px-5 py-2.5 rounded-lg shadow-md shadow-violet-200">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-100 rounded-full blur-[120px] opacity-70" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-violet-700 mb-7 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50">
            The all-in-one Sales AI operating system for businesses
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08] mb-7 text-[#0f0520]">
            Every customer conversation,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-700 to-purple-500">
              understood before the next one begins.
            </span>
          </h1>

          <p className="text-lg text-[#0f0520]/65 max-w-2xl mx-auto leading-relaxed mb-10">
            SupportGenius AI analyses every call, extracts intent, objections, and commitments, then writes pre-call briefs, follow-ups and exactly what your team should do next — all from the transcript.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 transition-all text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-violet-200 text-sm">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border-2 border-violet-200 hover:border-violet-400 transition-colors text-violet-700 hover:text-violet-800 font-semibold px-8 py-3.5 rounded-xl text-sm bg-white">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-[#0f0520]/40 tracking-wider font-medium">Call analysis · Commitment tracking · Follow-up drafting</p>
        </div>
      </section>

      {/* ── LOOP ── */}
      <section className="py-14 px-6 bg-[#1a0a3e]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-300/60 mb-7">The SupportGenius loop</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {['Upload', 'Extract', 'Brief', 'Follow Up', 'Retain', 'Grow'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2.5">
                <span className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/80 hover:bg-violet-600/30 hover:border-violet-400/50 hover:text-white transition-all cursor-default">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-white/25 text-xs">→</span>}
              </div>
            ))}
          </div>
          <p className="mt-7 text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
            Every stage feeds the next automatically. A commitment made on a call is tracked, followed up on schedule, and visible to the whole team before the next conversation.
          </p>
        </div>
      </section>

      {/* ── EIGHT EXTRACTIONS ── */}
      <section id="features" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-violet-600 mb-5">What it extracts</p>
            <h2 className="text-3xl sm:text-[2.4rem] font-extrabold tracking-tight leading-tight mb-5 text-[#0f0520]">
              Eight things pulled from every call, automatically.
            </h2>
            <p className="text-[#0f0520]/60 leading-relaxed text-lg">
              Nobody fills out a form after a conversation. Upload the recording or transcript. The platform reads it, extracts what matters, and writes what happens next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-purple-100 rounded-2xl overflow-hidden border border-purple-100 shadow-sm">
            {[
              { n: '01', label: 'Summary', desc: 'A plain-English account of what was discussed and where the relationship stands.' },
              { n: '02', label: 'Buyer Intent', desc: 'What the contact is moving toward — renewal, expansion, evaluation, or exit.' },
              { n: '03', label: 'Sentiment', desc: 'The emotional register of the call and where friction surfaced.' },
              { n: '04', label: 'Objections', desc: 'Every concern raised, stated or implied, with the context it appeared in.' },
              { n: '05', label: 'Commitments', desc: 'What your team promised to deliver and by when.' },
              { n: '06', label: 'Competitors Mentioned', desc: 'Alternatives named on the call and how they were positioned.' },
              { n: '07', label: 'Decision Criteria', desc: 'What the contact said matters most when evaluating options.' },
              { n: '08', label: 'Next Action', desc: 'The single most important move — specific, concrete, and ready to act on.' },
            ].map(item => (
              <div key={item.n} className="bg-white p-6 hover:bg-violet-50 transition-colors group">
                <div className="text-[10px] font-bold tracking-[0.15em] text-violet-400 mb-3 group-hover:text-violet-600 transition-colors">{item.n}</div>
                <div className="text-sm font-bold text-[#0f0520] mb-2">{item.label}</div>
                <div className="text-sm text-[#0f0520]/55 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE THE CALL ── */}
      <section id="how" className="py-28 px-6 bg-purple-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-violet-600 mb-5">Before the call</p>
            <h2 className="text-3xl sm:text-[2.2rem] font-extrabold tracking-tight leading-tight mb-6 text-[#0f0520]">
              Walk in knowing what happened last time.
            </h2>
            <p className="text-[#0f0520]/65 leading-relaxed mb-8 text-lg">
              The pre-call brief brings together relationship history, past objections, promises already made, a suggested opening and the questions worth asking. Your team arrives prepared, every time.
            </p>
            <div className="space-y-3.5">
              {[
                'Relationship history and open commitments',
                'Past objections, surfaced before the call',
                'Suggested opening line and questions worth asking',
                'Full conversation timeline, visible to the whole team',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-[#0f0520]/70">
                  <div className="h-2 w-2 rounded-full bg-violet-600 shrink-0 mt-1.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { n: '01', title: 'Account history at a glance', body: 'Every past call, commitment and outcome — summarised and searchable. New team members arrive briefed.' },
              { n: '02', title: 'Open items from the last call', body: 'Commitments not yet delivered. Objections not yet addressed. Both visible before the conversation starts.' },
              { n: '03', title: 'A suggested opening, not a blank page', body: 'The brief includes a recommended first line and the questions most worth asking, built from that account\'s own history.' },
            ].map(card => (
              <div key={card.n} className="p-6 rounded-2xl border border-purple-200 bg-white shadow-sm hover:border-violet-400 hover:shadow-md transition-all">
                <div className="text-[10px] font-bold tracking-[0.15em] text-violet-400 mb-2">{card.n}</div>
                <div className="text-sm font-bold text-[#0f0520] mb-2">{card.title}</div>
                <div className="text-sm text-[#0f0520]/60 leading-relaxed">{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AFTER THE CALL ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-4">
            {[
              { n: '01', title: 'Written from the transcript, not a template', body: 'Every follow-up message reflects the specific conversation — what was said, what was promised, what needs to happen next.' },
              { n: '02', title: 'Right contact, right time, right message', body: 'Follow-Up AI decides who needs a message and when — across active accounts, quiet opportunities and dormant relationships.' },
              { n: '03', title: 'Campaign-level reach, account-level relevance', body: 'Ask for a campaign — "everyone quiet for 7 days" — and each recipient gets a message built from their own history, not a blast.' },
            ].map(card => (
              <div key={card.n} className="p-6 rounded-2xl border border-purple-200 bg-white shadow-sm hover:border-violet-400 hover:shadow-md transition-all">
                <div className="text-[10px] font-bold tracking-[0.15em] text-violet-400 mb-2">{card.n}</div>
                <div className="text-sm font-bold text-[#0f0520] mb-2">{card.title}</div>
                <div className="text-sm text-[#0f0520]/60 leading-relaxed">{card.body}</div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-violet-600 mb-5">After the call</p>
            <h2 className="text-3xl sm:text-[2.2rem] font-extrabold tracking-tight leading-tight mb-6 text-[#0f0520]">
              The follow-up is written from what was actually said.
            </h2>
            <p className="text-[#0f0520]/65 leading-relaxed mb-8 text-lg">
              Follow-Up AI decides who needs a message, when it should go, and drafts it from that contact&apos;s own history — not from a template. Every recipient gets a message that reflects their conversation.
            </p>
            <div className="space-y-3.5">
              {[
                'Drafted from the call transcript, not a template',
                'Works across active accounts and dormant ones',
                'Each message reflects that account\'s history',
                'Campaign-level reach with account-level relevance',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-[#0f0520]/70">
                  <div className="h-2 w-2 rounded-full bg-violet-600 shrink-0 mt-1.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM MEMORY ── */}
      <section className="py-28 px-6 bg-[#1a0a3e]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-300/70 mb-5">One memory across the team</p>
              <h2 className="text-3xl sm:text-[2.2rem] font-extrabold tracking-tight leading-tight mb-6 text-white">
                Nothing learned on a call gets lost.
              </h2>
              <p className="text-white/65 leading-relaxed mb-6 text-lg">
                Every analysis, briefing and action plan is saved and searchable, visible to the whole team. New team members walk into a call knowing what happened before.
              </p>
              <p className="text-white/55 leading-relaxed">
                Objections and competitor mentions become patterns the whole team can see — not intelligence that disappears when someone leaves.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Full history', desc: 'Every call, commitment and briefing — unlimited history, searchable across the whole team, on every plan.' },
                { label: 'Instant onboarding', desc: 'New reps walk in prepared. The account history is already there. No handover meeting required.' },
                { label: 'Pattern recognition', desc: 'Objections and competitor mentions accumulate into trends the team can see and act on.' },
                { label: 'Plain-language questions', desc: 'Ask about your accounts in plain language and get an answer backed by the calls themselves.' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-400/40 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                    <div className="text-sm text-white/55 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GOVERNANCE ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-violet-600 mb-5">Governed by design</p>
            <h2 className="text-3xl sm:text-[2.4rem] font-extrabold tracking-tight leading-tight mb-5 text-[#0f0520]">
              Sensitive calls, handled with care.
            </h2>
            <p className="text-[#0f0520]/60 max-w-xl mx-auto leading-relaxed text-lg">
              Workspaces are isolated at the database level, access is role-based, and uploaded calls run your workspace only. They are never used to train shared models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Database, title: 'Workspace isolation, enforced in the database', body: 'Row-level security scopes every query to your organisation — access control is not a frontend check that can be bypassed.' },
              { icon: Users, title: 'Role-based access for the whole team', body: 'Owners, admins and members see the same system with the right level of control for each role.' },
              { icon: Lock, title: 'Your data stays yours', body: 'Uploaded calls and transcripts are used to run your workspace and nothing else. Never to train shared models.' },
            ].map(item => (
              <div key={item.title} className="p-7 rounded-2xl border border-purple-100 bg-purple-50 hover:border-violet-300 hover:shadow-md transition-all">
                <div className="h-11 w-11 rounded-xl bg-violet-700 flex items-center justify-center mb-6 shadow-md shadow-violet-200">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-bold text-[#0f0520] mb-3 leading-snug">{item.title}</div>
                <div className="text-sm text-[#0f0520]/60 leading-relaxed">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6 bg-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-violet-600 mb-5">Pricing</p>
            <h2 className="text-3xl sm:text-[2.4rem] font-extrabold tracking-tight mb-5 text-[#0f0520]">Credits for the work you run.</h2>
            <p className="text-[#0f0520]/60 max-w-xl mx-auto leading-relaxed text-lg">
              Every plan includes every module. The only difference is the monthly credit allowance. Credits refresh each billing cycle. Unlimited team members on all plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                credits: '200 credits / month',
                desc: 'Start running call analysis and building your account history.',
                features: ['All modules included', '1 AI agent', '100 conversations / month', 'Unlimited team members', 'Unlimited history'],
                href: '/signup',
                featured: false,
              },
              {
                name: 'Professional',
                price: '$57',
                period: 'per month',
                credits: '4,000 credits / month',
                desc: 'Daily analysis, follow-up campaigns across the full pipeline.',
                features: ['All modules included', '3 AI agents', '1,000 conversations / month', 'Unlimited team members', 'Priority support'],
                href: process.env.NEXT_PUBLIC_STARTER_PAYMENT_LINK || '/signup',
                featured: true,
              },
              {
                name: 'Business',
                price: '$97',
                period: 'per month',
                credits: '11,000 credits / month',
                desc: 'Built for teams running daily briefings and high call volume.',
                features: ['All modules included', '10 AI agents', '5,000 conversations / month', 'Unlimited team members', 'Dedicated support'],
                href: process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK || '/signup',
                featured: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-2xl p-7 flex flex-col ${plan.featured ? 'border-2 border-violet-600 bg-white shadow-xl shadow-violet-100' : 'border border-purple-200 bg-white shadow-sm'}`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-violet-700 text-white text-[10px] font-bold tracking-[0.12em] uppercase shadow-lg shadow-violet-300">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f0520]/40 mb-4">{plan.name}</div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-extrabold text-[#0f0520]">{plan.price}</span>
                    <span className="text-sm text-[#0f0520]/40">{plan.period}</span>
                  </div>
                  <div className="text-xs font-semibold text-violet-600 mb-3">{plan.credits}</div>
                  <div className="text-sm text-[#0f0520]/60 leading-relaxed">{plan.desc}</div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#0f0520]/65">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full text-center text-sm font-bold py-3.5 rounded-xl transition-all ${plan.featured ? 'bg-violet-700 hover:bg-violet-600 text-white shadow-md shadow-violet-200' : 'border-2 border-violet-200 hover:border-violet-500 text-violet-700 hover:bg-violet-50'}`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 bg-[#1a0a3e]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-[2.6rem] font-extrabold tracking-tight mb-6 text-white leading-tight">
            Turn every conversation into the next right move.
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed text-lg">
            The platform reads the call, tracks the commitment, writes the follow-up, and briefs the team — before the next one begins.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white hover:bg-purple-50 transition-all text-violet-800 font-bold px-8 py-4 rounded-xl shadow-lg text-sm">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border-2 border-white/25 hover:border-white/50 transition-colors text-white/75 hover:text-white font-semibold px-8 py-4 rounded-xl text-sm">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-purple-100 py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-md shadow-purple-200">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path d="M4 5h8M4 9h6M13 14a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M15.5 16.5l-1.5-1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-[#0f0520]">SupportGenius AI</span>
            </Link>
            <div className="flex flex-wrap gap-6 text-xs font-medium text-[#0f0520]/40">
              <Link href="#features" className="hover:text-[#0f0520]/70 transition-colors">Features</Link>
              <Link href="#how" className="hover:text-[#0f0520]/70 transition-colors">How it works</Link>
              <Link href="#pricing" className="hover:text-[#0f0520]/70 transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-[#0f0520]/70 transition-colors">Sign in</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-purple-100">
            <p className="text-xs text-[#0f0520]/35">
              © {new Date().getFullYear()} SupportGenius AI · All rights reserved ·{' '}
              <a href="mailto:hello@supportgeniusai.online" className="hover:text-[#0f0520]/60 transition-colors">hello@supportgeniusai.online</a>
            </p>
            <div className="flex gap-5 text-xs text-[#0f0520]/35">
              <Link href="/privacy" className="hover:text-[#0f0520]/60 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#0f0520]/60 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-[#0f0520]/60 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
