// Schema for the Demo page replay system.
// Real run artifacts will replace placeholder fixtures; the schema is the contract.

export type ScenarioId = 'clean' | 'escalated';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type StepActor =
  | 'Supervisor'
  | 'IT Security'
  | 'Legal'
  | 'Procurement'
  | 'Checklist Assembler'
  | 'Checkoff';

export type StepStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETE'
  | 'ESCALATED'
  | 'BLOCKED'
  | 'NOT_RUN';

export type RetrievalLane =
  | 'direct_structured' // matrix row / registry / manifest lookup
  | 'indexed_hybrid'    // dense + lexical, cross-encoder reranked
  | 'non_retrieval';    // already-governed upstream output

export type AuthorityTier = 1 | 2 | 3 | 4;

export type SourceType =
  | 'Policy document'
  | 'Trigger matrix'
  | 'Approval matrix'
  | 'Vendor questionnaire'
  | 'Contracts registry'
  | 'Stakeholder map'
  | 'Slack thread'
  | 'Precedent record'
  | 'Runtime state'
  | 'Required-source manifest'
  | 'Upstream determination';

export type SourceTreatment = 'primary' | 'supplementary' | 'excluded';

export interface RetrievedEvidenceItem {
  id: string;
  name: string;            // e.g. "ISP-001 §12.2"
  type: SourceType;
  lane: RetrievalLane;
  authorityTier: AuthorityTier;
  treatment: SourceTreatment;
  reason: string;          // why included / why excluded / why supplementary
  chunksRetrieved: number;
  chunksAdmitted: number;
}

export interface BundleEvidence {
  source: string;          // e.g. "ISP-001 §12.2 row M-02"
  tier: AuthorityTier;
  note: string;
}

export interface BundleItem {
  task: string;
  instructions: string[];
  evidence: BundleEvidence[];
  citations: string[];     // free-form citation strings
  permissions: string[];
  nonGoals: string[];
  outputContract: string[];
  excluded?: Array<{ source: string; reason: string }>;
}

export interface OutputCitation {
  field: string;
  source: string;
}

export interface AgentOutputPayload {
  summary: string;                          // plain-language determination
  structured: Record<string, unknown>;      // structured agent return
  citations: OutputCitation[];              // citations against fields in structured
}

export interface GateDecision {
  status: StepStatus;
  continueRun: boolean;
  reason: string;
  expectedContract: string[];
  contractValid: boolean;
}

export interface AuditEvent {
  timestamp: string;
  type: string;            // e.g. retrieval.requested, gate.passed, escalation.routed
  payload: string;
  detail?: string;
}

// Scripted supervisor narration per replay phase. Optional — not every phase
// needs custom narration; defaults will fill gaps.
export interface ReplayMoments {
  retrieving?: string;
  bundling?: string;
  dispatching?: string;
  agent_working?: string;
  output_ready?: string;
  gating?: string;
  decided?: string;
}

export interface DemoStep {
  id: string;
  stepNumber: StepNumber;
  title: string;             // long-form, e.g. "IT Security · Path classification"
  shortLabel: string;        // graph label, e.g. "IT Security"
  actor: StepActor;
  question: string;          // the agent's responsibility, one sentence
  governancePrinciple: string; // headline, e.g. "Policy outranks vendor wording"
  retrievedEvidence: RetrievedEvidenceItem[];
  bundle: BundleItem;
  output: AgentOutputPayload;
  gateDecision: GateDecision;
  auditEvents: AuditEvent[];
  replayMoments?: ReplayMoments;
  notRunReason?: string;     // populated when status === 'NOT_RUN'
  status: StepStatus;        // terminal status of this step in the recorded run
}

export interface SummaryChip {
  label: string;
  value: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}

export interface FinalChecklistItem {
  id: string;
  title: string;
  owner: string;
  status: 'resolved' | 'provisional' | 'blocker';
  detail?: string;
}

export interface FinalOutputs {
  status: StepStatus;
  approvalPath?: string;
  fastTrack?: 'APPROVED' | 'INELIGIBLE' | 'PENDING';
  haltedAt?: string;        // step id where the run halted, if escalated
  checklist: FinalChecklistItem[];
  blockers: Array<{
    id: string;
    title: string;
    owner: string;
    requiredAction: string;
    citation: string;
  }>;
  stakeholderGuidance: Array<{
    audience: string;
    nextStep: string;
  }>;
  artifactName: string;     // e.g. "Approval checklist · OptiChain · 2026-04-22"
}

export interface DemoScenario {
  id: ScenarioId;
  title: string;
  subtitle: string;
  outcome: 'COMPLETE' | 'ESCALATED' | 'BLOCKED';
  summaryChips: SummaryChip[];
  steps: DemoStep[];
  finalOutputs: FinalOutputs;
  takeaway: {
    headline: string;
    body: string;
    bullets: string[];
  };
}
