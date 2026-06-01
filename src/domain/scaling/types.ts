export interface ScalingInputs {
  currentDailyBudget: number
  startDate: Date
}

export interface ScalingStep {
  day: number
  date: Date
  action: string
  budgetChange: string
  newDailyBudget: number
  description: string
}

export interface ScalingRoadmap {
  steps: ScalingStep[]
  totalDuration: number
  peakDailyBudget: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}
