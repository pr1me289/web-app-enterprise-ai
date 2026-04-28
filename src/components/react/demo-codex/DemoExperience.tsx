// The Demo page experience: scenario selector, replay controls, supervisor
// rail, execution strip, current-step panel, technical drawers, final outputs,
// takeaway. Single React island; all state lives in the codex Zustand store.
import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useDemoCodexStore, lastExecutedStep, PHASE_INDEX, phaseIndex } from './store';
import { scenarios } from '../../../data/demo-codex';
import ScenarioSelector from './ScenarioSelector';
import ReplayControls from './ReplayControls';
import RunSummaryChips from './RunSummaryChips';
import ExecutionStrip from './ExecutionStrip';
import CurrentStepPanel from './CurrentStepPanel';
import StepInspectionDrawers from './StepInspectionDrawers';
import FinalOutputsPanel from './FinalOutputsPanel';
import TakeawayPanel from './TakeawayPanel';
import { motion } from 'framer-motion';

// Focus frame styling — black border, faintly tinted translucent gray fill.
// Halo (warm-accent ambiance) is applied separately so it can move between the
// stages frame and the final-outputs frame depending on run progress.
// `min-w-0` prevents intrinsic-width children (long mono-font tokens, dashed
// SVGs, etc.) from pushing the frame past its parent's width.
const FRAME_BOX =
  'min-w-0 overflow-hidden rounded-3xl border-2 border-ink-900 bg-ink-900/[0.04] p-5 md:p-7 transition-shadow duration-700 ease-out';
const HALO_ACTIVE =
  'shadow-[0_0_180px_-10px_rgba(157,87,40,0.65),0_0_80px_-6px_rgba(157,87,40,0.5),0_0_28px_-4px_rgba(157,87,40,0.35)]';
const HALO_DIM = 'shadow-none';

