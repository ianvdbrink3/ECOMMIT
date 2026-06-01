import { z } from 'zod'

export const funnelSchema = z.object({
  sessions: z.preprocess(Number, z.number().min(0, 'Sessions must be non-negative')),
  addToCart: z.preprocess(Number, z.number().min(0, 'Add to cart must be non-negative')),
  initiateCheckout: z.preprocess(Number, z.number().min(0, 'Initiate checkout must be non-negative')),
  purchases: z.preprocess(Number, z.number().min(0, 'Purchases must be non-negative')),
})

export type FunnelFormValues = {
  sessions: number
  addToCart: number
  initiateCheckout: number
  purchases: number
}
