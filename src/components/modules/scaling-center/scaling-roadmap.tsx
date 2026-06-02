'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  ReferenceLine,
} from 'recharts'

const riskColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
} as const

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
          label: `Day ${step.day}`,
        })),
      ]
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Scaling Center</CardTitle>
          <CardDescription>
            Stap-voor-stap schaalroadmap voor je winnende campagne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentDailyBudget">Current Daily Budget (€)</Label>
              <Input
                id="currentDailyBudget"
                type="number"
                step="0.01"
                min="1"
                placeholder="50"
                {...register('currentDailyBudget')}
              />
              {errors.currentDailyBudget && (
                <p className="text-xs text-red-400">{errors.currentDailyBudget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Scale Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-xs text-red-400">{errors.startDate.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              <TrendingUp className="w-4 h-4" />
              Genereer roadmap
            </Button>
          </form>

          {/* Scaling Strategy Info */}
          <div className="mt-6 space-y-3">
            <p className="text-xs text-[#525252] uppercase tracking-wider">Scaling Strategy</p>
            <div className="space-y-2 text-xs text-[#737373]">
              <p>• Days 1–5: Incremental budget increases (15–20%)</p>
              <p>• Day 7: Duplicate the winning ad set</p>
              <p>• Day 10: Launch dedicated scaling campaign</p>
              <p>• Monitor ROAS daily; pause if it drops below 1.5x</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373]">Duration</p>
                <p className="text-lg font-bold text-[#f5f5f5]">{result.totalDuration} days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373]">Peak Budget</p>
                <p className="text-lg font-bold text-green-400">{formatCurrency(result.peakDailyBudget)}/day</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-[#737373]">Risk Level</p>
                <Badge variant={riskColors[result.riskLevel]} className="mt-1">
                  {result.riskLevel}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Budget Growth Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#737373', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v.toFixed(0)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f5f5f5',
                    }}
                    formatter={(v) => [formatCurrency(v as number), 'Dagbudget']}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Step-by-step Roadmap */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Scaling Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.steps.map((step, index) => (
                <div
                  key={step.day}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                      {index + 1}
                    </div>
                    {index < result.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-[#1f1f1f] mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[#f5f5f5]">{step.action}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {step.budgetChange}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-[#737373]">
                          <Calendar size={10} />
                          {formatDate(step.date)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#737373]">{step.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign size={10} className="text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">
                        {formatCurrency(step.newDailyBudget)}/day
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-[#1a1a1a] border-dashed">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-[#525252] mx-auto mb-2" />
            <p className="text-[13px] text-[#444444]">Vul het formulier in om een roadmap te genereren</p>
          </div>
        </div>
      )}
    </div>
  )
}
