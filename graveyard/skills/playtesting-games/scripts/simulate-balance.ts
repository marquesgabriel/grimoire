// Estimates real-play pacing to reach each depth layer and the first
// prestige, by simulating a greedy "always buy whatever gives the best
// $/sec per $ spent" player against the game's *actual* cost/production
// formulas (imported straight from src/, not re-derived here).
//
// This is a rough pacing signal, not an exact model: it assumes a
// constant click rate, no offline progress (the game doesn't have any),
// and a player who never deliberately saves up instead of buying the
// best available upgrade. Real players are streakier. Treat the output
// as "is the curve in the right ballpark for RNF03 (~1 week)", not a
// guarantee.
//
// Usage: npx tsx .claude/skills/playtesting-games/scripts/simulate-balance.ts [clicksPerSecond]

import Decimal from "break_eternity.js";
import { AUTOMATIONS } from "../../../../src/features/automation/catalog";
import {
  DEPTH_LEVELS,
  getRequiredUpgradeLevelForLayer,
  getTotalUpgradeLevel,
} from "../../../../src/features/depth/catalog";
import { CLICK_VALUE } from "../../../../src/features/mining/MineButton";
import { UPGRADES } from "../../../../src/features/upgrades/catalog";

const clicksPerSecond = Number(process.argv[2] ?? 2);

interface SimState {
  money: Decimal;
  upgradeLevels: Record<string, number>;
  automationCounts: Record<string, number>;
  depthIndex: number;
}

function manualMultiplier(state: SimState): Decimal {
  return UPGRADES.filter((u) => u.effectType === "manual").reduce(
    (total, u) => total.plus(u.bonusPerLevel.mul(state.upgradeLevels[u.id] ?? 0)),
    new Decimal(1),
  );
}

function passiveMultiplier(state: SimState): Decimal {
  return UPGRADES.filter((u) => u.effectType === "passive").reduce(
    (total, u) => total.plus(u.bonusPerLevel.mul(state.upgradeLevels[u.id] ?? 0)),
    new Decimal(1),
  );
}

function automationBaseRate(state: SimState): Decimal {
  return AUTOMATIONS.reduce(
    (total, a) =>
      total.plus(a.baseProductionPerSecond.mul(state.automationCounts[a.id] ?? 0)),
    new Decimal(0),
  );
}

function effectiveRatePerSecond(state: SimState): Decimal {
  const manualRate = new Decimal(CLICK_VALUE)
    .mul(manualMultiplier(state))
    .mul(clicksPerSecond);
  const passiveRate = automationBaseRate(state).mul(passiveMultiplier(state));
  return manualRate.plus(passiveRate);
}

interface Candidate {
  kind: "upgrade" | "automation";
  id: string;
  cost: Decimal;
  marginalValuePerSecond: Decimal;
}

function bestCandidate(state: SimState): Candidate {
  const passiveBase = automationBaseRate(state);
  const candidates: Candidate[] = [];

  for (const u of UPGRADES) {
    const level = state.upgradeLevels[u.id] ?? 0;
    const cost = u.baseCost.mul(u.costMultiplier.pow(level));
    const marginalValuePerSecond =
      u.effectType === "manual"
        ? u.bonusPerLevel.mul(CLICK_VALUE).mul(clicksPerSecond)
        : u.bonusPerLevel.mul(passiveBase);
    candidates.push({ kind: "upgrade", id: u.id, cost, marginalValuePerSecond });
  }

  const currentPassiveMultiplier = passiveMultiplier(state);
  for (const a of AUTOMATIONS) {
    const owned = state.automationCounts[a.id] ?? 0;
    const cost = a.baseCost.mul(a.costMultiplier.pow(owned));
    const marginalValuePerSecond = a.baseProductionPerSecond.mul(
      currentPassiveMultiplier,
    );
    candidates.push({ kind: "automation", id: a.id, cost, marginalValuePerSecond });
  }

  return candidates.reduce((best, c) =>
    c.marginalValuePerSecond.div(c.cost).gt(best.marginalValuePerSecond.div(best.cost))
      ? c
      : best,
  );
}

