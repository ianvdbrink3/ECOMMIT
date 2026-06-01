import type { ProductInputs, ProductEconomics } from './types'

export function calculateProductEconomics(inputs: ProductInputs): ProductEconomics {
  const revenue = inputs.salePrice
  const cogs = inputs.productCost
  const shippingCost = inputs.shippingCost
  const vat = revenue * (inputs.vatPercentage / 100)
  const paymentFees = revenue * (inputs.paymentFeePerc / 100)
  const refundReserve = revenue * (inputs.refundPerc / 100)
  const chargebackReserve = revenue * (inputs.chargebackPerc / 100)

  const totalCosts = cogs + shippingCost + vat + paymentFees + refundReserve + chargebackReserve
  const netProfit = revenue - totalCosts
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
  const breakEvenCpa = netProfit > 0 ? netProfit : 0

  return {
    revenue,
    cogs,
    shippingCost,
    vat,
    paymentFees,
    refundReserve,
    chargebackReserve,
    netProfit,
    netMargin,
    breakEvenCpa,
  }
}
