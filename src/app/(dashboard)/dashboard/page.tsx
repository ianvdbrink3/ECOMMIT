import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Calculator,
  PieChart,
  Layers,
  Filter,
  Skull,
  Trophy,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Package,
  Megaphone,
  XCircle,
  Percent,
} from 'lucide-react'

const modules = [
  {
    href: '/economics',
    icon: Calculator,
    title: 'Product Economics',
    description: 'Calculate true margins, net profit, and break-even CPA for your products.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badge: 'Core',
  },
  {
    href: '/budget-planner',
    icon: PieChart,
    title: 'Budget Planner',
    description: 'Allocate test budgets across creatives, hooks, and angles efficiently.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    badge: 'Core',
  },
  {
    href: '/creative-analysis',
    icon: Layers,
    title: 'Creative Analysis',
    description: 'Analyze CTR, CPC, CPM and classify creatives as Weak, Average, Good, or Strong.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    badge: 'Analysis',
  },
  {
    href: '/funnel-analysis',
    icon: Filter,
    title: 'Funnel Analysis',
    description: 'Diagnose conversion bottlenecks from sessions through to purchases.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: 'Analysis',
  },
  {
    href: '/kill-engine',
    icon: Skull,
    title: 'Kill Engine',
    description: 'Apply 5 automated kill rules to identify underperforming campaigns and creatives.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badge: 'Action',
  },
  {
    href: '/winner-detection',
    icon: Trophy,
    title: 'Winner Detection',
    description: 'Score campaigns by ROAS, CPA, CTR, and CVR to identify winners ready to scale.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    badge: 'Action',
  },
  {
    href: '/scaling-center',
    icon: TrendingUp,
    title: 'Scaling Center',
    description: 'Generate a 10-day step-by-step scaling roadmap for winning campaigns.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    badge: 'Scale',
  },
  {
    href: '/cash-forecast',
    icon: DollarSign,
    title: 'Cash Forecast',
    description: 'Forecast your budget runway, depletion date, and estimated profit.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    badge: 'Finance',
  },
]

const statCards = [
  {
    icon: Package,
    label: 'Products',
    value: '—',
    description: 'Connect your product catalog',
    color: 'text-blue-400',
  },
  {
    icon: Megaphone,
    label: 'Active Campaigns',
    value: '—',
    description: 'Campaigns currently running',
    color: 'text-green-400',
  },
  {
    icon: XCircle,
    label: 'Kill Decisions',
    value: '—',
    description: 'Decisions made today',
    color: 'text-red-400',
  },
  {
    icon: Percent,
    label: 'Budget Utilized',
    value: '—',
    description: 'Of total test budget',
    color: 'text-amber-400',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#f5f5f5]">Welcome to TVB Allocator</h2>
        <p className="text-[#737373] mt-1">
          Your complete e-commerce ad spend management toolkit. Use the modules below to optimize
          your campaigns.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, description, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-xs text-[#737373]">{label}</p>
              </div>
              <p className="text-2xl font-bold text-[#f5f5f5]">{value}</p>
              <p className="text-xs text-[#525252] mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-4">
          All Modules
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map(({ href, icon: Icon, title, description, color, bg, border, badge }) => (
            <Link key={href} href={href} className="group">
              <Card className={`h-full border transition-all duration-200 hover:border-[#333333] group-hover:bg-[#141414] ${border}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs leading-relaxed">
                    {description}
                  </CardDescription>
                  <div className="flex items-center gap-1 mt-3 text-[#525252] group-hover:text-blue-400 transition-colors">
                    <span className="text-xs">Open module</span>
                    <ArrowRight size={12} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recommended Workflow</CardTitle>
          <CardDescription>Follow this sequence for best results</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {[
              { step: 1, text: 'Start with Product Economics to know your true margin and break-even CPA', href: '/economics' },
              { step: 2, text: 'Use Budget Planner to allocate your test budget across creatives', href: '/budget-planner' },
              { step: 3, text: 'After spending, run Creative Analysis to classify performance', href: '/creative-analysis' },
              { step: 4, text: 'Check Funnel Analysis to identify conversion bottlenecks', href: '/funnel-analysis' },
              { step: 5, text: 'Use Kill Engine to automatically identify what to pause', href: '/kill-engine' },
              { step: 6, text: 'Run Winner Detection on top performers', href: '/winner-detection' },
              { step: 7, text: 'Scale winners using the Scaling Center roadmap', href: '/scaling-center' },
              { step: 8, text: 'Monitor Cash Forecast to stay on top of your runway', href: '/cash-forecast' },
            ].map(({ step, text, href }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                  {step}
                </span>
                <Link href={href} className="text-sm text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors">
                  {text}
                </Link>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
