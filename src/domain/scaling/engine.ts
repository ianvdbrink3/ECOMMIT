import type { ScalingInputs, ScalingStep, ScalingRoadmap } from './types'

export function generateScalingRoadmap(inputs: ScalingInputs): ScalingRoadmap {
  const steps: ScalingStep[] = []
  let currentBudget = inputs.currentDailyBudget

  const increments = [
    { day: 1, action: 'Increase Budget +20%', factor: 1.2 },
    { day: 3, action: 'Increase Budget +20%', factor: 1.2 },
    { day: 5, action: 'Increase Budget +15%', factor: 1.15 },
    { day: 7, action: 'Duplicate Ad Set', factor: 2.0 },
    { day: 10, action: 'Create Scaling Campaign', factor: 1.5 },
  ]

  for (const increment of increments) {
    const date = new Date(inputs.startDate)
    date.setDate(date.getDate() + increment.day)
    const prevBudget = currentBudget
    currentBudget = currentBudget * increment.factor

    steps.push({
      day: increment.day,
      date,
      action: increment.action,
      budgetChange: `+${((increment.factor - 1) * 100).toFixed(0)}%`,
      newDailyBudget: currentBudget,
      description: getStepDescription(increment.action, prevBudget, currentBudget),
    })
  }

  return {
    steps,
    totalDuration: 10,
    peakDailyBudget: currentBudget,
    riskLevel: currentBudget > inputs.currentDailyBudget * 5 ? 'HIGH' : 'MEDIUM',
  }
}

function getStepDescription(action: string, prev: number, next: number): string {
  if (action.includes('Duplicate')) {
    return `Duplicate the winning ad set to test in a fresh auction. New combined budget: €${next.toFixed(2)}/day`
  }
  if (action.includes('Scaling Campaign')) {
    return `Launch dedicated scaling campaign with proven creative. Budget: €${next.toFixed(2)}/day`
  }
  return `Increase daily budget from €${prev.toFixed(2)} to €${next.toFixed(2)}`
}
