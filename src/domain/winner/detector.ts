import type { WinnerInputs, WinnerAnalysis, WinnerVerdict } from './types'

export function detectWinner(inputs: WinnerInputs): WinnerAnalysis {
  const cpa = inputs.purchases > 0 ? inputs.spend / inputs.purchases : Infinity
  const roas = inputs.spend > 0 ? inputs.revenue / inputs.spend : 0
  const ctr = inputs.impressions > 0 ? (inputs.clicks / inputs.impressions) * 100 : 0
  const conversionRate = inputs.clicks > 0 ? (inputs.purchases / inputs.clicks) * 100 : 0

  let score = 0

  if (roas >= 3) score += 40
  else if (roas >= 2) score += 20
  else if (roas >= 1) score += 0
  else score -= 20

  if (inputs.breakEvenCpa > 0) {
    if (cpa <= inputs.breakEvenCpa * 0.7) score += 30
    else if (cpa <= inputs.breakEvenCpa) score += 15
    else if (cpa <= inputs.breakEvenCpa * 1.5) score -= 10
    else score -= 30
  }

  if (ctr >= 2) score += 20
  else if (ctr >= 1) score += 10

  if (conversionRate >= 3) score += 10
  else if (conversionRate >= 1) score += 5

  const confidence = Math.min(100, Math.max(0, score + 50))

  let verdict: WinnerVerdict
  if (score >= 40) verdict = 'SCALE'
  else if (score >= 0) verdict = 'OBSERVE'
  else verdict = 'KILL'

  const explanation = generateExplanation(verdict, {
    cpa,
    roas,
    ctr,
    conversionRate,
    breakEvenCpa: inputs.breakEvenCpa,
  })

  return { cpa, roas, ctr, conversionRate, verdict, confidence, explanation }
}

function generateExplanation(
  verdict: WinnerVerdict,
  metrics: {
    cpa: number
    roas: number
    ctr: number
    conversionRate: number
    breakEvenCpa: number
  }
): string {
  if (verdict === 'SCALE') {
    return `Strong performer. ROAS of ${metrics.roas.toFixed(2)}x exceeds target and CPA of €${metrics.cpa.toFixed(2)} is below break-even. Scale budget by 20% increments.`
  } else if (verdict === 'OBSERVE') {
    return `Mixed signals. Monitor for 24-48 more hours before deciding. ROAS at ${metrics.roas.toFixed(2)}x needs improvement to justify scaling.`
  } else {
    return `Underperformer. CPA of €${metrics.cpa === Infinity ? '∞' : metrics.cpa.toFixed(2)} exceeds break-even of €${metrics.breakEvenCpa.toFixed(2)}. Kill and reallocate budget.`
  }
}
