import { z } from 'zod'

export const economicsSchema = z.object({
  salePrice: z.preprocess(Number, z.number().positive('Sale price must be positive')),
  productCost: z.preprocess(Number, z.number().min(0, 'Product cost must be non-negative')),
  shippingCost: z.preprocess(Number, z.number().min(0, 'Shipping cost must be non-negative')),
  vatPercentage: z.preprocess(Number, z.number().min(0).max(100, 'VAT must be between 0 and 100')),
  paymentFeePerc: z.preprocess(Number, z.number().min(0).max(100, 'Payment fee must be between 0 and 100')),
  refundPerc: z.preprocess(Number, z.number().min(0).max(100, 'Refund % must be between 0 and 100')),
  chargebackPerc: z.preprocess(Number, z.number().min(0).max(100, 'Chargeback % must be between 0 and 100')),
})

export type EconomicsFormValues = {
  salePrice: number
  productCost: number
  shippingCost: number
  vatPercentage: number
  paymentFeePerc: number
  refundPerc: number
  chargebackPerc: number
}
