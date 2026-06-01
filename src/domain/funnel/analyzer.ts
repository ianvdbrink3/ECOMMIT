import type { FunnelInputs, FunnelAnalysis, FunnelDiagnosis } from './types'

export function analyzeFunnel(inputs: FunnelInputs): FunnelAnalysis {
  const atcRate = inputs.sessions > 0 ? (inputs.addToCart / inputs.sessions) * 100 : 0
  const checkoutRate = inputs.addToCart > 0 ? (inputs.initiateCheckout / inputs.addToCart) * 100 : 0
  const purchaseRate = inputs.initiateCheckout > 0 ? (inputs.purchases / inputs.initiateCheckout) * 100 : 0
  const overallConversionRate = inputs.sessions > 0 ? (inputs.purchases / inputs.sessions) * 100 : 0

  let diagnosis: FunnelDiagnosis
  let recommendation: string

  if (atcRate < 3 && inputs.sessions > 100) {
    diagnosis = 'PRODUCT_PAGE_ISSUE'
    recommendation =
      'Your product page is underperforming. Improve product images, copy, and social proof. ATC rate below 3% indicates visitors are not convinced by the product presentation.'
  } else if (checkoutRate < 40 && inputs.addToCart > 10) {
    diagnosis = 'PRICING_ISSUE'
    recommendation =
      'Many visitors add to cart but do not proceed to checkout. This typically indicates price sensitivity. Consider testing lower price points, payment plans, or highlighting value.'
  } else if (purchaseRate < 50 && inputs.initiateCheckout > 5) {
    diagnosis = 'TRUST_ISSUE'
    recommendation =
      'Visitors reach checkout but abandon before purchasing. Add trust signals: security badges, reviews, guarantees, and simplify the checkout process.'
  } else {
    diagnosis = 'HEALTHY'
    recommendation =
      'Your funnel is performing well. Focus on increasing top-of-funnel traffic and scaling winning campaigns.'
  }

  return { atcRate, checkoutRate, purchaseRate, overallConversionRate, diagnosis, recommendation }
}
