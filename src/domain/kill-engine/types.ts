export type EntityType = 'CREATIVE' | 'ADSET' | 'CAMPAIGN'
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type KillVerdict = 'KILL' | 'OBSERVE' | 'MONITOR'

export interface KillInput {
  entityType: EntityType
  entityName: string
  spend: number
  impressions: number
  clicks: number
  atc: number
  purchases: number
  breakEvenCpa: number
}

export interface RuleResult {
  triggered: boolean
  ruleName: string
  reason: string
  severity: SeverityLevel
  verdict: KillVerdict
  recommendation: string
}

export interface KillEngineResult {
  shouldKill: boolean
  triggeredRules: RuleResult[]
  highestSeverity: SeverityLevel
  finalVerdict: KillVerdict
  summary: string
}
