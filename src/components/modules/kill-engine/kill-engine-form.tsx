'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skull, Eye, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    color: 'text-[var(--danger)]',
    border: 'border-[var(--danger)]/25',
    bg: 'bg-[var(--danger-dim)]',
  },
  OBSERVE: {
    icon: Eye,
    label: 'Observe',
    color: 'text-[var(--warning)]',
    border: 'border-[var(--warning)]/25',
    bg: 'bg-[var(--warning-dim)]',
  },
  MONITOR: {
    icon: Shield,
    label: 'Monitor',
    color: 'text-[var(--success)]',
    border: 'border-[var(--success)]/25',
    bg: 'bg-[var(--success-dim)]',
  },
}

const severityStyles = {
  LOW: 'text-[var(--accent)] border-[var(--accent)]/25 bg-[var(--accent-dim)]',
  MEDIUM: 'text-[var(--warning)] border-[var(--warning)]/25 bg-[var(--warning-dim)]',
  HIGH: 'text-orange-400 border-orange-500/25 bg-orange-500/10',
  CRITICAL: 'text-[var(--danger)] border-[var(--danger)]/25 bg-[var(--danger-dim)]',
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
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Kill Engine</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">5 geautomatiseerde kill rules om onderpresterende entiteiten te stoppen</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Field label="Type entiteit">
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
          </Field>

          <Field label="Naam" error={errors.entityName?.message}>
            <Input placeholder="Ad Set #1" {...register('entityName')} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Spend (€)">
              <Input type="number" step="0.01" min="0" placeholder="120" {...register('spend')} />
            </Field>
            <Field label="Break-even CPA (€)">
              <Input type="number" step="0.01" min="0" placeholder="15" {...register('breakEvenCpa')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Impressions">
              <Input type="number" min="0" placeholder="8500" {...register('impressions')} />
            </Field>
            <Field label="Clicks">
              <Input type="number" min="0" placeholder="95" {...register('clicks')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Add to Carts">
              <Input type="number" min="0" placeholder="3" {...register('atc')} />
            </Field>
            <Field label="Aankopen">
              <Input type="number" min="0" placeholder="0" {...register('purchases')} />
            </Field>
          </div>

          <Button type="submit" variant="destructive" className="w-full" loading={loading}>
            <Skull size={14} />
            Run Kill Engine
          </Button>
        </form>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Verdict */}
          {(() => {
            const cfg = verdictConfig[result.finalVerdict]
            const Icon = cfg.icon
            return (
              <div className={cn('rounded-[var(--radius)] border p-5', cfg.border, cfg.bg)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-black/20 flex items-center justify-center">
                    <Icon className={cn('w-5 h-5', cfg.color)} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wide">Verdict</p>
                    <p className={cn('text-xl font-bold', cfg.color)}>{cfg.label}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-1 rounded-[var(--radius-sm)] border',
                      severityStyles[result.highestSeverity]
                    )}>
                      {result.highestSeverity}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text-2)]">{result.summary}</p>
              </div>
            )
          })()}

          {/* Triggered rules */}
          {result.triggeredRules.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
                  <span className="text-[var(--danger)]">
                    {result.triggeredRules.length} regel{result.triggeredRules.length > 1 ? 's' : ''} getriggerd
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.triggeredRules.map((rule) => (
                  <div
                    key={rule.ruleName}
                    className={cn(
                      'rounded-[var(--radius-sm)] border p-3.5 space-y-2',
                      severityStyles[rule.severity]
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold">{rule.ruleName}</p>
                      <span className="text-[10px] opacity-70 uppercase tracking-wide">{rule.severity}</span>
                    </div>
                    <p className="text-[12px] text-[var(--text-2)]">{rule.reason}</p>
                    <div className="border-t border-white/5 pt-2">
                      <p className="text-[12px] text-[var(--text-3)]">
                        <span className="text-[var(--text-3)]">Aanbeveling:</span>{' '}
                        {rule.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-[var(--radius)] border border-[var(--success)]/20 bg-[var(--success-dim)] p-5">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[var(--success)]" />
                <div>
                  <p className="text-[13px] font-medium text-[var(--success)]">Alle regels geslaagd</p>
                  <p className="text-[12px] text-[var(--text-3)] mt-0.5">
                    Entiteit bevindt zich binnen acceptabele parameters. Blijf monitoren.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <Skull size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Voer data in en run de Kill Engine</p>
          </div>
        </div>
      )}
    </div>
  )
}
