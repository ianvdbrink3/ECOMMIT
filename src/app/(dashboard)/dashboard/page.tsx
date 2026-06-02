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
} from 'lucide-react'

const modules = [
  {
    href: '/economics',
    icon: Calculator,
    title: 'Product Economics',
    description: 'Echte marge, netto winst en break-even CPA.',
    color: 'text-blue-400',
    tag: 'Basis',
    tagColor: 'text-blue-400 bg-blue-500/10',
  },
  {
    href: '/budget-planner',
    icon: PieChart,
    title: 'Budget Planner',
    description: 'Verdeel testbudget over creatives × hooks × angles.',
    color: 'text-violet-400',
    tag: 'Basis',
    tagColor: 'text-violet-400 bg-violet-500/10',
  },
  {
    href: '/creative-analysis',
    icon: Layers,
    title: 'Creative Analyse',
    description: 'CTR, CPC, CPM — beoordeel als Zwak, Gemiddeld, Goed of Sterk.',
    color: 'text-pink-400',
    tag: 'Analyse',
    tagColor: 'text-pink-400 bg-pink-500/10',
  },
  {
    href: '/funnel-analysis',
    icon: Filter,
    title: 'Funnel Analyse',
    description: 'Diagnose van winkelwagen-, checkout- en aankoopuitval.',
    color: 'text-amber-400',
    tag: 'Analyse',
    tagColor: 'text-amber-400 bg-amber-500/10',
  },
  {
    href: '/kill-engine',
    icon: Skull,
    title: 'Kill Engine',
    description: 'Stop verlieslatende campagnes automatisch via 5 kill-regels.',
    color: 'text-red-400',
    tag: 'Actie',
    tagColor: 'text-red-400 bg-red-500/10',
  },
  {
    href: '/winner-detection',
    icon: Trophy,
    title: 'Winner Detectie',
    description: 'Beoordeel op ROAS + CPA + CTR + CVR → STOP / WACHT / SCHAAL.',
    color: 'text-yellow-400',
    tag: 'Actie',
    tagColor: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    href: '/scaling-center',
    icon: TrendingUp,
    title: 'Scaling Center',
    description: '10-daagse schaalroadmap voor gevalideerde winnaars.',
    color: 'text-emerald-400',
    tag: 'Schalen',
    tagColor: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    href: '/cash-forecast',
    icon: DollarSign,
    title: 'Cash Forecast',
    description: 'Runway, dagelijkse burn en verwachte depletiedatum.',
    color: 'text-teal-400',
    tag: 'Finance',
    tagColor: 'text-teal-400 bg-teal-500/10',
  },
]

const workflow = [
  { step: 1, text: 'Bereken je echte marge en break-even CPA', href: '/economics' },
  { step: 2, text: 'Verdeel testbudget over creatives, hooks en angles', href: '/budget-planner' },
  { step: 3, text: 'Analyseer CTR, CPC en CPM per creative', href: '/creative-analysis' },
  { step: 4, text: 'Identificeer knelpunten in de conversiefunnel', href: '/funnel-analysis' },
  { step: 5, text: 'Stop verlieslatende campagnes met de Kill Engine', href: '/kill-engine' },
  { step: 6, text: 'Valideer winnaars op ROAS, CPA en CTR', href: '/winner-detection' },
  { step: 7, text: 'Schaal winners via de 10-daagse roadmap', href: '/scaling-center' },
  { step: 8, text: 'Houd je budget runway dagelijks bij', href: '/cash-forecast' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-[#efefef] tracking-tight">
          Truin vdBrink Test Budget Allocator
        </h2>
        <p className="text-[13px] text-[#555555]">
          Alloceer kapitaal intelligent. Stop verlies snel. Schaal winnaars met vertrouwen.
        </p>
      </div>

      {/* Module grid */}
      <div>
        <p className="text-[11px] font-medium text-[#3d3d3d] uppercase tracking-widest mb-3">
          Modules
        </p>
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map(({ href, icon: Icon, title, description, color, tag, tagColor }) => (
            <Link key={href} href={href} className="group">
              <div className="h-full rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4 transition-all duration-150 hover:border-[#2a2a2a] hover:bg-[#111111]">
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${tagColor}`}>
                    {tag}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-[#cccccc] mb-1.5 leading-tight">
                  {title}
                </p>
                <p className="text-[12px] text-[#555555] leading-relaxed mb-3">
                  {description}
                </p>
                <div className="flex items-center gap-1 text-[#333333] group-hover:text-blue-500 transition-colors">
                  <span className="text-[11px]">Openen</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div>
        <p className="text-[11px] font-medium text-[#3d3d3d] uppercase tracking-widest mb-3">
          Aanbevolen workflow
        </p>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] divide-y divide-[#161616]">
          {workflow.map(({ step, text, href }) => (
            <Link
              key={step}
              href={href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#111111] transition-colors group"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1a1a1a] text-[#555555] text-[11px] font-medium flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
                {step}
              </span>
              <span className="text-[13px] text-[#666666] group-hover:text-[#cccccc] transition-colors">
                {text}
              </span>
              <ArrowRight size={11} className="ml-auto text-[#2a2a2a] group-hover:text-[#444444] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
