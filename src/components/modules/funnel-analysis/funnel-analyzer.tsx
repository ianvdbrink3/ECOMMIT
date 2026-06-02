'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { funnelSchema, type FunnelFormValues } from '@/lib/validations/funnel'
import { analyzeFunnel } from '@/domain/funnel/analyzer'
import type { FunnelAnalysis } from '@/domain/funnel/types'
import { formatPercent, formatNumber, cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, Filter } from 'lucide-react'
import { useState } from 'react'
import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts'

const diagnosisConfig = {
  HEALTHY: {
    icon: CheckCircle,
    title: 'Funnel is gezond',
    color: '#22c55e',
    bg: 'bg-[var(--success-dim)]',
    border: 'border-[var(--success)]/20',
    textColor: 'text-[var(--success)]',
  },
  PRODUCT_PAGE_ISSUE: {
    icon: AlertTriangle,
    title: 'Productpagina-probleem gedetecteerd',
    color: '#eab308',
    bg: 'bg-[var(--warning-dim)]',
    border: 'border-[var(--warning)]/20',
    textColor: 'text-[var(--warning)]',
  },
  PRICING_ISSUE: {
    icon: AlertTriangle,
    title: 'Prijsprobleem gedetecteerd',
    color: '#eab308',
    bg: 'bg-[var(--warning-dim)]',
    border: 'border-[var(--warning)]/20',
    textColor: 'text-[var(--warning)]',
  },
  TRUST_ISSUE: {
    icon: Info,
    title: 'Vertrouwensprobleem gedetecteerd',
    color: '#3b82f6',
    bg: 'bg-[var(--accent-dim)]',
    border: 'border-[var(--accent)]/20',
    textColor: 'text-[var(--accent)]',
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

export function FunnelAnalyzer() {
  const [result, setResult] = useState<FunnelAnalysis | null>(null)
  const [formValues, setFormValues] = useState<FunnelFormValues | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FunnelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(funnelSchema) as any,
    defaultValues: {
      sessions: 5000,
      addToCart: 250,
      initiateCheckout: 120,
      purchases: 45,
    },
  })

  const onSubmit = (data: FunnelFormValues) => {
    setLoading(true)
    setTimeout(() => {
      const analysis = analyzeFunnel(data)
      setResult(analysis)
      setFormValues(data)
      setLoading(false)
    }, 200)
  }

  const funnelData = formValues
    ? [
        { name: 'Sessies', value: formValues.sessions, fill: '#3b82f6' },
        { name: 'Winkelwagen', value: formValues.addToCart, fill: '#8b5cf6' },
        { name: 'Checkout', value: formValues.initiateCheckout, fill: '#f59e0b' },
        { name: 'Aankopen', value: formValues.purchases, fill: '#22c55e' },
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Funnel Analyse</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Diagnose conversieproblemen in je verkoopfunnel</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {[
            { id: 'sessions', label: 'Totaal sessies', placeholder: '5000' },
            { id: 'addToCart', label: 'Winkelwagen toevoegen', placeholder: '250' },
            { id: 'initiateCheckout', label: 'Checkout starten', placeholder: '120' },
            { id: 'purchases', label: 'Aankopen', placeholder: '45' },
          ].map(({ id, label, placeholder }) => (
            <Field key={id} label={label} error={errors[id as keyof FunnelFormValues]?.message}>
              <Input
                type="number"
                min="0"
                placeholder={placeholder}
                {...register(id as keyof FunnelFormValues)}
              />
            </Field>
          ))}
          <Button type="submit" className="w-full" loading={loading}>
            Analyseer funnel
          </Button>
        </form>

        {/* Benchmarks */}
        <div className="px-5 pb-5 space-y-2">
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] font-semibold">Stage Benchmarks</p>
          {[
            { stage: 'Sessie → Winkelwagen', benchmark: '≥ 3%', description: 'Winkelwagenratio' },
            { stage: 'Winkelwagen → Checkout', benchmark: '≥ 40%', description: 'Checkout-initiatie' },
            { stage: 'Checkout → Aankoop', benchmark: '≥ 50%', description: 'Aankoopafronding' },
          ].map(({ stage, benchmark, description }) => (
            <div key={stage} className="flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[var(--text-2)]">{stage}</span>
                <span className="text-[var(--text-3)] ml-2">({description})</span>
              </div>
              <span className="text-[var(--success)]">{benchmark}</span>
            </div>
          ))}
        </div>
      </div>

      {result && formValues ? (
        <div className="space-y-4">
          {/* Diagnosis */}
          {(() => {
            const config = diagnosisConfig[result.diagnosis]
            const Icon = config.icon
            return (
              <div className={cn('rounded-[var(--radius)] border p-4', config.bg, config.border)}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={16} className={config.textColor} />
                  <p className={cn('text-[13px] font-semibold', config.textColor)}>{config.title}</p>
                </div>
                <p className="text-[13px] text-[var(--text-2)]">{result.recommendation}</p>
              </div>
            )
          })()}

          {/* Stage Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'ATC Ratio',
                value: formatPercent(result.atcRate, 1),
                benchmark: 3,
                actual: result.atcRate,
              },
              {
                label: 'Checkout Ratio',
                value: formatPercent(result.checkoutRate, 1),
                benchmark: 40,
                actual: result.checkoutRate,
              },
              {
                label: 'Aankoopratio',
                value: formatPercent(result.purchaseRate, 1),
                benchmark: 50,
                actual: result.purchaseRate,
              },
              {
                label: 'Totaal CVR',
                value: formatPercent(result.overallConversionRate, 2),
                benchmark: 2,
                actual: result.overallConversionRate,
              },
            ].map(({ label, value, benchmark, actual }) => (
              <Card
                key={label}
                className={cn(
                  actual >= benchmark ? 'border-[var(--success)]/30' : 'border-[var(--danger)]/30'
                )}
              >
                <CardContent className="p-4">
                  <p className="text-[11px] text-[var(--text-3)]">{label}</p>
                  <p
                    className={cn(
                      'text-lg font-bold mt-0.5',
                      actual >= benchmark ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    )}
                  >
                    {value}
                  </p>
                  <p className="text-[11px] text-[var(--text-3)]">doel: {benchmark}%</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funnel Visualization */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Funnel visualisatie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-1)',
                    }}
                    formatter={(value, name) => [
                      formatNumber(value as number),
                      name as string,
                    ]}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="var(--text-2)"
                      stroke="none"
                      dataKey="name"
                      style={{ fontSize: 12 }}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Drop-off Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Uitvalssamenvatting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  from: 'Sessies',
                  to: 'Winkelwagen',
                  fromVal: formValues.sessions,
                  toVal: formValues.addToCart,
                },
                {
                  from: 'Winkelwagen',
                  to: 'Checkout',
                  fromVal: formValues.addToCart,
                  toVal: formValues.initiateCheckout,
                },
                {
                  from: 'Checkout',
                  to: 'Aankoop',
                  fromVal: formValues.initiateCheckout,
                  toVal: formValues.purchases,
                },
              ].map(({ from, to, fromVal, toVal }) => {
                const dropoff = fromVal - toVal
                const dropoffRate = fromVal > 0 ? (dropoff / fromVal) * 100 : 0
                return (
                  <div key={`${from}-${to}`} className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--text-2)]">
                      {from} → {to}
                    </span>
                    <span className="text-[var(--danger)]">
                      -{formatNumber(dropoff)} ({formatPercent(dropoffRate, 0)} uitval)
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <Filter size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Voer funnel data in om de analyse te zien</p>
          </div>
        </div>
      )}
    </div>
  )
}
