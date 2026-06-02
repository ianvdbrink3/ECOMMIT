import Link from 'next/link'
import {
  ArrowUpRight, Calculator, PieChart, Layers, Filter,
  Skull, Trophy, TrendingUp, DollarSign,
} from 'lucide-react'

const modules = [
  {
    href: '/economics',
    icon: Calculator,
    title: 'Product Economics',
    desc: 'Bereken marge, netto winst en break-even CPA.',
  },
  {
    href: '/budget-planner',
    icon: PieChart,
    title: 'Budget Planner',
    desc: 'Verdeel testbudget over creatives, hooks en angles.',
  },
  {
    href: '/creative-analysis',
    icon: Layers,
    title: 'Creative Analyse',
    desc: 'CTR, CPC en CPM beoordelen. Van Zwak tot Sterk.',
  },
  {
    href: '/funnel-analysis',
    icon: Filter,
    title: 'Funnel Analyse',
    desc: 'Diagnose van winkelwagen-, checkout- en aankoopuitval.',
  },
  {
    href: '/kill-engine',
    icon: Skull,
    title: 'Kill Engine',
    desc: 'Stop verlieslatende campagnes via automatische kill-regels.',
  },
  {
    href: '/winner-detection',
    icon: Trophy,
    title: 'Winner Detectie',
    desc: 'Beoordeel op ROAS + CPA + CTR — STOP, WACHT of SCHAAL.',
  },
  {
    href: '/scaling-center',
    icon: TrendingUp,
    title: 'Scaling Center',
    desc: '10-daagse schaalroadmap voor gevalideerde winnaars.',
  },
  {
    href: '/cash-forecast',
    icon: DollarSign,
    title: 'Cash Forecast',
    desc: 'Runway, burn rate en verwachte depletiedatum.',
  },
]

const workflow = [
  { step: 1, label: 'Bereken break-even CPA',  href: '/economics'         },
  { step: 2, label: 'Verdeel testbudget',       href: '/budget-planner'    },
  { step: 3, label: 'Analyseer creatives',      href: '/creative-analysis' },
  { step: 4, label: 'Diagnose funnel',          href: '/funnel-analysis'   },
  { step: 5, label: 'Stop onderpresteerders',   href: '/kill-engine'       },
  { step: 6, label: 'Valideer winnaars',        href: '/winner-detection'  },
  { step: 7, label: 'Schaal winners op',        href: '/scaling-center'    },
  { step: 8, label: 'Monitor cash runway',      href: '/cash-forecast'     },
]

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">

      {/* Hero */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-3)] mb-3">
          TVB Allocator
        </p>
        <h1 className="text-[36px] font-bold text-[var(--text-1)] tracking-[-0.04em] leading-[1.05] mb-4">
          Goedemorgen.
        </h1>
        <p className="text-[16px] text-[var(--text-2)] max-w-[440px] leading-[1.6]">
          Verdeel je testbudget wetenschappelijk, stop verlies vroeg en schaal winnaars gecontroleerd op.
        </p>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-8 items-start">

        {/* Module grid */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-3)] mb-5">
            Tools
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {modules.map(({ href, icon: Icon, title, desc }) => (
              <Link key={href} href={href} className="group">
                <div className="h-full bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[var(--border-strong)] hover:-translate-y-[1px]">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] flex items-center justify-center">
                      <Icon size={16} className="text-[var(--accent)]" />
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--text-3)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-200"
                    />
                  </div>
                  <p className="text-[13.5px] font-semibold text-[var(--text-1)] tracking-[-0.02em] mb-1.5">
                    {title}
                  </p>
                  <p className="text-[12.5px] text-[var(--text-2)] leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-3)] mb-5">
            Aanbevolen workflow
          </p>
          <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] shadow-sm overflow-hidden">
            {workflow.map(({ step, label, href }, i) => (
              <Link
                key={step}
                href={href}
                className={`group flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-[var(--surface-3)] ${
                  i > 0 ? 'border-t border-[var(--border)]' : ''
                }`}
              >
                <span className="shrink-0 w-[22px] h-[22px] rounded-full text-[10px] font-semibold border border-[var(--border-strong)] text-[var(--text-3)] flex items-center justify-center transition-all duration-150 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-dim)]">
                  {step}
                </span>
                <span className="flex-1 text-[13px] text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors duration-150">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
