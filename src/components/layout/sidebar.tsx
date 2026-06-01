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
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#0d0d0d] border-r border-[#1a1a1a] transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-[#1a1a1a]',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">TVB</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[#f5f5f5] font-semibold text-sm leading-tight">TVB Allocator</p>
            <p className="text-[#525252] text-[10px] leading-tight truncate">Truin vdBrink Test Budget</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
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

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[#1a1a1a]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#525252] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors text-sm',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
