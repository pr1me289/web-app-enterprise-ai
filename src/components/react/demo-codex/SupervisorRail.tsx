// Supervisor as a visible architectural actor. Surfaces what the supervisor
// is doing in this exact moment of the replay — retrieving evidence, dispatching
// to an agent, validating output contracts, recording escalation. Replaces the
// "vague label" that the build prompt explicitly forbids.
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Database,
  Package,
  Send,
  Brain,
  FileCheck,
  ShieldCheck,
  Gavel,
  CircleSlash,
} from 'lucide-react';
import { useDemoCodexStore, PHASE_LABELS, type ReplayPhase } from './store';
import { scenarios } from '../../../data/demo-codex';
import type { DemoStep } from '../../../data/demo-codex/types';

const phaseIcon: Record<ReplayPhase, typeof Compass> = {
  idle: Compass,
  retrieving: Database,
  bundling: Package,
  dispatching: Send,
  agent_working: Brain,
  output_ready: FileCheck,
  gating: ShieldCheck,
  decided: Gavel,
  completed: CircleSlash,
};

const phaseAccent: Record<ReplayPhase, string> = {
  idle: 'text-ink-500',
  retrieving: 'text-spruce-700',
  bundling: 'text-spruce-700',
  dispatching: 'text-accent',
  agent_working: 'text-accent',
  output_ready: 'text-spruce-700',
  gating: 'text-accent',
  decided: 'text-spruce-700',
  completed: 'text-ink-700',
};

// Index across the canonical 7 in-step phases.
const PHASE_PROGRESS_ORDER: ReplayPhase[] = [
  'retrieving',
  'bundling',
  'dispatching',
  'agent_working',
  'output_ready',
  'gating',
  'decided',
];

export default function SupervisorRail() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const phase = useDemoCodexStore((s) => s.phase);
  const mode = useDemoCodexStore((s) => s.mode);

  const step = scenarios[scenario].steps.find((s) => s.stepNumber === currentStep) as DemoStep;
  const Icon = phaseIcon[phase];
  const accent = phaseAccent[phase];
  const message = resolveMessage(phase, step, scenario);
  const phaseProgress = phase === 'idle' || phase === 'completed' ? -1 : PHASE_PROGRESS_ORDER.indexOf(phase);

  const supervisorActive = phase !== 'idle' && phase !== 'completed';

  return (
    <div className="flex w-full items-stretch gap-3 rounded-2xl border border-ink-100 bg-paper/90 p-3 shadow-soft backdrop-blur md:gap-4 md:p-4">
      {/* Supervisor badge */}
      <div className="relative flex shrink-0 items-center gap-3 rounded-xl border border-ink-100 bg-paper-muted/60 px-3 py-2 md:px-4">
        <div className="relative grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-paper">
          <Compass size={14} aria-hidden />
          {supervisorActive && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full ring-2 ring-accent"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>
        <div className="hidden flex-col md:flex">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            Supervisor
          </span>
          <span className="font-serif text-sm text-ink-900">
            {modeLabel(mode)}
          </span>
        </div>
      </div>

      {/* Action message */}
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-ink-100 bg-paper px-4 py-2">
        <Icon size={16} className={accent} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            {`${step.id} · ${PHASE_LABELS[phase]}`}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${step.id}-${phase}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="truncate font-serif text-sm text-ink-900 md:text-base"
            >
              {message}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Phase progress dots */}
      <div className="hidden shrink-0 items-center gap-1 rounded-xl border border-ink-100 bg-paper-muted/60 px-3 py-2 lg:flex">
        {PHASE_PROGRESS_ORDER.map((p, idx) => {
          const isActive = idx === phaseProgress;
          const isPast = idx < phaseProgress || phase === 'completed';
          return (
            <span
              key={p}
              title={PHASE_LABELS[p]}
              className={`h-2 w-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-accent shadow-[0_0_0_3px_rgba(157,87,40,0.18)]'
                  : isPast
                    ? 'bg-spruce-700'
                    : 'bg-ink-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function resolveMessage(
  phase: ReplayPhase,
  step: DemoStep,
  scenario: 'clean' | 'escalated'
): string {
  if (phase === 'idle') {
    return scenario === 'escalated'
      ? 'Ready to replay the escalated run. Press Start Replay.'
      : 'Ready to replay the clean run. Press Start Replay.';
  }
  if (phase === 'completed') {
    return scenario === 'escalated'
      ? 'Pipeline halted at STEP-03. Escalation routed to General Counsel.'
      : 'Run terminated COMPLETE. Stakeholder package emitted.';
  }
  // Inspecting a step that never ran in this scenario.
  if (step.status === 'NOT_RUN') {
    return `${step.id} did not run — supervisor halted upstream.`;
  }
  const moments = step.replayMoments;
  if (moments && moments[phase]) return moments[phase] as string;
  // Sensible defaults if a step doesn't override
  return `${PHASE_LABELS[phase]} for ${step.shortLabel}.`;
}

function modeLabel(mode: 'stopped' | 'playing' | 'paused' | 'ended'): string {
  if (mode === 'playing') return 'Driving the pipeline';
  if (mode === 'paused') return 'Paused';
  if (mode === 'ended') return 'Run complete';
  return 'Awaiting start';
}
