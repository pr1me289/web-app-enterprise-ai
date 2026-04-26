import type { DemoScenario, ScenarioId } from './types';
import { cleanScenario } from './scenarios/clean';
import { escalatedScenario } from './scenarios/escalated';

export const scenarios: Record<ScenarioId, DemoScenario> = {
  clean: cleanScenario,
  escalated: escalatedScenario,
};

export type { DemoScenario, ScenarioId };
export * from './types';
