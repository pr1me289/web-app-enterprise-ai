// Per-scenario summary chips. Tone-coded to surface outcome at a glance.
import { motion } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import type { SummaryChip } from '../../../data/demo-codex/types';

const toneCls: Record<NonNullable<SummaryChip['tone']>, string> = {
  neutral: 'border-ink-100 bg-paper text-ink-700',
  positive: 'border-spruce-700/30 bg-spruce-50 text-spruce-700',
  warning: 'border-accent/40 bg-accent-soft/60 text-accent',
  danger: 'border-rose-700/30 bg-rose-50 text-rose-700',
};

export default function RunSummaryChips() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const chips = scenarios[scenario].summaryChips;

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <motion.li
          key={`${chip.label}-${i}`}
          layout
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.22 }}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${toneCls[chip.tone ?? 'neutral']}`}
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] opacity-70">
            {chip.label}
          </span>
          <span className="font-serif text-sm">{chip.value}</span>
        </motion.li>
      ))}
    </ul>
  );
}
