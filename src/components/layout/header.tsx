'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LayoutDashboard, Calculator, PieChart, Layers, Filter, Skull, Trophy, TrendingUp, DollarSign, Settings } from 'lucide-react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Overzicht' },
  '/economics': { title: 'Product Economics', description: 'Marge & break-even CPA' },
  '/budget-planner': { title: 'Budget Planner', description: 'Testbudget verdelen' },
  '/creative-analysis': { title: 'Creative Analyse', description: 'CTR, CPC, CPM beoordeling' },
  '/funnel-analysis': { title: 'Funnel Analyse', description: 'Conversieproblemen opsporen' },
  '/kill-engine': { title: 'Kill Engine', description: 'Onderpresteerders stoppen' },
  '/winner-detection': { title: 'Winner Detectie', description: 'Winnaars identificeren' },
  '/scaling-center': { title: 'Scaling Center', description: '10-daagse schaalroadmap' },
  '/cash-forecast': { title: 'Cash Forecast', description: 'Budget runway & depletie' },
  '/settings': { title: 'Instellingen', description: 'Account en voorkeuren' },
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/economics', icon: Calculator, label: 'Economics' },
  { href: '/budget-planner', icon: PieChart, label: 'Budget Planner' },
  { href: '/creative-analysis', icon: Layers, label: 'Creative Analyse' },
  { href: '/funnel-analysis', icon: Filter, label: 'Funnel Analyse' },
  { href: '/kill-engine', icon: Skull, label: 'Kill Engine' },
  { href: '/winner-detection', icon: Trophy, label: 'Winner Detectie' },
  { href: '/scaling-center', icon: TrendingUp, label: 'Scaling Center' },
  { href: '/cash-forecast', icon: DollarSign, label: 'Cash Forecast' },
  { href: '/settings', icon: Settings, label: 'Instellingen' },
]

export function Header() {
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] ?? { title: 'TVB Allocator', description: '' }
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="flex items-center h-14 px-4 border-b border-[#161616] bg-[#080808] shrink-0 gap-3">
        {/* Hamburger — alleen mobiel */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#555555] hover:text-[#efefef] hover:bg-[#141414] transition-colors"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </button>

        {/* TVB logo — alleen mobiel */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-[9px]">TVB</span>
          </div>
        </div>

        {/* Paginatitel */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="text-[13px] font-semibold text-[#efefef] leading-none truncate">
            {pageInfo.title}
          </h1>
          {pageInfo.description && (
            <>
              <span className="hidden sm:block text-[#2a2a2a] text-sm select-none">/</span>
              <p className="hidden sm:block text-[12px] text-[#555555] leading-none truncate">
                {pageInfo.description}
              </p>
            </>
          )}
        </div>

        {/* User button rechts */}
        <div className="shrink-0">
          <UserButton
            appearance={{
              elements: { avatarBox: 'w-7 h-7' },
            }}
          />
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-[#161616] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#161616]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-[11px]">TVB</span>
                </div>
                <span className="text-[13px] font-semibold text-[#efefef]">TVB Allocator</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#555555] hover:text-[#efefef] hover:bg-[#141414]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
              {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-[#1a1a1a] text-[#efefef] font-medium'
                        : 'text-[#666666] hover:text-[#cccccc] hover:bg-[#141414]'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-blue-500" />
                    )}
                    <Icon size={16} className={isActive ? 'text-blue-400' : 'text-[#555555]'} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="px-4 py-3 border-t border-[#161616]">
              <UserButton appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
