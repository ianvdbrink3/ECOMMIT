import { z } from 'zod'

export const scalingSchema = z.object({
  currentDailyBudget: z.preprocess(Number, z.number().positive('Daily budget must be positive')),
  startDate: z.string().min(1, 'Start date is required'),
})

export type ScalingFormValues = {
  currentDailyBudget: number
  startDate: string
}
