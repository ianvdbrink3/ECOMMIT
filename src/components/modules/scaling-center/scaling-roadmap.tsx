'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { scalingSchema, type ScalingFormValues } from '@/lib/validations/scaling'
import { generateScalingRoadmap } from '@/domain/scaling/engine'
import type { ScalingRoadmap as ScalingRoadmapType } from '@/domain/scaling/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const riskColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
} as const

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}

export function ScalingRoadmap() {
  const [result, setResult] = useState<ScalingRoadmapType | null>(null)
  const [initialBudget, setInitialBudget] = useState(0)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScalingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(scalingSchema) as any,
    defaultValues: {
      currentDailyBudget: 50,
      startDate: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (data: ScalingFormValues) => {
    setLoading(true)
    setTimeout(() => {
      const roadmap = generateScalingRoadmap({
        currentDailyBudget: data.currentDailyBudget,
        startDate: new Date(data.startDate),
      })
      setResult(roadmap)
      setInitialBudget(data.currentDailyBudget)
      setLoading(false)
    }, 200)
  }

  const chartData = result
    ? [
        { day: 0, budget: initialBudget, label: 'Start' },
        ...result.steps.map((step) => ({
          day: step.day,
          budget: step.newDailyBudget,
          label: `Dag ${step.day}`,
        })),
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Scaling Center</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Stap-voor-stap schaalroadmap voor je winnende campagne</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Field label="Huidig dagbudget (€)" error={errors.currentDailyBudget?.message}>
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="50"
              {...register('currentDailyBudget')}
            />
          </Field>

          <Field label="Startdatum schalen" error={errors.startDate?.message}>
            <Input
              type="date"
              {...register('startDate')}
            />
          </Field>

          <Button type="submit" className="w-full" loading={loading}>
            <TrendingUp size={14} />
            Genereer roadmap
          </Button>
        </form>

        {/* Scaling Strategy Info */}
        <div className="px-5 pb-5 space-y-2">
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-[0.08em] font-semibold">Schaalstrategie</p>
          <div className="space-y-1.5 text-[12px] text-[var(--text-3)]">
            <p>• Dagen 1–5: Incrementele budgetverhogingen (15–20%)</p>
            <p>• Dag 7: Dupliceer de winnende ad set</p>
            <p>• Dag 10: Start een aparte schaalcampagne</p>
            <p>• Monitor ROAS dagelijks; pauzeer als het onder 1,5x zakt</p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-[11px] text-[var(--text-3)] uppercase tracking-[0.06em]">Duur</p>
                <p className="text-lg font-bold text-[var(--text-1)] mt-1">{result.totalDuration} dagen</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[11px] text-[var(--text-3)] uppercase tracking-[0.06em]">Piekbudget</p>
                <p className="text-lg font-bold text-[var(--success)] mt-1">{formatCurrency(result.peakDailyBudget)}/dag</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[11px] text-[var(--text-3)] uppercase tracking-[0.06em]">Risico</p>
                <Badge variant={riskColors[result.riskLevel]} className="mt-2">
                  {result.riskLevel}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Budget Growth Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Budgetgroei over tijd</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-3)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v.toFixed(0)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-1)',
                    }}
                    formatter={(v) => [formatCurrency(v as number), 'Dagbudget']}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Step-by-step Roadmap */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Schaalstappen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.steps.map((step, index) => (
                <div
                  key={step.day}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] text-[11px] font-bold">
                      {index + 1}
                    </div>
                    {index < result.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-[var(--border)] mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-medium text-[var(--text-1)]">{step.action}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[11px]">
                          {step.budgetChange}
                        </Badge>
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-3)]">
                          <Calendar size={10} />
                          {formatDate(step.date)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[12px] text-[var(--text-3)]">{step.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign size={10} className="text-[var(--accent)]" />
                      <span className="text-[11px] text-[var(--accent)] font-medium">
                        {formatCurrency(step.newDailyBudget)}/dag
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <TrendingUp size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Vul het formulier in om een roadmap te genereren</p>
          </div>
        </div>
      )}
    </div>
  )
}
