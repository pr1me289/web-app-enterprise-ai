// Technical inspection drawers for the focused step — audit events, raw structured
// output, and source document previews. Returns null for NOT_RUN steps.
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import StructuredOutputViewer from './StructuredOutputViewer';
import ExpandableDrawer from './ExpandableDrawer';
import AuditEventsPanel from './AuditEventsPanel';
import SourceDocumentsDrawer from './SourceDocumentsDrawer';
import type { DemoStep } from '../../../data/demo-codex/types';

export default function StepInspectionDrawers() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const isExpanded = useDemoCodexStore((s) => s.isExpanded);
  const toggleSection = useDemoCodexStore((s) => s.toggleSection);

  const step = scenarios[scenario].steps.find((s) => s.stepNumber === currentStep) as DemoStep;
  if (step.status === 'NOT_RUN') return null;

  const auditId = `audit-${scenario}-${step.id}`;
  const rawOutId = `raw-${scenario}-${step.id}`;
  const docsId = `docs-${scenario}-${step.id}`;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3">
      <p className="eyebrow mt-2 text-ink-400">Technical inspection · default closed</p>
      <ExpandableDrawer
        id={auditId}
        eyebrow="Audit"
        title="Audit events"
        meta={
          <span className="font-mono">
            {step.auditEvents.length} event{step.auditEvents.length === 1 ? '' : 's'} · structured trace
          </span>
        }
        open={isExpanded(auditId)}
        onOpenChange={() => toggleSection(auditId)}
      >
        <AuditEventsPanel events={step.auditEvents} />
      </ExpandableDrawer>

      <ExpandableDrawer
        id={rawOutId}
        eyebrow="Output"
        title="Full structured output (raw)"
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

      <ExpandableDrawer
        id={docsId}
        eyebrow="Documents"
        title="Source document previews"
        meta={
          <span className="font-mono">
            {step.retrievedEvidence.length} source
            {step.retrievedEvidence.length === 1 ? '' : 's'} · placeholder previews
          </span>
        }
        open={isExpanded(docsId)}
        onOpenChange={() => toggleSection(docsId)}
      >
        <SourceDocumentsDrawer step={step} />
      </ExpandableDrawer>
    </div>
  );
}
