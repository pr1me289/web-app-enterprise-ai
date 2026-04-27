// The four narrative stages of a single step's execution. Each stage gates on
// the current replay phase so the visual story matches the supervisor's actions.
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Search,
  FileText,
  Package,
  Send,
  Brain,
  FileCheck,
  ShieldCheck,
  Gavel,
  CircleSlash,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { AuthorityBadge, LaneBadge, TreatmentBadge, laneMeta } from './badges';
import { phaseIndex, PHASE_INDEX, type ReplayPhase } from './store';
import type {
  DemoStep,
  RetrievalLane,
  RetrievedEvidenceItem,
} from '../../../data/demo-codex/types';

type StageState = 'pending' | 'active' | 'done';

function stateFor(phase: ReplayPhase, threshold: number): StageState {
  const idx = phaseIndex(phase);
  if (idx < threshold) return 'pending';
  if (idx === threshold) return 'active';
  return 'done';
}

function stateForRange(phase: ReplayPhase, start: number, end: number): StageState {
  const idx = phaseIndex(phase);
  if (idx < start) return 'pending';
  if (idx >= start && idx <= end) return 'active';
  return 'done';
}

// ────────────────────────────────────────────────────────────────────────────
// Shared shell wrapping each stage with consistent header + state styling
// ────────────────────────────────────────────────────────────────────────────

