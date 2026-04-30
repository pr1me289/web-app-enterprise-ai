// Scenario picker — sliding pill toggle between the four scenario fixtures.
// Each pill has three lines: scenario title, terminal status emission, and a
// short subtitle (where the run halted, or how many steps completed cleanly).
// Switching resets the replay machine and clears expanded drawers.
import { motion } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import type { DemoScenario, ScenarioId } from '../../../data/demo-codex/types';

const ORDER: ScenarioId[] = ['escalated', 'clean', 'blocked', 'escalated_step4'];

const PILL_SUBTITLE: Record<ScenarioId, string> = {
  escalated: 'Halts at STEP-03',
  clean: 'Six complete steps',
  blocked: 'Halts at STEP-04',
  escalated_step4: 'Halts at STEP-04',
};

const STATUS_COLOR: Record<DemoScenario['outcome'], string> = {
  COMPLETE: 'text-spruce-700',
  ESCALATED: 'text-accent',
  BLOCKED: 'text-rose-700',
};

// Trim the trailing " · STATUS" the scenario titles carry so the title head
// can sit on its own line in the pill.
function titleHead(title: string): string {
  return title.split(' · ')[0];
}

export default function ScenarioSelector() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const select = useDemoCodexStore((s) => s.selectScenario);

  return (
    <div
      role="radiogroup"
      aria-label="Pipeline replay scenario"
      className="relative inline-flex w-full max-w-4xl items-stretch rounded-2xl border border-ink-100 bg-paper-muted/70 p-1.5 shadow-soft backdrop-blur"
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
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 transition-colors"
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
              className={`whitespace-nowrap font-serif text-base ${isActive ? 'text-ink-900' : 'text-ink-600'}`}
            >
              {titleHead(meta.title)}
            </span>
            <span
              className={`font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] ${STATUS_COLOR[meta.outcome]}`}
            >
              {meta.outcome}
            </span>
            <span
              className={`font-mono text-[0.6rem] uppercase tracking-[0.1em] ${
                isActive ? 'text-ink-600' : 'text-ink-400'
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
