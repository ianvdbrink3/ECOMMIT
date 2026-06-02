'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { economicsSchema, type EconomicsFormValues } from '@/lib/validations/economics'
import { calculateProductEconomics } from '@/domain/economics/calculator'
import type { ProductEconomics } from '@/domain/economics/types'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'

const CHART_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6', '#22c55e']

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[11px] text-red-400 mt-1">{message}</p>
}

function StatLine({
  label,
  value,
  variant = 'neutral',
}: {
  label: string
  value: string
  variant?: 'neutral' | 'positive' | 'negative'
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-[#666666]">{label}</span>
      <span
        className={cn(
          'text-[13px] font-medium tabular-nums',
          variant === 'positive' && 'text-emerald-400',
          variant === 'negative' && 'text-red-400',
          variant === 'neutral' && 'text-[#cccccc]'
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function EconomicsCalculator() {
  const [result, setResult] = useState<ProductEconomics | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EconomicsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(economicsSchema) as any,
    defaultValues: {
      salePrice: 49.99,
      productCost: 8.5,
      shippingCost: 4.95,
      vatPercentage: 21,
      paymentFeePerc: 2.5,
      refundPerc: 3,
      chargebackPerc: 0.5,
    },
  })

  const onSubmit = (data: EconomicsFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setResult(calculateProductEconomics(data))
      setLoading(false)
    }, 200)
  }

  const chartData = result
    ? [
        { name: 'COGS', value: result.cogs },
        { name: 'Verzending', value: result.shippingCost },
        { name: 'BTW', value: result.vat },
        { name: 'Betaalkosten', value: result.paymentFees },
        { name: 'Refund reserve', value: result.refundReserve },
        { name: 'Chargeback reserve', value: result.chargebackReserve },
        { name: 'Netto winst', value: Math.max(0, result.netProfit) },
      ]
    : []

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Economics</CardTitle>
          <CardDescription>
            Voer de kostenstructuur in om je echte marge te berekenen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="salePrice">Verkoopprijs (€)</Label>
              <Input id="salePrice" type="number" step="0.01" placeholder="49.99" {...register('salePrice')} />
              <FieldError message={errors.salePrice?.message} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="productCost">Productkosten (€)</Label>
                <Input id="productCost" type="number" step="0.01" placeholder="8.50" {...register('productCost')} />
                <FieldError message={errors.productCost?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shippingCost">Verzendkosten (€)</Label>
                <Input id="shippingCost" type="number" step="0.01" placeholder="4.95" {...register('shippingCost')} />
                <FieldError message={errors.shippingCost?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vatPercentage">BTW (%)</Label>
                <Input id="vatPercentage" type="number" step="0.1" placeholder="21" {...register('vatPercentage')} />
                <FieldError message={errors.vatPercentage?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentFeePerc">Betaalfee (%)</Label>
                <Input id="paymentFeePerc" type="number" step="0.1" placeholder="2.5" {...register('paymentFeePerc')} />
                <FieldError message={errors.paymentFeePerc?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="refundPerc">Refund rate (%)</Label>
                <Input id="refundPerc" type="number" step="0.1" placeholder="3" {...register('refundPerc')} />
                <FieldError message={errors.refundPerc?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="chargebackPerc">Chargeback rate (%)</Label>
                <Input id="chargebackPerc" type="number" step="0.1" placeholder="0.5" {...register('chargebackPerc')} />
                <FieldError message={errors.chargebackPerc?.message} />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              <Calculator className="w-4 h-4" />
              Bereken economics
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Hero metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              'rounded-xl border p-4',
              result.netProfit > 0
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-red-500/20 bg-red-500/5'
            )}>
              <p className="text-[11px] text-[#555555] uppercase tracking-wide mb-2">Netto winst</p>
              <p className={cn(
                'text-2xl font-bold tabular-nums',
                result.netProfit > 0 ? 'text-emerald-400' : 'text-red-400'
              )}>
                {formatCurrency(result.netProfit)}
              </p>
              <p className={cn(
                'text-[12px] mt-1',
                result.netProfit > 0 ? 'text-emerald-500/70' : 'text-red-500/70'
              )}>
                {formatPercent(result.netMargin)} marge
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-[11px] text-[#555555] uppercase tracking-wide mb-2">Break-even CPA</p>
              <p className="text-2xl font-bold tabular-nums text-blue-400">
                {result.breakEvenCpa > 0 ? formatCurrency(result.breakEvenCpa) : '—'}
              </p>
              <p className="text-[12px] text-blue-500/60 mt-1">Max ad cost per sale</p>
            </div>
          </div>

          {/* Cost breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Kostenverdeling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[#161616]">
                <StatLine label="Omzet" value={formatCurrency(result.revenue)} variant="positive" />
                <StatLine label="Productkosten (COGS)" value={`− ${formatCurrency(result.cogs)}`} variant="negative" />
                <StatLine label="Verzendkosten" value={`− ${formatCurrency(result.shippingCost)}`} variant="negative" />
                <StatLine label="BTW" value={`− ${formatCurrency(result.vat)}`} variant="negative" />
                <StatLine label="Betaalkosten" value={`− ${formatCurrency(result.paymentFees)}`} variant="negative" />
                <StatLine label="Refund reserve" value={`− ${formatCurrency(result.refundReserve)}`} variant="negative" />
                <StatLine label="Chargeback reserve" value={`− ${formatCurrency(result.chargebackReserve)}`} variant="negative" />
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#efefef]">Netto winst</span>
                <span className={cn(
                  'text-[14px] font-bold tabular-nums',
                  result.netProfit > 0 ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {formatCurrency(result.netProfit)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pie chart */}
          <Card>
            <CardHeader>
              <CardTitle>Omzetverdeling</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #242424',
                      borderRadius: '8px',
                      color: '#efefef',
                      fontSize: '12px',
                    }}
                    formatter={(v) => [formatCurrency(v as number), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-[11px] text-[#555555] truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-dashed border-[#1e1e1e] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#333333]" />
          </div>
          <p className="text-[13px] text-[#444444]">Vul het formulier in om resultaten te zien</p>
        </div>
      )}
    </div>
  )
}
