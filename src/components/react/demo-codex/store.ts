// Replay state machine for the codex Demo experience.
// Owns: scenario selection, replay mode, current step, current phase,
// drawer open/closed state, playback speed, and the auto-advance timer.
import { create } from 'zustand';
import { scenarios } from '../../../data/demo-codex';
import type { ScenarioId, StepNumber } from '../../../data/demo-codex/types';

export type ReplayPhase =
  | 'idle'
  | 'retrieving'
  | 'bundling'
  | 'dispatching'
  | 'agent_working'
  | 'output_ready'
  | 'gating'
  | 'decided'
  | 'completed';

export type ReplayMode = 'stopped' | 'playing' | 'paused' | 'ended';

const PHASE_ORDER: Exclude<ReplayPhase, 'idle' | 'completed'>[] = [
  'retrieving',
  'bundling',
  'dispatching',
  'agent_working',
  'output_ready',
  'gating',
  'decided',
];

// Tuned for legibility, not realism. Replay pacing is a teaching tool.
const PHASE_DURATIONS_MS: Record<Exclude<ReplayPhase, 'idle' | 'completed'>, number> = {
  retrieving: 1300,
  bundling: 1000,
  dispatching: 800,
  agent_working: 700,
  output_ready: 600,
  gating: 1000,
  decided: 700,
};

export const PHASE_LABELS: Record<ReplayPhase, string> = {
  idle: 'Standby',
  retrieving: 'Retrieving evidence',
  bundling: 'Assembling bundle',
  dispatching: 'Dispatching to agent',
  agent_working: 'Agent reasoning',
  output_ready: 'Output received',
  gating: 'Validating output contract',
  decided: 'Gate decision recorded',
  completed: 'Run terminated',
};

export type Speed = 1 | 1.5 | 2;

interface DemoState {
  scenario: ScenarioId;
  mode: ReplayMode;
  currentStep: StepNumber;
  phase: ReplayPhase;
  speed: Speed;
  expandedSections: Set<string>;

  // actions
  selectScenario: (s: ScenarioId) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stepThrough: () => void;
  jumpToEnd: () => void;
  reset: () => void;
  selectStep: (n: StepNumber) => void;
  setSpeed: (s: Speed) => void;
  toggleSection: (id: string) => void;
  isExpanded: (id: string) => boolean;
  expandSection: (id: string) => void;
  collapseSection: (id: string) => void;
}

let activeTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

function lastExecutedStep(scenarioId: ScenarioId): StepNumber {
  const steps = scenarios[scenarioId].steps;
  const executed = steps.filter((s) => s.status !== 'NOT_RUN');
  return executed[executed.length - 1].stepNumber;
}

function nextPhase(phase: ReplayPhase): ReplayPhase | null {
  if (phase === 'idle') return 'retrieving';
  if (phase === 'completed') return null;
  const idx = PHASE_ORDER.indexOf(phase as Exclude<ReplayPhase, 'idle' | 'completed'>);
  if (idx === -1) return null;
  if (idx === PHASE_ORDER.length - 1) return null; // 'decided' has no next within step
  return PHASE_ORDER[idx + 1];
}

