// Per-scenario takeaway panel. Concise. Frames the architectural argument
// the audience should leave with.
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';

export default function TakeawayPanel() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const t = scenarios[scenario].takeaway;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.32 }}
      className="relative overflow-hidden rounded-2xl border border-ink-100 bg-paper p-6 shadow-soft md:p-8"
    >
      <div
        aria-hidden
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-soft/60 blur-3xl"
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent" aria-hidden />
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
            What this scenario demonstrates
          </p>
        </div>
        <h3 className="display-balance max-w-3xl font-serif text-2xl font-semibold text-ink-900 md:text-3xl">
          {t.headline}
        </h3>
        <p className="max-w-3xl text-base leading-relaxed text-ink-700">{t.body}</p>

        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {t.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-xl border border-ink-100 bg-paper-muted/40 p-3"
            >
              <span className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-ink-700">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