function formatSeconds(totalSeconds: number): string {
  const days = totalSeconds / 86400;
  if (days >= 1) return `${days.toFixed(1)} days`;
  const hours = totalSeconds / 3600;
  if (hours >= 1) return `${hours.toFixed(1)} hours`;
  return `${(totalSeconds / 60).toFixed(1)} minutes`;
}

function main() {
  const state: SimState = {
    money: new Decimal(0),
    upgradeLevels: {},
    automationCounts: {},
    depthIndex: 0,
  };

  let elapsedSeconds = 0;
  const layerTimes: { index: number; layerId: string; seconds: number }[] = [];
  const MAX_SECONDS = 60 * 60 * 24 * 365; // 1 simulated year safety cap
  const MAX_EVENTS = 2_000_000;

  for (let events = 0; events < MAX_EVENTS; events++) {
    // Advance depth for free whenever eligible — it costs no money, so a
    // rational player always takes it the instant they qualify.
    let advanced = true;
    while (advanced) {
      advanced = false;
      const current = DEPTH_LEVELS[state.depthIndex];
      const next = DEPTH_LEVELS[state.depthIndex + 1];
      if (!next) break;

      const equipmentOk =
        getTotalUpgradeLevel(state.upgradeLevels) >=
        getRequiredUpgradeLevelForLayer(next.layerId);

      if (state.money.gte(current.moneyRequirement) && equipmentOk) {
        state.depthIndex += 1;
        layerTimes.push({
          index: state.depthIndex,
          layerId: DEPTH_LEVELS[state.depthIndex].layerId,
          seconds: elapsedSeconds,
        });
        advanced = true;
      }
    }

    if (state.depthIndex === DEPTH_LEVELS.length - 1) {
      break; // reached the core: eligible to prestige
    }

    const current = DEPTH_LEVELS[state.depthIndex];
    const next = DEPTH_LEVELS[state.depthIndex + 1];
    const equipmentOk =
      getTotalUpgradeLevel(state.upgradeLevels) >=
      getRequiredUpgradeLevelForLayer(next.layerId);

    const purchase = bestCandidate(state);
    const rate = effectiveRatePerSecond(state);

    // The next "event" is whichever comes first: affording the best
    // purchase, or (if equipment already allows it) affording the depth
    // gate's money requirement.
    let targetMoney = purchase.cost;
    let isDepthEvent = false;
    if (equipmentOk && current.moneyRequirement.lt(targetMoney)) {
      targetMoney = current.moneyRequirement;
      isDepthEvent = true;
    }

    const secondsNeeded = Decimal.max(
      0,
      targetMoney.minus(state.money).div(rate),
    ).toNumber();

    elapsedSeconds += secondsNeeded;
    state.money = state.money.plus(rate.mul(secondsNeeded));

    if (elapsedSeconds > MAX_SECONDS) {
      console.log("Simulation exceeded 1 simulated year without reaching the core — stopping.");
      break;
    }

    if (!isDepthEvent) {
      state.money = state.money.minus(purchase.cost);
      if (purchase.kind === "upgrade") {
        state.upgradeLevels[purchase.id] = (state.upgradeLevels[purchase.id] ?? 0) + 1;
      } else {
        state.automationCounts[purchase.id] =
          (state.automationCounts[purchase.id] ?? 0) + 1;
      }
    }
  }

  console.log(`Model: greedy $/sec-per-$-spent player, ${clicksPerSecond} clicks/sec sustained, no offline progress.\n`);
  console.log("Depth layer transitions:");
  for (const t of layerTimes) {
    console.log(`  level ${t.index + 1}/${DEPTH_LEVELS.length} (${t.layerId}): ${formatSeconds(t.seconds)} of active play`);
  }

  console.log(`\nReached the core (eligible for 1st prestige) after ${formatSeconds(elapsedSeconds)} of active play.`);
  console.log("\nTranslated to calendar time at a few session lengths:");
  for (const minutesPerDay of [15, 30, 60]) {
    const days = elapsedSeconds / (minutesPerDay * 60);
    console.log(`  ${minutesPerDay} min/day of active play -> ~${days.toFixed(1)} days`);
  }
  console.log("\nRNF03 target: first prestige after ~1 week of gameplay.");
}

main();
