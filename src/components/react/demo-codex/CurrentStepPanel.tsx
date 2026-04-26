// Current step panel — composes the four narrative stages and the technical
// inspection drawers for whatever step is currently focused in the replay.
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import StatusPill from './StatusPill';
import StructuredOutputViewer from './StructuredOutputViewer';
import ExpandableDrawer from './ExpandableDrawer';
import { RetrievalStage, BundleStage, AgentStage, GateStage } from './stages';
import AuditEventsPanel from './AuditEventsPanel';
import SourceDocumentsDrawer from './SourceDocumentsDrawer';
import type { DemoStep } from '../../../data/demo-codex/types';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export default function CurrentStepPanel() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const phase = useDemoCodexStore((s) => s.phase);
  const isExpanded = useDemoCodexStore((s) => s.isExpanded);
  const toggleSection = useDemoCodexStore((s) => s.toggleSection);

  const step = scenarios[scenario].steps.find((s) => s.stepNumber === currentStep) as DemoStep;
  const prevented = step.status === 'NOT_RUN';

  const auditId = `audit-${scenario}-${step.id}`;
  const rawOutId = `raw-${scenario}-${step.id}`;
  const docsId = `docs-${scenario}-${step.id}`;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={`${scenario}-${step.id}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeUp}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        {/* Step heading */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
              {step.id} · {step.actor}
            </span>
            <StatusPill status={prevented ? 'NOT_RUN' : step.status} size="sm" />
          </div>
          <h2 className="display-balance mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink-900 md:text-display-sm">
            {step.governancePrinciple}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">{step.title}</p>
        </header>

        {/* Prevented banner */}
        {prevented && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-dashed border-ink-300 bg-paper-muted/40 p-5"
          >
            <p className="font-serif text-base text-ink-800">This step did not run</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{step.notRunReason}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-500">
                Gate decision —{' '}
              </span>
              {step.gateDecision.reason}
            </p>
          </motion.div>
        )}

        {/* Four narrative stages — gated on replay phase */}
        {!prevented && (
          <div className="grid gap-4">
            <RetrievalStage step={step} phase={phase} prevented={false} />
            <BundleStage step={step} phase={phase} prevented={false} />
            <AgentStage
              step={step}
              phase={phase}
              prevented={false}
              renderOutput={(s) => (
                <StructuredOutputViewer
                  value={s.output.structured}
                  citations={s.output.citations}
                />
              )}
            />
            <GateStage step={step} phase={phase} prevented={false} />
          </div>
        )}

        {/* Technical inspection drawers */}
        {!prevented && (
          <div className="grid gap-3">
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
        )}
      </motion.section>
    </AnimatePresence>
  );
}
