import type { DemoScenario, ScenarioId } from './types';
import { cleanScenario } from './scenarios/clean';
import { escalatedScenario } from './scenarios/escalated';
import { blockedScenario } from './scenarios/blocked';
import { escalatedStep4Scenario } from './scenarios/escalatedStep4';

export const scenarios: Record<ScenarioId, DemoScenario> = {
  clean: cleanScenario,
  escalated: escalatedScenario,
  blocked: blockedScenario,
  escalated_step4: escalatedStep4Scenario,
};

export type { DemoScenario, ScenarioId };
export * from './types';
