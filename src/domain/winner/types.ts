export interface WinnerInputs {
  spend: number
  purchases: number
  revenue: number
  impressions: number
  clicks: number
  breakEvenCpa: number
}

export type WinnerVerdict = 'KILL' | 'OBSERVE' | 'SCALE'

export interface WinnerAnalysis {
  cpa: number
  roas: number
  ctr: number
  conversionRate: number
  verdict: WinnerVerdict
  confidence: number
  explanation: string
}
