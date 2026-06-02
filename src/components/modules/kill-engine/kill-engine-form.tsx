'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skull, Eye, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { killEngineSchema, type KillEngineFormValues } from '@/lib/validations/kill-engine'
import { createDefaultRuleEngine } from '@/domain/kill-engine/rules'
import type { KillEngineResult } from '@/domain/kill-engine/types'
import { cn } from '@/lib/utils'

const verdictConfig = {
  KILL: {
    icon: Skull,
    label: 'Kill',
    color: 'text-red-400',
    border: 'border-red-500/25',
    bg: 'bg-red-500/8',
  },
  OBSERVE: {
    icon: Eye,
    label: 'Observe',
    color: 'text-amber-400',
    border: 'border-amber-500/25',
    bg: 'bg-amber-500/8',
  },
  MONITOR: {
    icon: Shield,
    label: 'Monitor',
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/8',
  },
}

const severityStyles = {
  LOW: 'text-blue-400 border-blue-500/25 bg-blue-500/8',
  MEDIUM: 'text-amber-400 border-amber-500/25 bg-amber-500/8',
  HIGH: 'text-orange-400 border-orange-500/25 bg-orange-500/8',
  CRITICAL: 'text-red-400 border-red-500/25 bg-red-500/8',
}

export function KillEngineForm() {
  const [result, setResult] = useState<KillEngineResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [entityType, setEntityType] = useState<'CREATIVE' | 'ADSET' | 'CAMPAIGN'>('ADSET')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KillEngineFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(killEngineSchema) as any,
    defaultValues: {
      entityType: 'ADSET',
      entityName: 'Ad Set #1',
      spend: 120,
      impressions: 8500,
      clicks: 95,
      atc: 3,
      purchases: 0,
      breakEvenCpa: 15,
    },
  })

  const onSubmit = (data: KillEngineFormValues) => {
    setLoading(true)
    setTimeout(() => {
      const engine = createDefaultRuleEngine()
      setResult(engine.evaluate(data))
      setLoading(false)
    }, 300)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kill Engine</CardTitle>
          <CardDescription>
            5 geautomatiseerde kill rules om onderpresterende entiteiten te stoppen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Type entiteit</Label>
              <Select value={entityType} onValueChange={(v: 'CREATIVE' | 'ADSET' | 'CAMPAIGN') => {
                setEntityType(v)
                setValue('entityType', v)
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATIVE">Creative</SelectItem>
                  <SelectItem value="ADSET">Ad Set</SelectItem>
                  <SelectItem value="CAMPAIGN">Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="entityName">Naam</Label>
              <Input id="entityName" placeholder="Ad Set #1" {...register('entityName')} />
              {errors.entityName && (
                <p className="text-[11px] text-red-400 mt-1">{errors.entityName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="spend">Spend (€)</Label>
                <Input id="spend" type="number" step="0.01" min="0" placeholder="120" {...register('spend')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="breakEvenCpa">Break-even CPA (€)</Label>
                <Input id="breakEvenCpa" type="number" step="0.01" min="0" placeholder="15" {...register('breakEvenCpa')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="impressions">Impressions</Label>
                <Input id="impressions" type="number" min="0" placeholder="8500" {...register('impressions')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clicks">Clicks</Label>
                <Input id="clicks" type="number" min="0" placeholder="95" {...register('clicks')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="atc">Add to Carts</Label>
                <Input id="atc" type="number" min="0" placeholder="3" {...register('atc')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchases">Purchases</Label>
                <Input id="purchases" type="number" min="0" placeholder="0" {...register('purchases')} />
              </div>
            </div>

            <Button type="submit" variant="destructive" className="w-full" loading={loading}>
              <Skull className="w-4 h-4" />
              Run Kill Engine
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Verdict */}
          {(() => {
            const cfg = verdictConfig[result.finalVerdict]
            const Icon = cfg.icon
            return (
              <div className={cn('rounded-xl border p-5', cfg.border, cfg.bg)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center">
                    <Icon className={cn('w-5 h-5', cfg.color)} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#555555] uppercase tracking-wide">Verdict</p>
                    <p className={cn('text-xl font-bold', cfg.color)}>{cfg.label}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-1 rounded-md border',
                      severityStyles[result.highestSeverity]
                    )}>
                      {result.highestSeverity}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[#888888]">{result.summary}</p>
              </div>
            )
          })()}

          {/* Triggered rules */}
          {result.triggeredRules.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">
                    {result.triggeredRules.length} regel{result.triggeredRules.length > 1 ? 's' : ''} getriggerd
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.triggeredRules.map((rule) => (
                  <div
                    key={rule.ruleName}
                    className={cn(
                      'rounded-lg border p-3.5 space-y-2',
                      severityStyles[rule.severity]
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold">{rule.ruleName}</p>
                      <span className="text-[10px] opacity-70 uppercase tracking-wide">{rule.severity}</span>
                    </div>
                    <p className="text-[12px] text-[#999999]">{rule.reason}</p>
                    <div className="border-t border-white/5 pt-2">
                      <p className="text-[12px] text-[#777777]">
                        <span className="text-[#555555]">Aanbeveling:</span>{' '}
                        {rule.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-[13px] font-medium text-emerald-400">Alle regels geslaagd</p>
                  <p className="text-[12px] text-[#666666] mt-0.5">
                    Entiteit bevindt zich binnen acceptabele parameters. Blijf monitoren.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-dashed border-[#1e1e1e] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center">
            <Skull className="w-5 h-5 text-[#333333]" />
          </div>
          <p className="text-[13px] text-[#444444]">Voer data in en run de Kill Engine</p>
        </div>
      )}
    </div>
  )
}