export const useDemoCodexStore = create<DemoState>((set, get) => {
  function schedule() {
    clearTimer();
    const { mode, phase, currentStep, scenario, speed } = get();
    if (mode !== 'playing') return;
    if (phase === 'idle' || phase === 'completed') return;

    const duration = PHASE_DURATIONS_MS[phase as Exclude<ReplayPhase, 'idle' | 'completed'>] / speed;
    activeTimer = setTimeout(() => {
      const next = nextPhase(phase);
      if (next) {
        set({ phase: next });
        schedule();
      } else {
        // Decided: try to advance to next step
        const lastStep = lastExecutedStep(scenario);
        const haltedHere =
          scenarios[scenario].steps.find((s) => s.stepNumber === currentStep)?.status === 'ESCALATED';
        if (haltedHere || currentStep >= lastStep) {
          set({ phase: 'completed', mode: 'ended' });
          clearTimer();
          return;
        }
        const newStep = (currentStep + 1) as StepNumber;
        set({ currentStep: newStep, phase: 'retrieving' });
        schedule();
      }
    }, duration);
  }

  return {
    scenario: 'escalated',
    mode: 'stopped',
    currentStep: 1,
    phase: 'idle',
    speed: 1,
    expandedSections: new Set(),

    selectScenario: (s) => {
      clearTimer();
      set({
        scenario: s,
        mode: 'stopped',
        currentStep: 1,
        phase: 'idle',
        expandedSections: new Set(),
      });
    },

    start: () => {
      clearTimer();
      set({ mode: 'playing', currentStep: 1, phase: 'retrieving' });
      schedule();
    },

    pause: () => {
      clearTimer();
      if (get().mode === 'playing') set({ mode: 'paused' });
    },

    resume: () => {
      const { mode, phase } = get();
      if (mode !== 'paused') return;
      set({ mode: 'playing' });
      // If we paused at decided or in-flight, resume scheduling
      if (phase === 'idle') {
        set({ phase: 'retrieving' });
      }
      schedule();
    },

    stepThrough: () => {
      // Pause if playing, then advance one phase
      clearTimer();
      const { phase, currentStep, scenario, mode } = get();
      if (mode === 'playing') set({ mode: 'paused' });
      if (phase === 'completed') return;
      if (phase === 'idle') {
        set({ phase: 'retrieving' });
        return;
      }
      const next = nextPhase(phase);
      if (next) {
        set({ phase: next });
        return;
      }
      // decided → advance step or finalize
      const lastStep = lastExecutedStep(scenario);
      const haltedHere =
        scenarios[scenario].steps.find((s) => s.stepNumber === currentStep)?.status === 'ESCALATED';
      if (haltedHere || currentStep >= lastStep) {
        set({ phase: 'completed', mode: 'ended' });
        return;
      }
      const newStep = (currentStep + 1) as StepNumber;
      set({ currentStep: newStep, phase: 'retrieving' });
    },

    jumpToEnd: () => {
      clearTimer();
      const { scenario } = get();
      const lastStep = lastExecutedStep(scenario);
      set({ mode: 'ended', currentStep: lastStep, phase: 'completed' });
    },

    reset: () => {
      clearTimer();
      set({
        mode: 'stopped',
        currentStep: 1,
        phase: 'idle',
        expandedSections: new Set(),
      });
    },

    selectStep: (n) => {
      clearTimer();
      const { scenario } = get();
      const target = scenarios[scenario].steps.find((s) => s.stepNumber === n);
      if (!target) return;
      // Allow inspecting NOT_RUN steps too — the panel shows a prevented banner
      // for them, and the supervisor rail surfaces the halt reason.
      set({ mode: 'paused', currentStep: n, phase: 'decided' });
    },

    setSpeed: (s) => {
      set({ speed: s });
      // If currently playing, reschedule with new speed
      if (get().mode === 'playing') {
        schedule();
      }
    },

    toggleSection: (id) => {
      const next = new Set(get().expandedSections);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      set({ expandedSections: next });
    },

    isExpanded: (id) => get().expandedSections.has(id),

    expandSection: (id) => {
      const next = new Set(get().expandedSections);
      next.add(id);
      set({ expandedSections: next });
    },

    collapseSection: (id) => {
      const next = new Set(get().expandedSections);
      next.delete(id);
      set({ expandedSections: next });
    },
  };
});

// Helper: phase index used to gate "completed" rendering of step substages
export function phaseIndex(phase: ReplayPhase): number {
  if (phase === 'idle') return -1;
  if (phase === 'completed') return PHASE_ORDER.length;
  return PHASE_ORDER.indexOf(phase as Exclude<ReplayPhase, 'idle' | 'completed'>);
}

export const PHASE_INDEX = {
  RETRIEVING: 0,
  BUNDLING: 1,
  DISPATCHING: 2,
  AGENT_WORKING: 3,
  OUTPUT_READY: 4,
  GATING: 5,
  DECIDED: 6,
} as const;
