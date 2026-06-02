'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cashSchema, type CashFormValues } from '@/lib/validations/cash'
import { calculateCashForecast } from '@/domain/cash/forecast'
import type { CashForecastResult } from '@/domain/cash/types'
import { formatCurrency, formatDate, formatNumber, cn } from '@/lib/utils'
import { DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}

export function CashForecastForm() {
  const [result, setResult] = useState<CashForecastResult | null>(null)
  const [formValues, setFormValues] = useState<CashFormValues | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CashFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cashSchema) as any,
    defaultValues: {
      remainingBudget: 2500,
      dailySpend: 120,
      averageCpa: 14.5,
      roas: 2.8,
    },
  })

  const onSubmit = (data: CashFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setResult(calculateCashForecast(data))
      setFormValues(data)
      setLoading(false)
    }, 200)
  }

  // Generate burn curve data
  const burnCurveData = result && formValues
    ? Array.from({ length: Math.min(Math.ceil(result.runway === Infinity ? 30 : result.runway) + 2, 32) }, (_, i) => ({
        day: i,
        budget: Math.max(0, formValues.remainingBudget - formValues.dailySpend * i),
        revenue: formValues.dailySpend * i * formValues.roas,
      }))
    : []

  const depletionDay = result && formValues && result.runway !== Infinity
    ? Math.floor(result.runway)
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Cash Forecast</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Forecast je resterend budget runway en geschatte opbrengsten</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Field label="Resterend budget (€)" error={errors.remainingBudget?.message}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="2500"
              {...register('remainingBudget')}
            />
          </Field>

          <Field label="Huidig dagbudget (€)" error={errors.dailySpend?.message}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="120"
              {...register('dailySpend')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Gemiddeld CPA (€)" error={errors.averageCpa?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="14.50"
                {...register('averageCpa')}
              />
            </Field>

            <Field label="Huidig ROAS" error={errors.roas?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="2.8"
                {...register('roas')}
              />
            </Field>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            <DollarSign size={14} />
            Genereer forecast
          </Button>
        </form>
      </div>

      {result && formValues ? (
        <div className="space-y-4">
          {/* Status Banner */}
          {(() => {
            const isCritical = result.runway < 3
            const isWarning = result.runway < 7 || !result.isViable
            const bg = isCritical ? 'bg-[var(--danger-dim)] border-[var(--danger)]/20' : isWarning ? 'bg-[var(--warning-dim)] border-[var(--warning)]/20' : 'bg-[var(--success-dim)] border-[var(--success)]/20'
            const textColor = isCritical ? 'text-[var(--danger)]' : isWarning ? 'text-[var(--warning)]' : 'text-[var(--success)]'
            const Icon = isWarning || isCritical ? AlertTriangle : CheckCircle
            const title = isCritical
              ? 'Kritiek: Budget bijna leeg'
              : result.runway < 7
                ? 'Waarschuwing: Laag budget'
                : !result.isViable
                  ? 'Waarschuwing: Laag ROAS'
                  : 'Budgetstatus: Goed'
            return (
              <div className={cn('rounded-[var(--radius)] border p-4', bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={15} className={textColor} />
                  <p className={cn('text-[13px] font-semibold', textColor)}>{title}</p>
                </div>
                <p className="text-[13px] text-[var(--text-2)]">{result.recommendation}</p>
              </div>
            )
          })()}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className={cn(result.runway < 7 ? 'border-[var(--danger)]/30' : 'border-[var(--success)]/30')}>
              <CardContent className="p-4">
                <p className="text-[11px] text-[var(--text-3)]">Budget runway</p>
                <p className={cn(
                  'text-2xl font-bold',
                  result.runway < 7 ? 'text-[var(--danger)]' : 'text-[var(--success)]'
                )}>
                  {result.runway === Infinity ? '∞' : `${Math.floor(result.runway)}`}
                  {result.runway !== Infinity && <span className="text-[14px] ml-1">dagen</span>}
                </p>
                {result.runway !== Infinity && (
                  <p className="text-[11px] text-[var(--text-3)] mt-1">
                    Leeg op {formatDate(result.estimatedDepletionDate)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className={cn(result.isViable ? 'border-[var(--success)]/30' : 'border-[var(--danger)]/30')}>
              <CardContent className="p-4">
                <p className="text-[11px] text-[var(--text-3)]">Geschatte winst</p>
                <p className={cn(
                  'text-2xl font-bold',
                  result.estimatedProfit > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                )}>
                  {formatCurrency(result.estimatedProfit)}
                </p>
                <Badge variant={result.isViable ? 'success' : 'danger'} className="mt-1">
                  ROAS {formValues.roas.toFixed(2)}x
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Dagelijkse burn rate', value: formatCurrency(result.burnRate) },
                { label: 'Geschatte aankopen', value: formatNumber(Math.floor(result.estimatedPurchases)) },
                { label: 'Geschatte omzet', value: formatCurrency(result.estimatedRevenue) },
                { label: 'Geschatte winst', value: formatCurrency(result.estimatedProfit) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--text-2)]">{label}</span>
                  <span className="text-[13px] font-semibold text-[var(--text-1)]">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Budget Burn Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Budget burn curve</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={burnCurveData}>
                  <defs>
                    <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-3)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `D${v}`}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-1)',
                    }}
                    formatter={(v, name) => [
                      formatCurrency(v as number),
                      name === 'budget' ? 'Resterend budget' : 'Cumulatieve omzet',
                    ]}
                  />
                  {depletionDay !== null && (
                    <ReferenceLine
                      x={depletionDay}
                      stroke="var(--danger)"
                      strokeDasharray="3 3"
                      label={{ value: 'Depletie', fill: 'var(--danger)', fontSize: 10 }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="budget"
                    stroke="#3b82f6"
                    fill="url(#budgetGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    fill="url(#revenueGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <DollarSign size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Vul het formulier in om je runway te zien</p>
          </div>
        </div>
      )}
    </div>
  )
}
