// Blocked run scenario — pipeline halts at STEP-04 (Procurement) because the
// Procurement Approval Matrix (PAM-001) is not registered in the index. The
// router fails closed, the bundle's approval-matrix payload arrives empty,
// and the Procurement agent emits status=blocked. STEP-05 and STEP-06 never
// run. Sourced from the captured run in scenario_blocked_demo/ (run_500e817423,
// 2026-04-28T02:11:39Z → 2026-04-28T02:11:48Z).
import type { DemoScenario } from '../types';

export const blockedScenario: DemoScenario = {
  id: 'blocked',
  title: 'Missing source · BLOCKED',
  subtitle:
    'OptiChain submits a complete questionnaire with a regulated, direct-API ERP integration. STEP-02 and STEP-03 complete cleanly, but at STEP-04 the Procurement Approval Matrix is absent from the index registry. The router fails closed, the bundle arrives without approval-matrix rows, and the Procurement agent emits BLOCKED. The pipeline halts; STEP-05 and STEP-06 never run.',
  outcome: 'BLOCKED',
  summaryChips: [
    { label: 'Run status', value: 'BLOCKED', tone: 'danger' },
    { label: 'Halted at', value: 'STEP-04 · Procurement', tone: 'warning' },
    { label: 'Fast-track', value: 'INELIGIBLE', tone: 'warning' },
    { label: 'Blockers', value: '1', tone: 'danger' },
    { label: 'Escalation owner', value: 'Data Engineering', tone: 'warning' },
  ],
  steps: [
    {
      id: 'STEP-01',
      stepNumber: 1,
      title: 'Intake validation',
      shortLabel: 'Intake',
      actor: 'Supervisor',
      question:
        'Is the questionnaire present, complete, and uniquely versioned for this PRQ?',
      governancePrinciple: 'Nothing begins without the questionnaire',
      retrievedEvidence: [
        {
          id: 'vq-oc-001-intake-blk',
          name: 'Vendor Questionnaire · VSQ-001',
          type: 'Vendor questionnaire',
          lane: 'direct_structured',
          authorityTier: 2,
          treatment: 'primary',
          reason:
            'Supervisor reads VQ-OC-001 directly via vq_direct_access to verify existence (R01-SQ-01), required-field completeness (R01-SQ-02), and version conflict absence (R01-SQ-03) before any domain agent is dispatched.',
          chunksRetrieved: 3,
          chunksAdmitted: 3,
        },
      ],
      bundle: {
        task: 'Verify questionnaire exists, is complete, and has no version conflict before launching domain review.',
        instructions: [
          'Run R01-SQ-01 — confirm a vendor questionnaire exists for this PRQ.',
          'Run R01-SQ-02 — confirm all required intake fields are present and non-null.',
          'Run R01-SQ-03 — confirm there is no version conflict between submissions.',
        ],
        evidence: [
          {
            source: 'VQ-OC-001 · VSQ-001 — Vendor Questionnaire',
            tier: 2,
            note: 'Questionnaire submitted 2024-03-04; all required fields present.',
          },
        ],
        citations: ['VQ-OC-001'],
        permissions: [
          'Read VQ-OC-001 (this PRQ only via vq_direct_access)',
          'Write to PipelineState.intake_status',
        ],
        nonGoals: ['Do not classify the data path — that is STEP-02.'],
        outputContract: [
          'questionnaire_exists: boolean',
          'questionnaire_complete: boolean',
          'version_conflict_detected: boolean',
          'submission_id: string',
          'submission_timestamp: string',
          'vendor_name: string',
          'status: complete | blocked',
        ],
      },
      output: {
        summary:
          'Questionnaire VSQ-001 exists, all required intake fields present, no version conflict. Pipeline cleared to launch domain review.',
        plainSummary:
          "We received the vendor questionnaire and confirmed it's complete and ready for review. The pipeline can begin its work.",
        structured: {
          status: 'complete',
          questionnaire_exists: true,
          questionnaire_complete: true,
          version_conflict_detected: false,
          submission_id: 'VSQ-001',
          submission_timestamp: '2024-03-04',
          vendor_name: 'OptiChain, Inc.',
        },
        citations: [{ field: 'submission_id', source: 'VQ-OC-001' }],
      },
      gateDecision: {
        status: 'COMPLETE',
        continueRun: true,
        reason: 'All three intake subqueries passed; questionnaire admissible; advance to STEP-02.',
        expectedContract: [
          'questionnaire_exists',
          'questionnaire_complete',
          'version_conflict_detected',
          'submission_id',
          'submission_timestamp',
          'vendor_name',
          'status',
        ],
        contractValid: true,
      },
      auditEvents: [
        { timestamp: '2026-04-28T02:11:39Z', type: 'RUN_EVENT', payload: 'Pipeline initialized · manifest_version=CC-001-v1.4' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-01 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R01-SQ-01 · lane=direct_structured · source=VQ-OC-001 · output=questionnaire_exists · admitted=3' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R01-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=questionnaire_complete · admitted=10' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R01-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=version_conflict_detected · admitted=2' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'DETERMINATION', payload: 'step_id=STEP-01 · questionnaire_valid=true · vendor_name=OptiChain, Inc. · status=COMPLETE' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-01 · from=IN_PROGRESS · to=COMPLETE' },
      ],
      replayMoments: {
        retrieving: 'Supervisor reading VQ-OC-001 via direct field lookup.',
        bundling: 'Assembling intake-validation evidence (R01-SQ-01, -02, -03).',
        dispatching: 'Dispatching to Supervisor (deterministic intake gate).',
        agent_working: 'Verifying existence, completeness, and version conflict.',
        output_ready: 'questionnaire_exists=true · questionnaire_complete=true · version_conflict_detected=false.',
        gating: 'Validating output contract against intake schema.',
        decided: 'Gate passed → advance to STEP-02.',
      },
      status: 'COMPLETE',
    },
    {
      id: 'STEP-02',
      stepNumber: 2,
      title: 'IT Security · Path classification',
      shortLabel: 'IT Security',
      actor: 'IT Security',
      question: 'What ERP integration tier does this vendor describe, and is fast-track eligible?',
      governancePrinciple: 'Policy outranks vendor wording',
      retrievedEvidence: [
        {
          id: 'vq-oc-001-it',
          name: 'Vendor Questionnaire · VSQ-001 · integration fields',
          type: 'Vendor questionnaire',
          lane: 'direct_structured',
          authorityTier: 2,
          treatment: 'primary',
          reason:
            'Direct-structured access to VQ-OC-001 fields the agent needs: integration type, NDA status, regulated-data fields. ERP integration described as direct OAuth API to SAP S/4HANA OData.',
          chunksRetrieved: 7,
          chunksAdmitted: 7,
        },
        {
          id: 'isp-001-tiers',
          name: 'IT Security Policy ISP-001 · §3, §4, §5, §6, §7, §12, §17',
          type: 'Policy document',
          lane: 'indexed_hybrid',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'Hybrid retrieval over the IT Security Policy returns the integration-tier and data-classification rule sections. ISP-001 §12.2 governs ERP integration; §5 governs data classification; §12.1 governs vendor onboarding pre-engagement requirements.',
          chunksRetrieved: 13,
          chunksAdmitted: 13,
        },
      ],
      bundle: {
        task: 'Classify the integration tier and data classification, then determine fast-track eligibility per ISP-001 §12.2 and §8.6.',
        instructions: [
          'Apply ISP-001 §12.2 integration-tier rules — DIRECT_API to ERP qualifies as TIER_1.',
          'Apply ISP-001 §5 data-classification rules — ERP-connected, sensitive, or regulated data → REGULATED.',
          'Apply ISP-001 §8.6 fast-track rule — REGULATED or TIER_1 disqualifies fast-track.',
          'Cite the policy section that governs each determination.',
        ],
        evidence: [
          {
            source: 'VQ-OC-001 integration_description — Vendor Questionnaire',
            tier: 2,
            note: 'Direct OAuth API integration to SAP S/4HANA OData; production order data, MRP outputs, inventory positions.',
          },
          {
            source: 'ISP-001 §12.2 — IT Security Policy',
            tier: 1,
            note: 'TIER_1 ERP integrations require CISO + CIO written approval, penetration test, SOC 2 Type II, quarterly access review.',
          },
          {
            source: 'ISP-001 §5 — IT Security Policy',
            tier: 1,
            note: 'ERP-connected operational data classified as REGULATED.',
          },
          {
            source: 'ISP-001 §12.1.3 — IT Security Policy',
            tier: 1,
            note: 'Vendors handling RESTRICTED/REGULATED data must provide valid SOC 2 Type II within 12 months.',
          },
        ],
        citations: ['ISP-001 §12.2', 'ISP-001 §5', 'ISP-001 §12.1.3', 'VQ-OC-001'],
        permissions: ['Read VQ-OC-001', 'Read ISP-001'],
        nonGoals: [
          'Do not evaluate DPA — that is STEP-03.',
          'Do not assemble approval routing — that is STEP-04.',
        ],
        outputContract: [
          'integration_type_normalized: ENUM',
          'integration_tier: TIER_1 | TIER_2 | TIER_3',
          'data_classification: REGULATED | RESTRICTED | UNREGULATED',
          'fast_track_eligible: boolean',
          'fast_track_rationale: ENUM',
          'security_followup_required: boolean',
          'required_security_actions: SecurityAction[]',
          'policy_citations: PolicyCitation[]',
          'status: complete | escalated | blocked',
        ],
      },
      output: {
        summary:
          'Integration normalized to DIRECT_API (TIER_1). Data classification REGULATED. Fast-track ineligible — DISALLOWED_INTEGRATION_RISK per ISP-001 §12.2. Four mandatory security actions queued (full security review, SOC 2 validation, penetration test, quarterly access review). NDA confirmed EXECUTED.',
        plainSummary:
          'OptiChain wants to plug directly into our ERP, which is the highest-risk integration tier and brings regulated data into scope. That rules out the fast-track path. The agent flagged four mandatory security activities (full review, SOC 2 check, pentest, quarterly access review) and confirmed the NDA is in place.',
        structured: {
          integration_type_normalized: 'DIRECT_API',
          integration_tier: 'TIER_1',
          data_classification: 'REGULATED',
          eu_personal_data_present: false,
          fast_track_eligible: false,
          fast_track_rationale: 'DISALLOWED_INTEGRATION_RISK',
          security_followup_required: true,
          nda_status_from_questionnaire: 'EXECUTED',
          required_security_actions: [
            {
              action_type: 'FULL_SECURITY_REVIEW',
              reason:
                'TIER_1 direct ERP integration with REGULATED data classification requires mandatory CISO + CIO written approval, penetration testing, and SOC 2 Type II certification per ISP-001 §12.2',
              owner: 'IT Security',
            },
            {
              action_type: 'SOC_2_VALIDATION',
              reason:
                'Vendor handling RESTRICTED/REGULATED data via direct ERP connection must provide valid SOC 2 Type II report or ISO 27001 certification within preceding 12 months per ISP-001 §12.1.3',
              owner: 'IT Security',
            },
            {
              action_type: 'PENETRATION_TEST',
              reason:
                'TIER_1 direct API integration requires mandatory penetration test prior to contract execution per ISP-001 §12.2',
              owner: 'IT Security',
            },
            {
              action_type: 'QUARTERLY_ACCESS_REVIEW',
              reason: 'TIER_1 integration requires quarterly access review schedule per ISP-001 §12.2',
              owner: 'IT Security',
            },
          ],
          policy_citations: [
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_12', section_id: '12.2', citation_class: 'PRIMARY' },
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_5', section_id: '5', citation_class: 'PRIMARY' },
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_12', section_id: '12.1.3', citation_class: 'PRIMARY' },
          ],
          status: 'complete',
        },
        citations: [
          { field: 'integration_tier', source: 'ISP-001 §12.2' },
          { field: 'data_classification', source: 'ISP-001 §5' },
          { field: 'fast_track_eligible', source: 'ISP-001 §12.2' },
          { field: 'required_security_actions', source: 'ISP-001 §12.1.3' },
        ],
      },
      gateDecision: {
        status: 'COMPLETE',
        continueRun: true,
        reason:
          'All output-contract fields populated; classifications policy-cited; fast-track correctly disqualified. Advance to STEP-03.',
        expectedContract: [
          'integration_type_normalized',
          'integration_tier',
          'data_classification',
          'fast_track_eligible',
          'fast_track_rationale',
          'security_followup_required',
          'required_security_actions',
          'policy_citations',
          'status',
        ],
        contractValid: true,
      },
      auditEvents: [
        { timestamp: '2026-04-28T02:11:39Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-02 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R02-SQ-01 · lane=direct_structured · source=VQ-OC-001 · output=integration_inputs · admitted=3' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R02-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=regulated_data_inputs · admitted=2' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R02-SQ-04 · lane=indexed_hybrid · source=ISP-001 · output=erp_tier_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R02-SQ-05 · lane=indexed_hybrid · source=ISP-001 · output=data_classification_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:11:39Z', type: 'RETRIEVAL', payload: 'R02-SQ-06 · lane=indexed_hybrid · source=ISP-001 · output=fast_track_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'DETERMINATION', payload: 'step_id=STEP-02 · integration_tier=TIER_1 · data_classification=REGULATED · fast_track_eligible=false · status=complete' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-02 · from=IN_PROGRESS · to=COMPLETE' },
      ],
      replayMoments: {
        retrieving: 'Pulling integration fields from VQ-OC-001 and tier rules from ISP-001.',
        bundling: 'Assembling IT Security bundle · 7 questionnaire fields · 13 policy chunks.',
        dispatching: 'Dispatching to IT Security agent.',
        agent_working: 'Classifying integration tier and data class against §12.2 and §5.',
        output_ready: 'TIER_1 · REGULATED · fast_track_eligible=false · 4 security actions queued.',
        gating: 'Validating output contract; all required fields populated and policy-cited.',
        decided: 'Gate passed → advance to STEP-03.',
      },
      status: 'COMPLETE',
    },
    {
      id: 'STEP-03',
      stepNumber: 3,
      title: 'Legal · Compliance triggers',
      shortLabel: 'Legal',
      actor: 'Legal',
      question:
        'Are a DPA or NDA legally required, and is anything blocking contract execution?',
      governancePrinciple: 'Legal triggers come from the matrix, not inference',
      retrievedEvidence: [
        {
          id: 'step-02-passthrough',
          name: 'STEP-02 · IT Security determination',
          type: 'Upstream determination',
          lane: 'non_retrieval',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'STEP-02 output is consumed verbatim — data_classification, integration_tier, eu_personal_data_present, nda_status_from_questionnaire — to inform DPA/NDA evaluation without re-deriving them.',
          chunksRetrieved: 3,
          chunksAdmitted: 3,
        },
        {
          id: 'vq-oc-001-legal',
          name: 'Vendor Questionnaire · VSQ-001 · legal fields',
          type: 'Vendor questionnaire',
          lane: 'direct_structured',
          authorityTier: 2,
          treatment: 'primary',
          reason:
            'Direct-structured access to data_subjects_eu, eu_personal_data_flag, existing_nda_status, dpa_required, dpa_status — the inputs needed to evaluate DPA-TM-001 row applicability and NDA execution.',
          chunksRetrieved: 3,
          chunksAdmitted: 3,
        },
        {
          id: 'dpa-tm-001-rows',
          name: 'DPA Legal Trigger Matrix DPA-TM-001 · rows A-01, A-03, A-04, A-05, B-01',
          type: 'Trigger matrix',
          lane: 'indexed_hybrid',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'R03-SQ-04 hybrid query against the DPA matrix. Branch fires on REGULATED upstream classification. Five rows retrieved and evaluated; none match because eu_personal_data_flag=false and data_subjects_eu=false.',
          chunksRetrieved: 5,
          chunksAdmitted: 5,
        },
        {
          id: 'isp-001-nda',
          name: 'IT Security Policy ISP-001 · §3, §4, §5, §7, §12 (NDA clauses)',
          type: 'Policy document',
          lane: 'indexed_hybrid',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'Hybrid retrieval to confirm the NDA-execution requirement governing onboarding before information exchange. ISP-001 §12.1.4 is the controlling clause; NDA already executed in this run.',
          chunksRetrieved: 5,
          chunksAdmitted: 5,
        },
      ],
      bundle: {
        task: 'Determine whether a DPA is required, evaluate NDA execution status, and surface any contract blockers.',
        instructions: [
          'Inherit STEP-02 output verbatim — do not re-classify.',
          'Apply DPA-TM-001 row admissibility — a row applies only if its trigger conditions match the questionnaire.',
          'If no row matches, dpa_required = false and dpa_blocker = false.',
          'Evaluate NDA status against ISP-001 §12.1.4 — EXECUTED clears the blocker.',
          'Cite the controlling matrix row or policy section for each determination.',
        ],
        evidence: [
          { source: 'STEP-02 output — Upstream IT Security determination', tier: 1, note: 'data_classification=REGULATED · eu_personal_data_present=false · nda_status_from_questionnaire=EXECUTED.' },
          { source: 'VQ-OC-001 legal fields — Vendor Questionnaire', tier: 2, note: 'eu_personal_data_flag=false · data_subjects_eu=false · existing_nda_status=EXECUTED.' },
          { source: 'DPA-TM-001 rows A-01, A-03, A-04, A-05, B-01 — DPA Legal Trigger Matrix', tier: 1, note: 'No row matches — EU-conditional triggers do not fire when eu_personal_data_flag=false.' },
          { source: 'ISP-001 §12.1.4 — IT Security Policy', tier: 1, note: 'NDA execution governs information-exchange phase; EXECUTED → no blocker.' },
        ],
        citations: ['DPA-TM-001', 'ISP-001 §12.1.4', 'STEP-02', 'VQ-OC-001'],
        permissions: ['Read STEP-02 output', 'Read VQ-OC-001', 'Read DPA-TM-001', 'Read ISP-001'],
        nonGoals: [
          'Do not re-derive STEP-02 classifications.',
          'Do not assemble approval routing — that is STEP-04.',
        ],
        outputContract: [
          'dpa_required: boolean',
          'dpa_blocker: boolean',
          'nda_status: ENUM',
          'nda_blocker: boolean',
          'trigger_rule_cited: TriggerRow[]',
          'policy_citations: PolicyCitation[]',
          'status: complete | escalated | blocked',
        ],
      },
      output: {
        summary:
          'No DPA matrix row matches — eu_personal_data_flag=false and data_subjects_eu=false, so the EU-conditional triggers do not fire. DPA not required, no DPA blocker. NDA EXECUTED per VQ-OC-001 and ISP-001 §12.1.4 — no NDA blocker. Status complete.',
        plainSummary:
          'No EU personal data is involved, so a Data Processing Agreement is not legally required. The NDA is already signed. There are no legal blockers — the run can proceed to procurement.',
        structured: {
          dpa_required: false,
          dpa_blocker: false,
          nda_status: 'EXECUTED',
          nda_blocker: false,
          trigger_rule_cited: [],
          policy_citations: [
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_12', section_id: '12.1.4', citation_class: 'PRIMARY' },
          ],
          status: 'complete',
        },
        citations: [
          { field: 'dpa_required', source: 'DPA-TM-001 (no matching row)' },
          { field: 'nda_status', source: 'ISP-001 §12.1.4' },
        ],
      },
      gateDecision: {
        status: 'COMPLETE',
        continueRun: true,
        reason: 'DPA not required; NDA executed; no contract blockers. Advance to STEP-04.',
        expectedContract: [
          'dpa_required',
          'dpa_blocker',
          'nda_status',
          'nda_blocker',
          'trigger_rule_cited',
          'policy_citations',
          'status',
        ],
        contractValid: true,
      },
      auditEvents: [
        { timestamp: '2026-04-28T02:11:45Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-03 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'RETRIEVAL', payload: 'R03-SQ-01 · lane=runtime_read · source=STEP-02 · output=upstream_security · admitted=3' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'RETRIEVAL', payload: 'R03-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=eu_inputs · admitted=2' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'RETRIEVAL', payload: 'R03-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=nda_inputs · admitted=1' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'RETRIEVAL', payload: 'R03-SQ-04 · lane=indexed_hybrid · source=DPA-TM-001 · output=dpa_trigger_rows · admitted=5' },
        { timestamp: '2026-04-28T02:11:45Z', type: 'RETRIEVAL', payload: 'R03-SQ-05 · lane=indexed_hybrid · source=ISP-001 · output=nda_clause_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'DETERMINATION', payload: 'step_id=STEP-03 · dpa_required=false · nda_status=EXECUTED · status=complete' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-03 · from=IN_PROGRESS · to=COMPLETE' },
      ],
      replayMoments: {
        retrieving: 'Reading STEP-02 output, legal fields from VQ-OC-001, DPA matrix rows, NDA clauses.',
        bundling: 'Assembling Legal bundle · 5 DPA rows · 5 NDA chunks.',
        dispatching: 'Dispatching to Legal agent.',
        agent_working: 'Evaluating DPA row applicability and NDA execution status.',
        output_ready: 'dpa_required=false · nda_status=EXECUTED · no blockers.',
        gating: 'Validating output contract; advance condition met.',
        decided: 'Gate passed → advance to STEP-04.',
      },
      status: 'COMPLETE',
    },
    {
      id: 'STEP-04',
      stepNumber: 4,
      title: 'Procurement · Approval routing',
      shortLabel: 'Procurement',
      actor: 'Procurement',
      question: 'Which approval path applies for this vendor and integration profile?',
      governancePrinciple: 'No registered source → no silent invention',
      retrievedEvidence: [
        {
          id: 'step-02-pass',
          name: 'STEP-02 · IT Security output',
          type: 'Upstream determination',
          lane: 'non_retrieval',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'Carries integration_tier=TIER_1, data_classification=REGULATED, fast_track_eligible=false. Required for vendor-class / integration-tier matrix lookup.',
          chunksRetrieved: 6,
          chunksAdmitted: 6,
        },
        {
          id: 'step-03-pass',
          name: 'STEP-03 · Legal output',
          type: 'Upstream determination',
          lane: 'non_retrieval',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'Carries dpa_required=false and nda_status=EXECUTED — needed to determine whether legal posture gates the approval path.',
          chunksRetrieved: 7,
          chunksAdmitted: 7,
        },
        {
          id: 'vq-oc-001-proc',
          name: 'Vendor Questionnaire · VSQ-001 · vendor relationship',
          type: 'Vendor questionnaire',
          lane: 'direct_structured',
          authorityTier: 2,
          treatment: 'primary',
          reason:
            'Vendor class, deal size, and contract details for the (vendor_class, integration_tier, deal_size) primary key into the approval matrix.',
          chunksRetrieved: 4,
          chunksAdmitted: 4,
        },
        {
          id: 'pam-001-missing',
          name: 'Procurement Approval Matrix · PAM-001',
          type: 'Approval matrix',
          lane: 'indexed_hybrid',
          authorityTier: 1,
          treatment: 'excluded',
          reason:
            'Source PAM-001 is not registered in data/indexes/scenario_blocked_demo/index_registry.json. Router caught KeyError, returned denied=true with reason "Source \'PAM-001\' not found in index registry." Bundle\'s approval_path_matrix_rows arrives empty.',
          chunksRetrieved: 0,
          chunksAdmitted: 0,
        },
        {
          id: 'slk-001-procurement',
          name: 'Slack thread SLK-001',
          type: 'Slack thread',
          lane: 'indexed_hybrid',
          authorityTier: 3,
          treatment: 'supplementary',
          reason:
            'OptiChain procurement context across three threads (T1, T2, T3). A fourth thread (T4) discussing Greenbrook Catering — a different vendor on PRQ-2024-0051 — was retrieved and explicitly excluded by the bundle assembler.',
          chunksRetrieved: 4,
          chunksAdmitted: 3,
        },
      ],
      bundle: {
        task: 'Determine the approval path and assemble required approvers using upstream determinations and PAM-001.',
        instructions: [
          'Apply PAM-001 strict primary-key match on (vendor_class, integration_tier, deal_size).',
          'Assemble required_approvals[] from the matched row.',
          'Pass through fast_track_eligible from STEP-02 unchanged.',
          'If approval_path_matrix_rows is empty, emit status=blocked per Procurement Agent Spec §10.',
        ],
        evidence: [
          { source: 'STEP-02 output — Upstream IT Security determination', tier: 1, note: 'TIER_1 · REGULATED · fast_track_eligible=false.' },
          { source: 'STEP-03 output — Upstream Legal determination', tier: 1, note: 'dpa_required=false · nda_status=EXECUTED · no blockers.' },
          { source: 'VQ-OC-001 vendor relationship — Vendor Questionnaire', tier: 2, note: 'Class A enterprise vendor; direct API integration; production deal.' },
        ],
        citations: ['STEP-02', 'STEP-03', 'VQ-OC-001'],
        permissions: ['Read STEP-02 output', 'Read STEP-03 output', 'Read VQ-OC-001', 'Query PAM-001 (denied)', 'Read SLK-001'],
        nonGoals: [
          'Do not invent approval rows that the matrix does not return.',
          'Do not re-evaluate legal or security determinations.',
        ],
        outputContract: [
          'approval_path: STANDARD | FAST_TRACK',
          'fast_track_eligible: boolean',
          'required_approvals: ApproverEntry[]',
          'estimated_timeline: string',
          'policy_citations: PolicyCitation[]',
          'status: complete | escalated | blocked',
        ],
        excluded: [
          {
            source: 'PAM-001 — Procurement Approval Matrix',
            reason:
              "Router denied: \"Source 'PAM-001' not found in index registry.\" The matrix file exists in mock_documents/ but was not ingested into the live index — registry-driven fail-closed.",
          },
          {
            source: 'SLK-001 thread T4 — Slack Thread Export (Greenbrook Catering)',
            reason: 'Off-topic — different vendor (PRQ-2024-0051). Excluded by bundle assembler.',
          },
        ],
      },
      output: {
        summary:
          'Procurement agent emitted status=blocked. Bundle\'s approval_path_matrix_rows is empty because PAM-001 was denied at retrieval (not in index registry). Four output-contract fields could not be populated: required_approvals, policy_citations, fast_track_eligible, estimated_timeline. The agent did not invent rows.',
        plainSummary:
          'The Procurement Approval Matrix — the document that tells the system which approvals are needed for this kind of vendor — is missing from the index. The agent has no rows to consult, refuses to make them up, and reports BLOCKED. The pipeline halts here.',
        structured: {
          status: 'blocked',
          errors: [
            'required_approvals',
            'policy_citations',
            'fast_track_eligible',
            'estimated_timeline',
          ],
        },
        citations: [],
      },
      gateDecision: {
        status: 'BLOCKED',
        continueRun: false,
        reason:
          'Output contract invalid — four required fields missing because PAM-001 was denied at retrieval. Per Procurement Agent Spec §10, missing primary source triggers BLOCKED. Supervisor halts; STEP-05 and STEP-06 do not run.',
        expectedContract: [
          'approval_path',
          'fast_track_eligible',
          'required_approvals',
          'estimated_timeline',
          'policy_citations',
          'status',
        ],
        contractValid: false,
      },
      auditEvents: [
        { timestamp: '2026-04-28T02:11:47Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-04 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-01 · lane=runtime_read · source=STEP-02 · output=it_security_output · admitted=6' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-02 · lane=runtime_read · source=STEP-03 · output=legal_output · admitted=7' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=vendor_relationship · admitted=4' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-04 · lane=indexed_hybrid · source=PAM-001 · output=approval_matrix_rows · admitted=0 · denied="Source not in index registry"' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-05 · lane=indexed_hybrid · source=PAM-001 · output=fast_track_routing_rows · admitted=0 · denied="Source not in index registry"' },
        { timestamp: '2026-04-28T02:11:47Z', type: 'RETRIEVAL', payload: 'R04-SQ-06 · lane=indexed_hybrid · source=SLK-001 · output=slack_procurement · admitted=4' },
        { timestamp: '2026-04-28T02:11:48Z', type: 'DETERMINATION', payload: 'step_id=STEP-04 · status=blocked · errors=[required_approvals, policy_citations, fast_track_eligible, estimated_timeline]' },
        { timestamp: '2026-04-28T02:11:48Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-04 · from=IN_PROGRESS · to=BLOCKED · reason="Invalid STEP-04 output"' },
        { timestamp: '2026-04-28T02:11:48Z', type: 'RUN_EVENT', payload: 'Pipeline halted in blocked state · overall_status=BLOCKED' },
      ],
      replayMoments: {
        retrieving: 'Issuing matrix query against PAM-001 — registry lookup fails closed.',
        bundling: 'Assembling Procurement bundle — approval_path_matrix_rows arrives empty.',
        dispatching: 'Dispatching to Procurement agent with empty matrix payload.',
        agent_working: 'Agent evaluates: no rows → cannot populate required_approvals, fast_track, timeline, citations.',
        output_ready: 'status=blocked · errors=[required_approvals, policy_citations, fast_track_eligible, estimated_timeline].',
        gating: 'Output contract invalid · BLOCKED is terminal · halt downstream.',
        decided: 'Gate held · STEP-05 and STEP-06 do not run.',
      },
      status: 'BLOCKED',
    },
    {
      id: 'STEP-05',
      stepNumber: 5,
      title: 'Checklist assembly',
      shortLabel: 'Checklist',
      actor: 'Checklist Assembler',
      question:
        'What does the final structured checklist look like for stakeholders to consume?',
      governancePrinciple: 'The checklist is what stakeholders actually consume',
      retrievedEvidence: [],
      bundle: {
        task: '',
        instructions: [],
        evidence: [],
        citations: [],
        permissions: [],
        nonGoals: [],
        outputContract: [],
      },
      output: { summary: '', structured: {}, citations: [] },
      gateDecision: {
        status: 'NOT_RUN',
        continueRun: false,
        reason: 'Did not execute. Pipeline halted upstream at STEP-04 (BLOCKED).',
        expectedContract: [],
        contractValid: false,
      },
      auditEvents: [],
      notRunReason:
        'Checklist assembly cannot proceed without a resolved approval path. STEP-04 produced BLOCKED because PAM-001 is not in the index registry; the supervisor preserves this absence rather than fabricating a partial checklist.',
      status: 'NOT_RUN',
    },
    {
      id: 'STEP-06',
      stepNumber: 6,
      title: 'Checkoff · Stakeholder guidance',
      shortLabel: 'Checkoff',
      actor: 'Checkoff',
      question:
        'Who needs to be notified, and what action does each owner take next?',
      governancePrinciple: 'Closure routes to humans with explicit next steps',
      retrievedEvidence: [],
      bundle: {
        task: '',
        instructions: [],
        evidence: [],
        citations: [],
        permissions: [],
        nonGoals: [],
        outputContract: [],
      },
      output: { summary: '', structured: {}, citations: [] },
      gateDecision: {
        status: 'NOT_RUN',
        continueRun: false,
        reason: "Did not execute. The blocker package emitted at STEP-04 is the run's final artifact.",
        expectedContract: [],
        contractValid: false,
      },
      auditEvents: [],
      notRunReason:
        'Stakeholder closure cannot run without a checklist. STEP-04 BLOCKED is the terminal status; the surfaced blocker package itself is what routes to Data Engineering for ingestion remediation.',
      status: 'NOT_RUN',
    },
  ],
  finalOutputs: {
    status: 'BLOCKED',
    fastTrack: 'INELIGIBLE',
    haltedAt: 'STEP-04',
    artifactName: 'Blocker package · OptiChain · PRQ-2024-0047',
    checklist: [
      {
        id: 'CHK-01',
        title: 'Intake artifacts validated',
        owner: 'Procurement Operations',
        status: 'resolved',
      },
      {
        id: 'CHK-02',
        title: 'Integration classified · TIER_1 · REGULATED · fast-track INELIGIBLE',
        owner: 'IT Security',
        status: 'resolved',
        detail:
          'Direct OAuth API to SAP S/4HANA OData. Four mandatory security activities queued (full review, SOC 2 validation, penetration test, quarterly access review).',
      },
      {
        id: 'CHK-03',
        title: 'Legal cleared · DPA not required · NDA executed',
        owner: 'Legal',
        status: 'resolved',
        detail:
          'No EU personal data; DPA-TM-001 returns no matching row. ISP-001 §12.1.4 NDA requirement satisfied.',
      },
      {
        id: 'CHK-04',
        title: 'Procurement approval routing · BLOCKED on PAM-001',
        owner: 'Procurement',
        status: 'blocker',
        detail:
          'Router denied PAM-001 at retrieval. Bundle approval_path_matrix_rows is empty. Agent emitted status=blocked rather than fabricating approval rows.',
      },
      {
        id: 'CHK-05',
        title: 'Approval checklist assembly',
        owner: 'Checklist Assembler',
        status: 'blocker',
        detail: 'Cannot assemble a checklist without a resolved approval path.',
      },
      {
        id: 'CHK-06',
        title: 'Stakeholder checkoff and routing',
        owner: 'Checkoff',
        status: 'blocker',
        detail: 'No checklist to route. The blocker package itself is the final artifact.',
      },
    ],
    blockers: [
      {
        id: 'BLK-INF-001',
        title: 'Register PAM-001 in the index',
        owner: 'Data Engineering',
        requiredAction:
          'Ingest Procurement_Approval_Matrix_v2_0 into the scenario index registry (chunk → embed → register). The file exists in mock_documents/ but was not indexed; rerunning will re-route the retrieval and complete STEP-04.',
        citation: 'Procurement Agent Spec §10 · index_registry.json',
      },
    ],
    stakeholderGuidance: [
      {
        audience: 'Data Engineering',
        nextStep:
          'Register PAM-001 in data/indexes/scenario_blocked_demo/index_registry.json and rebuild the indexed-hybrid store. The pipeline will recover at STEP-04 on the next run.',
      },
      {
        audience: 'Procurement Manager',
        nextStep:
          'No procurement action yet — approval routing is blocked at the system level, not by anything procurement owes. Stand by until Data Engineering confirms PAM-001 is registered.',
      },
      {
        audience: 'IT Security',
        nextStep:
          'STEP-02 complete with four mandatory follow-ups queued (full security review, SOC 2 validation, penetration test, quarterly access review). These remain valid for the eventual re-run.',
      },
      {
        audience: 'Legal',
        nextStep:
          'STEP-03 cleared. No DPA required; NDA already executed. No follow-up needed.',
      },
      {
        audience: 'Business Owner',
        nextStep:
          'Onboarding is paused at the procurement step because a required reference document was not loaded into the system. Data Engineering is the owner; expect remediation, not a vendor-side request.',
      },
    ],
  },
  takeaway: {
    headline: 'BLOCKED is the third governed outcome',
    body:
      'STEP-04 issued an approval-matrix query against PAM-001, but the source was absent from the index registry. The router failed closed, the bundle arrived without approval-matrix rows, and the Procurement agent emitted BLOCKED rather than inventing rows that did not exist. The supervisor halted; STEP-05 and STEP-06 did not run. This is the system working as designed: when an authoritative source has not been ingested, the registry-driven fail-closed model surfaces that absence as a terminal blocker routed to the team who owns ingestion, instead of letting an agent silently fabricate a path.',
  },
};
