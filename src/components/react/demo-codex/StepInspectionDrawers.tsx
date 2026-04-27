// Technical inspection drawers for a selected step — audit events, agent input
// bundle, raw structured output, and source document previews.
// The section has its own step selector, decoupled from the main replay's
// currentStep. Initialized to step 1 on mount; resets when scenario changes.
import { useState, useEffect } from 'react';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import StructuredOutputViewer from './StructuredOutputViewer';
import ExpandableDrawer from './ExpandableDrawer';
import SourceDocumentsDrawer from './SourceDocumentsDrawer';
import DocumentViewer from '../DocumentViewer';
import type { DemoStep } from '../../../data/demo-codex/types';
import type { ScenarioId, StepNumber } from '../../../data/demo-codex/types';

// Hardcoded map of which (scenario, stepNumber) combinations have a captured bundle on disk.
// scenario-1 has STEP-02 through STEP-06; scenario-2 has STEP-02 and STEP-03 (run halts at STEP-03).
const BUNDLE_EXISTS: Record<ScenarioId, Set<StepNumber>> = {
  clean: new Set([2, 3, 4, 5, 6] as StepNumber[]),
  escalated: new Set([2, 3] as StepNumber[]),
};

function scenarioNumber(scenario: ScenarioId): string {
  return scenario === 'clean' ? '1' : '2';
}

function scenarioLabel(scenario: ScenarioId): string {
  return scenario === 'clean' ? 'Complete' : 'Escalated';
}

function bundlePath(scenario: ScenarioId, stepNumber: StepNumber): string {
  const n = scenarioNumber(scenario);
  const step = String(stepNumber).padStart(2, '0');
  return `/scenarios/scenario-${n}/agent_input_bundles/scenario_${n}__STEP-${step}__bundle.json`;
}

function bundleTitle(stepNumber: StepNumber, actor: string): string {
  const step = String(stepNumber).padStart(2, '0');
  return `Agent input bundle — STEP-${step} (${actor})`;
}

function bundleLabel(stepNumber: StepNumber): string {
  const step = String(stepNumber).padStart(2, '0');
  return `step_${step}__bundle.json`;
}

// ---- useBundleMeta hook ----

