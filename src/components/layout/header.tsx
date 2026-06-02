'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Menu, X, LayoutDashboard, Calculator, PieChart, Layers, Filter, Skull, Trophy, TrendingUp, DollarSign, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const pageMeta: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/economics': 'Product Economics',
  '/budget-planner': 'Budget Planner',
  '/creative-analysis': 'Creative Analyse',
  '/funnel-analysis': 'Funnel Analyse',
  '/kill-engine': 'Kill Engine',
  '/winner-detection': 'Winner Detectie',
  '/scaling-center': 'Scaling Center',
  '/cash-forecast': 'Cash Forecast',
  '/settings': 'Instellingen',
}

const allNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'Overzicht' },
  { href: '/economics', icon: Calculator, label: 'Economics', section: 'Analyse' },
  { href: '/budget-planner', icon: PieChart, label: 'Budget Planner', section: 'Analyse' },
  { href: '/creative-analysis', icon: Layers, label: 'Creative Analyse', section: 'Analyse' },
  { href: '/funnel-analysis', icon: Filter, label: 'Funnel Analyse', section: 'Analyse' },
  { href: '/kill-engine', icon: Skull, label: 'Kill Engine', section: 'Actie' },
  { href: '/winner-detection', icon: Trophy, label: 'Winner Detectie', section: 'Actie' },
  { href: '/scaling-center', icon: TrendingUp, label: 'Scaling Center', section: 'Actie' },
  { href: '/cash-forecast', icon: DollarSign, label: 'Cash Forecast', section: 'Actie' },
  { href: '/settings', icon: Settings, label: 'Instellingen', section: 'Overig' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const title = pageMeta[pathname] ?? 'TVB Allocator'

  const sections = [...new Set(allNav.map(n => n.section))]

  return (
    <>
      <header className="flex items-center h-[var(--header-h)] px-4 md:px-5 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-white/[0.05] transition-colors"
        >
          <Menu size={17} />
        </button>

        {/* Mobile logo */}
        <div className="md:hidden shrink-0 w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white font-bold text-[9px]">TVB</span>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 text-[13px]">
          <span className="hidden md:block text-[var(--text-3)]">TVB Allocator</span>
          <span className="hidden md:block text-[var(--border-strong)] select-none">/</span>
          <span className="font-medium text-[var(--text-1)] truncate">{title}</span>
        </div>

        <div className="shrink-0">
          <UserButton appearance={{ elements: { avatarBox: 'w-[26px] h-[26px]' } }} />
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">
            <div className="flex items-center justify-between px-4 h-[var(--header-h)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">TVB</span>
                </div>
                <span className="text-[13px] font-semibold text-[var(--text-1)]">TVB Allocator</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {sections.map(section => {
                const items = allNav.filter(n => n.section === section)
                return (
                  <div key={section} className="mb-4">
                    <p className="px-2.5 mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                      {section}
                    </p>
                    {items.map(({ href, icon: Icon, label }) => {
                      const active = pathname === href
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'relative flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] transition-colors',
                            active ? 'bg-white/[0.06] text-[var(--text-1)] font-medium' : 'text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-white/[0.03]'
                          )}
                        >
                          {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full bg-[var(--accent)]" />}
                          <Icon size={15} className={active ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'} />
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
