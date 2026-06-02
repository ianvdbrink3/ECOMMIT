'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { winnerSchema, type WinnerFormValues } from '@/lib/validations/winner'
import { detectWinner } from '@/domain/winner/detector'
import type { WinnerAnalysis } from '@/domain/winner/types'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'
import { Trophy, TrendingUp, Eye, Skull } from 'lucide-react'
import { useState } from 'react'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts'

const verdictConfig = {
  SCALE: {
    icon: TrendingUp,
    color: 'text-[var(--success)]',
    bg: 'bg-[var(--success-dim)] border-[var(--success)]/30',
    label: 'Schalen',
    description: 'Dit is een winnaar. Schaal het budget agressief.',
  },
  OBSERVE: {
    icon: Eye,
    color: 'text-[var(--warning)]',
    bg: 'bg-[var(--warning-dim)] border-[var(--warning)]/30',
    label: 'Observeren',
    description: 'Gemengde signalen. Geef het meer tijd en data.',
  },
  KILL: {
    icon: Skull,
    color: 'text-[var(--danger)]',
    bg: 'bg-[var(--danger-dim)] border-[var(--danger)]/30',
    label: 'Killen',
    description: 'Onderpresteerder. Kill en herverdeel het budget.',
  },
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}

export function WinnerDetector() {
  const [result, setResult] = useState<WinnerAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WinnerFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(winnerSchema) as any,
    defaultValues: {
      spend: 250,
      purchases: 18,
      revenue: 899.82,
      impressions: 15000,
      clicks: 320,
      breakEvenCpa: 15,
    },
  })

  const onSubmit = (data: WinnerFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setResult(detectWinner(data))
      setLoading(false)
    }, 250)
  }

  const radialData = result
    ? [{ name: 'Betrouwbaarheid', value: result.confidence, fill: 'var(--accent)' }]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Winner Detectie</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Analyseer campagnemetrics om winnaars klaar voor schalen te identificeren</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Totaal spend (€)" error={errors.spend?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="250"
                {...register('spend')}
              />
            </Field>
            <Field label="Omzet (€)" error={errors.revenue?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="900"
                {...register('revenue')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Aankopen">
              <Input
                type="number"
                min="0"
                placeholder="18"
                {...register('purchases')}
              />
            </Field>
            <Field label="Break-even CPA (€)">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="15"
                {...register('breakEvenCpa')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Impressions">
              <Input
                type="number"
                min="0"
                placeholder="15000"
                {...register('impressions')}
              />
            </Field>
            <Field label="Clicks">
              <Input
                type="number"
                min="0"
                placeholder="320"
                {...register('clicks')}
              />
            </Field>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            <Trophy size={14} />
            Detecteer winner
          </Button>
        </form>

        {/* Scoring Criteria */}
        <div className="px-5 pb-5 space-y-2">
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] font-semibold">Scoringscriteria</p>
          {[
            { factor: 'ROAS ≥ 3x', points: '+40 pt', color: 'text-[var(--success)]' },
            { factor: 'CPA ≤ Break-even × 0,7', points: '+30 pt', color: 'text-[var(--success)]' },
            { factor: 'CTR ≥ 2%', points: '+20 pt', color: 'text-[var(--accent)]' },
            { factor: 'Conv. Rate ≥ 3%', points: '+10 pt', color: 'text-[var(--accent)]' },
          ].map(({ factor, points, color }) => (
            <div key={factor} className="flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-2)]">{factor}</span>
              <span className={color}>{points}</span>
            </div>
          ))}
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Verdict Banner */}
          {(() => {
            const config = verdictConfig[result.verdict]
            const Icon = config.icon
            return (
              <div className={cn('rounded-[var(--radius)] border p-5', config.bg)}>
                <div className="flex items-center gap-3">
                  <Icon size={28} className={config.color} />
                  <div>
                    <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em]">Oordeel</p>
                    <p className={cn('text-3xl font-bold', config.color)}>{config.label}</p>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text-2)] mt-3">{result.explanation}</p>
              </div>
            )
          })()}

          {/* Confidence Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Betrouwbaarheidsscore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'var(--surface-3)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-4xl font-bold text-[var(--accent)]">{result.confidence}%</p>
                  <p className="text-[12px] text-[var(--text-3)] mt-1">
                    {result.confidence >= 70
                      ? 'Hoge zekerheid'
                      : result.confidence >= 50
                        ? 'Gemiddelde zekerheid'
                        : 'Lage zekerheid'}
                  </p>
                  <Progress value={result.confidence} className="mt-2 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'ROAS',
                value: `${result.roas.toFixed(2)}x`,
                good: result.roas >= 2,
                target: '≥ 2x',
              },
              {
                label: 'CPA',
                value: result.cpa === Infinity ? '∞' : formatCurrency(result.cpa),
                good: result.cpa < Infinity,
                target: `≤ ${formatCurrency(result.cpa)}`,
              },
              {
                label: 'CTR',
                value: formatPercent(result.ctr, 2),
                good: result.ctr >= 1,
                target: '≥ 1%',
              },
              {
                label: 'Conv. Rate',
                value: formatPercent(result.conversionRate, 2),
                good: result.conversionRate >= 1,
                target: '≥ 1%',
              },
            ].map(({ label, value, good, target }) => (
              <Card key={label} className={cn(good ? 'border-[var(--success)]/20' : 'border-[var(--danger)]/20')}>
                <CardContent className="p-4">
                  <p className="text-[11px] text-[var(--text-3)]">{label}</p>
                  <p className={cn('text-lg font-bold mt-0.5', good ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                    {value}
                  </p>
                  <p className="text-[10px] text-[var(--text-3)]">doel: {target}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <Trophy size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Voer metrics in om winners te detecteren</p>
          </div>
        </div>
      )}
    </div>
  )
}
