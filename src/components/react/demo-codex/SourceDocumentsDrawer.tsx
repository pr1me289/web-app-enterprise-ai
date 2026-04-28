// Renders one card per retrieved source for this step. Clicking a card opens
// the site-wide DocumentViewer dialog (same as the Overview page) in place of
// the old in-file custom dialog. Supported formats: .md → markdown, .json →
// json, .csv → sheet (via .xlsx sibling in public/mock-documents/).
// pipeline_state and no_file items render as plain non-interactive cards.
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { AuthorityBadge, LaneBadge, TreatmentBadge } from './badges';
import DocumentViewer, { type DocKind } from '../DocumentViewer';
import type { DemoStep, RetrievedEvidenceItem } from '../../../data/demo-codex/types';
import type { ScenarioId } from '../../../data/demo-codex/types';

// ---- Document path resolution ----

interface SheetOverrideShape {
  tabs?: string[];
  skipRowsPerSheet?: number[];
  firstCellOverrides?: string[];
  columnWidthsPerSheet?: (string[] | undefined)[];
}

type DocRef =
  | { kind: DocKind; src: string; title: string; overrides?: SheetOverrideShape }
  | { kind: 'note'; note: string };

const SCENARIO_NUMBER: Record<ScenarioId, string> = {
  clean: '1',
  escalated: '2',
  blocked: '3',
  escalated_step4: '4',
};

function scenarioNumber(scenario: ScenarioId): string {
  return SCENARIO_NUMBER[scenario];
}

