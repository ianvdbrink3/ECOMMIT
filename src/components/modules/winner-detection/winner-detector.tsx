'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  Tooltip,
} from 'recharts'

const verdictConfig = {
  SCALE: {
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    label: 'Scale It',
    description: 'This is a winner. Scale budget aggressively.',
  },
  OBSERVE: {
    icon: Eye,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    label: 'Observe',
    description: 'Mixed signals. Give it more time and data.',
  },
  KILL: {
    icon: Skull,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    label: 'Kill It',
    description: 'Underperforming. Kill and reallocate budget.',
  },
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
    ? [{ name: 'Confidence', value: result.confidence, fill: '#3b82f6' }]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Winner Detectie</CardTitle>
          <CardDescription>
            Analyseer campagnemetrics om winnaars klaar voor schalen te identificeren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="spend">Total Spend (€)</Label>
                <Input
                  id="spend"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="250"
                  {...register('spend')}
                />
                {errors.spend && <p className="text-xs text-red-400">{errors.spend.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue (€)</Label>
                <Input
                  id="revenue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="900"
                  {...register('revenue')}
                />
                {errors.revenue && <p className="text-xs text-red-400">{errors.revenue.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="purchases">Purchases</Label>
                <Input
                  id="purchases"
                  type="number"
                  min="0"
                  placeholder="18"
                  {...register('purchases')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breakEvenCpa">Break-even CPA (€)</Label>
                <Input
                  id="breakEvenCpa"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15"
                  {...register('breakEvenCpa')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="impressions">Impressions</Label>
                <Input
                  id="impressions"
                  type="number"
                  min="0"
                  placeholder="15000"
                  {...register('impressions')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clicks">Clicks</Label>
                <Input
                  id="clicks"
                  type="number"
                  min="0"
                  placeholder="320"
                  {...register('clicks')}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              <Trophy className="w-4 h-4" />
              Detecteer winner
            </Button>
          </form>

          {/* Scoring Criteria */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-[#525252] uppercase tracking-wider">Scoringscriteria</p>
            {[
              { factor: 'ROAS ≥ 3x', points: '+40 pts', color: 'text-green-400' },
              { factor: 'CPA ≤ Break-Even × 0.7', points: '+30 pts', color: 'text-green-400' },
              { factor: 'CTR ≥ 2%', points: '+20 pts', color: 'text-blue-400' },
              { factor: 'Conv. Rate ≥ 3%', points: '+10 pts', color: 'text-blue-400' },
            ].map(({ factor, points, color }) => (
              <div key={factor} className="flex items-center justify-between text-xs">
                <span className="text-[#a3a3a3]">{factor}</span>
                <span className={color}>{points}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-4">
          {/* Verdict Banner */}
          {(() => {
            const config = verdictConfig[result.verdict]
            const Icon = config.icon
            return (
              <div className={cn('rounded-xl border p-5', config.bg)}>
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-8 h-8', config.color)} />
                  <div>
                    <p className="text-xs text-[#737373] uppercase tracking-wider">Oordeel</p>
                    <p className={cn('text-3xl font-bold', config.color)}>{config.label}</p>
                  </div>
                </div>
                <p className="text-sm text-[#a3a3a3] mt-3">{result.explanation}</p>
              </div>
            )
          })()}

          {/* Confidence Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Betrouwbaarheidsscore</CardTitle>
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
                    <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1f1f1f' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-4xl font-bold text-blue-400">{result.confidence}%</p>
                  <p className="text-xs text-[#737373] mt-1">
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
              <Card key={label} className={good ? 'border-green-500/20' : 'border-red-500/20'}>
                <CardContent className="p-4">
                  <p className="text-xs text-[#737373]">{label}</p>
                  <p className={cn('text-lg font-bold mt-0.5', good ? 'text-green-400' : 'text-red-400')}>
                    {value}
                  </p>
                  <p className="text-[10px] text-[#525252]">target: {target}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-dashed border-[#1e1e1e] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#333333]" />
          </div>
          <p className="text-[13px] text-[#444444]">Voer metrics in om winners te detecteren</p>
        </div>
      )}
    </div>
  )
}
