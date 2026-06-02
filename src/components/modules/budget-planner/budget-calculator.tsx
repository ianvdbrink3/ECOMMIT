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
import { PieChart } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
        { name: 'Dagbudget', value: result.recommendedDailyBudget },
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
            <Field label="Totaal testbudget (€)" error={errors.testBudget?.message}>
              <Input
                type="number"
                step="10"
                placeholder="1000"
                {...register('testBudget')}
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Creatives" error={errors.creatives?.message}>
                <Input
                  type="number"
                  min="1"
                  placeholder="3"
                  {...register('creatives')}
                />
              </Field>

              <Field label="Hooks" error={errors.hooks?.message}>
                <Input
                  type="number"
                  min="1"
                  placeholder="3"
                  {...register('hooks')}
                />
              </Field>

              <Field label="Angles" error={errors.angles?.message}>
                <Input
                  type="number"
                  min="1"
                  placeholder="2"
                  {...register('angles')}
                />
              </Field>
            </div>

            {totalAdsPreview > 0 && (
              <div className="bg-[var(--accent-dim)] border border-[var(--accent)]/20 rounded-[var(--radius-sm)] p-3">
                <p className="text-[12px] text-[var(--accent)]">
                  Totaal te testen advertenties: <span className="font-bold text-[13px]">{totalAdsPreview}</span>
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
                  <p className="text-[11px] text-[var(--text-3)] uppercase tracking-[0.06em]">{label}</p>
                  <p className="text-xl font-bold text-[var(--text-1)] mt-1">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Budget breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Budgetverdeling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Totaal testbudget', value: formatCurrency(result.budgetRunway) },
                { label: 'Dagbudget (7-daags plan)', value: formatCurrency(result.recommendedDailyBudget) },
                { label: 'Budget per ad set', value: formatCurrency(result.budgetPerAdSet) },
                { label: 'Budget per advertentie', value: formatCurrency(result.budgetPerAd) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--text-2)]">{label}</span>
                  <span className="text-[13px] font-semibold text-[var(--text-1)]">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Budget per entiteit</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-3)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-3)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-3)', fontSize: 11 }}
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
                    formatter={(v) => [formatCurrency(v as number), 'Budget']}
                  />
                  <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Strategy Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Strategie-aanbevelingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[12px] text-[var(--text-2)]">
                Met {result.totalAds} advertenties verdeeld over {result.recommendedCampaigns} campagne(s),
                wijs {formatCurrency(result.budgetPerAdSet)} toe per ad set over 7 dagen.
              </p>
              <p className="text-[12px] text-[var(--text-2)]">
                Stop na de testperiode de onderpresteerders en verdubbel op de top{' '}
                {Math.max(1, Math.ceil(result.totalAds * 0.2))} advertenties op ROAS en CPA.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <PieChart size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Vul het formulier in om de allocatie te zien</p>
          </div>
        </div>
      )}
    </div>
  )
}
