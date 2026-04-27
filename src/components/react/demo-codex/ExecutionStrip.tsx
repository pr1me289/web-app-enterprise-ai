// Horizontal step strip showing the canonical six-step pipeline.
// Each step card animates its computed status based on replay phase:
//   - past steps: their terminal recorded status
//   - current step (mid-replay): IN_PROGRESS with active ring
//   - current step (at 'decided'): terminal recorded status
//   - downstream not-yet-reached: PENDING (or NOT_RUN if scenario halted upstream)
import { motion, AnimatePresence } from 'framer-motion';
import StatusPill from './StatusPill';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import type { DemoStep, StepNumber, StepStatus } from '../../../data/demo-codex/types';

export default function ExecutionStrip() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const phase = useDemoCodexStore((s) => s.phase);
  const mode = useDemoCodexStore((s) => s.mode);
  const selectStep = useDemoCodexStore((s) => s.selectStep);

  const steps = scenarios[scenario].steps;

  // Detect whether the run halted at any step
  const haltStep = steps.find((s) => s.status === 'ESCALATED');

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-500">
          Execution strip
        </p>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-400">
          {scenarios[scenario].steps.length} steps · {scenario === 'escalated' ? 'halts at STEP-03' : 'runs end-to-end'}
        </p>
      </div>

      <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
        {steps.map((step, idx) => {
          const computedStatus = computeStatus({
            step,
            currentStep,
            phase,
            mode,
            haltAtNumber: haltStep?.stepNumber,
          });
          const isFocused = step.stepNumber === currentStep;
          const next = steps[idx + 1];
          const handoffActive =
            isFocused && phase === 'decided' && computedStatus === 'COMPLETE' && !!next && !next.notRunReason;
          const connectorDimmed =
            !!next?.notRunReason ||
            computedStatus === 'ESCALATED' ||
            computedStatus === 'BLOCKED';

          return (
            <li key={step.id} className="flex items-stretch md:flex-1">
              <ExecutionStepCard
                step={step}
                status={computedStatus}
                focused={isFocused}
                onClick={() => selectStep(step.stepNumber)}
              />
              {idx < steps.length - 1 && (
                <Connector
                  active={handoffActive}
                  dimmed={connectorDimmed}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ExecutionStepCard({
  step,
  status,
  focused,
  onClick,
}: {
  step: DemoStep;
  status: StepStatus;
  focused: boolean;
  onClick: () => void;
}) {
  const ringStyle =
    status === 'NOT_RUN'
      ? 'border-dashed border-ink-200 bg-paper-muted/30 opacity-60'
      : focused
        ? 'border-accent bg-paper'
        : status === 'COMPLETE'
          ? 'border-spruce-700/30 bg-paper'
          : status === 'ESCALATED' || status === 'BLOCKED'
            ? 'border-accent/40 bg-paper'
            : 'border-ink-100 bg-paper';

  const labelTone = status === 'NOT_RUN' ? 'text-ink-400' : 'text-ink-900';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={focused ? 'step' : undefined}
      aria-label={`${step.id} — ${step.shortLabel} · ${status}`}
      className={`group relative flex w-full flex-col gap-2 rounded-2xl border px-3 py-3 text-left transition-all md:min-w-[10rem] md:py-3.5 ${ringStyle} hover:-translate-y-0.5 hover:shadow-soft`}
    >
      {focused && (
        <motion.span
          layoutId="step-focus-ring"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-2xl ring-2 ring-accent shadow-[0_0_0_6px_rgba(157,87,40,0.10)]"
          transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
        />
      )}

      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-400">
          {step.id}
        </span>
        <StatusPill status={status} size="sm" withLabel={false} pulse={status === 'IN_PROGRESS'} />
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <span className={`font-serif text-sm font-semibold ${labelTone}`}>
          {step.shortLabel}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-400">
          {step.actor}
        </span>
      </div>

      <AnimatePresence>
        {focused && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            aria-hidden
            className="absolute -bottom-2 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-ink-900 md:block"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

function Connector({ active, dimmed }: { active: boolean; dimmed: boolean }) {
  // Vertical on mobile, horizontal on md+
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center self-center md:w-6 md:py-0 lg:w-8"
    >
      <svg viewBox="0 0 32 12" className="hidden h-3 w-full md:block" preserveAspectRatio="none">
        <line
          x1="0"
          y1="6"
          x2="26"
          y2="6"
          stroke={dimmed ? 'rgba(214,221,225,1)' : 'rgba(157,87,40,0.7)'}
          strokeWidth="1.5"
          strokeDasharray={dimmed ? '3 3' : 'none'}
        />
        <path
          d="M 26 6 L 21 2.5 L 21 9.5 Z"
          fill={dimmed ? 'rgba(214,221,225,1)' : 'rgba(157,87,40,0.7)'}
        />
        {active && (
          <motion.circle
            r="2"
            fill="rgba(157,87,40,1)"
            initial={{ cx: 0, opacity: 0 }}
            animate={{ cx: 26, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )}
      </svg>
      {/* Mobile vertical connector */}
      <span
        className={`block h-4 w-px md:hidden ${dimmed ? 'bg-ink-200' : 'bg-accent/60'}`}
      />
    </div>
  );
}

function computeStatus({
  step,
  currentStep,
  phase,
  mode,
  haltAtNumber,
}: {
  step: DemoStep;
  currentStep: StepNumber;
  phase: ReturnType<typeof useDemoCodexStore.getState>['phase'];
  mode: ReturnType<typeof useDemoCodexStore.getState>['mode'];
  haltAtNumber?: StepNumber;
}): StepStatus {
  // Steps that didn't run in the recorded scenario are NOT_RUN regardless of replay state.
  if (step.status === 'NOT_RUN') return 'NOT_RUN';

  // Idle / stopped: everything pending until replay starts.
  if (mode === 'stopped' && phase === 'idle') return 'PENDING';

  // After replay ended, all executed steps show their recorded status.
  if (mode === 'ended' || phase === 'completed') return step.status;

  // Step is in the past relative to cursor → recorded status.
  if (step.stepNumber < currentStep) return step.status;

  // Step is in the future relative to cursor → pending (or NOT_RUN if upstream halted).
  if (step.stepNumber > currentStep) {
    if (haltAtNumber && step.stepNumber > haltAtNumber) return 'NOT_RUN';
    return 'PENDING';
  }

  // Step IS the cursor.
  // At 'decided' the step has just received its recorded status.
  if (phase === 'decided') return step.status;
  // Mid-replay phases → in-progress.
  return 'IN_PROGRESS';
}
