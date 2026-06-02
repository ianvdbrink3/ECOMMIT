'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { creativeSchema, type CreativeFormValues } from '@/lib/validations/creative'
import { analyzeCreative } from '@/domain/creative/analyzer'
import type { CreativeAnalysis } from '@/domain/creative/types'
import { formatPercent, formatCurrency, cn } from '@/lib/utils'
import { Layers } from 'lucide-react'
import { useState } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

const classificationConfig = {
  Weak: { variant: 'danger' as const, bg: 'bg-[var(--danger-dim)]', border: 'border-[var(--danger)]/30', text: 'text-[var(--danger)]' },
  Average: { variant: 'warning' as const, bg: 'bg-[var(--warning-dim)]', border: 'border-[var(--warning)]/30', text: 'text-[var(--warning)]' },
  Good: { variant: 'blue' as const, bg: 'bg-[var(--accent-dim)]', border: 'border-[var(--accent)]/30', text: 'text-[var(--accent)]' },
  Strong: { variant: 'success' as const, bg: 'bg-[var(--success-dim)]', border: 'border-[var(--success)]/30', text: 'text-[var(--success)]' },
} as const

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}

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
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Creative Analyse</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Beoordeel creative performance op CTR, CPC en CPM</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Field label="Impressions" error={errors.impressions?.message}>
            <Input
              type="number"
              min="0"
              placeholder="10000"
              {...register('impressions')}
            />
          </Field>

          <Field label="Link Clicks" error={errors.linkClicks?.message}>
            <Input
              type="number"
              min="0"
              placeholder="180"
              {...register('linkClicks')}
            />
          </Field>

          <Field label="Ad Spend (€)" error={errors.spend?.message}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="150"
              {...register('spend')}
            />
          </Field>

          <Button type="submit" className="w-full" loading={loading}>
            Analyseer creative
          </Button>
        </form>

        {/* Benchmark guide */}
        <div className="px-5 pb-5 space-y-2">
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] font-semibold">CTR Benchmarks</p>
          {[
            { label: 'Sterk', range: '≥ 3,0%', color: 'text-[var(--success)]' },
            { label: 'Goed', range: '2,0 – 2,9%', color: 'text-[var(--accent)]' },
            { label: 'Gemiddeld', range: '1,0 – 1,9%', color: 'text-[var(--warning)]' },
            { label: 'Zwak', range: '< 1,0%', color: 'text-[var(--danger)]' },
          ].map(({ label, range, color }) => (
            <div key={label} className="flex items-center justify-between text-[12px]">
              <span className={color}>{label}</span>
              <span className="text-[var(--text-3)]">{range}</span>
            </div>
          ))}
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Classification Banner */}
          {(() => {
            const config = classificationConfig[result.classification]
            return (
              <div className={cn('rounded-[var(--radius)] border p-4', config.bg, config.border)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] mb-1">
                      Creative classificatie
                    </p>
                    <p className={cn('text-2xl font-bold', config.text)}>{result.classification}</p>
                  </div>
                  <Badge variant={config.variant} className="text-[12px] px-2 py-1">
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
              { label: 'Outbound CTR', value: formatPercent(result.outboundCtr, 2), desc: 'Externe klikratio' },
              { label: 'CPC', value: formatCurrency(result.cpc), desc: 'Kosten per klik' },
              { label: 'CPM', value: formatCurrency(result.cpm), desc: 'Kosten per 1000 impressions' },
            ].map(({ label, value, desc }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-[11px] text-[var(--text-3)]">{desc}</p>
                  <p className="text-lg font-bold text-[var(--text-1)] mt-0.5">{value}</p>
                  <p className="text-[11px] text-[var(--text-3)] mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Radar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--surface-3)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="var(--accent)"
                    fill="var(--accent)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] font-semibold mb-2">Actie</p>
              <p className="text-[13px] text-[var(--text-2)]">
                {result.classification === 'Strong'
                  ? 'Deze creative is een toppresteerder. Schaal het budget en test variaties om het plafond te vinden.'
                  : result.classification === 'Good'
                    ? 'Solide creative. Overweeg A/B-testen van variaties van de hook om naar Sterk te groeien.'
                    : result.classification === 'Average'
                      ? 'Marginale prestatie. Laat meer spend accumuleren voor meer data, beslis dan of je itereert of killt.'
                      : 'Kil deze creative. CTR is te laag om verder budget te rechtvaardigen. Test nieuwe hooks en visuele concepten.'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <Layers size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Voer creative metrics in om te analyseren</p>
          </div>
        </div>
      )}
    </div>
  )
}
