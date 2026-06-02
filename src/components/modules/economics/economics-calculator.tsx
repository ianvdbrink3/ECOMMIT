'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { economicsSchema, type EconomicsFormValues } from '@/lib/validations/economics'
import { calculateProductEconomics } from '@/domain/economics/calculator'
import type { ProductEconomics } from '@/domain/economics/types'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6', '#22c55e']

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}

function Metric({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: 'positive' | 'negative' | 'blue' }) {
  const colors = {
    positive: 'text-[var(--success)]',
    negative: 'text-[var(--danger)]',
    blue: 'text-[var(--accent)]',
  }
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--text-3)] mb-2">{label}</p>
      <p className={cn('text-[22px] font-bold tabular-nums leading-none', highlight ? colors[highlight] : 'text-[var(--text-1)]')}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-[var(--text-3)] mt-1.5">{sub}</p>}
    </div>
  )
}

function CostRow({ label, value, type }: { label: string; value: string; type: 'income' | 'cost' | 'total' }) {
  return (
    <div className={cn('flex items-center justify-between py-2', type === 'total' && 'pt-3 mt-1 border-t border-[var(--border)]')}>
      <span className={cn('text-[13px]', type === 'total' ? 'font-semibold text-[var(--text-1)]' : 'text-[var(--text-2)]')}>{label}</span>
      <span className={cn(
        'text-[13px] font-medium tabular-nums',
        type === 'income' && 'text-[var(--success)]',
        type === 'cost' && 'text-[var(--danger)]',
        type === 'total' && 'font-bold text-[var(--text-1)]'
      )}>{value}</span>
    </div>
  )
}

export function EconomicsCalculator() {
  const [result, setResult] = useState<ProductEconomics | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<EconomicsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(economicsSchema) as any,
    defaultValues: { salePrice: 49.99, productCost: 8.5, shippingCost: 4.95, vatPercentage: 21, paymentFeePerc: 2.5, refundPerc: 3, chargebackPerc: 0.5 },
  })

  const onSubmit = (data: EconomicsFormValues) => {
    setLoading(true)
    setTimeout(() => { setResult(calculateProductEconomics(data)); setLoading(false) }, 250)
  }

  const chartData = result ? [
    { name: 'Productkosten', value: result.cogs },
    { name: 'Verzending', value: result.shippingCost },
    { name: 'BTW', value: result.vat },
    { name: 'Betaalkosten', value: result.paymentFees },
    { name: 'Refund reserve', value: result.refundReserve },
    { name: 'Chargeback reserve', value: result.chargebackReserve },
    { name: 'Netto winst', value: Math.max(0, result.netProfit) },
  ] : []

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)]">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Product Economics</h2>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Voer de kostenstructuur in om je echte marge te berekenen</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <Field label="Verkoopprijs (€)" error={errors.salePrice?.message}>
            <Input type="number" step="0.01" placeholder="49.99" {...register('salePrice')} />
          </Field>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Productkosten (€)" error={errors.productCost?.message}>
              <Input type="number" step="0.01" placeholder="8.50" {...register('productCost')} />
            </Field>
            <Field label="Verzendkosten (€)" error={errors.shippingCost?.message}>
              <Input type="number" step="0.01" placeholder="4.95" {...register('shippingCost')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="BTW (%)" error={errors.vatPercentage?.message}>
              <Input type="number" step="0.1" placeholder="21" {...register('vatPercentage')} />
            </Field>
            <Field label="Betaalfee (%)" error={errors.paymentFeePerc?.message}>
              <Input type="number" step="0.1" placeholder="2.5" {...register('paymentFeePerc')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Refund rate (%)" error={errors.refundPerc?.message}>
              <Input type="number" step="0.1" placeholder="3" {...register('refundPerc')} />
            </Field>
            <Field label="Chargeback rate (%)" error={errors.chargebackPerc?.message}>
              <Input type="number" step="0.1" placeholder="0.5" {...register('chargebackPerc')} />
            </Field>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            <Calculator size={14} />
            Bereken economics
          </Button>
        </form>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Metric
              label="Netto winst"
              value={formatCurrency(result.netProfit)}
              sub={`${formatPercent(result.netMargin)} marge`}
              highlight={result.netProfit > 0 ? 'positive' : 'negative'}
            />
            <Metric
              label="Break-even CPA"
              value={result.breakEvenCpa > 0 ? formatCurrency(result.breakEvenCpa) : '—'}
              sub="Max adkosten per sale"
              highlight="blue"
            />
          </div>

          {/* Cost breakdown */}
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)] mb-1">Kostenverdeling</p>
            <CostRow label="Omzet" value={formatCurrency(result.revenue)} type="income" />
            <CostRow label="Productkosten (COGS)" value={`− ${formatCurrency(result.cogs)}`} type="cost" />
            <CostRow label="Verzendkosten" value={`− ${formatCurrency(result.shippingCost)}`} type="cost" />
            <CostRow label="BTW" value={`− ${formatCurrency(result.vat)}`} type="cost" />
            <CostRow label="Betaalkosten" value={`− ${formatCurrency(result.paymentFees)}`} type="cost" />
            <CostRow label="Refund reserve" value={`− ${formatCurrency(result.refundReserve)}`} type="cost" />
            <CostRow label="Chargeback reserve" value={`− ${formatCurrency(result.chargebackReserve)}`} type="cost" />
            <CostRow
              label="Netto winst"
              value={formatCurrency(result.netProfit)}
              type="total"
            />
          </div>

          {/* Pie chart */}
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)] mb-3">Omzetverdeling</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-1)' }}
                  formatter={(v) => [formatCurrency(v as number), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {chartData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[11px] text-[var(--text-3)] truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--radius)] border border-dashed border-[var(--border)] gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center">
            <Calculator size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[var(--text-2)]">Geen resultaten</p>
            <p className="text-[12px] text-[var(--text-3)] mt-1">Vul het formulier in en klik op bereken</p>
          </div>
        </div>
      )}
    </div>
  )
}
