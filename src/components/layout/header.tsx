'use client'

import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Overview of your campaign performance',
  },
  '/economics': {
    title: 'Product Economics',
    description: 'Calculate true margins and break-even CPA',
  },
  '/budget-planner': {
    title: 'Budget Planner',
    description: 'Allocate test budgets across creatives and ad sets',
  },
  '/creative-analysis': {
    title: 'Creative Analysis',
    description: 'Analyze and classify creative performance',
  },
  '/funnel-analysis': {
    title: 'Funnel Analysis',
    description: 'Diagnose conversion funnel bottlenecks',
  },
  '/kill-engine': {
    title: 'Kill Engine',
    description: 'Automatically identify underperforming entities',
  },
  '/winner-detection': {
    title: 'Winner Detection',
    description: 'Identify and validate winning campaigns',
  },
  '/scaling-center': {
    title: 'Scaling Center',
    description: 'Generate scaling roadmaps for winning campaigns',
  },
  '/cash-forecast': {
    title: 'Cash Forecast',
    description: 'Forecast budget runway and depletion',
  },
  '/settings': {
    title: 'Settings',
    description: 'Manage your account and preferences',
  },
}

export function Header() {
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] ?? {
    title: 'TVB Allocator',
    description: 'Test Budget Allocator',
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
      <div>
        <h1 className="text-lg font-semibold text-[#f5f5f5]">{pageInfo.title}</h1>
        <p className="text-sm text-[#737373]">{pageInfo.description}</p>
      </div>
      <div className="flex items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>
    </header>
  )
}
