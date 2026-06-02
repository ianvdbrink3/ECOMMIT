'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { creativeSchema, type CreativeFormValues } from '@/lib/validations/creative'
import { analyzeCreative } from '@/domain/creative/analyzer'
import type { CreativeAnalysis } from '@/domain/creative/types'
import { formatPercent, formatCurrency, formatNumber, cn } from '@/lib/utils'
import { useState } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

const classificationConfig = {
  Weak: { color: 'danger', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  Average: { color: 'warning', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  Good: { color: 'success', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  Strong: { color: 'success', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
} as const

export function CreativeAnalyzer() {
  const [result, setResult] = useState<CreativeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreativeFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(creativeSchema) as any,
    defaultValues: {
      impressions: 10000,
      linkClicks: 180,
      spend: 150,
    },
  })

  const onSubmit = (data: CreativeFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setResult(analyzeCreative(data))
      setLoading(false)
    }, 200)
  }

  const radarData = result
    ? [
        { metric: 'CTR', value: Math.min(100, (result.ctr / 4) * 100) },
        { metric: 'Outbound CTR', value: Math.min(100, (result.outboundCtr / 3.5) * 100) },
        { metric: 'Performance', value: result.performanceScore },
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Creative Analyzer</CardTitle>
          <CardDescription>
            Analyze creative performance by CTR, CPC, and CPM metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="impressions">Impressions</Label>
              <Input
                id="impressions"
                type="number"
                min="0"
                placeholder="10000"
                {...register('impressions')}
              />
              {errors.impressions && (
                <p className="text-xs text-red-400">{errors.impressions.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkClicks">Link Clicks</Label>
              <Input
                id="linkClicks"
                type="number"
                min="0"
                placeholder="180"
                {...register('linkClicks')}
              />
              {errors.linkClicks && (
                <p className="text-xs text-red-400">{errors.linkClicks.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="spend">Ad Spend (€)</Label>
              <Input
                id="spend"
                type="number"
                step="0.01"
                min="0"
                placeholder="150"
                {...register('spend')}
              />
              {errors.spend && (
                <p className="text-xs text-red-400">{errors.spend.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Analyseer creative
            </Button>
          </form>

          {/* Benchmark guide */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-[#525252] uppercase tracking-wider">CTR Benchmarks</p>
            {[
              { label: 'Strong', range: '≥ 3.0%', color: 'text-green-400' },
              { label: 'Good', range: '2.0 – 2.9%', color: 'text-blue-400' },
              { label: 'Average', range: '1.0 – 1.9%', color: 'text-amber-400' },
              { label: 'Weak', range: '< 1.0%', color: 'text-red-400' },
            ].map(({ label, range, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className={color}>{label}</span>
                <span className="text-[#525252]">{range}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-4">
          {/* Classification Banner */}
          {(() => {
            const config = classificationConfig[result.classification]
            return (
              <div className={cn('rounded-xl border p-4', config.bg, config.border)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">
                      Creative Classification
                    </p>
                    <p className={cn('text-2xl font-bold', config.text)}>{result.classification}</p>
                  </div>
                  <Badge variant={config.color as 'danger' | 'warning' | 'success'} className="text-sm px-3 py-1">
                    Score: {result.performanceScore}
                  </Badge>
                </div>
                <div className="mt-3">
                  <Progress value={result.performanceScore} className="h-1.5" />
                </div>
              </div>
            )
          })()}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'CTR', value: formatPercent(result.ctr, 2), desc: 'Link Click-Through Rate' },
              { label: 'Outbound CTR', value: formatPercent(result.outboundCtr, 2), desc: 'External Click Rate' },
              { label: 'CPC', value: formatCurrency(result.cpc), desc: 'Cost per Click' },
              { label: 'CPM', value: formatCurrency(result.cpm), desc: 'Cost per 1000 Impressions' },
            ].map(({ label, value, desc }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-xs text-[#737373]">{desc}</p>
                  <p className="text-lg font-bold text-[#f5f5f5] mt-0.5">{value}</p>
                  <p className="text-xs text-[#525252] mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Radar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#262626" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#737373', fontSize: 12 }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-[#525252] uppercase tracking-wider mb-2">Action</p>
              <p className="text-sm text-[#a3a3a3]">
                {result.classification === 'Strong'
                  ? 'This creative is a top performer. Scale budget and test variations to find the ceiling.'
                  : result.classification === 'Good'
                    ? 'Solid creative. Consider A/B testing variations of the hook to push into Strong territory.'
                    : result.classification === 'Average'
                      ? 'Marginal performance. Allow more spend to accumulate data, then decide to iterate or kill.'
                      : 'Kill this creative. CTR is too low to justify further spend. Test new hooks and visual concepts.'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <p className="text-[#525252] text-sm">Enter creative metrics to analyze</p>
          </div>
        </div>
      )}
    </div>
  )
}
