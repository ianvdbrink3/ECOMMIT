import { z } from 'zod'

export const killEngineSchema = z.object({
  entityType: z.enum(['CREATIVE', 'ADSET', 'CAMPAIGN']),
  entityName: z.string().min(1, 'Entity name is required'),
  spend: z.preprocess(Number, z.number().min(0, 'Spend must be non-negative')),
  impressions: z.preprocess(Number, z.number().min(0, 'Impressions must be non-negative')),
  clicks: z.preprocess(Number, z.number().min(0, 'Clicks must be non-negative')),
  atc: z.preprocess(Number, z.number().min(0, 'ATC must be non-negative')),
  purchases: z.preprocess(Number, z.number().min(0, 'Purchases must be non-negative')),
  breakEvenCpa: z.preprocess(Number, z.number().min(0, 'Break-even CPA must be non-negative')),
})

export type KillEngineFormValues = {
  entityType: 'CREATIVE' | 'ADSET' | 'CAMPAIGN'
  entityName: string
  spend: number
  impressions: number
  clicks: number
  atc: number
  purchases: number
  breakEvenCpa: number
}
