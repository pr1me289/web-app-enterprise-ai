// The business-facing payoff for each scenario. Renders differently for clean
// vs escalated runs to emphasise that escalation is a correct governed outcome.
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Gavel,
  ArrowRight,
  ClipboardList,
  Send,
} from 'lucide-react';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import StatusPill from './StatusPill';
import type { FinalChecklistItem } from '../../../data/demo-codex/types';

const checklistMeta: Record<
  FinalChecklistItem['status'],
  { icon: typeof CheckCircle2; cls: string; label: string }
> = {
  resolved: {
    icon: CheckCircle2,
    cls: 'border-spruce-700/30 bg-spruce-50/70 text-spruce-700',
    label: 'Resolved',
  },
  provisional: {
    icon: Wrench,
    cls: 'border-spruce-700/20 bg-spruce-50/40 text-spruce-700',
    label: 'Provisional',
  },
  blocker: {
    icon: AlertTriangle,
    cls: 'border-accent/40 bg-accent-soft/60 text-accent',
    label: 'Blocker',
  },
};

export default function FinalOutputsPanel() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const final = scenarios[scenario].finalOutputs;
  const isEscalated = final.status === 'ESCALATED';

  return (
    <div className="grid gap-5">
      <header className="flex flex-col gap-2">
        <p className="eyebrow text-accent">Final outputs · stakeholder-ready</p>
        <h3 className="display-balance max-w-3xl font-serif text-2xl font-semibold text-ink-900 md:text-3xl">
          {isEscalated ? 'What the escalation package contains' : 'What the approval checklist contains'}
        </h3>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-600">
          {isEscalated
            ? 'When the supervisor halts at STEP-03, this is the artifact that lands on the right desks. Determined items remain visible alongside named blockers and owners.'
            : 'When all six steps complete, this is the artifact that lands in stakeholder inboxes. Every line is cited and routed to a named owner.'}
        </p>
      </header>

      {/* Summary card */}
      <div className="grid gap-4 rounded-2xl border border-ink-100 bg-paper p-5 shadow-soft md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <StatusPill status={isEscalated ? 'ESCALATED' : 'COMPLETE'} />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-500">
              {final.artifactName}
            </span>
          </div>
          {!isEscalated ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryStat label="Approval path" value={final.approvalPath ?? '—'} />
              <SummaryStat label="Fast-track" value={final.fastTrack ?? '—'} tone="positive" />
              <SummaryStat label="Blockers" value={String(final.blockers.length)} tone="positive" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryStat label="Halted at" value={final.haltedAt ?? '—'} tone="warning" />
              <SummaryStat label="Fast-track" value={final.fastTrack ?? '—'} tone="warning" />
              <SummaryStat label="Blockers" value={String(final.blockers.length)} tone="danger" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper-muted/40 p-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            Final artifact emitted by
          </p>
          <p className="font-serif text-base text-ink-900">
            {isEscalated ? 'Supervisor (escalation package)' : 'Checkoff agent'}
          </p>
          <p className="text-[0.7rem] text-ink-500">
            {isEscalated
              ? 'Routes to the named legal owners listed below.'
              : 'Routes to the named domain owners listed below.'}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <section className="rounded-2xl border border-ink-100 bg-paper p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-accent" aria-hidden />
          <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-700">
            Checklist · {final.checklist.length} item{final.checklist.length === 1 ? '' : 's'}
          </h4>
        </div>
        <ul className="mt-3 grid gap-2">
          {final.checklist.map((item, i) => {
            const meta = checklistMeta[item.status];
            const Icon = meta.icon;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.04, duration: 0.24 }}
                className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${meta.cls}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Icon size={14} className="mt-0.5 shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-ink-900">{item.title}</p>
                    {item.detail && (
                      <p className="mt-0.5 text-[0.72rem] leading-relaxed text-ink-600">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                    Owner
                  </p>
                  <p className="font-mono text-[0.7rem] text-ink-700">{item.owner}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Blockers — only if any */}
      {final.blockers.length > 0 && (
        <section className="rounded-2xl border border-accent/30 bg-accent-soft/30 p-5">
          <div className="flex items-center gap-2">
            <Gavel size={14} className="text-accent" aria-hidden />
            <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
              Open blockers · human-owned action required
            </h4>
          </div>
          <ul className="mt-3 grid gap-2">
            {final.blockers.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-accent/40 bg-paper p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-paper">
                    {b.id}
                  </span>
                  <p className="font-serif text-base text-ink-900">{b.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{b.requiredAction}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem]">
                  <span className="font-mono text-ink-500">
                    <span className="text-ink-700">Owner: </span>
                    {b.owner}
                  </span>
                  <span className="font-mono text-ink-500">
                    <span className="text-ink-700">Citation: </span>
                    {b.citation}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Stakeholder guidance */}
      <section className="rounded-2xl border border-ink-100 bg-paper p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Send size={14} className="text-accent" aria-hidden />
          <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-700">
            Stakeholder guidance · routed next steps
          </h4>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {final.stakeholderGuidance.map((g) => (
            <li
              key={g.audience}
              className="flex flex-col gap-1.5 rounded-xl border border-ink-100 bg-paper-muted/40 p-3"
            >
              <div className="flex items-center gap-2">
                <ArrowRight size={12} className="text-accent" aria-hidden />
                <p className="font-serif text-sm font-semibold text-ink-900">{g.audience}</p>
              </div>
              <p className="text-[0.72rem] leading-relaxed text-ink-600">{g.nextStep}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}) {
  const tones = {
    neutral: 'text-ink-900',
    positive: 'text-spruce-700',
    warning: 'text-accent',
    danger: 'text-rose-700',
  };
  return (
    <div className="rounded-xl border border-ink-100 bg-paper-muted/40 p-3">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">{label}</p>
      <p className={`mt-1 font-serif text-xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
