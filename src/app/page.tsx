import Link from 'next/link'
import { Shield, Users, Database, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06060f] text-white antialiased">

      {/* ── NAVIGATION ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#06060f]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M4 5h8M4 9h6M13 14a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15.5 16.5l-1.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">SupportGenius AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-white/55">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/signup" className="text-sm font-medium bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-2 rounded-lg shadow-lg shadow-violet-900/40">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-purple-800/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-violet-400 mb-6 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
            Conversation intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Every customer conversation,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
              understood before the next one begins.
            </span>
          </h1>

          <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            SupportGenius AI analyses every call your team has, extracts what was promised, what was objected to and what happens next, and writes the follow-up — so no account depends on anyone&apos;s memory.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all text-white font-semibold px-6 py-3 rounded-xl shadow-xl shadow-violet-900/50 text-sm">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 transition-colors text-white/70 hover:text-white font-medium px-6 py-3 rounded-xl text-sm">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-white/30 tracking-wide">Call analysis · Commitment tracking · Follow-up drafting</p>
        </div>

        {/* ── MOCK ANALYSIS CARD ── */}
        <div className="relative max-w-3xl mx-auto mt-20">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/30 to-transparent pointer-events-none" />
          <div className="relative rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium text-white/60">Call Analysis — Acme Corp / Sarah Chen</span>
              </div>
              <span className="text-[10px] text-white/25 italic">Illustrative example</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
              {[
                { label: 'Summary', value: 'Renewal discussion. Customer satisfied with support volume but flagged slow response on P1 incidents. Requested SLA review before signing.' },
                { label: 'Buyer Intent', value: 'Intent to renew — conditional on revised SLA terms and improved escalation routing.' },
                { label: 'Sentiment', value: 'Positive overall. Frustration noted specifically around incident response times in Q3.' },
                { label: 'Objections', value: 'Response SLA for P1 issues. Ticket visibility for their engineering team during incidents.' },
                { label: 'Commitments', value: 'Send revised SLA draft by Thursday. Schedule technical review with their VP Eng next week.' },
                { label: 'Competitors Mentioned', value: 'Zendesk — mentioned as alternative being evaluated by their procurement team.' },
                { label: 'Decision Criteria', value: 'SLA guarantees, escalation transparency, dedicated support contact, pricing per seat.' },
                { label: 'Recommended Next Action', value: 'Send SLA draft today. Loop in account director before engineering review. Flag renewal risk to CS lead.' },
              ].map(item => (
                <div key={item.label} className="bg-[#06060f] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-400 mb-1.5">{item.label}</div>
                  <div className="text-sm text-white/70 leading-relaxed">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATING LOOP ── */}
      <section className="py-20 px-6 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">The SupportGenius loop</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Upload', 'Extract', 'Brief', 'Follow Up', 'Retain', 'Grow'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all cursor-default">
                  {step}
                </div>
                {i < arr.length - 1 && <span className="text-white/20 text-xs">→</span>}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/35 max-w-xl mx-auto">
            Every stage feeds the next automatically. A commitment made on a call is tracked, followed up on schedule, and visible to the whole team before the next conversation.
          </p>
        </div>
      </section>

      {/* ── EIGHT EXTRACTIONS ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">What it extracts</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              Eight things pulled from every call,{' '}
              <span className="text-white/50">automatically.</span>
            </h2>
            <p className="text-white/50 leading-relaxed">
              Nobody fills out a form after a conversation. Upload the recording or transcript and the platform does the reading.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.07]">
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
              <div key={item.n} className="bg-[#06060f] p-6 hover:bg-white/[0.03] transition-colors group">
                <div className="text-[10px] font-bold tracking-[0.15em] text-violet-500/60 mb-3 group-hover:text-violet-400 transition-colors">{item.n}</div>
                <div className="text-sm font-semibold text-white mb-2">{item.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRE-CALL BRIEF ── */}
      <section id="how" className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">Before the call</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
              Walk in knowing what happened last time.
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              The pre-call brief brings together relationship history, past objections, promises already made, a suggested opening and the questions worth asking. Your team arrives prepared, every time — not just when someone remembers to check the notes.
            </p>
            <div className="space-y-3">
              {['Relationship history at a glance', 'Open commitments and past objections', 'Suggested opening and questions', 'Full conversation timeline'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-600/20 to-transparent pointer-events-none" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-violet-400 font-bold mb-0.5">Pre-Call Brief</div>
                  <div className="text-sm font-semibold text-white">Marcus Lee — Bright Finance</div>
                </div>
                <div className="text-[10px] text-white/25 italic">Illustrative</div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Last call', value: 'Nov 14 · Renewal discussion · 32 min' },
                  { label: 'Open commitment', value: 'Send updated pricing by Nov 20 (overdue)' },
                  { label: 'Key objection', value: 'Integration time with their internal CRM' },
                  { label: 'Suggested opening', value: '"I have the revised pricing ready — wanted to walk through it before we talked about next steps."' },
                  { label: 'Worth asking', value: 'Has the CRM concern been resolved internally? Who is involved in final sign-off?' },
                ].map(row => (
                  <div key={row.label}>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">{row.label}</div>
                    <div className="text-sm text-white/70 leading-snug">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOLLOW-UP AI ── */}
      <section className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-600/20 to-transparent pointer-events-none" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="text-[10px] uppercase tracking-[0.15em] text-violet-400 font-bold">Follow-Up Draft</div>
                <div className="text-[10px] text-white/25 italic">Illustrative</div>
              </div>
              <div className="text-xs text-white/40 mb-1">To: sarah.chen@acmecorp.com</div>
              <div className="text-xs text-white/40 mb-4">Subject: SLA draft + next steps</div>
              <div className="text-sm text-white/65 leading-relaxed space-y-3">
                <p>Hi Sarah,</p>
                <p>Following our call today — I&apos;ve attached the revised SLA draft with updated P1 response windows we discussed. I&apos;ve also flagged the incident visibility point for our engineering team to address before your review.</p>
                <p>Does Thursday at 2pm work for the technical session with your VP Eng? Happy to adjust.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.07]">
                <div className="text-[10px] text-violet-400/70 uppercase tracking-widest">Written from: Call transcript · Nov 18</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">After the call</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
              The follow-up is written from what was actually said.
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              Follow-Up AI decides who needs a message, when it should go, and drafts it from that contact&apos;s own history — not a template. Every recipient gets a message that reflects their conversation, not a broadcast that pretends otherwise.
            </p>
            <div className="space-y-3">
              {['Drafted from the call transcript, not a template', 'Right contact, right time, right message', 'Works across active accounts and dormant ones', 'Each message reflects that account\'s history'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM MEMORY ── */}
      <section className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">One memory across the team</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
            Nothing learned on a call gets lost.
          </h2>
          <p className="text-lg text-white/50 leading-relaxed mb-16 max-w-2xl mx-auto">
            Every analysis, briefing and action plan is saved and searchable, visible to the whole team. New team members walk into a call knowing what happened before. No one needs to ask &quot;who owns this account?&quot;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '⟳', label: 'Full history', desc: 'Every call, commitment and briefing — searchable across the whole team.' },
              { icon: '↗', label: 'Instant onboarding', desc: 'New reps walk in prepared. The account history is already there.' },
              { icon: '⌖', label: 'Pattern recognition', desc: 'Objections and competitor mentions become trends the team can act on.' },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 text-left hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
                <div className="text-2xl mb-4 text-violet-400">{item.icon}</div>
                <div className="text-sm font-semibold text-white mb-2">{item.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOVERNANCE ── */}
      <section className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">Governed by design</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
                Sensitive calls,{' '}
                <span className="text-white/50">handled with care.</span>
              </h2>
              <p className="text-white/55 leading-relaxed">
                Workspaces are isolated at the database level, access is role-based, and uploaded calls run your workspace only. They are never used to train shared models.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Database, title: 'Workspace isolation, enforced in the database', body: 'Row-level security scopes every query to your organisation — access control is not a frontend check that can be bypassed.' },
                { icon: Users, title: 'Role-based access for the whole team', body: 'Owners, admins and members see the same system with the right level of control for each role.' },
                { icon: Shield, title: 'Your data stays yours', body: 'Uploaded calls and transcripts are used to run your workspace and nothing else. Never to train shared models.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-white/45 leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Credits for the work you run.</h2>
            <p className="text-white/45 max-w-xl mx-auto text-sm leading-relaxed">
              Every plan includes every module. The only difference is the monthly credit allowance. Credits refresh each billing cycle. Unlimited team members on all plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                credits: '200 credits / mo',
                features: ['All modules included', '1 AI agent', '100 conversations / mo', 'Community support'],
                cta: 'Get started',
                href: '/signup',
                featured: false,
              },
              {
                name: 'Professional',
                price: '$57',
                period: 'per month',
                credits: '4,000 credits / mo',
                features: ['All modules included', '3 AI agents', '1,000 conversations / mo', 'Follow-up campaigns', 'Priority support'],
                cta: 'Get started',
                href: process.env.NEXT_PUBLIC_STARTER_PAYMENT_LINK || '/signup',
                featured: true,
              },
              {
                name: 'Business',
                price: '$97',
                period: 'per month',
                credits: '11,000 credits / mo',
                features: ['All modules included', '10 AI agents', '5,000 conversations / mo', 'Daily briefings', 'Dedicated support'],
                cta: 'Get started',
                href: process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK || '/signup',
                featured: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-2xl border p-7 flex flex-col ${plan.featured ? 'border-violet-500/50 bg-violet-600/10' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold tracking-wide uppercase">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-3">{plan.name}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-white/35">{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs text-violet-400/80">{plan.credits}</div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className={`w-full text-center text-sm font-semibold py-3 rounded-xl transition-all ${plan.featured ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40' : 'border border-white/15 hover:border-white/30 text-white/70 hover:text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 -top-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-700/15 rounded-full blur-[80px]" />
          </div>
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Turn every conversation into the next right move.
          </h2>
          <p className="relative text-white/45 mb-10 leading-relaxed">
            The platform reads the call, tracks the commitment, writes the follow-up, and briefs the team — before the next one begins.
          </p>
          <div className="relative flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all text-white font-semibold px-7 py-3.5 rounded-xl shadow-xl shadow-violet-900/50 text-sm">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 transition-colors text-white/60 hover:text-white font-medium px-7 py-3.5 rounded-xl text-sm">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path d="M4 5h8M4 9h6M13 14a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15.5 16.5l-1.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-white/80">SupportGenius AI</span>
            </Link>

            <div className="flex flex-wrap gap-6 text-xs text-white/35">
              <Link href="#features" className="hover:text-white/70 transition-colors">Features</Link>
              <Link href="#how" className="hover:text-white/70 transition-colors">How it works</Link>
              <Link href="#pricing" className="hover:text-white/70 transition-colors">Pricing</Link>
              <Link href="/dashboard" className="hover:text-white/70 transition-colors">Sign in</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} SupportGenius AI. All rights reserved.
              <span className="mx-2">·</span>
              <a href="mailto:hello@supportgeniusai.online" className="hover:text-white/50 transition-colors">hello@supportgeniusai.online</a>
            </p>
            <div className="flex gap-5 text-xs text-white/25">
              <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-white/50 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
