'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Calculator, PieChart, Layers, Filter,
  Skull, Trophy, TrendingUp, DollarSign, Settings,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  {
    label: 'Overzicht',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { href: '/economics', icon: Calculator, label: 'Economics' },
      { href: '/budget-planner', icon: PieChart, label: 'Budget Planner' },
      { href: '/creative-analysis', icon: Layers, label: 'Creative Analyse' },
      { href: '/funnel-analysis', icon: Filter, label: 'Funnel Analyse' },
    ],
  },
  {
    label: 'Actie',
    items: [
      { href: '/kill-engine', icon: Skull, label: 'Kill Engine' },
      { href: '/winner-detection', icon: Trophy, label: 'Winner Detectie' },
      { href: '/scaling-center', icon: TrendingUp, label: 'Scaling Center' },
      { href: '/cash-forecast', icon: DollarSign, label: 'Cash Forecast' },
    ],
  },
]

interface NavLinkProps {
  href: string
  icon: React.ElementType
  label: string
  collapsed: boolean
}

function NavLink({ href, icon: Icon, label, collapsed }: NavLinkProps) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-[7px] text-[13px] transition-all duration-100',
        collapsed && 'justify-center px-0 w-9 mx-auto',
        active
          ? 'bg-white/[0.06] text-[var(--text-1)] font-medium'
          : 'text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-white/[0.03]'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full bg-[var(--accent)]" />
      )}
      <Icon
        size={15}
        className={cn(
          'shrink-0 transition-colors',
          active ? 'text-[var(--accent)]' : 'text-[var(--text-3)] group-hover:text-[var(--text-2)]'
        )}
      />
      {!collapsed && <span className="leading-none">{label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] transition-[width] duration-200 ease-in-out shrink-0',
        collapsed ? 'w-14' : 'w-[var(--sidebar-w)]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 h-[var(--header-h)] px-4 border-b border-[var(--border)]',
        collapsed && 'justify-center px-0'
      )}>
        <div className="shrink-0 w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)]">
          <span className="text-white font-bold text-[10px] tracking-tight">TVB</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-[13px] font-semibold text-[var(--text-1)] leading-none block truncate">
              TVB Allocator
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, i) => (
          <div key={section.label} className={cn(i > 0 && 'mt-4')}>
            {!collapsed && (
              <p className="px-2.5 mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink key={item.href} {...item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-[var(--border)] px-2 py-2 space-y-1">
        <NavLink href="/settings" icon={Settings} label="Instellingen" collapsed={collapsed} />
        <div className={cn(
          'flex items-center gap-2.5 px-2.5 py-1.5',
          collapsed && 'justify-center px-0'
        )}>
          <UserButton
            appearance={{ elements: { avatarBox: 'w-6 h-6' } }}
          />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 rounded text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-9 mx-auto flex items-center justify-center py-1.5 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </aside>
  )
}
