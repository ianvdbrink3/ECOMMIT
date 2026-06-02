import Link from 'next/link'
import { ArrowRight, Calculator, PieChart, Layers, Filter, Skull, Trophy, TrendingUp, DollarSign } from 'lucide-react'

const modules = [
  {
    href: '/economics',
    icon: Calculator,
    title: 'Product Economics',
    desc: 'Echte marge, netto winst en break-even CPA.',
    color: '#3b82f6',
    tag: 'Basis',
  },
  {
    href: '/budget-planner',
    icon: PieChart,
    title: 'Budget Planner',
    desc: 'Verdeel testbudget over creatives × hooks × angles.',
    color: '#8b5cf6',
    tag: 'Basis',
  },
  {
    href: '/creative-analysis',
    icon: Layers,
    title: 'Creative Analyse',
    desc: 'Beoordeel CTR, CPC en CPM. Classificeer als Zwak t/m Sterk.',
    color: '#ec4899',
    tag: 'Analyse',
  },
  {
    href: '/funnel-analysis',
    icon: Filter,
    title: 'Funnel Analyse',
    desc: 'Diagnose van winkelwagen-, checkout- en aankoopuitval.',
    color: '#eab308',
    tag: 'Analyse',
  },
  {
    href: '/kill-engine',
    icon: Skull,
    title: 'Kill Engine',
    desc: 'Stop verlieslatende campagnes automatisch via 5 kill-regels.',
    color: '#ef4444',
    tag: 'Actie',
  },
  {
    href: '/winner-detection',
    icon: Trophy,
    title: 'Winner Detectie',
    desc: 'Beoordeel op ROAS + CPA + CTR → STOP / WACHT / SCHAAL.',
    color: '#f59e0b',
    tag: 'Actie',
  },
  {
    href: '/scaling-center',
    icon: TrendingUp,
    title: 'Scaling Center',
    desc: '10-daagse schaalroadmap voor gevalideerde winnaars.',
    color: '#22c55e',
    tag: 'Actie',
  },
  {
    href: '/cash-forecast',
    icon: DollarSign,
    title: 'Cash Forecast',
    desc: 'Runway, dagelijkse burn en verwachte depletiedatum.',
    color: '#14b8a6',
    tag: 'Finance',
  },
]

const workflow = [
  { step: 1, label: 'Bereken break-even CPA', href: '/economics', tag: 'Basis' },
  { step: 2, label: 'Verdeel testbudget', href: '/budget-planner', tag: 'Basis' },
  { step: 3, label: 'Analyseer creatives', href: '/creative-analysis', tag: 'Analyse' },
  { step: 4, label: 'Diagnose funnel', href: '/funnel-analysis', tag: 'Analyse' },
  { step: 5, label: 'Stop onderpresteerders', href: '/kill-engine', tag: 'Actie' },
  { step: 6, label: 'Valideer winnaars', href: '/winner-detection', tag: 'Actie' },
  { step: 7, label: 'Schaal winners', href: '/scaling-center', tag: 'Actie' },
  { step: 8, label: 'Monitor runway', href: '/cash-forecast', tag: 'Finance' },
]

const tagColors: Record<string, string> = {
  Basis: 'text-blue-400 bg-blue-500/10',
  Analyse: 'text-amber-400 bg-amber-500/10',
  Actie: 'text-red-400 bg-red-500/10',
  Finance: 'text-teal-400 bg-teal-500/10',
}

export default function DashboardPage() {
  return (
    <div className="max-w-4xl space-y-10">

      {/* Hero */}
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-1)] tracking-tight leading-tight">
          Goedemorgen
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-3)] max-w-lg">
          TVB Allocator helpt je testbudget wetenschappelijk verdelen, verlies snel stoppen en winnaars gecontroleerd opschalen.
        </p>
      </div>

      {/* Modules */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">
            Modules
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {modules.map(({ href, icon: Icon, title, desc, color, tag }) => (
            <Link key={href} href={href} className="group block">
              <div className="h-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] p-4 transition-all duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)]">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-[3px] rounded-[4px] ${tagColors[tag]}`}>
                    {tag}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-[var(--text-1)] leading-tight mb-1.5">{title}</p>
                <p className="text-[12px] text-[var(--text-3)] leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center gap-1 text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors duration-150">
                  <span className="text-[11px]">Openen</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)] mb-4">
          Aanbevolen workflow
        </h2>
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
          {workflow.map(({ step, label, href, tag }, i) => (
            <Link
              key={step}
              href={href}
              className={`group flex items-center gap-4 px-5 py-3.5 transition-colors duration-100 hover:bg-white/[0.03] ${i > 0 ? 'border-t border-[var(--border)]' : ''}`}
            >
              <span className="shrink-0 w-5 h-5 rounded-full border border-[var(--border-strong)] text-[var(--text-3)] text-[11px] font-medium flex items-center justify-center group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)] transition-all">
                {step}
              </span>
              <span className="flex-1 text-[13px] text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors">{label}</span>
              <span className={`hidden sm:block text-[10px] font-medium px-1.5 py-[3px] rounded-[4px] ${tagColors[tag]}`}>{tag}</span>
              <ArrowRight size={13} className="text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
