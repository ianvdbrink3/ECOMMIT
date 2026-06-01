export interface CreativeInputs {
  impressions: number
  linkClicks: number
  spend: number
}

export type CreativeClassification = 'Weak' | 'Average' | 'Good' | 'Strong'

export interface CreativeAnalysis {
  ctr: number
  outboundCtr: number
  cpc: number
  cpm: number
  performanceScore: number
  classification: CreativeClassification
}