export default function DemoExperience() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const stepThrough = useDemoCodexStore((s) => s.stepThrough);
  const stepBackward = useDemoCodexStore((s) => s.stepBackward);
  const reset = useDemoCodexStore((s) => s.reset);
  const start = useDemoCodexStore((s) => s.start);
  const pause = useDemoCodexStore((s) => s.pause);
  const resume = useDemoCodexStore((s) => s.resume);
  const mode = useDemoCodexStore((s) => s.mode);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const phase = useDemoCodexStore((s) => s.phase);

  // True once the run has reached the gating decision of the last executed
  // step (or otherwise completed). Used to move the warm-accent halo between
  // the stages frame and the final-outputs frame.
  const lastStep = lastExecutedStep(scenario);
  const runFinalized =
    phase === 'completed' ||
    mode === 'ended' ||
    (currentStep === lastStep && phaseIndex(phase) >= PHASE_INDEX.GATING);

  // Keyboard: space toggles play/pause, → steps through, R resets
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (mode === 'playing') pause();
        else if (mode === 'paused') resume();
        else start();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepThrough();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, pause, resume, start, stepThrough, stepBackward, reset]);

  const meta = scenarios[scenario];

  // Hide the sticky strip + controls once the Final Outputs section enters
  // the viewport. The user has reached the conclusion; the playback affordances
  // are no longer relevant. Show them again when scrolling back up.
  const finalOutputsSentinelRef = useRef<HTMLDivElement>(null);
  const [hideStickyStack, setHideStickyStack] = useState(false);
  useEffect(() => {
    const target = finalOutputsSentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHideStickyStack(entry.isIntersecting),
      { rootMargin: '0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Scroll the focus frame back into view when the replay advances to a new
  // step. Without this, the page collapses upward as the new step's stages
  // 2–4 hide their bodies, leaving the user's viewport stranded in the Final
  // Outputs section. Skip while the run is stopped (initial idle state) and
  // skip the very first render so we don't yank the page on load.
  const stepAnchorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (mode === 'stopped') return;
    stepAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // mode is intentionally omitted from deps — only run on currentStep change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Same auto-scroll, but for the "select-then-play" path: clicking a step
  // parks at phase 'decided' (all stages exposed); pressing Play rewinds the
  // same step to phase 'retrieving' (Stages 2–4 collapse), which would
  // otherwise leave the viewport stranded in the now-shrunken content.
  const prevPhaseRef = useRef(phase);
  const prevStepRef = useRef(currentStep);
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const prevStep = prevStepRef.current;
    prevPhaseRef.current = phase;
    prevStepRef.current = currentStep;

    if (mode === 'stopped') return;
    if (currentStep === prevStep && prevPhase === 'decided' && phase === 'retrieving') {
      stepAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [phase, currentStep, mode]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-12">
        {/* Scenario selector — sits above the scenario framing strip so the
            user picks which scenario before reading its description. */}
        <div className="flex flex-col items-center gap-2">
          <ScenarioSelector />
          <p className="text-center text-xs italic text-ink-400">
            Click between the two full-pipeline replays here
          </p>
        </div>

        {/* Scenario framing strip */}
        <motion.div
          key={meta.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6 rounded-2xl border border-ink-100 bg-paper-muted/40 p-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-7"
        >
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-accent">
                Scenario {meta.id === 'escalated' ? '1' : '2'} · {meta.outcome}
              </p>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 md:text-3xl">
                {meta.title}
              </h2>
              <p className="text-sm leading-relaxed text-ink-600">{meta.subtitle}</p>
              <RunSummaryChips />
            </div>
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-ink-100 bg-paper p-4">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
                  Summary
                </p>
                <p className="mt-1 font-serif text-sm leading-relaxed text-ink-700">
                  {meta.id === 'escalated'
                    ? 'Below is a replay of a scenario in which intake is complete, but authoritative evidence reveals unresolved legal blockers. The pipeline reaches STEP-03, the legal agent emits an escalated status, and halts rather than continuing through conflicting or incomplete conditions.'
                    : 'Below is a replay of a scenario in which intake is complete and the evidence is sufficient across all required steps. The pipeline moves cleanly through each stage, produces governed domain determinations, and completes with a final approval package instead of halting for escalation.'}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                  Keyboard
                </p>
                <p className="font-mono text-[0.62rem] text-ink-500">
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">Space</kbd>{' '}
                  play/pause ·{' '}
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">←</kbd>
                  /
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">→</kbd>{' '}
                  step ·{' '}
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">R</kbd>{' '}
                  reset
                </p>
              </div>
            </div>
        </motion.div>

        {/* Sticky stack — execution strip on top, replay controls as a
            separate full-width bar below. The supervisor rail no longer
            lives here; it sits in document flow above the focus frame.
            Fades out once the Final Outputs section enters the viewport. */}
        <div
          className={`sticky top-2 z-30 -mx-4 flex flex-col gap-2 px-4 transition-opacity duration-300 md:top-4 md:mx-0 md:px-0 ${
            hideStickyStack ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <div className="rounded-2xl border border-ink-100 bg-paper/95 p-3 shadow-soft backdrop-blur md:p-4">
            <ExecutionStrip />
          </div>
          <div className="rounded-2xl border border-ink-100 bg-paper/95 px-4 py-1.5 shadow-soft backdrop-blur">
            <ReplayControls />
          </div>
        </div>

        {/* Scroll anchor — used by the step-advance auto-scroll. Sits just
            above the focus frame so the new step's stages land directly
            below the sticky stack. scroll-mt-48 ≈ sticky stack height. */}
        <div ref={stepAnchorRef} aria-hidden className="scroll-mt-48" />

        {/* Stages frame — always present. Halo is bright while the run is
            in progress and dims once the pipeline reaches its final gate. */}
        <div className={`${FRAME_BOX} ${runFinalized ? HALO_DIM : HALO_ACTIVE}`}>
          <CurrentStepPanel />
        </div>
        <StepInspectionDrawers />

        {/* Final-outputs frame — always present. Halo lights up only once
            the pipeline has finalized; otherwise it sits with a quiet border. */}
        <div
          className={`${FRAME_BOX} ${runFinalized ? HALO_ACTIVE : HALO_DIM} mt-12 flex flex-col gap-12 md:mt-16`}
        >
          <div ref={finalOutputsSentinelRef} aria-hidden />
          <FinalOutputsPanel />
          <TakeawayPanel />
        </div>
      </div>
    </MotionConfig>
  );
}
