import { z } from 'zod'

export const creativeSchema = z.object({
  impressions: z.preprocess(Number, z.number().min(0, 'Impressions must be non-negative')),
  linkClicks: z.preprocess(Number, z.number().min(0, 'Link clicks must be non-negative')),
  spend: z.preprocess(Number, z.number().min(0, 'Spend must be non-negative')),
})

export type CreativeFormValues = {
  impressions: number
  linkClicks: number
  spend: number
}
