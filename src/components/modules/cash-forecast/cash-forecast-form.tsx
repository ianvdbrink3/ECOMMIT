'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
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
      <Card>
        <CardHeader>
          <CardTitle>Cash Forecast</CardTitle>
          <CardDescription>
            Forecast your remaining budget runway and estimated returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remainingBudget">Remaining Budget (€)</Label>
              <Input
                id="remainingBudget"
                type="number"
                step="0.01"
                min="0"
                placeholder="2500"
                {...register('remainingBudget')}
              />
              {errors.remainingBudget && (
                <p className="text-xs text-red-400">{errors.remainingBudget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailySpend">Current Daily Spend (€)</Label>
              <Input
                id="dailySpend"
                type="number"
                step="0.01"
                min="0"
                placeholder="120"
                {...register('dailySpend')}
              />
              {errors.dailySpend && (
                <p className="text-xs text-red-400">{errors.dailySpend.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="averageCpa">Average CPA (€)</Label>
                <Input
                  id="averageCpa"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="14.50"
                  {...register('averageCpa')}
                />
                {errors.averageCpa && (
                  <p className="text-xs text-red-400">{errors.averageCpa.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roas">Current ROAS</Label>
                <Input
                  id="roas"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.8"
                  {...register('roas')}
                />
                {errors.roas && (
                  <p className="text-xs text-red-400">{errors.roas.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              <DollarSign className="w-4 h-4" />
              Genereer forecast
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && formValues ? (
        <div className="space-y-4">
          {/* Recommendation Alert */}
          <Alert variant={result.runway < 3 ? 'destructive' : result.runway < 7 || !result.isViable ? 'warning' : 'success'}>
            {result.runway < 7 || !result.isViable ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.runway < 3
                ? 'Critical: Budget Nearly Depleted'
                : result.runway < 7
                  ? 'Warning: Low Budget'
                  : !result.isViable
                    ? 'Warning: Low ROAS'
                    : 'Budget Health: Good'}
            </AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {result.recommendation}
            </AlertDescription>
          </Alert>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className={result.runway < 7 ? 'border-red-500/30' : 'border-green-500/30'}>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373]">Budget Runway</p>
                <p className={cn(
                  'text-2xl font-bold',
                  result.runway < 7 ? 'text-red-400' : 'text-green-400'
                )}>
                  {result.runway === Infinity ? '∞' : `${Math.floor(result.runway)}`}
                  {result.runway !== Infinity && <span className="text-sm ml-1">days</span>}
                </p>
                {result.runway !== Infinity && (
                  <p className="text-xs text-[#737373] mt-1">
                    Depletes {formatDate(result.estimatedDepletionDate)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className={result.isViable ? 'border-green-500/30' : 'border-red-500/30'}>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373]">Est. Profit</p>
                <p className={cn(
                  'text-2xl font-bold',
                  result.estimatedProfit > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {formatCurrency(result.estimatedProfit)}
                </p>
                <Badge variant={result.isViable ? 'success' : 'danger'} className="mt-1 text-xs">
                  ROAS {formValues.roas.toFixed(2)}x
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Daily Burn Rate', value: formatCurrency(result.burnRate) },
                { label: 'Estimated Purchases', value: formatNumber(Math.floor(result.estimatedPurchases)) },
                { label: 'Estimated Revenue', value: formatCurrency(result.estimatedRevenue) },
                { label: 'Estimated Profit', value: formatCurrency(result.estimatedProfit) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-[#a3a3a3]">{label}</span>
                  <span className="text-sm font-semibold text-[#f5f5f5]">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Budget Burn Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Burn Curve</CardTitle>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#737373', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `D${v}`}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f5f5f5',
                    }}
                    formatter={(v, name) => [
                      formatCurrency(v as number),
                      name === 'budget' ? 'Remaining Budget' : 'Cumulative Revenue',
                    ]}
                  />
                  {depletionDay !== null && (
                    <ReferenceLine
                      x={depletionDay}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label={{ value: 'Depletion', fill: '#ef4444', fontSize: 10 }}
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
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-[#525252] mx-auto mb-2" />
            <p className="text-[13px] text-[#444444]">Vul het formulier in om je runway te zien</p>
          </div>
        </div>
      )}
    </div>
  )
}
