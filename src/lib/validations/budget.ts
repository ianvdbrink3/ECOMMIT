import { z } from 'zod'

export const budgetSchema = z.object({
  testBudget: z.preprocess(Number, z.number().positive('Test budget must be positive')),
  creatives: z.preprocess(Number, z.number().int().min(1, 'Must have at least 1 creative')),
  hooks: z.preprocess(Number, z.number().int().min(1, 'Must have at least 1 hook')),
  angles: z.preprocess(Number, z.number().int().min(1, 'Must have at least 1 angle')),
})

export type BudgetFormValues = {
  testBudget: number
  creatives: number
  hooks: number
  angles: number
}
