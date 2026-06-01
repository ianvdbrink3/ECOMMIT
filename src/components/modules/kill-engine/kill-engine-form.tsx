'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { killEngineSchema, type KillEngineFormValues } from '@/lib/validations/kill-engine'
import { createDefaultRuleEngine } from '@/domain/kill-engine/rules'
import type { KillEngineResult } from '@/domain/kill-engine/types'
import { cn } from '@/lib/utils'
import { Skull, Eye, Shield } from 'lucide-react'
import { useState } from 'react'

const severityColors = {
  LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
}

const verdictConfig = {
  KILL: { icon: Skull, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Kill' },
  OBSERVE: { icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Observe' },
  MONITOR: { icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: 'Monitor' },
}

export function KillEngineForm() {
  const [result, setResult] = useState<KillEngineResult | null>(null)
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
    const engine = createDefaultRuleEngine()
    const engineResult = engine.evaluate(data)
    setResult(engineResult)
  }

  const handleEntityTypeChange = (value: 'CREATIVE' | 'ADSET' | 'CAMPAIGN') => {
    setEntityType(value)
    setValue('entityType', value)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kill Engine</CardTitle>
          <CardDescription>
            Apply kill rules to determine if an entity should be paused or killed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select
                value={entityType}
                onValueChange={handleEntityTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATIVE">Creative</SelectItem>
                  <SelectItem value="ADSET">Ad Set</SelectItem>
                  <SelectItem value="CAMPAIGN">Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityName">Entity Name</Label>
              <Input
                id="entityName"
                placeholder="Ad Set #1"
                {...register('entityName')}
              />
              {errors.entityName && (
                <p className="text-xs text-red-400">{errors.entityName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="spend">Spend (€)</Label>
                <Input
                  id="spend"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="120"
                  {...register('spend')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breakEvenCpa">Break-Even CPA (€)</Label>
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
                  placeholder="8500"
                  {...register('impressions')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clicks">Clicks</Label>
                <Input
                  id="clicks"
                  type="number"
                  min="0"
                  placeholder="95"
                  {...register('clicks')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="atc">Add to Carts</Label>
                <Input
                  id="atc"
                  type="number"
                  min="0"
                  placeholder="3"
                  {...register('atc')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchases">Purchases</Label>
                <Input
                  id="purchases"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('purchases')}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" variant="destructive">
              <Skull className="w-4 h-4 mr-2" />
              Run Kill Engine
            </Button>
          </form>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-4">
          {/* Verdict Banner */}
          {(() => {
            const config = verdictConfig[result.finalVerdict]
            const Icon = config.icon
            return (
              <div className={cn('rounded-xl border p-5', config.bg)}>
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', config.bg)}>
                    <Icon className={cn('w-6 h-6', config.color)} />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] uppercase tracking-wider">Final Verdict</p>
                    <p className={cn('text-2xl font-bold', config.color)}>{config.label}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant={result.highestSeverity === 'CRITICAL' ? 'danger' : result.highestSeverity === 'HIGH' || result.highestSeverity === 'MEDIUM' ? 'warning' : 'secondary'}
                      className="text-xs"
                    >
                      {result.highestSeverity} severity
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-[#a3a3a3] mt-3">{result.summary}</p>
              </div>
            )
          })()}

          {/* Triggered Rules */}
          {result.triggeredRules.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-400">
                  Triggered Rules ({result.triggeredRules.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.triggeredRules.map((rule) => (
                  <div
                    key={rule.ruleName}
                    className={cn(
                      'rounded-lg border p-3',
                      severityColors[rule.severity]
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold">{rule.ruleName}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#a3a3a3] mb-2">{rule.reason}</p>
                    <p className="text-xs text-[#737373]">
                      <span className="font-medium">Recommendation:</span> {rule.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Alert variant="success">
              <Shield className="h-4 w-4" />
              <AlertTitle>No Kill Rules Triggered</AlertTitle>
              <AlertDescription>
                This entity is within acceptable performance parameters. Continue monitoring.
              </AlertDescription>
            </Alert>
          )}

          {/* Non-triggered rules note */}
          {result.triggeredRules.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-[#525252] uppercase tracking-wider mb-2">
                  All Rules Passed
                </p>
                <p className="text-sm text-[#737373]">
                  This entity passed all 5 kill rules. Keep running and accumulate more data
                  before making optimization decisions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <Skull className="w-8 h-8 text-[#525252] mx-auto mb-2" />
            <p className="text-[#525252] text-sm">Run the kill engine to see verdict</p>
          </div>
        </div>
      )}
    </div>
  )
}