function StageShell({
  state,
  icon: Icon,
  eyebrow,
  title,
  children,
  accent = 'accent',
}: {
  state: StageState;
  icon: typeof Database;
  eyebrow: string;
  title: string;
  children: ReactNode;
  accent?: 'accent' | 'spruce';
}) {
  const accentCls = accent === 'spruce' ? 'text-spruce-700' : 'text-accent';
  const ringCls =
    state === 'active'
      ? accent === 'spruce'
        ? 'ring-2 ring-spruce-700/50 shadow-[0_0_0_5px_rgba(33,71,60,0.06)]'
        : 'ring-2 ring-accent/50 shadow-[0_0_0_5px_rgba(157,87,40,0.06)]'
      : '';
  const opacityCls = state === 'pending' ? 'opacity-50' : 'opacity-100';

  return (
    <motion.section
      layout
      transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
      className={`overflow-hidden rounded-2xl border border-ink-100 bg-paper shadow-soft transition-all ${ringCls} ${opacityCls}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-ink-100 bg-paper-muted/40 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Icon size={14} className={accentCls} aria-hidden />
          <div className="flex flex-col">
            <span className={`font-mono text-[0.62rem] uppercase tracking-[0.12em] ${accentCls}`}>
              {eyebrow}
            </span>
            <span className="font-serif text-base text-ink-900">{title}</span>
          </div>
        </div>
        <StageStateChip state={state} />
      </header>
      <div className="p-5">{children}</div>
    </motion.section>
  );
}

function StageStateChip({ state }: { state: StageState }) {
  const Icon = state === 'active' ? Loader2 : state === 'done' ? CheckCircle2 : Clock;
  const cls =
    state === 'active'
      ? 'bg-accent-soft text-accent border-accent/40'
      : state === 'done'
        ? 'bg-spruce-50 text-spruce-700 border-spruce-700/30'
        : 'bg-ink-50 text-ink-500 border-ink-200';
  const label = state === 'active' ? 'Active' : state === 'done' ? 'Done' : 'Waiting';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] ${cls}`}
    >
      <Icon size={11} className={state === 'active' ? 'animate-spin' : ''} aria-hidden />
      {label}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 1. RetrievalStage — sources animate into a tray
// ────────────────────────────────────────────────────────────────────────────

export function RetrievalStage({
  step,
  phase,
  prevented,
}: {
  step: DemoStep;
  phase: ReplayPhase;
  prevented: boolean;
}) {
  const state = stateFor(phase, PHASE_INDEX.RETRIEVING);
  const showSources = state !== 'pending';

  if (prevented) {
    return (
      <StageShell state="pending" icon={Database} eyebrow="Stage 1" title="Source-aware retrieval">
        <PreventedNote
          message={step.notRunReason ?? 'Step did not run; no sources queried.'}
        />
      </StageShell>
    );
  }

  // Group by lane for the tray visualization
  const byLane: Record<RetrievalLane, RetrievedEvidenceItem[]> = {
    direct_structured: [],
    indexed_hybrid: [],
    non_retrieval: [],
  };
  step.retrievedEvidence.forEach((ev) => byLane[ev.lane].push(ev));

  return (
    <StageShell state={state} icon={Database} eyebrow="Stage 1" title="Source-aware retrieval">
      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(byLane) as RetrievalLane[]).map((lane) => {
          const items = byLane[lane];
          const meta = laneMeta[lane];
          const Icon = meta.icon;
          if (items.length === 0) {
            return (
              <div
                key={lane}
                className="flex min-h-[7.5rem] flex-col gap-2 rounded-xl border border-dashed border-ink-100 bg-paper-muted/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <Icon size={12} className={meta.iconCls} aria-hidden />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                    {meta.label}
                  </span>
                </div>
                <p className="text-[0.7rem] italic text-ink-400">No sources used in this step.</p>
              </div>
            );
          }
          return (
            <div
              key={lane}
              className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper-muted/30 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={12} className={meta.iconCls} aria-hidden />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-700">
                    {meta.label}
                  </span>
                </div>
                <span className="font-mono text-[0.55rem] text-ink-400">
                  {items.length} source{items.length === 1 ? '' : 's'}
                </span>
              </div>
              <AnimatePresence>
                {showSources &&
                  items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.28, ease: 'easeOut' }}
                      className={`flex flex-col gap-1.5 rounded-lg border bg-paper p-2.5 ${
                        item.treatment === 'excluded'
                          ? 'border-dashed border-ink-200 opacity-60'
                          : item.treatment === 'supplementary'
                            ? 'border-ink-100 bg-paper-muted/40'
                            : 'border-ink-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-mono text-[0.7rem] leading-snug text-ink-900">
                          {item.name}
                        </p>
                        <AuthorityBadge tier={item.authorityTier} size="sm" />
                      </div>
                      <p className="text-[0.68rem] leading-relaxed text-ink-500">{item.reason}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <TreatmentBadge treatment={item.treatment} size="sm" />
                        <span className="font-mono text-[0.58rem] text-ink-500">
                          <span className="text-ink-900">{item.chunksAdmitted}</span>
                          <span className="text-ink-400"> / {item.chunksRetrieved}</span> admitted
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {step.bundle.excluded && step.bundle.excluded.length > 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-ink-200 bg-paper-muted/40 p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            Excluded at index time
          </p>
          <ul className="mt-1 space-y-0.5">
            {step.bundle.excluded.map((ex) => (
              <li key={ex.source} className="text-[0.7rem] text-ink-500">
                <span className="font-mono text-ink-700">{ex.source}</span>{' '}
                <span className="text-ink-400">— {ex.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StageShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. BundleStage — sources condense into a bundle card
// ────────────────────────────────────────────────────────────────────────────

export function BundleStage({
  step,
  phase,
  prevented,
}: {
  step: DemoStep;
  phase: ReplayPhase;
  prevented: boolean;
}) {
  const state = stateFor(phase, PHASE_INDEX.BUNDLING);

  if (prevented) {
    return (
      <StageShell state="pending" icon={Package} eyebrow="Stage 2" title="Bundle assembly" accent="spruce">
        <PreventedNote message="No bundle assembled; the supervisor never reached this step." />
      </StageShell>
    );
  }

  return (
    <StageShell state={state} icon={Package} eyebrow="Stage 2" title="Bundle assembly" accent="spruce">
      {state !== 'pending' && (
        <motion.div
          key="bundle-content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="grid gap-3 md:grid-cols-2"
        >
            <BundleSection title="Task" delay={0}>
              <p className="text-sm leading-relaxed text-ink-700">{step.bundle.task}</p>
            </BundleSection>
            <BundleSection title="Instructions" delay={0.04}>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink-700">
                {step.bundle.instructions.map((instr, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-[0.7rem] text-ink-400">{i + 1}.</span>
                    <span>{instr}</span>
                  </li>
                ))}
              </ul>
            </BundleSection>

            <BundleSection title="Evidence" delay={0.08} span={2}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {step.bundle.evidence.map((ev, i) => (
                  <li
                    key={`${ev.source}-${i}`}
                    className="rounded-lg border border-ink-100 bg-paper-muted/40 p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[0.7rem] text-ink-900">{ev.source}</p>
                      </div>
                      <AuthorityBadge tier={ev.tier} size="sm" />
                    </div>
                    <p className="mt-1 text-[0.7rem] leading-relaxed text-ink-600">{ev.note}</p>
                  </li>
                ))}
              </ul>
            </BundleSection>

            <BundleSection title="Output contract" delay={0.12} span={2}>
              <pre className="overflow-x-auto rounded-md bg-ink-950 p-3 font-mono text-[0.72rem] leading-relaxed text-ink-100">
                {step.bundle.outputContract.map((line) => `  ${line}`).join('\n')}
              </pre>
            </BundleSection>
        </motion.div>
      )}
    </StageShell>
  );
}

function BundleSection({
  title,
  children,
  delay = 0,
  span = 1,
}: {
  title: string;
  children: ReactNode;
  delay?: number;
  span?: 1 | 2;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: 'easeOut' }}
      className={`rounded-xl border border-ink-100 bg-paper p-3 ${
        span === 2 ? 'md:col-span-2' : ''
      }`}
    >
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-700">
        {title}
      </p>
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. AgentStage — bundle dispatches to agent; output assembles
// ────────────────────────────────────────────────────────────────────────────

export function AgentStage({
  step,
  phase,
  prevented,
  renderOutput,
}: {
  step: DemoStep;
  phase: ReplayPhase;
  prevented: boolean;
  // The structured output renderer is composed from the parent so we can
  // share styling with other JSON renders on the page.
  renderOutput: (step: DemoStep) => ReactNode;
}) {
  const dispatchState = stateFor(phase, PHASE_INDEX.DISPATCHING);
  const workingState = stateForRange(phase, PHASE_INDEX.AGENT_WORKING, PHASE_INDEX.OUTPUT_READY);
  const outputReady = phaseIndex(phase) >= PHASE_INDEX.OUTPUT_READY;

  if (prevented) {
    return (
      <StageShell state="pending" icon={Send} eyebrow="Stage 3" title="Agent dispatch & output">
        <PreventedNote message="Bundle never dispatched; agent never executed." />
      </StageShell>
    );
  }

  return (
    <StageShell state={dispatchState} icon={Send} eyebrow="Stage 3" title="Agent dispatch & output">
      {dispatchState !== 'pending' && (
      <>
      {/* Dispatch visual — animated bundle traveling to agent */}
      <div className="relative grid items-center gap-3 rounded-xl border border-ink-100 bg-paper-muted/30 p-3 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,9rem)]">
        <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-paper px-3 py-2">
          <Package size={14} className="text-spruce-700" aria-hidden />
          <div className="flex flex-col">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.1em] text-ink-500">
              Bundle
            </span>
            <span className="font-serif text-xs text-ink-900">
              +{step.bundle.evidence.length} evidence
            </span>
          </div>
        </div>

        <div className="relative h-8">
          <svg
            viewBox="0 0 200 32"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* Faint background track — always visible behind any active flow. */}
            <line
              x1="0"
              y1="16"
              x2="168"
              y2="16"
              stroke="rgba(157,87,40,0.18)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {phaseIndex(phase) >= PHASE_INDEX.DISPATCHING &&
              phaseIndex(phase) <= PHASE_INDEX.OUTPUT_READY && (
                <>
                  {/* Energy-direction track — dashes flow continuously toward the agent
                      via strokeDashoffset, no segment-by-segment blink. */}
                  <motion.line
                    x1="0"
                    y1="16"
                    x2="168"
                    y2="16"
                    stroke="rgba(157,87,40,0.55)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    animate={{ strokeDashoffset: [0, -24] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Traveling glow particles — three staggered orbs of an outer
                      soft halo + sharp inner core, sliding from bundle to agent. */}
                  {[0, 1, 2].map((i) => (
                    <motion.g
                      key={`particle-${i}`}
                      initial={{ x: 0, opacity: 0 }}
                      animate={{
                        x: [0, 17, 150, 168],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        repeatDelay: 0.3,
                        delay: i * 0.55,
                        ease: 'linear',
                        times: [0, 0.1, 0.9, 1],
                      }}
                    >
                      <circle cy="16" r="5" fill="rgba(157,87,40,0.22)" />
                      <circle cy="16" r="2.8" fill="rgba(157,87,40,0.5)" />
                      <circle cy="16" r="1.6" fill="rgba(157,87,40,1)" />
                    </motion.g>
                  ))}
                </>
              )}

            {/* Refined arrow head — soft outer glow + crisp filled triangle. */}
            <path
              d="M 184 16 L 168 8 L 168 24 Z"
              fill="rgba(157,87,40,0.28)"
              style={{ filter: 'blur(2.5px)' }}
            />
            <path d="M 184 16 L 168 8 L 168 24 Z" fill="rgba(157,87,40,0.9)" />
          </svg>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-soft/40 px-3 py-2">
          <Brain size={14} className="text-accent" aria-hidden />
          <div className="flex flex-col">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.1em] text-accent">
              Agent
            </span>
            <span className="font-serif text-xs text-ink-900">{step.actor}</span>
          </div>
        </div>
      </div>

      {/* The agent's question */}
      <div className="mt-4 rounded-xl border border-ink-100 bg-paper-muted/30 p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
          Agent question
        </p>
        <p className="mt-1 font-serif text-sm leading-relaxed text-ink-800">{step.question}</p>
      </div>

      {/* Output area — appears when output_ready or later */}
      <AnimatePresence>
        {outputReady && (
          <motion.div
            key="agent-output"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="mt-4 grid min-w-0 grid-cols-1 gap-4"
          >
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-ink-100 bg-paper p-4">
              <FileCheck size={16} className="mt-0.5 shrink-0 text-spruce-700" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
                  Plain-language summary
                </p>
                <p className="mt-1 break-words font-serif text-base leading-relaxed text-ink-900">
                  {step.output.plainSummary ?? step.output.summary}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-ink-100 bg-paper-muted/50 p-4">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
                  Technical summary
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words font-mono text-[0.78rem] leading-relaxed text-ink-800">
                  {step.output.summary}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
                Structured output
              </p>
              {renderOutput(step)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {workingState === 'active' && !outputReady && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-dashed border-accent/30 bg-accent-soft/30 px-4 py-6 text-center">
          <ShimmerDots />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
            Agent reasoning over scoped bundle
          </span>
        </div>
      )}
      </>
      )}
    </StageShell>
  );
}

function ShimmerDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. GateStage — supervisor validates; gate decision shows
// ────────────────────────────────────────────────────────────────────────────

export function GateStage({
  step,
  phase,
  prevented,
  eyebrow = 'Stage 4',
}: {
  step: DemoStep;
  phase: ReplayPhase;
  prevented: boolean;
  eyebrow?: string;
}) {
  const state = stateFor(phase, PHASE_INDEX.GATING);
  const decided = phaseIndex(phase) >= PHASE_INDEX.DECIDED;
  const passed = step.gateDecision.continueRun;
  const status = step.gateDecision.status;

  if (prevented) {
    return (
      <StageShell state="pending" icon={ShieldCheck} eyebrow={eyebrow} title="Gate decision">
        <PreventedNote message="No gate ran; the supervisor never validated this step." />
      </StageShell>
    );
  }

  return (
    <StageShell state={state} icon={ShieldCheck} eyebrow={eyebrow} title="Gate decision">
      {state !== 'pending' && (
      <>
      {/* Contract validation list */}
      <div className="rounded-xl border border-ink-100 bg-paper-muted/30 p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
          Output contract
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {step.gateDecision.expectedContract.map((field, i) => (
            <motion.li
              key={field}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.22 }}
              className="flex items-center gap-2 rounded-md bg-paper px-2 py-1 font-mono text-[0.7rem] text-ink-800"
            >
              <CheckCircle2 size={12} className="text-spruce-700" aria-hidden />
              {field}
            </motion.li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[0.62rem] text-ink-500">
          Schema validation:{' '}
          <span className="font-medium text-spruce-700">
            {step.gateDecision.contractValid ? 'PASSED' : 'FAILED'}
          </span>
        </p>
      </div>

      {/* Decision badge */}
      <AnimatePresence>
        {decided && (
          <motion.div
            key="gate-decision"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
              passed
                ? 'border-spruce-700/30 bg-spruce-50/70'
                : 'border-accent/40 bg-accent-soft/50'
            }`}
          >
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                passed ? 'bg-spruce-700 text-paper' : 'bg-accent text-paper'
              }`}
            >
              <Gavel size={16} aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`font-mono text-[0.62rem] uppercase tracking-[0.12em] ${
                    passed ? 'text-spruce-700' : 'text-accent'
                  }`}
                >
                  Supervisor decision
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] ${
                    passed
                      ? 'bg-spruce-700 text-paper'
                      : 'bg-accent text-paper'
                  }`}
                >
                  {status}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] ${
                    passed
                      ? 'bg-paper text-spruce-700 border border-spruce-700/30'
                      : 'bg-paper text-accent border border-accent/40'
                  }`}
                >
                  {passed ? 'continue' : 'halt'}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                {step.gateDecision.reason}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </StageShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Shared prevented-state note
// ────────────────────────────────────────────────────────────────────────────

function PreventedNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-ink-200 bg-paper-muted/30 p-4">
      <CircleSlash size={16} className="mt-0.5 shrink-0 text-ink-400" aria-hidden />
      <p className="text-sm leading-relaxed text-ink-600">{message}</p>
    </div>
  );
}

// Convenience re-export so the panel can pull all four from one module
export const STAGES = { RetrievalStage, BundleStage, AgentStage, GateStage };
