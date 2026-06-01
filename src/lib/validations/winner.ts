import { z } from 'zod'

export const winnerSchema = z.object({
  spend: z.preprocess(Number, z.number().min(0, 'Spend must be non-negative')),
  purchases: z.preprocess(Number, z.number().min(0, 'Purchases must be non-negative')),
  revenue: z.preprocess(Number, z.number().min(0, 'Revenue must be non-negative')),
  impressions: z.preprocess(Number, z.number().min(0, 'Impressions must be non-negative')),
  clicks: z.preprocess(Number, z.number().min(0, 'Clicks must be non-negative')),
  breakEvenCpa: z.preprocess(Number, z.number().min(0, 'Break-even CPA must be non-negative')),
})

export type WinnerFormValues = {
  spend: number
  purchases: number
  revenue: number
  impressions: number
  clicks: number
  breakEvenCpa: number
}