function resolveDoc(name: string, scenario: ScenarioId): DocRef {
  const n = scenarioNumber(scenario);
  const base = `/scenarios/scenario-${n}/mock_documents`;

  // ISP-001 — IT Security Policy (.md)
  if (name.startsWith('IT Security Policy')) {
    return {
      kind: 'markdown',
      src: `${base}/IT_Security_Policy_V4.2.md`,
      title: 'IT Security Policy V4.2',
    };
  }

  // DPA Legal Trigger Matrix (.csv → .xlsx in /mock-documents/)
  if (name.startsWith('DPA Legal Trigger Matrix')) {
    return {
      kind: 'sheet',
      src: '/mock-documents/DPA_Legal_Trigger_Matrix_v1_3.xlsx',
      title: 'DPA Legal Trigger Matrix v1.3',
      overrides: {
        // Sheet 0 (Trigger Matrix) — drop the two-row title block (LICHEN
        // header + Document ID metadata) so the table starts at the ID |
        // Trigger Condition | … row.
        skipRowsPerSheet: [2, 0, 0, 0, 0],
        // Renumber the trailing tabs so the visible tab order matches the
        // section number. The source XLSX numbers these as 3/4/5/6 because
        // its legacy spec collapses Section 2 — fix to 2/3/4/5.
        firstCellOverrides: [
          '',
          'Section 2 — Regulatory Framework Reference',
          'Section 3 — Status Legend',
          'Section 4 — Procurement Workflow Integration',
          'Section 5 — Maintenance and Version History',
        ],
        columnWidthsPerSheet: [
          // Sheet 0 — Trigger Matrix: ID column kept narrow (just A-01,
          // B-01, etc.); long policy / clause columns get the largest share
          // so they wrap cleanly.
          ['5%', '14%', '14%', '12%', '9%', '17%', '17%', '12%'],
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
    };
  }

  // Procurement Approval Matrix (.csv → .xlsx in /mock-documents/)
  if (name.startsWith('Procurement Approval Matrix')) {
    return {
      kind: 'sheet',
      src: '/mock-documents/Procurement_Approval_Matrix_v2_0.xlsx',
      title: 'Procurement Approval Matrix v2.0',
      overrides: {
        // Sheet 0 (Approval Matrix) — drop the two-row title block (LICHEN
        // header + PROC-MATRIX-001 metadata) so the table starts at the
        // Class | Tier | … row.
        skipRowsPerSheet: [2, 0, 0, 0, 0, 0, 0],
        // Renumber sections downstream of Fast-Track Rules so the visible
        // tab order matches the section number (the source XLSX numbers
        // these as 5/6/7/8 because Section 4 covers procurement workflow
        // integration in the legacy spec — collapsed in this view).
        firstCellOverrides: [
          '',
          '',
          '',
          'Section 4 — Fast-Track Eligibility Rules',
          'Section 5 — OptiChain Classification',
          'Section 6 — Approval Workflow',
          'Section 7 — Version History',
        ],
        columnWidthsPerSheet: [
          // Sheet 0 — Approval Matrix: Class + Tier kept narrow; long
          // notes column gets the lion's share so it wraps cleanly.
          ['7%', '6%', '12%', '11%', '11%', '11%', '12%', '10%', '20%'],
          undefined,
          undefined,
          undefined,
          undefined,
          // Sheet 5 — Approval Workflow: Step column kept narrow.
          ['7%', '23%', '15%', '20%', '17%', '18%'],
          undefined,
        ],
      },
    };
  }

  // Vendor Questionnaire — OptiChain (.json)
  if (name.startsWith('Vendor Questionnaire')) {
    const filename =
      scenario === 'clean'
        ? 'OptiChain_VSQ_001_v2_1_scenario01.json'
        : scenario === 'blocked'
          ? 'OptiChain_VSQ_001_v2_1_blocked.json'
          : scenario === 'escalated_step4'
            ? 'OptiChain_VSQ_001_v2_1_escalated_step4.json'
            : 'OptiChain_VSQ_001_v2_1.json';
    return { kind: 'json', src: `${base}/${filename}`, title: 'OptiChain Vendor Security Questionnaire' };
  }

  // Stakeholder Map (.json)
  if (name.startsWith('Stakeholder Map')) {
    return {
      kind: 'json',
      src: `${base}/Stakeholder_Map_PRQ_2024_0047.json`,
      title: 'Stakeholder Map PRQ-2024-0047',
    };
  }

  // Slack Thread export (.md)
  if (name.startsWith('Slack Thread') || name.startsWith('Slack thread')) {
    const filename =
      scenario === 'clean' || scenario === 'blocked' || scenario === 'escalated_step4'
        ? 'Slack_Thread_Export_scenario01.md'
        : 'Slack_Thread_Export_001.md';
    return { kind: 'markdown', src: `${base}/${filename}`, title: 'Slack Thread Export' };
  }

  // Pipeline-state evidence — upstream agent outputs bundled into the context
  if (
    /STEP-0[1-6]/.test(name) ||
    name.includes('Upstream determination') ||
    name.includes('outputs') ||
    name.includes('checklist')
  ) {
    return {
      kind: 'note',
      note: 'This evidence is upstream pipeline state, not a source document. See the agent input bundle drawer for the bundled values.',
    };
  }

  // Checklist Template — not captured
  if (name.startsWith('Checklist Template')) {
    return { kind: 'note', note: 'Mock template not yet captured.' };
  }

  return { kind: 'note', note: 'No underlying mock document for this evidence type.' };
}

// ---- Source card markup (shared between interactive and non-interactive variants) ----

function SourceCardContent({
  item,
}: {
  item: RetrievedEvidenceItem;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[0.72rem] text-ink-900">{item.name}</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
            {item.type}
          </p>
        </div>
        <FileText size={14} className="shrink-0 text-ink-400" aria-hidden />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <AuthorityBadge tier={item.authorityTier} size="sm" />
        <LaneBadge lane={item.lane} size="sm" />
        <TreatmentBadge treatment={item.treatment} size="sm" />
      </div>
      <p className="text-[0.7rem] leading-relaxed text-ink-600">{item.reason}</p>
    </>
  );
}

// ---- Source card + dialog ----

export default function SourceDocumentsDrawer({
  step,
  scenario,
}: {
  step: DemoStep;
  scenario: ScenarioId;
}) {
  if (step.retrievedEvidence.length === 0) {
    return (
      <p className="px-5 py-4 text-sm italic text-ink-500">No sources retrieved for this step.</p>
    );
  }
  return (
    <div className="grid gap-3 p-5 md:grid-cols-2">
      {step.retrievedEvidence.map((item) => (
        <SourceCard key={item.id} item={item} scenario={scenario} />
      ))}
    </div>
  );
}

function SourceCard({
  item,
  scenario,
}: {
  item: RetrievedEvidenceItem;
  scenario: ScenarioId;
}) {
  const doc = resolveDoc(item.name, scenario);

  // Non-interactive card for pipeline state / no-file evidence
  if (doc.kind === 'note') {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper p-3 text-left shadow-soft">
        <SourceCardContent item={item} />
        <p className="mt-1 rounded-lg border border-dashed border-ink-200 bg-paper-muted/40 px-3 py-2 text-[0.68rem] italic text-ink-500">
          {doc.note}
        </p>
      </div>
    );
  }

  // Interactive card — the card itself is the DocumentViewer trigger
  const cardTrigger = (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper p-3 text-left shadow-soft transition-colors hover:border-ink-300"
    >
      <SourceCardContent item={item} />
      <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">
        Open preview →
      </span>
    </motion.button>
  );

  return (
    <DocumentViewer
      src={doc.src}
      title={doc.title}
      kind={doc.kind}
      label={item.name}
      overrides={doc.overrides}
      trigger={cardTrigger}
    />
  );
}
