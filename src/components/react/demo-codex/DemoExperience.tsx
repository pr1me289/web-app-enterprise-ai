// The Demo page experience: scenario selector, replay controls, supervisor
// rail, execution strip, current-step panel, technical drawers, final outputs,
// takeaway. Single React island; all state lives in the codex Zustand store.
import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import ScenarioSelector from './ScenarioSelector';
import ReplayControls from './ReplayControls';
import RunSummaryChips from './RunSummaryChips';
import SupervisorRail from './SupervisorRail';
import ExecutionStrip from './ExecutionStrip';
import CurrentStepPanel from './CurrentStepPanel';
import FinalOutputsPanel from './FinalOutputsPanel';
import TakeawayPanel from './TakeawayPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoExperience() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const stepThrough = useDemoCodexStore((s) => s.stepThrough);
  const reset = useDemoCodexStore((s) => s.reset);
  const start = useDemoCodexStore((s) => s.start);
  const pause = useDemoCodexStore((s) => s.pause);
  const resume = useDemoCodexStore((s) => s.resume);
  const mode = useDemoCodexStore((s) => s.mode);

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
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, pause, resume, start, stepThrough, reset]);

  const meta = scenarios[scenario];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-12">
        {/* Scenario framing strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={meta.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 rounded-2xl border border-ink-100 bg-paper-muted/40 p-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-7"
          >
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-accent">Scenario · {meta.outcome}</p>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 md:text-3xl">
                {meta.title}
              </h2>
              <p className="text-sm leading-relaxed text-ink-600">{meta.subtitle}</p>
              <RunSummaryChips />
            </div>
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-ink-100 bg-paper p-4">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
                  Final artifact
                </p>
                <p className="mt-1 font-serif text-base text-ink-900">{meta.finalOutputs.artifactName}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                  Keyboard
                </p>
                <p className="font-mono text-[0.62rem] text-ink-500">
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">Space</kbd>{' '}
                  play/pause ·{' '}
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">→</kbd>{' '}
                  step ·{' '}
                  <kbd className="rounded border border-ink-200 bg-paper-muted/60 px-1 py-0.5">R</kbd>{' '}
                  reset
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scenario selector + replay controls */}
        <div className="flex flex-col gap-4">
          <ScenarioSelector />
          <div className="rounded-2xl border border-ink-100 bg-paper p-3 shadow-soft md:p-4">
            <ReplayControls />
          </div>
        </div>

        {/* Sticky supervisor rail */}
        <div className="sticky top-2 z-30 -mx-4 px-4 md:top-4 md:mx-0 md:px-0">
          <SupervisorRail />
        </div>

        {/* Execution strip */}
        <ExecutionStrip />

        {/* Current step panel — full-width detail with stages */}
        <CurrentStepPanel />

        {/* Final outputs */}
        <FinalOutputsPanel />

        {/* Per-scenario takeaway */}
        <TakeawayPanel />
      </div>
    </MotionConfig>
  );
}
