export interface CashInputs {
  remainingBudget: number
  dailySpend: number
  averageCpa: number
  roas: number
}

export interface CashForecastResult {
  runway: number
  burnRate: number
  estimatedDepletionDate: Date
  estimatedPurchases: number
  estimatedRevenue: number
  estimatedProfit: number
  isViable: boolean
  recommendation: string
}
