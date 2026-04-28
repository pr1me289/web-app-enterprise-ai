// Scenario picker — sliding pill toggle between the two scenario fixtures.
// Switching resets the replay machine and clears expanded drawers.
import { motion } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import type { ScenarioId } from '../../../data/demo-codex/types';

const ORDER: ScenarioId[] = ['escalated', 'clean', 'blocked', 'escalated_step4'];

const PILL_SUBTITLE: Record<ScenarioId, string> = {
  escalated: 'Halts at STEP-03 · ESCALATED',
  clean: 'Six steps · COMPLETE',
  blocked: 'Halts at STEP-04 · BLOCKED',
  escalated_step4: 'Halts at STEP-04 · ESCALATED',
};

export default function ScenarioSelector() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const select = useDemoCodexStore((s) => s.selectScenario);

  return (
    <div
      role="radiogroup"
      aria-label="Pipeline replay scenario"
      className="relative inline-flex w-full max-w-xl items-stretch rounded-2xl border border-ink-100 bg-paper-muted/70 p-1.5 shadow-soft backdrop-blur"
    >
      {ORDER.map((id) => {
        const isActive = scenario === id;
        const meta = scenarios[id];
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => select(id)}
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2.5 transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="codex-scenario-pill"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-xl bg-paper shadow-soft ring-1 ring-ink-100"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span
              className={`font-serif text-base ${isActive ? 'text-ink-900' : 'text-ink-600'}`}
            >
              {meta.title}
            </span>
            <span
              className={`font-mono text-[0.6rem] uppercase tracking-[0.1em] ${
                isActive ? 'text-accent' : 'text-ink-400'
              }`}
            >
              {PILL_SUBTITLE[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
