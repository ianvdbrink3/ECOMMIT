export interface ProductInputs {
  salePrice: number
  productCost: number
  shippingCost: number
  vatPercentage: number
  paymentFeePerc: number
  refundPerc: number
  chargebackPerc: number
}

export interface ProductEconomics {
  revenue: number
  cogs: number
  shippingCost: number
  vat: number
  paymentFees: number
  refundReserve: number
  chargebackReserve: number
  netProfit: number
  netMargin: number
  breakEvenCpa: number
}
