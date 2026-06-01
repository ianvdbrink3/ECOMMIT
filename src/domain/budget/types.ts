export interface BudgetInputs {
  testBudget: number
  creatives: number
  hooks: number
  angles: number
}

export interface BudgetAllocation {
  totalAds: number
  recommendedCampaigns: number
  recommendedAdSets: number
  recommendedDailyBudget: number
  maxTestDuration: number
  budgetRunway: number
  budgetPerAdSet: number
  budgetPerAd: number
}
