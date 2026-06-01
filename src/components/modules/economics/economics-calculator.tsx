'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { economicsSchema, type EconomicsFormValues } from '@/lib/validations/economics'
import { calculateProductEconomics } from '@/domain/economics/calculator'
import type { ProductEconomics } from '@/domain/economics/types'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'
import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#14b8a6']

export function EconomicsCalculator() {
  const [result, setResult] = useState<ProductEconomics | null>(null)

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
    const economics = calculateProductEconomics(data as EconomicsFormValues)
    setResult(economics)
  }

  const chartData = result
    ? [
        { name: 'COGS', value: result.cogs },
        { name: 'Shipping', value: result.shippingCost },
        { name: 'VAT', value: result.vat },
        { name: 'Payment Fees', value: result.paymentFees },
        { name: 'Refund Reserve', value: result.refundReserve },
        { name: 'Chargeback Reserve', value: result.chargebackReserve },
        { name: 'Net Profit', value: Math.max(0, result.netProfit) },
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Economics</CardTitle>
          <CardDescription>Enter your product cost structure to calculate true margins</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price (€)</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                placeholder="49.99"
                {...register('salePrice')}
              />
              {errors.salePrice && (
                <p className="text-xs text-red-400">{errors.salePrice.message}</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productCost">Product Cost (€)</Label>
                <Input
                  id="productCost"
                  type="number"
                  step="0.01"
                  placeholder="8.50"
                  {...register('productCost')}
                />
                {errors.productCost && (
                  <p className="text-xs text-red-400">{errors.productCost.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost (€)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  placeholder="4.95"
                  {...register('shippingCost')}
                />
                {errors.shippingCost && (
                  <p className="text-xs text-red-400">{errors.shippingCost.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vatPercentage">VAT (%)</Label>
                <Input
                  id="vatPercentage"
                  type="number"
                  step="0.1"
                  placeholder="21"
                  {...register('vatPercentage')}
                />
                {errors.vatPercentage && (
                  <p className="text-xs text-red-400">{errors.vatPercentage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentFeePerc">Payment Fee (%)</Label>
                <Input
                  id="paymentFeePerc"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  {...register('paymentFeePerc')}
                />
                {errors.paymentFeePerc && (
                  <p className="text-xs text-red-400">{errors.paymentFeePerc.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="refundPerc">Refund Rate (%)</Label>
                <Input
                  id="refundPerc"
                  type="number"
                  step="0.1"
                  placeholder="3"
                  {...register('refundPerc')}
                />
                {errors.refundPerc && (
                  <p className="text-xs text-red-400">{errors.refundPerc.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chargebackPerc">Chargeback Rate (%)</Label>
                <Input
                  id="chargebackPerc"
                  type="number"
                  step="0.1"
                  placeholder="0.5"
                  {...register('chargebackPerc')}
                />
                {errors.chargebackPerc && (
                  <p className="text-xs text-red-400">{errors.chargebackPerc.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Calculate Economics
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn(result.netProfit > 0 ? 'border-green-500/30' : 'border-red-500/30')}>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373] mb-1">Net Profit per Sale</p>
                <p className={cn(
                  'text-2xl font-bold',
                  result.netProfit > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {formatCurrency(result.netProfit)}
                </p>
                <Badge variant={result.netProfit > 0 ? 'success' : 'danger'} className="mt-1 text-xs">
                  {formatPercent(result.netMargin)} margin
                </Badge>
              </CardContent>
            </Card>

            <Card className={cn(result.breakEvenCpa > 0 ? 'border-blue-500/30' : 'border-[#262626]')}>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373] mb-1">Break-Even CPA</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.breakEvenCpa > 0 ? formatCurrency(result.breakEvenCpa) : 'N/A'}
                </p>
                <p className="text-xs text-[#737373] mt-1">Max ad cost per conversion</p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Revenue', value: result.revenue, positive: true },
                { label: 'Product Cost (COGS)', value: -result.cogs },
                { label: 'Shipping Cost', value: -result.shippingCost },
                { label: 'VAT', value: -result.vat },
                { label: 'Payment Fees', value: -result.paymentFees },
                { label: 'Refund Reserve', value: -result.refundReserve },
                { label: 'Chargeback Reserve', value: -result.chargebackReserve },
              ].map(({ label, value, positive }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-[#a3a3a3]">{label}</span>
                  <span className={cn(
                    'text-sm font-medium',
                    positive ? 'text-[#f5f5f5]' : 'text-red-400'
                  )}>
                    {positive ? formatCurrency(value) : `- ${formatCurrency(Math.abs(value))}`}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-[#f5f5f5]">Net Profit</span>
                <span className={cn(
                  'text-sm font-bold',
                  result.netProfit > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {formatCurrency(result.netProfit)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f5f5f5',
                    }}
                    formatter={(value) => [formatCurrency(value as number), '']}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#a3a3a3', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <p className="text-[#525252] text-sm">Fill in the form to see results</p>
            <p className="text-[#525252] text-xs mt-1">Results will appear here</p>
          </div>
        </div>
      )}
    </div>
  )
}
