import type { Rule } from './rule-engine'
import type { KillInput, RuleResult } from './types'
import { RuleEngine } from './rule-engine'

const noImpressionsRule: Rule = {
  name: 'No Impressions Rule',
  entityType: 'ALL',
  evaluate(input: KillInput): RuleResult {
    const triggered = input.spend > 5 && input.impressions === 0
    return {
      triggered,
      ruleName: this.name,
      reason: triggered
        ? `Spent €${input.spend.toFixed(2)} with zero impressions — delivery issue detected.`
        : 'Impressions are being delivered normally.',
      severity: 'HIGH',
      verdict: 'KILL',
      recommendation: 'Kill this entity. Check audience targeting, budget settings, or ad policy compliance.',
    }
  },
}

const highSpendNoConversionRule: Rule = {
  name: 'High Spend No Conversion Rule',
  entityType: 'ALL',
  evaluate(input: KillInput): RuleResult {
    const threshold = input.breakEvenCpa * 2
    const triggered = input.spend >= threshold && input.purchases === 0
    return {
      triggered,
      ruleName: this.name,
      reason: triggered
        ? `Spent €${input.spend.toFixed(2)} (2x break-even of €${input.breakEvenCpa.toFixed(2)}) with zero purchases.`
        : 'Spend-to-conversion ratio is acceptable.',
      severity: 'CRITICAL',
      verdict: 'KILL',
      recommendation: 'Kill immediately. Budget has exceeded 2x break-even CPA with no returns. Reallocate to better performers.',
    }
  },
}

const lowCtrRule: Rule = {
  name: 'Low CTR Rule',
  entityType: 'CREATIVE',
  evaluate(input: KillInput): RuleResult {
    const ctr = input.impressions > 0 ? (input.clicks / input.impressions) * 100 : 0
    const triggered = input.impressions >= 2000 && ctr < 0.5
    return {
      triggered,
      ruleName: this.name,
      reason: triggered
        ? `CTR is ${ctr.toFixed(2)}% after ${input.impressions.toLocaleString()} impressions — well below 0.5% threshold.`
        : `CTR of ${ctr.toFixed(2)}% is acceptable.`,
      severity: 'HIGH',
      verdict: 'KILL',
      recommendation: 'Kill this creative. The hook or visual is not resonating. Test new angles and hooks.',
    }
  },
}

const cpaBelowBreakEvenRule: Rule = {
  name: 'CPA Above Break-Even Rule',
  entityType: 'ADSET',
  evaluate(input: KillInput): RuleResult {
    const cpa = input.purchases > 0 ? input.spend / input.purchases : 0
    const triggered = input.purchases > 0 && cpa > input.breakEvenCpa * 1.5
    return {
      triggered,
      ruleName: this.name,
      reason: triggered
        ? `CPA of €${cpa.toFixed(2)} is 50%+ above break-even of €${input.breakEvenCpa.toFixed(2)}.`
        : 'CPA is within acceptable range of break-even.',
      severity: 'MEDIUM',
      verdict: 'OBSERVE',
      recommendation: 'Pause spend increases. Review targeting, creative fatigue, and bid strategy. Kill if CPA does not improve within 48 hours.',
    }
  },
}

const lowAtcRateRule: Rule = {
  name: 'Low ATC Rate Rule',
  entityType: 'ADSET',
  evaluate(input: KillInput): RuleResult {
    const atcRate = input.clicks > 0 ? (input.atc / input.clicks) * 100 : 0
    const triggered = input.clicks >= 100 && atcRate < 1
    return {
      triggered,
      ruleName: this.name,
      reason: triggered
        ? `Add-to-cart rate is ${atcRate.toFixed(2)}% after ${input.clicks} clicks — traffic is not converting on the product page.`
        : `ATC rate of ${atcRate.toFixed(2)}% is acceptable.`,
      severity: 'MEDIUM',
      verdict: 'OBSERVE',
      recommendation: 'Investigate product page performance. Improve product images, copy, pricing, and social proof. The audience is clicking but not engaging with the offer.',
    }
  },
}

export function createDefaultRuleEngine(): RuleEngine {
  const engine = new RuleEngine()
  engine.register(noImpressionsRule)
  engine.register(highSpendNoConversionRule)
  engine.register(lowCtrRule)
  engine.register(cpaBelowBreakEvenRule)
  engine.register(lowAtcRateRule)
  return engine
}
