import type { CashInputs, CashForecastResult } from './types'

export function calculateCashForecast(inputs: CashInputs): CashForecastResult {
  const runway = inputs.dailySpend > 0 ? inputs.remainingBudget / inputs.dailySpend : Infinity
  const burnRate = inputs.dailySpend
  const depletionDate = new Date()
  depletionDate.setDate(depletionDate.getDate() + Math.floor(runway === Infinity ? 365 : runway))

  const estimatedPurchases = inputs.averageCpa > 0 ? inputs.remainingBudget / inputs.averageCpa : 0
  const estimatedRevenue = inputs.remainingBudget * inputs.roas
  const estimatedProfit = estimatedRevenue - inputs.remainingBudget
  const isViable = inputs.roas >= 1.5

  let recommendation: string
  if (runway !== Infinity && runway < 3) {
    recommendation =
      'Critical: Less than 3 days of budget remaining. Pause underperforming campaigns immediately and allocate remaining budget to winners only.'
  } else if (runway !== Infinity && runway < 7) {
    recommendation =
      'Warning: Less than 7 days of budget remaining. Begin reducing spend on underperformers and prepare for budget reload.'
  } else if (!isViable) {
    recommendation =
      'ROAS below 1.5x threshold. Reconsider campaign strategy before additional budget allocation.'
  } else {
    recommendation =
      'Budget health is good. Continue current strategy and monitor performance metrics daily.'
  }

  return {
    runway,
    burnRate,
    estimatedDepletionDate: depletionDate,
    estimatedPurchases,
    estimatedRevenue,
    estimatedProfit,
    isViable,
    recommendation,
  }
}
