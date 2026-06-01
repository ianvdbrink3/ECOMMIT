export interface FunnelInputs {
  sessions: number
  addToCart: number
  initiateCheckout: number
  purchases: number
}

export type FunnelDiagnosis =
  | 'PRODUCT_PAGE_ISSUE'
  | 'PRICING_ISSUE'
  | 'TRUST_ISSUE'
  | 'HEALTHY'

export interface FunnelAnalysis {
  atcRate: number
  checkoutRate: number
  purchaseRate: number
  overallConversionRate: number
  diagnosis: FunnelDiagnosis
  recommendation: string
}
