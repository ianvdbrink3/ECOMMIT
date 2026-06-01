import { z } from 'zod'

export const cashSchema = z.object({
  remainingBudget: z.preprocess(Number, z.number().min(0, 'Remaining budget must be non-negative')),
  dailySpend: z.preprocess(Number, z.number().min(0, 'Daily spend must be non-negative')),
  averageCpa: z.preprocess(Number, z.number().min(0, 'Average CPA must be non-negative')),
  roas: z.preprocess(Number, z.number().min(0, 'ROAS must be non-negative')),
})

export type CashFormValues = {
  remainingBudget: number
  dailySpend: number
  averageCpa: number
  roas: number
}
