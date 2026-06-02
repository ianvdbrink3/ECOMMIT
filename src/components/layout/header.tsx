'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Overview of your operations' },
  '/economics': { title: 'Product Economics', description: 'True margins & break-even CPA' },
  '/budget-planner': { title: 'Budget Planner', description: 'Allocate test budgets scientifically' },
  '/creative-analysis': { title: 'Creative Analysis', description: 'CTR, CPC, CPM performance scoring' },
  '/funnel-analysis': { title: 'Funnel Analysis', description: 'Diagnose conversion bottlenecks' },
  '/kill-engine': { title: 'Kill Engine', description: 'Rule-based underperformer detection' },
  '/winner-detection': { title: 'Winner Detection', description: 'Score and validate winning campaigns' },
  '/scaling-center': { title: 'Scaling Center', description: '10-day scaling roadmap generator' },
  '/cash-forecast': { title: 'Cash Forecast', description: 'Budget runway & depletion forecast' },
  '/settings': { title: 'Settings', description: 'Account and preferences' },
}

export function Header() {
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] ?? { title: 'TVB Allocator', description: '' }

  return (
    <header className="flex items-center h-14 px-6 border-b border-[#161616] bg-[#080808] shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <h1 className="text-[14px] font-semibold text-[#efefef] leading-none">
          {pageInfo.title}
        </h1>
        {pageInfo.description && (
          <>
            <span className="text-[#2a2a2a] text-sm select-none">/</span>
            <p className="text-[13px] text-[#555555] leading-none truncate">
              {pageInfo.description}
            </p>
          </>
        )}
      </div>
    </header>
  )
}
