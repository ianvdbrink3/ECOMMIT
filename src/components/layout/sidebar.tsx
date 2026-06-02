'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Calculator, PieChart, Layers, Filter,
  Skull, Trophy, TrendingUp, DollarSign, Settings,
  PanelLeftClose, PanelLeftOpen,
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
]

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
}: {
  href: string
  icon: React.ElementType
  label: string
  collapsed: boolean
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center rounded-[var(--radius-sm)] transition-all duration-150',
        collapsed ? 'justify-center w-9 h-9 mx-auto' : 'gap-3 px-3 py-[7px]',
        active
          ? 'text-[var(--text-1)]'
          : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
      )}
    >
      {active && (
        <span className="absolute left-0 inset-y-[5px] w-[2.5px] rounded-r-full bg-[var(--accent)]" />
      )}
      <Icon
        size={15}
        strokeWidth={active ? 2.2 : 1.8}
        className={cn(
          'shrink-0 transition-colors duration-150',
          active
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-3)] group-hover:text-[var(--text-2)]'
        )}
      />
      {!collapsed && (
        <span className={cn('text-[13px] leading-none tracking-[-0.01em]', active && 'font-medium')}>
          {label}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)]',
        'transition-[width] duration-200 ease-in-out shrink-0',
        collapsed ? 'w-[56px]' : 'w-[var(--sidebar-w)]'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-[var(--header-h)] border-b border-[var(--border)]',
          collapsed ? 'justify-center' : 'px-4 gap-3'
        )}
      >
        <div className="shrink-0 w-7 h-7 rounded-[8px] bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white font-bold text-[10px] tracking-[-0.02em]">TVB</span>
        </div>
        {!collapsed && (
          <span className="text-[14px] font-semibold text-[var(--text-1)] tracking-[-0.03em] truncate">
            TVB Allocator
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {sections.map(section => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">
                {section.label}
              </p>
            )}
            <div className="space-y-[2px]">
              {section.items.map(item => (
                <NavLink key={item.href} {...item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-[var(--border)] px-2 py-3 space-y-[2px]">
        <NavLink href="/settings" icon={Settings} label="Instellingen" collapsed={collapsed} />
        <div className={cn(
          'flex items-center pt-2',
          collapsed ? 'flex-col gap-2 items-center' : 'px-3 gap-3'
        )}>
          <UserButton appearance={{ elements: { avatarBox: 'w-6 h-6' } }} />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-150"
            >
              <PanelLeftClose size={14} />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-150"
            >
              <PanelLeftOpen size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
