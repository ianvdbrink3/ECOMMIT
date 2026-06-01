import type { BudgetInputs, BudgetAllocation } from './types'

export function calculateBudgetAllocation(inputs: BudgetInputs): BudgetAllocation {
  const totalAds = inputs.creatives * inputs.hooks * inputs.angles
  const recommendedCampaigns = Math.max(1, Math.ceil(totalAds / 5))
  const recommendedAdSets = Math.max(1, Math.ceil(totalAds / inputs.creatives))
  const recommendedDailyBudget = inputs.testBudget / 7
  const budgetPerAdSet = recommendedAdSets > 0 ? inputs.testBudget / recommendedAdSets : 0
  const budgetPerAd = totalAds > 0 ? inputs.testBudget / totalAds : 0
  const maxTestDuration = recommendedDailyBudget > 0 ? Math.floor(inputs.testBudget / recommendedDailyBudget) : 0
  const budgetRunway = inputs.testBudget

  return {
    totalAds,
    recommendedCampaigns,
    recommendedAdSets,
    recommendedDailyBudget,
    maxTestDuration,
    budgetRunway,
    budgetPerAdSet,
    budgetPerAd,
  }
}
