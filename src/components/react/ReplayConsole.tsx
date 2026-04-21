import { useState } from 'react';

type StepState = 'idle' | 'active' | 'complete' | 'escalated' | 'blocked';

interface PipelineStep {
  index: number;
  id: string;
  title: string;
  state: StepState;
  agent: string;
  summary: string;
  evidence: string[];
  rationale: string;
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
  idle: { label: 'Idle', className: 'bg-ink-50 text-ink-500' },
  active: { label: 'Active', className: 'bg-accent-soft text-accent' },
  complete: { label: 'Complete', className: 'bg-emerald-50 text-emerald-700' },
  escalated: { label: 'Escalated', className: 'bg-amber-50 text-amber-700' },
  blocked: { label: 'Blocked', className: 'bg-red-50 text-red-700' },
};

const stateDot: Record<StepState, string> = {
  idle: 'bg-ink-200',
  active: 'bg-accent ring-4 ring-accent/20',
  complete: 'bg-emerald-500',
  escalated: 'bg-amber-500',
  blocked: 'bg-red-500',
};

export default function ReplayConsole({ run, steps }: ReplayConsoleProps) {
  const [selectedId, setSelectedId] = useState(steps[0]?.id);
  const selected = steps.find((s) => s.id === selectedId) ?? steps[0];

  const handleSelect = (id: string) => setSelectedId(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside aria-label="Pipeline steps" className="space-y-2">
        <p className="eyebrow mb-3 text-ink-400">Pipeline steps</p>
        <ul className="space-y-2">
          {steps.map((step) => {
            const isSelected = step.id === selected.id;
            const badge = stateBadge[step.state];
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(step.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'border-ink-900 bg-paper shadow-soft'
                      : 'border-ink-100 bg-paper hover:border-ink-200'
                  }`}
                >
                  <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${stateDot[step.state]}`} />
                  <span className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-400">
                    {String(step.index).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-serif text-sm font-medium text-ink-900">{step.title}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[0.65rem] font-medium uppercase ${badge.className}`}>
                    {badge.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="rounded-lg border border-ink-100 bg-paper p-6 shadow-soft">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-4">
          <div>
            <p className="eyebrow text-ink-400">Step detail</p>
            <h3 className="mt-1 font-serif text-2xl text-ink-900">{selected.title}</h3>
            <p className="mt-1 text-sm text-ink-500">Agent: {selected.agent}</p>
          </div>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${stateBadge[selected.state].className}`}
          >
            {stateBadge[selected.state].label}
          </span>
        </header>

        <div className="mt-5 space-y-6">
          <div>
            <p className="eyebrow mb-2 text-ink-400">Summary</p>
            <p className="text-sm leading-relaxed text-ink-700">{selected.summary}</p>
          </div>

          <div>
            <p className="eyebrow mb-2 text-ink-400">Evidence</p>
            {selected.evidence.length === 0 ? (
              <p className="text-sm italic text-ink-400">No direct evidence retrieved at this step.</p>
            ) : (
              <ul className="space-y-1.5 font-mono text-xs text-ink-700">
                {selected.evidence.map((e) => (
                  <li key={e} className="flex items-center gap-2">
                    <span aria-hidden className="text-ink-300">·</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="eyebrow mb-2 text-ink-400">Rationale</p>
            <p className="text-sm leading-relaxed text-ink-700">{selected.rationale}</p>
          </div>

          <div className="rounded-md border border-ink-100 bg-paper-muted p-4">
            <p className="eyebrow mb-2 text-ink-400">Determination output</p>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-700">
{`{
  "step": "${selected.id}",
  "agent": "${selected.agent}",
  "state": "${selected.state}",
  "evidence_count": ${selected.evidence.length},
  "audit_trail": "ok"
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
