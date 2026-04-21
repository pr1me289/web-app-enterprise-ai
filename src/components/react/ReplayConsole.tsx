import { useMemo, useState } from 'react';

type StepState = 'idle' | 'active' | 'blocked' | 'provisional' | 'escalated' | 'resolved' | 'complete';

interface Blocker {
  id: string;
  title: string;
  owner: string;
  citations: string[];
}

interface ResolvedItem {
  title: string;
  determination: string;
  owner: string;
  citation: string;
}

interface StakeholderGuidance {
  role: string;
  action: string;
  citation: string;
}

interface PipelineStep {
  index: number;
  id: string;
  title: string;
  state: StepState;
  agent: string;
  summary: string;
  evidence: string[];
  rationale: string;
  conceptualState?: StepState;
  blockers?: Blocker[];
  resolvedItems?: ResolvedItem[];
  stakeholderGuidance?: StakeholderGuidance[];
}

interface Act {
  id: string;
  roman: string;
  title: string;
  record: string;
  outcome: string;
  steps: PipelineStep[];
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
  acts: Act[];
}

const stateBadge: Record<StepState, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'bg-ink-50 text-ink-500 ring-1 ring-inset ring-ink-100' },
  active: { label: 'Active', className: 'bg-accent-soft text-accent ring-1 ring-inset ring-accent/30' },
  blocked: { label: 'Blocked', className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200' },
  provisional: { label: 'Provisional', className: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200' },
  escalated: { label: 'Escalated', className: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200' },
  resolved: { label: 'Resolved', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' },
  complete: { label: 'Complete', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' },
};

const stateDot: Record<StepState, string> = {
  idle: 'bg-ink-200',
  active: 'bg-accent ring-4 ring-accent/20',
  blocked: 'bg-red-500',
  provisional: 'bg-sky-500',
  escalated: 'bg-amber-500',
  resolved: 'bg-emerald-500',
  complete: 'bg-emerald-500',
};

export default function ReplayConsole({ run, acts }: ReplayConsoleProps) {
  const flatSteps = useMemo(() => acts.flatMap((a) => a.steps.map((s) => ({ step: s, actId: a.id }))), [acts]);
  const [selectedId, setSelectedId] = useState(flatSteps[0]?.step.id);
  const selected = flatSteps.find((entry) => entry.step.id === selectedId)?.step ?? flatSteps[0].step;
  const selectedActId = flatSteps.find((entry) => entry.step.id === selectedId)?.actId ?? acts[0].id;

  const handleSelect = (id: string) => setSelectedId(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <aside aria-label="Pipeline acts" className="space-y-6">
        <p className="eyebrow text-ink-400">Five-act execution</p>
        <ol className="space-y-5">
          {acts.map((act) => {
            const isActiveAct = act.id === selectedActId;
            return (
              <li key={act.id}>
                <div className="mb-2 flex items-baseline gap-3">
                  <span
                    className={`font-mono text-[0.7rem] tracking-[0.16em] ${
                      isActiveAct ? 'text-accent' : 'text-ink-300'
                    }`}
                  >
                    ACT {act.roman}
                  </span>
                  <span className="font-serif text-sm font-medium text-ink-900">{act.title}</span>
                  <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-wider text-ink-400">
                    {act.record}
                  </span>
                </div>
                <ul className="space-y-1.5 border-l border-ink-100 pl-3">
                  {act.steps.map((step) => {
                    const isSelected = step.id === selected.id;
                    const badge = stateBadge[step.state];
                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(step.id)}
                          aria-current={isSelected ? 'true' : undefined}
                          className={`group flex w-full items-center gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors ${
                            isSelected
                              ? 'border-ink-900 bg-paper shadow-soft'
                              : 'border-transparent bg-paper hover:border-ink-100'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`h-2 w-2 shrink-0 rounded-full ${stateDot[step.state]}`}
                          />
                          <span className="flex-1 text-xs leading-snug text-ink-800">{step.title}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="space-y-6">
        <ActOverview acts={acts} selectedActId={selectedActId} />
        <StepDetail step={selected} />
      </section>
    </div>
  );
}

function ActOverview({ acts, selectedActId }: { acts: Act[]; selectedActId: string }) {
  const act = acts.find((a) => a.id === selectedActId) ?? acts[0];
  return (
    <div className="rounded-lg border border-ink-100 bg-paper-muted p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.18em] text-accent">ACT {act.roman}</span>
          <h3 className="font-serif text-xl text-ink-900">{act.title}</h3>
        </div>
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-400">{act.record}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{act.outcome}</p>
    </div>
  );
}

function StepDetail({ step }: { step: PipelineStep }) {
  return (
    <section className="rounded-lg border border-ink-100 bg-paper p-6 shadow-soft">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-4">
        <div>
          <p className="eyebrow text-ink-400">Step detail</p>
          <h3 className="mt-1 font-serif text-2xl text-ink-900">{step.title}</h3>
          <p className="mt-1 text-sm text-ink-500">Agent: {step.agent}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${stateBadge[step.state].className}`}
          >
            {stateBadge[step.state].label}
          </span>
          {step.conceptualState && step.conceptualState !== step.state ? (
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-400">
              conceptually: {step.conceptualState}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-5 space-y-6">
        <div>
          <p className="eyebrow mb-2 text-ink-400">Summary</p>
          <p className="text-sm leading-relaxed text-ink-700">{step.summary}</p>
        </div>

        <div>
          <p className="eyebrow mb-2 text-ink-400">Evidence</p>
          {step.evidence.length === 0 ? (
            <p className="text-sm italic text-ink-400">No evidence — the gate is the point.</p>
          ) : (
            <ul className="space-y-1.5 font-mono text-xs text-ink-700">
              {step.evidence.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 text-ink-300">·</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="eyebrow mb-2 text-ink-400">Rationale</p>
          <p className="text-sm leading-relaxed text-ink-700">{step.rationale}</p>
        </div>

        {step.blockers ? <BlockerTable blockers={step.blockers} /> : null}
        {step.resolvedItems ? <ResolvedTable items={step.resolvedItems} /> : null}
        {step.stakeholderGuidance ? <StakeholderTable guidance={step.stakeholderGuidance} /> : null}
      </div>
    </section>
  );
}

function BlockerTable({ blockers }: { blockers: Blocker[] }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="eyebrow text-ink-400">Blocking items</p>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-amber-700">
          {blockers.length} open
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-amber-200 bg-amber-50/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-50 text-[0.65rem] uppercase tracking-wider text-amber-800">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Blocker</th>
              <th className="px-3 py-2 font-medium">Owner</th>
              <th className="px-3 py-2 font-medium">Citation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {blockers.map((b) => (
              <tr key={b.id}>
                <td className="px-3 py-2.5 font-mono text-ink-500">{b.id}</td>
                <td className="px-3 py-2.5 text-ink-800">{b.title}</td>
                <td className="px-3 py-2.5 text-ink-600">{b.owner}</td>
                <td className="px-3 py-2.5 font-mono text-[0.7rem] text-ink-600">{b.citations.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResolvedTable({ items }: { items: ResolvedItem[] }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="eyebrow text-ink-400">Resolved determinations</p>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-700">
          {items.length} cited
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-emerald-200 bg-emerald-50/30">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50 text-[0.65rem] uppercase tracking-wider text-emerald-800">
            <tr>
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 font-medium">Determination</th>
              <th className="px-3 py-2 font-medium">Owner</th>
              <th className="px-3 py-2 font-medium">Citation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {items.map((item) => (
              <tr key={item.title}>
                <td className="px-3 py-2.5 text-ink-800">{item.title}</td>
                <td className="px-3 py-2.5 font-mono text-[0.7rem] font-medium uppercase text-emerald-800">
                  {item.determination}
                </td>
                <td className="px-3 py-2.5 text-ink-600">{item.owner}</td>
                <td className="px-3 py-2.5 font-mono text-[0.7rem] text-ink-600">{item.citation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StakeholderTable({ guidance }: { guidance: StakeholderGuidance[] }) {
  return (
    <div>
      <p className="eyebrow mb-2 text-ink-400">Stakeholder guidance</p>
      <ul className="divide-y divide-ink-100 overflow-hidden rounded-md border border-ink-100 bg-paper-muted">
        {guidance.map((g) => (
          <li key={g.role} className="grid gap-1 px-4 py-3 md:grid-cols-[10rem_1fr] md:gap-4">
            <span className="font-serif text-sm font-medium text-ink-900">{g.role}</span>
            <div>
              <p className="text-sm leading-relaxed text-ink-700">{g.action}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-ink-500">{g.citation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