function useBundleMeta(
  scenario: ScenarioId,
  stepNumber: StepNumber,
): { text: string; loading: boolean } {
  const [text, setText] = useState('Loading bundle…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stepNumber === 1 || !BUNDLE_EXISTS[scenario].has(stepNumber)) {
      setText('');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const url = bundlePath(scenario, stepNumber);
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((text) => {
        if (cancelled) return;
        const parsed = JSON.parse(text);
        const fieldCount =
          typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0;
        const sizeKb = Math.round((text.length / 1024) * 10) / 10;
        setText(`${fieldCount} top-level fields · ~${sizeKb}KB`);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setText('');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [scenario, stepNumber]);

  return { text, loading };
}

// ---- Step selector pill button ----

function StepSelectorPill({
  step,
  selected,
  onClick,
}: {
  step: DemoStep;
  selected: boolean;
  onClick: () => void;
}) {
  const stepId = step.id; // e.g. "STEP-01"
  const notRun = step.status === 'NOT_RUN';
  const label = `${stepId} · ${step.actor}`;

  if (notRun) {
    return (
      <button
        type="button"
        disabled
        title="did not run"
        className="rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] opacity-40 cursor-not-allowed bg-paper-muted/60 text-ink-700"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] transition-colors ${
        selected
          ? 'bg-accent text-paper'
          : 'bg-paper-muted/60 text-ink-700 hover:text-ink-900'
      }`}
    >
      {label}
    </button>
  );
}

// ---- Agent Input Bundle card ----
// Expandable drawer (default closed). Expanded body shows either an
// informational note (STEP-01 / no captured bundle) or a DocumentViewer
// trigger that opens the bundle JSON in its own dialog.

function AgentInputBundleDrawer({
  scenario,
  step,
  open,
  onOpenChange,
}: {
  scenario: ScenarioId;
  step: DemoStep;
  open: boolean;
  onOpenChange: () => void;
}) {
  const stepNumber = step.stepNumber;
  const { text: metaText, loading: metaLoading } = useBundleMeta(scenario, stepNumber);

  const isNotApplicable = stepNumber === 1;
  const isNotCaptured = !isNotApplicable && !BUNDLE_EXISTS[scenario].has(stepNumber);
  const hasBundle = !isNotApplicable && !isNotCaptured;

  const meta = (
    <span className="font-mono">
      {isNotApplicable
        ? 'Not applicable — supervisor intake step'
        : isNotCaptured
          ? 'Not captured for this run'
          : metaLoading
            ? 'Loading bundle…'
            : metaText}
    </span>
  );

  return (
    <ExpandableDrawer
      id={`bundle-${scenario}-${step.id}`}
      eyebrow="Bundle"
      title="Agent input bundle"
      meta={meta}
      open={open}
      onOpenChange={onOpenChange}
      tone="mono"
    >
      <div className="space-y-3 px-5 py-4">
        {isNotApplicable && (
          <p className="text-sm italic text-ink-500">
            Not applicable — STEP-01 is the deterministic supervisor intake; no bundle is dispatched
            to a domain agent.
          </p>
        )}
        {isNotCaptured && (
          <p className="text-sm italic text-ink-500">
            Not captured — pipeline halted before this agent dispatched in the recorded run.
          </p>
        )}
        {hasBundle && (
          <>
            <p className="text-[0.7rem] uppercase tracking-[0.08em] text-amber-500">
              Large file — opening this may briefly slow the demo page.
            </p>
            <DocumentViewer
              src={bundlePath(scenario, stepNumber)}
              title={bundleTitle(stepNumber, step.actor)}
              kind="json"
              label={bundleLabel(stepNumber)}
            />
          </>
        )}
      </div>
    </ExpandableDrawer>
  );
}

// ---- Audit Log drawer ----
// Scenario-level (not step-level) — the supervisor audit log captures the
// entire pipeline run. Expandable drawer reveals a DocumentViewer trigger;
// the viewer uses kind="json", matching how the vendor questionnaire is
// previewed elsewhere on the demo.

function AuditLogDrawer({
  scenario,
  open,
  onOpenChange,
}: {
  scenario: ScenarioId;
  open: boolean;
  onOpenChange: () => void;
}) {
  const n = scenarioNumber(scenario);
  const src = `/scenarios/scenario-${n}/supervisor_audit_log.json`;
  const title = `Full pipeline audit log — Scenario ${scenarioLabel(scenario)}`;
  const label = 'supervisor_audit_log.json';

  return (
    <ExpandableDrawer
      id={`audit-log-${scenario}`}
      eyebrow="Audit"
      title="Full pipeline audit log"
      meta={
        <span className="font-mono">
          Scenario {scenarioLabel(scenario)} · entire run trace
        </span>
      }
      open={open}
      onOpenChange={onOpenChange}
      tone="mono"
    >
      <div className="space-y-3 px-5 py-4">
        <p className="text-[0.7rem] uppercase tracking-[0.08em] text-amber-500">
          Large file — opening this may briefly slow the demo page.
        </p>
        <DocumentViewer src={src} title={title} kind="json" label={label} />
      </div>
    </ExpandableDrawer>
  );
}

// ---- Main export ----

export default function StepInspectionDrawers() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const expandedSections = useDemoCodexStore((s) => s.expandedSections);
  const toggleSection = useDemoCodexStore((s) => s.toggleSection);
  const isExpanded = (id: string) => expandedSections.has(id);

  // Local step selector — decoupled from the store's currentStep
  const [selectedStepNumber, setSelectedStepNumber] = useState<StepNumber>(1);

  // Reset to step 1 when scenario changes
  useEffect(() => {
    setSelectedStepNumber(1);
  }, [scenario]);

  const allSteps = scenarios[scenario].steps;
  const step = allSteps.find((s) => s.stepNumber === selectedStepNumber) as DemoStep;

  const rawOutId = `raw-${scenario}-${step.id}`;
  const docsId = `docs-${scenario}-${step.id}`;

  return (
    <div className="mt-12 grid min-w-0 grid-cols-1 gap-3 md:mt-16">
      <p className="eyebrow text-accent">
        Technical inspection · full document inputs/outputs throughout the pipeline
      </p>

      {/* Step selector */}
      <div className="flex flex-wrap gap-2">
        {allSteps.map((s) => (
          <StepSelectorPill
            key={s.id}
            step={s}
            selected={s.stepNumber === selectedStepNumber}
            onClick={() => setSelectedStepNumber(s.stepNumber)}
          />
        ))}
      </div>

      {/* Agent input bundle — expandable drawer wrapping a DocumentViewer trigger */}
      <AgentInputBundleDrawer
        scenario={scenario}
        step={step}
        open={isExpanded(`bundle-${scenario}-${step.id}`)}
        onOpenChange={() => toggleSection(`bundle-${scenario}-${step.id}`)}
      />

      {/* Full LLM domain agent output */}
      <ExpandableDrawer
        id={rawOutId}
        eyebrow="Output"
        title="Full LLM domain agent output (raw)"
        meta={
          <span className="font-mono">
            {Object.keys(step.output.structured).length} top-level fields ·{' '}
            {step.output.citations.length} citation
            {step.output.citations.length === 1 ? '' : 's'}
          </span>
        }
        open={isExpanded(rawOutId)}
        onOpenChange={() => toggleSection(rawOutId)}
        tone="mono"
      >
        <div className="p-4">
          <StructuredOutputViewer
            value={step.output.structured}
            citations={step.output.citations}
          />
        </div>
      </ExpandableDrawer>

      {/* Source document previews */}
      <ExpandableDrawer
        id={docsId}
        eyebrow="Documents"
        title="Source document previews"
        meta={
          <span className="font-mono">
            {step.retrievedEvidence.length} source
            {step.retrievedEvidence.length === 1 ? '' : 's'} · live document fetch
          </span>
        }
        open={isExpanded(docsId)}
        onOpenChange={() => toggleSection(docsId)}
        tone="mono"
      >
        <SourceDocumentsDrawer step={step} scenario={scenario} />
      </ExpandableDrawer>

      {/* Full pipeline audit log — scenario-level expandable drawer */}
      <AuditLogDrawer
        scenario={scenario}
        open={isExpanded(`audit-log-${scenario}`)}
        onOpenChange={() => toggleSection(`audit-log-${scenario}`)}
      />
    </div>
  );
}
