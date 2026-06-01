'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { funnelSchema, type FunnelFormValues } from '@/lib/validations/funnel'
import { analyzeFunnel } from '@/domain/funnel/analyzer'
import type { FunnelAnalysis } from '@/domain/funnel/types'
import { formatPercent, formatNumber } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
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
    variant: 'success' as const,
    title: 'Funnel is Healthy',
    color: '#22c55e',
  },
  PRODUCT_PAGE_ISSUE: {
    icon: AlertTriangle,
    variant: 'warning' as const,
    title: 'Product Page Issue Detected',
    color: '#f59e0b',
  },
  PRICING_ISSUE: {
    icon: AlertTriangle,
    variant: 'warning' as const,
    title: 'Pricing Issue Detected',
    color: '#f59e0b',
  },
  TRUST_ISSUE: {
    icon: Info,
    variant: 'warning' as const,
    title: 'Trust Issue Detected',
    color: '#3b82f6',
  },
}

export function FunnelAnalyzer() {
  const [result, setResult] = useState<FunnelAnalysis | null>(null)
  const [formValues, setFormValues] = useState<FunnelFormValues | null>(null)

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
    const analysis = analyzeFunnel(data)
    setResult(analysis)
    setFormValues(data)
  }

  const funnelData = formValues
    ? [
        { name: 'Sessions', value: formValues.sessions, fill: '#3b82f6' },
        { name: 'Add to Cart', value: formValues.addToCart, fill: '#8b5cf6' },
        { name: 'Checkout', value: formValues.initiateCheckout, fill: '#f59e0b' },
        { name: 'Purchases', value: formValues.purchases, fill: '#22c55e' },
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Funnel Analysis</CardTitle>
          <CardDescription>
            Diagnose conversion bottlenecks in your sales funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { id: 'sessions', label: 'Total Sessions', placeholder: '5000' },
              { id: 'addToCart', label: 'Add to Cart', placeholder: '250' },
              { id: 'initiateCheckout', label: 'Initiate Checkout', placeholder: '120' },
              { id: 'purchases', label: 'Purchases', placeholder: '45' },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type="number"
                  min="0"
                  placeholder={placeholder}
                  {...register(id as keyof FunnelFormValues)}
                />
                {errors[id as keyof FunnelFormValues] && (
                  <p className="text-xs text-red-400">
                    {errors[id as keyof FunnelFormValues]?.message}
                  </p>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full">
              Analyze Funnel
            </Button>
          </form>

          {/* Benchmarks */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-[#525252] uppercase tracking-wider">Stage Benchmarks</p>
            {[
              { stage: 'Session → ATC', benchmark: '≥ 3%', description: 'Add-to-cart rate' },
              { stage: 'ATC → Checkout', benchmark: '≥ 40%', description: 'Checkout initiation' },
              { stage: 'Checkout → Purchase', benchmark: '≥ 50%', description: 'Purchase completion' },
            ].map(({ stage, benchmark, description }) => (
              <div key={stage} className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#a3a3a3]">{stage}</span>
                  <span className="text-[#525252] ml-2">({description})</span>
                </div>
                <span className="text-green-400">{benchmark}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {result && formValues ? (
        <div className="space-y-4">
          {/* Diagnosis Alert */}
          {(() => {
            const config = diagnosisConfig[result.diagnosis]
            const Icon = config.icon
            return (
              <Alert variant={config.variant}>
                <Icon className="h-4 w-4" />
                <AlertTitle>{config.title}</AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                  {result.recommendation}
                </AlertDescription>
              </Alert>
            )
          })()}

          {/* Stage Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'ATC Rate',
                value: formatPercent(result.atcRate, 1),
                benchmark: 3,
                actual: result.atcRate,
              },
              {
                label: 'Checkout Rate',
                value: formatPercent(result.checkoutRate, 1),
                benchmark: 40,
                actual: result.checkoutRate,
              },
              {
                label: 'Purchase Rate',
                value: formatPercent(result.purchaseRate, 1),
                benchmark: 50,
                actual: result.purchaseRate,
              },
              {
                label: 'Overall CVR',
                value: formatPercent(result.overallConversionRate, 2),
                benchmark: 2,
                actual: result.overallConversionRate,
              },
            ].map(({ label, value, benchmark, actual }) => (
              <Card
                key={label}
                className={
                  actual >= benchmark ? 'border-green-500/30' : 'border-red-500/30'
                }
              >
                <CardContent className="p-4">
                  <p className="text-xs text-[#737373]">{label}</p>
                  <p
                    className={`text-lg font-bold mt-0.5 ${
                      actual >= benchmark ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-[#525252]">target: {benchmark}%</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funnel Visualization */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Funnel Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f5f5f5',
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
                      fill="#a3a3a3"
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
              <CardTitle className="text-sm">Drop-off Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  from: 'Sessions',
                  to: 'ATC',
                  fromVal: formValues.sessions,
                  toVal: formValues.addToCart,
                },
                {
                  from: 'ATC',
                  to: 'Checkout',
                  fromVal: formValues.addToCart,
                  toVal: formValues.initiateCheckout,
                },
                {
                  from: 'Checkout',
                  to: 'Purchase',
                  fromVal: formValues.initiateCheckout,
                  toVal: formValues.purchases,
                },
              ].map(({ from, to, fromVal, toVal }) => {
                const dropoff = fromVal - toVal
                const dropoffRate = fromVal > 0 ? (dropoff / fromVal) * 100 : 0
                return (
                  <div key={`${from}-${to}`} className="flex items-center justify-between text-xs">
                    <span className="text-[#a3a3a3]">
                      {from} → {to}
                    </span>
                    <span className="text-red-400">
                      -{formatNumber(dropoff)} ({formatPercent(dropoffRate, 0)} drop-off)
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <p className="text-[#525252] text-sm">Enter funnel data to see analysis</p>
          </div>
        </div>
      )}
    </div>
  )
}
