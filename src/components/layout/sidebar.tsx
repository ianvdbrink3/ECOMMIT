'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Calculator,
  PieChart,
  Layers,
  Filter,
  Skull,
  Trophy,
  TrendingUp,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { NavItem } from './nav-item'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/economics', icon: Calculator, label: 'Economics' },
  { href: '/budget-planner', icon: PieChart, label: 'Budget Planner' },
  { href: '/creative-analysis', icon: Layers, label: 'Creative Analysis' },
  { href: '/funnel-analysis', icon: Filter, label: 'Funnel Analysis' },
  { href: '/kill-engine', icon: Skull, label: 'Kill Engine' },
  { href: '/winner-detection', icon: Trophy, label: 'Winner Detection' },
  { href: '/scaling-center', icon: TrendingUp, label: 'Scaling Center' },
  { href: '/cash-forecast', icon: DollarSign, label: 'Cash Forecast' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#0a0a0a] border-r border-[#161616] transition-all duration-200 ease-in-out',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 h-14 border-b border-[#161616] shrink-0',
          collapsed && 'justify-center px-0'
        )}
      >
        <div className="shrink-0 w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-[11px] tracking-tight">TVB</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[#efefef] font-semibold text-[13px] leading-tight truncate">
              TVB Allocator
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-[#161616] px-2 py-2 space-y-0.5">
        <NavItem
          href="/settings"
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
        />

        {/* User + collapse row */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2',
            collapsed && 'justify-center px-0'
          )}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-6 h-6',
                userButtonPopoverCard: 'bg-[#111111] border border-[#242424]',
              },
            }}
          />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto text-[#444444] hover:text-[#888888] transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={15} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 mx-auto flex items-center justify-center py-1.5 text-[#444444] hover:text-[#888888] transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    </aside>
  )
}
