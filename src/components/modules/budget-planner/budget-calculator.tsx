'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { budgetSchema, type BudgetFormValues } from '@/lib/validations/budget'
import { calculateBudgetAllocation } from '@/domain/budget/calculator'
import type { BudgetAllocation } from '@/domain/budget/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function BudgetCalculator() {
  const [result, setResult] = useState<BudgetAllocation | null>(null)
  const [inputs, setInputs] = useState<BudgetFormValues | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      testBudget: 1000,
      creatives: 3,
      hooks: 3,
      angles: 2,
    },
  })

  const watchedValues = watch()
  const totalAdsPreview =
    (watchedValues.creatives || 0) * (watchedValues.hooks || 0) * (watchedValues.angles || 0)

  const onSubmit = (data: BudgetFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setResult(calculateBudgetAllocation(data))
      setInputs(data)
      setLoading(false)
    }, 200)
  }

  const chartData = result
    ? [
        { name: 'Per Ad Set', value: result.budgetPerAdSet },
        { name: 'Per Ad', value: result.budgetPerAd },
        { name: 'Daily Budget', value: result.recommendedDailyBudget },
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Planner</CardTitle>
          <CardDescription>
            Verdeel testbudget over creatives × hooks × angles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testBudget">Totaal testbudget (€)</Label>
              <Input
                id="testBudget"
                type="number"
                step="10"
                placeholder="1000"
                {...register('testBudget')}
              />
              {errors.testBudget && (
                <p className="text-xs text-red-400">{errors.testBudget.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="creatives">Creatives</Label>
                <Input
                  id="creatives"
                  type="number"
                  min="1"
                  placeholder="3"
                  {...register('creatives')}
                />
                {errors.creatives && (
                  <p className="text-xs text-red-400">{errors.creatives.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hooks">Hooks</Label>
                <Input
                  id="hooks"
                  type="number"
                  min="1"
                  placeholder="3"
                  {...register('hooks')}
                />
                {errors.hooks && (
                  <p className="text-xs text-red-400">{errors.hooks.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="angles">Angles</Label>
                <Input
                  id="angles"
                  type="number"
                  min="1"
                  placeholder="2"
                  {...register('angles')}
                />
                {errors.angles && (
                  <p className="text-xs text-red-400">{errors.angles.message}</p>
                )}
              </div>
            </div>

            {totalAdsPreview > 0 && (
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-400">
                  Totaal te testen advertenties: <span className="font-bold text-sm">{totalAdsPreview}</span>
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Bereken allocatie
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && inputs ? (
        <div className="space-y-4">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Totaal ads', value: formatNumber(result.totalAds) },
              { label: 'Campagnes', value: formatNumber(result.recommendedCampaigns) },
              { label: 'Ad sets', value: formatNumber(result.recommendedAdSets) },
              { label: 'Testduur', value: `${result.maxTestDuration} dagen` },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-xs text-[#737373]">{label}</p>
                  <p className="text-xl font-bold text-[#f5f5f5] mt-0.5">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Budget breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Budgetverdeling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Totaal testbudget', value: formatCurrency(result.budgetRunway) },
                { label: 'Dagbudget (7-daags plan)', value: formatCurrency(result.recommendedDailyBudget) },
                { label: 'Budget per ad set', value: formatCurrency(result.budgetPerAdSet) },
                { label: 'Budget per advertentie', value: formatCurrency(result.budgetPerAd) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-[#a3a3a3]">{label}</span>
                  <span className="text-sm font-semibold text-[#f5f5f5]">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Budget per entiteit</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#737373', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 11 }}
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
                    formatter={(v) => [formatCurrency(v as number), 'Budget']}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Strategy Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Strategie-aanbevelingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-[#a3a3a3]">
                Met {result.totalAds} advertenties verdeeld over {result.recommendedCampaigns} campagne(s),
                wijs {formatCurrency(result.budgetPerAdSet)} toe per ad set over 7 dagen.
              </p>
              <p className="text-xs text-[#a3a3a3]">
                Stop na de testperiode de onderpresteerders en verdubbel op de top{' '}
                {Math.max(1, Math.ceil(result.totalAds * 0.2))} advertenties op ROAS en CPA.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-dashed border-[#1e1e1e] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center">
            <span className="text-[#333333] text-lg font-bold">€</span>
          </div>
          <p className="text-[13px] text-[#444444]">Vul het formulier in om de allocatie te zien</p>
        </div>
      )}
    </div>
  )
}
