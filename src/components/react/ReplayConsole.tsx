import { useState } from 'react';

type StepState = 'queued' | 'active' | 'complete' | 'escalated' | 'blocked';

interface Subquery {
  label: string;
  route: string;
  reason: string;
}

interface EvidenceItem {
  citation: string;
  sourceType: string;
  authority: string;
  lane: string;
  note: string;
}

interface Determination {
  status: string;
  owner: string;
  downstream: string;
  output: string[];
}

interface PipelineStep {
  index: number;
  id: string;
  title: string;
  state: StepState;
  agent: string;
  trigger: string;
  summary: string;
  questions: string[];
  subqueries: Subquery[];
  evidence: EvidenceItem[];
  bundle: string[];
  rationale: string;
  determination: Determination;
  audit: string[];
}

interface RunMeta {
  id: string;
  scenario: string;
  startedAt: string;
  completedAt: string;
  outcome: 'complete' | 'escalated' | 'blocked';
  summary: string;
}

interface ReplayConsoleProps {
  run: RunMeta;
  steps: PipelineStep[];
}

const stateBadge: Record<StepState, { label: string; className: string }> = {
  queued: { label: 'Queued', className: 'bg-ink-50 text-ink-500' },
  active: { label: 'Active', className: 'bg-accent-soft text-accent' },
  complete: { label: 'Complete', className: 'bg-spruce-50 text-spruce-700' },
  escalated: { label: 'Escalated', className: 'bg-accent-soft text-accent' },
  blocked: { label: 'Blocked', className: 'bg-rose-50 text-rose-700' },
};

const stateDot: Record<StepState, string> = {
  queued: 'bg-ink-200',
  active: 'bg-accent ring-4 ring-accent/20',
  complete: 'bg-spruce-600',
  escalated: 'bg-accent',
  blocked: 'bg-rose-700',
};

export default function ReplayConsole({ run, steps }: ReplayConsoleProps) {
  const [selectedId, setSelectedId] = useState(steps[0]?.id);
  const selected = steps.find((step) => step.id === selectedId) ?? steps[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)_20rem]">
      <aside aria-label="Pipeline steps" className="panel-muted p-4">
        <p className="eyebrow mb-3 text-ink-400">Execution rail</p>
        <ul className="space-y-2">
          {steps.map((step) => {
            const isSelected = step.id === selected.id;
            const badge = stateBadge[step.state];

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(step.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? 'border-ink-900 bg-paper shadow-soft'
                      : 'border-ink-100 bg-paper/80 hover:border-ink-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${stateDot[step.state]}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-400">
                          {String(step.index).padStart(2, '0')}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[0.62rem] font-medium uppercase ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-2 font-serif text-sm text-ink-900">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{step.agent}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="panel p-6">
        <header className="border-b border-ink-100 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-400">Active step</p>
              <h3 className="mt-2 font-serif text-3xl text-ink-900">{selected.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{selected.agent}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] ${stateBadge[selected.state].className}`}
            >
              {stateBadge[selected.state].label}
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-600">{selected.summary}</p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-2 text-ink-400">Trigger</p>
            <p className="text-sm leading-relaxed text-ink-700">{selected.trigger}</p>
          </div>
          <div>
            <p className="eyebrow mb-2 text-ink-400">Supervisor questions</p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
              {selected.questions.map((question) => (
                <li
                  key={question}
                  className="rounded-2xl border border-ink-100 bg-paper-muted/70 px-4 py-3"
                >
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="eyebrow mb-3 text-ink-400">Retrieval plan</p>
          <div className="space-y-3">
            {selected.subqueries.map((query) => (
              <article
                key={query.label}
                className="rounded-2xl border border-ink-100 bg-paper-muted/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-serif text-base text-ink-900">{query.label}</p>
                  <span className="chip">{query.route}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{query.reason}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div>
            <p className="eyebrow mb-2 text-ink-400">Determination</p>
            <div className="rounded-[1.25rem] border border-ink-100 bg-paper-muted/70 p-5">
              <p className="font-serif text-xl text-ink-900">{selected.determination.status}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{selected.rationale}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-700">
                {selected.determination.output.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2 text-ink-400">Ownership</p>
            <div className="rounded-[1.25rem] border border-ink-100 bg-paper p-5 shadow-soft">
              <p className="text-sm font-medium text-ink-900">{selected.determination.owner}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {selected.determination.downstream}
              </p>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="panel p-5">
          <p className="eyebrow mb-3 text-ink-400">Evidence bundle</p>
          <div className="space-y-3">
            {selected.evidence.map((item) => (
              <article
                key={item.citation}
                className="rounded-2xl border border-ink-100 bg-paper-muted/70 p-4"
              >
                <p className="font-mono text-[0.72rem] leading-relaxed text-ink-500">
                  {item.citation}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="chip">{item.authority}</span>
                  <span className="chip">{item.lane}</span>
                  <span className="chip">{item.sourceType}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel-muted p-5">
          <p className="eyebrow mb-3 text-ink-400">Context bundle contents</p>
          <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
            {selected.bundle.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel p-5">
          <p className="eyebrow mb-3 text-ink-400">Audit notes</p>
          <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
            {selected.audit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl border border-ink-100 bg-paper-muted/70 p-4">
            <p className="eyebrow mb-2 text-ink-400">Replay scope</p>
            <p className="text-sm leading-relaxed text-ink-600">{run.summary}</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
