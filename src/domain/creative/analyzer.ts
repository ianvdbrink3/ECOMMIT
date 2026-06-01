import type { CreativeInputs, CreativeAnalysis, CreativeClassification } from './types'

export function analyzeCreative(inputs: CreativeInputs): CreativeAnalysis {
  const ctr = inputs.impressions > 0 ? (inputs.linkClicks / inputs.impressions) * 100 : 0
  const outboundCtr = ctr * 0.85
  const cpc = inputs.linkClicks > 0 ? inputs.spend / inputs.linkClicks : 0
  const cpm = inputs.impressions > 0 ? (inputs.spend / inputs.impressions) * 1000 : 0

  let performanceScore: number
  if (ctr >= 3) performanceScore = 100
  else if (ctr >= 2) performanceScore = 75
  else if (ctr >= 1) performanceScore = 50
  else performanceScore = 25

  let classification: CreativeClassification
  if (ctr < 1) classification = 'Weak'
  else if (ctr < 2) classification = 'Average'
  else if (ctr < 3) classification = 'Good'
  else classification = 'Strong'

  return { ctr, outboundCtr, cpc, cpm, performanceScore, classification }
}
