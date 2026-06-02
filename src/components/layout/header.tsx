'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Menu, X, LayoutDashboard, Calculator, PieChart, Layers,
  Filter, Skull, Trophy, TrendingUp, DollarSign, Settings,
} from 'lucide-react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':         { title: 'Dashboard',         subtitle: 'Overzicht'                  },
  '/economics':         { title: 'Product Economics', subtitle: 'Marge & break-even CPA'     },
  '/budget-planner':    { title: 'Budget Planner',    subtitle: 'Testbudget verdelen'         },
  '/creative-analysis': { title: 'Creative Analyse',  subtitle: 'CTR, CPC en CPM'            },
  '/funnel-analysis':   { title: 'Funnel Analyse',    subtitle: 'Conversieproblemen opsporen' },
  '/kill-engine':       { title: 'Kill Engine',       subtitle: 'Onderpresteerders stoppen'   },
  '/winner-detection':  { title: 'Winner Detectie',   subtitle: 'Winnaars identificeren'      },
  '/scaling-center':    { title: 'Scaling Center',    subtitle: '10-daagse schaalroadmap'     },
  '/cash-forecast':     { title: 'Cash Forecast',     subtitle: 'Budget runway & depletie'    },
  '/settings':          { title: 'Instellingen',      subtitle: 'Account en voorkeuren'       },
}

const drawerSections = [
  {
    label: 'Overzicht',
    items: [{ href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Analyse',
    items: [
      { href: '/economics',         icon: Calculator, label: 'Economics'        },
      { href: '/budget-planner',    icon: PieChart,   label: 'Budget Planner'   },
      { href: '/creative-analysis', icon: Layers,     label: 'Creative Analyse' },
      { href: '/funnel-analysis',   icon: Filter,     label: 'Funnel Analyse'   },
    ],
  },
  {
    label: 'Actie',
    items: [
      { href: '/kill-engine',      icon: Skull,      label: 'Kill Engine'     },
      { href: '/winner-detection', icon: Trophy,     label: 'Winner Detectie' },
      { href: '/scaling-center',   icon: TrendingUp, label: 'Scaling Center'  },
      { href: '/cash-forecast',    icon: DollarSign, label: 'Cash Forecast'   },
    ],
  },
  {
    label: 'Overig',
    items: [{ href: '/settings', icon: Settings, label: 'Instellingen' }],
  },
]

export function Header() {
  const pathname = usePathname()
  const meta = pageMeta[pathname] ?? { title: 'TVB Allocator', subtitle: '' }
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex items-center h-[var(--header-h)] px-5 md:px-6 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 gap-4">
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-2)] hover:bg-black/[0.04] transition-all duration-150"
          onClick={() => setOpen(true)}
        >
          <Menu size={17} />
        </button>

        <div className="md:hidden w-6 h-6 rounded-[6px] bg-[var(--accent)] flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-semibold text-[8px]">TVB</span>
        </div>

        <div className="flex items-baseline gap-2.5 min-w-0 flex-1">
          <h1 className="text-[14px] font-semibold text-[var(--text-1)] tracking-[-0.02em] leading-none truncate">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <span className="hidden sm:block text-[13px] text-[var(--text-3)] leading-none truncate">
              {meta.subtitle}
            </span>
          )}
        </div>

        <UserButton appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-[var(--surface)] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-[var(--header-h)] border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-[8px] bg-[var(--accent)] flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-[10px]">TVB</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--text-1)] tracking-[-0.02em]">
                  TVB Allocator
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-2)] hover:bg-black/[0.04] transition-all duration-150"
              >
                <X size={15} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
              {drawerSections.map(section => (
                <div key={section.label}>
                  <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-3)]">
                    {section.label}
                  </p>
                  <div className="space-y-[2px]">
                    {section.items.map(({ href, icon: Icon, label }) => {
                      const active = pathname === href || pathname.startsWith(href + '/')
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-[7px] rounded-[var(--radius-sm)] text-[13px] transition-all duration-150',
                            active
                              ? 'bg-[var(--accent-dim)] text-[var(--accent)] font-medium'
                              : 'text-[var(--text-2)] hover:bg-black/[0.03] hover:text-[var(--text-1)]'
                          )}
                        >
                          <Icon size={15} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                          <span className="leading-none">{label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="px-5 py-4 border-t border-[var(--border)]">
              <UserButton appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
