import type { EntityType, KillInput, RuleResult, KillEngineResult, SeverityLevel, KillVerdict } from './types'

export interface Rule {
  name: string
  entityType: EntityType | 'ALL'
  evaluate(input: KillInput): RuleResult
}

export class RuleEngine {
  private rules: Rule[] = []

  register(rule: Rule): void {
    this.rules.push(rule)
  }

  evaluate(input: KillInput): KillEngineResult {
    const applicableRules = this.rules.filter(
      (r) => r.entityType === 'ALL' || r.entityType === input.entityType
    )
    const results = applicableRules.map((r) => r.evaluate(input))
    const triggered = results.filter((r) => r.triggered)

    const severityOrder: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    const highestSeverity = triggered.reduce((highest, r) => {
      return severityOrder.indexOf(r.severity) > severityOrder.indexOf(highest)
        ? r.severity
        : highest
    }, 'LOW' as SeverityLevel)

    const shouldKill = triggered.some((r) => r.verdict === 'KILL')
    const finalVerdict: KillVerdict = shouldKill
      ? 'KILL'
      : triggered.length > 0
        ? 'OBSERVE'
        : 'MONITOR'

    const summary = shouldKill
      ? `${triggered.length} kill rule(s) triggered. Immediate action required.`
      : triggered.length > 0
        ? `${triggered.length} warning rule(s) triggered. Monitor closely.`
        : 'No kill rules triggered. Entity is within acceptable parameters.'

    return { shouldKill, triggeredRules: triggered, highestSeverity, finalVerdict, summary }
  }
}
