// Current step panel — composes the four narrative stages for whatever step is
// currently focused in the replay. Technical inspection drawers live in a
// sibling component (StepInspectionDrawers) so DemoExperience can frame them
// independently.
import { motion } from 'framer-motion';
import { useDemoCodexStore } from './store';
import { scenarios } from '../../../data/demo-codex';
import StatusPill from './StatusPill';
import StructuredOutputViewer from './StructuredOutputViewer';
import { RetrievalStage, BundleStage, AgentStage, GateStage } from './stages';
import type { DemoStep } from '../../../data/demo-codex/types';

export default function CurrentStepPanel() {
  const scenario = useDemoCodexStore((s) => s.scenario);
  const currentStep = useDemoCodexStore((s) => s.currentStep);
  const phase = useDemoCodexStore((s) => s.phase);

  const step = scenarios[scenario].steps.find((s) => s.stepNumber === currentStep) as DemoStep;
  const prevented = step.status === 'NOT_RUN';

  return (
    <motion.section
      key={`${scenario}-${step.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-w-0 flex-col gap-5"
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

        {/* Narrative stages — gated on replay phase. Step-01 is the deterministic
            supervisor intake, so it skips bundle assembly and agent dispatch and
            renumbers the gate as Stage 2. */}
        {!prevented && (
          <div className="grid min-w-0 grid-cols-1 gap-4">
            <RetrievalStage step={step} phase={phase} prevented={false} />
            {step.stepNumber !== 1 && (
              <>
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
              </>
            )}
            <GateStage
              step={step}
              phase={phase}
              prevented={false}
              eyebrow={step.stepNumber === 1 ? 'Stage 2' : 'Stage 4'}
            />
          </div>
        )}

    </motion.section>
  );
}
