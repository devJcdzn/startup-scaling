import type { GameState } from "../types";
import type { GrowthAction, CampaignOutcome, CampaignResult } from "./campaigns";
import { calculateAcquisitionReadiness, getReadinessFactors } from "./readiness";

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCampaignOutcome(readiness: number): CampaignOutcome {
  const roll = Math.random();

  if (readiness >= 1) {
    if (roll < 0.65) return "success";
    if (roll < 0.9) return "neutral";
    if (roll < 0.98) return "failure";
    return "backfire";
  }

  if (readiness >= 0.6) {
    if (roll < 0.35) return "success";
    if (roll < 0.75) return "neutral";
    if (roll < 0.95) return "failure";
    return "backfire";
  }

  if (roll < 0.15) return "success";
  if (roll < 0.45) return "neutral";
  if (roll < 0.85) return "failure";
  return "backfire";
}

function getOutcomeMultiplier(outcome: CampaignOutcome): number {
  const multipliers: Record<CampaignOutcome, number> = {
    success: 1.2,
    neutral: 0.65,
    failure: 0.25,
    backfire: 0.1,
  };
  return multipliers[outcome];
}

export function runGrowthCampaign(
  state: GameState,
  action: GrowthAction
): CampaignResult {
  const readiness = calculateAcquisitionReadiness(state);
  const outcome = getCampaignOutcome(readiness);

  const baseTraffic = randomBetween(
    action.trafficPotential.min,
    action.trafficPotential.max
  );

  const outcomeMultiplier = getOutcomeMultiplier(outcome);
  const acquiredUsers = Math.floor(
    baseTraffic * readiness * outcomeMultiplier
  );

  const payingUsers = Math.floor(acquiredUsers * state.conversionRate);
  const cac = action.cost / Math.max(payingUsers, 1);

  const factors = getReadinessFactors(state);

  return {
    outcome,
    acquiredUsers,
    payingUsers,
    cac,
    readiness,
    factors,
  };
}
