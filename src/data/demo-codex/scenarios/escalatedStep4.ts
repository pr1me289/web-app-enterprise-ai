// Coverage-gap escalation scenario — pipeline halts at STEP-04 (Procurement)
// because no PAM-001 row matches the Class D / TIER_1 vendor profile. Unlike
// the BLOCKED scenario (where PAM-001 was absent from the registry), here
// PAM-001 is fully indexed and three rows are retrieved — but none satisfy
// the strict primary-key match required by Procurement Spec §14 A-04. The
// agent emits the escalated output shape (all determination fields present,
// approval_path null) rather than fabricating the nearest row. STEP-05 and
// STEP-06 never run. Sourced from the captured run in
// scenario_escalated_step4_demo/ (run_baa1f4802d, 2026-04-28T02:50:15Z →
// 2026-04-28T02:50:23Z).
import type { DemoScenario } from '../types';

export const escalatedStep4Scenario: DemoScenario = {
  id: 'escalated_step4',
  title: 'Coverage gap · ESCALATED',
  subtitle:
    'OptiChain submits a regulated direct-API engagement with the vendor classified as Class D — Technology Professional Services. STEP-02 and STEP-03 complete cleanly. At STEP-04 the Procurement Approval Matrix returns three rows by hybrid retrieval, but none match the Class D / TIER_1 primary key. Per spec, the agent escalates to the Procurement Director rather than substituting the nearest row. The pipeline halts; STEP-05 and STEP-06 never run.',
  outcome: 'ESCALATED',
  summaryChips: [
    { label: 'Run status', value: 'ESCALATED', tone: 'warning' },
    { label: 'Halted at', value: 'STEP-04 · Procurement', tone: 'warning' },
    { label: 'Fast-track', value: 'INELIGIBLE', tone: 'warning' },
    { label: 'Blockers', value: '1', tone: 'danger' },
    { label: 'Escalation owner', value: 'Procurement Director', tone: 'warning' },
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
          id: 'vq-oc-001-intake-esc4',
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
            source: 'VQ-OC-001 VSQ-001 — Vendor Questionnaire',
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
        { timestamp: '2026-04-28T02:50:15Z', type: 'RUN_EVENT', payload: 'Pipeline initialized · manifest_version=CC-001-v1.4' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-01 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R01-SQ-01 · lane=direct_structured · source=VQ-OC-001 · output=questionnaire_exists · admitted=3' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R01-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=questionnaire_complete · admitted=10' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R01-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=version_conflict_detected · admitted=2' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'DETERMINATION', payload: 'step_id=STEP-01 · questionnaire_valid=true · vendor_name=OptiChain, Inc. · status=COMPLETE' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-01 · from=IN_PROGRESS · to=COMPLETE' },
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
          id: 'vq-oc-001-it-esc4',
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
          id: 'isp-001-tiers-esc4',
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
          'Apply ISP-001 §8.6 fast-track rule — REGULATED data disqualifies fast-track.',
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
        ],
        citations: ['ISP-001 §12.2', 'ISP-001 §5', 'VQ-OC-001'],
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
          'Integration normalized to DIRECT_API (TIER_1). Data classification REGULATED. Fast-track ineligible — DISALLOWED_REGULATED_DATA per ISP-001 §12.2. Four mandatory security actions queued (full security review, penetration test, SOC 2 Type II verification, quarterly access review). NDA confirmed EXECUTED.',
        plainSummary:
          'OptiChain wants direct API access to our ERP system, which is the highest-risk integration tier and pulls in regulated business data. That rules out the fast-track path. The agent flagged four mandatory security activities (full review, pentest, SOC 2 check, quarterly access review) and confirmed the NDA is in place.',
        structured: {
          integration_type_normalized: 'DIRECT_API',
          integration_tier: 'TIER_1',
          data_classification: 'REGULATED',
          eu_personal_data_present: false,
          fast_track_eligible: false,
          fast_track_rationale: 'DISALLOWED_REGULATED_DATA',
          security_followup_required: true,
          nda_status_from_questionnaire: 'EXECUTED',
          required_security_actions: [
            {
              action_type: 'FULL_SECURITY_REVIEW',
              reason:
                'TIER_1 direct ERP integration with regulated transactional data requires CISO + CIO written approval, mandatory penetration test, SOC 2 Type II certification, and quarterly access review per ISP-001 §12.2',
              owner: 'IT Security',
            },
            {
              action_type: 'PENETRATION_TEST',
              reason: 'Mandatory for TIER_1 direct API connections to ERP per ISP-001 §12.2',
              owner: 'IT Security',
            },
            {
              action_type: 'SOC2_TYPE_II_VERIFICATION',
              reason: 'SOC 2 Type II certification required for TIER_1 ERP integration per ISP-001 §12.2',
              owner: 'IT Security',
            },
            {
              action_type: 'QUARTERLY_ACCESS_REVIEW_SETUP',
              reason: 'Quarterly access review required for TIER_1 direct ERP connections per ISP-001 §12.2',
              owner: 'IT Security',
            },
          ],
          policy_citations: [
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_12', section_id: '12.2', citation_class: 'PRIMARY' },
            { source_id: 'ISP-001', version: '4.2', chunk_id: 'ISP-001__section_5', section_id: '5', citation_class: 'PRIMARY' },
          ],
          status: 'complete',
        },
        citations: [
          { field: 'integration_tier', source: 'ISP-001 §12.2' },
          { field: 'data_classification', source: 'ISP-001 §5' },
          { field: 'fast_track_eligible', source: 'ISP-001 §12.2' },
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
        { timestamp: '2026-04-28T02:50:15Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-02 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R02-SQ-01 · lane=direct_structured · source=VQ-OC-001 · output=integration_inputs · admitted=3' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R02-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=regulated_data_inputs · admitted=2' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R02-SQ-04 · lane=indexed_hybrid · source=ISP-001 · output=erp_tier_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R02-SQ-05 · lane=indexed_hybrid · source=ISP-001 · output=data_classification_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:50:15Z', type: 'RETRIEVAL', payload: 'R02-SQ-06 · lane=indexed_hybrid · source=ISP-001 · output=fast_track_policy_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'DETERMINATION', payload: 'step_id=STEP-02 · integration_tier=TIER_1 · data_classification=REGULATED · fast_track_eligible=false · status=complete' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-02 · from=IN_PROGRESS · to=COMPLETE' },
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
          id: 'step-02-passthrough-esc4',
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
          id: 'vq-oc-001-legal-esc4',
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
          id: 'dpa-tm-001-rows-esc4',
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
          id: 'isp-001-nda-esc4',
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
        { timestamp: '2026-04-28T02:50:20Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-03 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'RETRIEVAL', payload: 'R03-SQ-01 · lane=runtime_read · source=STEP-02 · output=upstream_security · admitted=3' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'RETRIEVAL', payload: 'R03-SQ-02 · lane=direct_structured · source=VQ-OC-001 · output=eu_inputs · admitted=2' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'RETRIEVAL', payload: 'R03-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=nda_inputs · admitted=1' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'RETRIEVAL', payload: 'R03-SQ-04 · lane=indexed_hybrid · source=DPA-TM-001 · output=dpa_trigger_rows · admitted=5' },
        { timestamp: '2026-04-28T02:50:20Z', type: 'RETRIEVAL', payload: 'R03-SQ-05 · lane=indexed_hybrid · source=ISP-001 · output=nda_clause_chunks · admitted=5' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'DETERMINATION', payload: 'step_id=STEP-03 · dpa_required=false · nda_status=EXECUTED · status=complete' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-03 · from=IN_PROGRESS · to=COMPLETE' },
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
      governancePrinciple: 'Approval routing reads the matrix row',
      retrievedEvidence: [
        {
          id: 'step-02-pass-esc4',
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
          id: 'step-03-pass-esc4',
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
          id: 'vq-oc-001-proc-esc4',
          name: 'Vendor Questionnaire · VSQ-001 · vendor relationship',
          type: 'Vendor questionnaire',
          lane: 'direct_structured',
          authorityTier: 2,
          treatment: 'primary',
          reason:
            'vendor_class="Class D — Technology Professional Services", integration_tier=TIER_1, deal_size=$150K. The (Class, Tier) tuple is the primary key into the approval matrix.',
          chunksRetrieved: 4,
          chunksAdmitted: 4,
        },
        {
          id: 'pam-001-rows-esc4',
          name: 'Procurement Approval Matrix PAM-001 · rows A-T1, B-T1, C-T1',
          type: 'Approval matrix',
          lane: 'indexed_hybrid',
          authorityTier: 1,
          treatment: 'primary',
          reason:
            'Hybrid retrieval against the curated approval matrix returns three Tier-1 rows. None carries Class D — the vendor profile sits in a coverage gap. Per Procurement Spec §14 A-04, no approval_path may be asserted from a row that does not match on both primary keys.',
          chunksRetrieved: 6,
          chunksAdmitted: 6,
        },
        {
          id: 'slk-001-procurement-esc4',
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
          'Apply PAM-001 strict primary-key match on (vendor_class, integration_tier).',
          'If no row matches both keys, do not substitute the nearest row — emit status=escalated with approval_path=null.',
          'Assemble required_approvals[] only from a matched row.',
          'Pass through fast_track_eligible from STEP-02 unchanged.',
        ],
        evidence: [
          { source: 'STEP-02 output — Upstream IT Security determination', tier: 1, note: 'TIER_1 · REGULATED · fast_track_eligible=false.' },
          { source: 'STEP-03 output — Upstream Legal determination', tier: 1, note: 'dpa_required=false · nda_status=EXECUTED · no blockers.' },
          { source: 'VQ-OC-001 vendor relationship — Vendor Questionnaire', tier: 2, note: 'Class D — Technology Professional Services · TIER_1 · $150K annual.' },
          { source: 'PAM-001 rows A-T1, B-T1, C-T1 — Procurement Approval Matrix', tier: 1, note: 'Three Tier-1 rows retrieved. None carry Class D — coverage gap on the primary key.' },
        ],
        citations: ['STEP-02', 'STEP-03', 'VQ-OC-001', 'PAM-001'],
        permissions: ['Read STEP-02 output', 'Read STEP-03 output', 'Read VQ-OC-001', 'Read PAM-001', 'Read SLK-001'],
        nonGoals: [
          'Do not substitute the nearest non-matching matrix row.',
          'Do not re-evaluate legal or security determinations.',
        ],
        outputContract: [
          'approval_path: STANDARD | FAST_TRACK | EXECUTIVE_APPROVAL',
          'fast_track_eligible: boolean',
          'required_approvals: ApproverEntry[]',
          'estimated_timeline: string',
          'policy_citations: PolicyCitation[]',
          'status: complete | escalated | blocked',
        ],
        excluded: [
          {
            source: 'SLK-001 thread T4 — Slack Thread Export (Greenbrook Catering)',
            reason: 'Off-topic — different vendor (PRQ-2024-0051). Excluded by bundle assembler.',
          },
        ],
      },
      output: {
        summary:
          'Procurement agent emitted status=escalated. PAM-001 returned three rows (Class A-T1, B-T1, C-T1) but none carry Class D — strict primary-key match fails. Per Procurement Spec §14 A-04, the agent set approval_path=null, required_approvals=null, estimated_timeline=null, policy_citations=null and escalated to the Procurement Director rather than substituting the nearest row. fast_track_eligible passed through from STEP-02 unchanged.',
        plainSummary:
          'The Procurement Approval Matrix has rules for Class A, B, and C vendors but not Class D — and OptiChain is registered as Class D. Rather than guess by picking the closest rule (which would be a fabrication), the agent flagged the gap and routed it to the Procurement Director to decide whether to extend the matrix or hand-route this engagement. The pipeline halts here.',
        structured: {
          approval_path: null,
          fast_track_eligible: false,
          required_approvals: null,
          estimated_timeline: null,
          policy_citations: null,
          status: 'escalated',
        },
        citations: [
          { field: 'fast_track_eligible', source: 'STEP-02 passthrough' },
        ],
      },
      gateDecision: {
        status: 'ESCALATED',
        continueRun: false,
        reason:
          'Output contract satisfies the escalated shape (all determination fields present, set to null where unresolvable; no PAM-001 PRIMARY citation). Per Procurement Spec §9.2, this is a governed escalation — supervisor halts and routes to the Procurement Director. STEP-05 and STEP-06 do not run.',
        expectedContract: [
          'approval_path',
          'fast_track_eligible',
          'required_approvals',
          'estimated_timeline',
          'policy_citations',
          'status',
        ],
        contractValid: true,
      },
      auditEvents: [
        { timestamp: '2026-04-28T02:50:22Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-04 · from=PENDING · to=IN_PROGRESS' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-01 · lane=runtime_read · source=STEP-02 · output=it_security_output · admitted=6' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-02 · lane=runtime_read · source=STEP-03 · output=legal_output · admitted=7' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-03 · lane=direct_structured · source=VQ-OC-001 · output=vendor_relationship · admitted=4' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-04 · lane=indexed_hybrid · source=PAM-001 · output=approval_matrix_rows · admitted=3' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-05 · lane=indexed_hybrid · source=PAM-001 · output=fast_track_routing_rows · admitted=3' },
        { timestamp: '2026-04-28T02:50:22Z', type: 'RETRIEVAL', payload: 'R04-SQ-06 · lane=indexed_hybrid · source=SLK-001 · output=slack_procurement · admitted=4' },
        { timestamp: '2026-04-28T02:50:23Z', type: 'DETERMINATION', payload: 'step_id=STEP-04 · status=escalated · approval_path=null · fast_track_eligible=false · no PAM-001 PRIMARY citation' },
        { timestamp: '2026-04-28T02:50:23Z', type: 'STATUS_CHANGE', payload: 'step_id=STEP-04 · from=IN_PROGRESS · to=ESCALATED' },
        { timestamp: '2026-04-28T02:50:23Z', type: 'ESCALATION', payload: 'step_id=STEP-04 · evidence_condition=Procurement routing inherited an unresolved constraint or lacked a matrix match · resolution_owner=Procurement Director' },
        { timestamp: '2026-04-28T02:50:23Z', type: 'RUN_EVENT', payload: 'Pipeline halted in escalated state · overall_status=ESCALATED' },
      ],
      replayMoments: {
        retrieving: 'Issuing matrix query against PAM-001 — three Tier-1 rows return.',
        bundling: 'Assembling Procurement bundle — 3 PAM rows admitted, no Class D coverage.',
        dispatching: 'Dispatching to Procurement agent.',
        agent_working: 'Inspecting each row\'s (Class, Tier) keys — none match Class D / TIER_1.',
        output_ready: 'status=escalated · approval_path=null · no PAM-001 PRIMARY citation.',
        gating: 'Output contract matches escalated shape · ESCALATED is terminal · halt downstream.',
        decided: 'Gate held · routed to Procurement Director · STEP-05 and STEP-06 do not run.',
      },
      status: 'ESCALATED',
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
        reason: 'Did not execute. Pipeline halted upstream at STEP-04 (ESCALATED).',
        expectedContract: [],
        contractValid: false,
      },
      auditEvents: [],
      notRunReason:
        'Checklist assembly cannot proceed without a resolved approval path. STEP-04 produced ESCALATED because no PAM-001 row matches the Class D / TIER_1 primary key; the supervisor preserves this absence rather than fabricating a partial checklist.',
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
        reason: "Did not execute. The escalation package emitted at STEP-04 is the run's final artifact.",
        expectedContract: [],
        contractValid: false,
      },
      auditEvents: [],
      notRunReason:
        'Stakeholder closure cannot run without a checklist. STEP-04 ESCALATED is the terminal status; the surfaced escalation routes the coverage gap directly to the Procurement Director for resolution.',
      status: 'NOT_RUN',
    },
  ],
  finalOutputs: {
    status: 'ESCALATED',
    approvalPath: 'Halted',
    fastTrack: 'INELIGIBLE',
    haltedAt: 'STEP-04',
    artifactName: 'Escalation package · OptiChain · PRQ-2024-0047',
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
          'Direct OAuth API to SAP S/4HANA OData. Four mandatory security activities queued (full review, penetration test, SOC 2 Type II verification, quarterly access review).',
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
        title: 'Procurement approval routing · ESCALATED on no matching row',
        owner: 'Procurement',
        status: 'escalated',
        detail:
          'PAM-001 returned three Tier-1 rows (Class A, B, C); none carry Class D. Agent emitted approval_path=null and escalated rather than substituting the nearest row.',
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
        detail: 'No checklist to route. The escalation package itself is the final artifact.',
      },
    ],
    blockers: [
      {
        id: 'BLK-PROC-001',
        title: 'Resolve Class D / TIER_1 coverage in the approval matrix',
        owner: 'Procurement Director',
        requiredAction:
          'Decide whether to (a) extend PAM-001 with a Class D / TIER_1 row covering Technology Professional Services engagements, or (b) hand-route this specific engagement off-matrix with documented executive sign-off. Either path produces a citable approval row for re-running the pipeline.',
        citation: 'Procurement Agent Spec §14 A-04 · PAM-001',
      },
    ],
    stakeholderGuidance: [
      {
        audience: 'Procurement Director',
        nextStep:
          'Owns the coverage-gap resolution. Decide whether to extend PAM-001 to cover Class D / TIER_1 or hand-route this engagement with explicit executive approval. Document the decision so the pipeline has a citable row on the next run.',
      },
      {
        audience: 'Procurement Manager',
        nextStep:
          'Pause approval-routing actions on this PRQ until the Director confirms the path. No routing decision can be issued without a matched matrix row.',
      },
      {
        audience: 'IT Security',
        nextStep:
          'STEP-02 complete with four mandatory follow-ups queued (full security review, penetration test, SOC 2 Type II verification, quarterly access review). These remain valid for the eventual re-run.',
      },
      {
        audience: 'Legal',
        nextStep: 'STEP-03 cleared. No DPA required; NDA already executed. No follow-up needed.',
      },
      {
        audience: 'Business Owner',
        nextStep:
          'Onboarding is paused at the procurement step because the approval matrix does not yet cover this vendor class. The Procurement Director owns the next decision; expect a decision rather than a vendor-side request.',
      },
    ],
  },
  takeaway: {
    headline: 'Escalation when evidence is present but unresolvable',
    body:
      'STEP-04 retrieved three approval-matrix rows, but none of them matched the Class D / TIER_1 primary key. The agent emitted an escalated determination — all output fields present, set to null where unresolvable — and routed the coverage gap to the Procurement Director rather than substituting the nearest row. The supervisor halted; STEP-05 and STEP-06 did not run. This is the system working as designed: when authoritative evidence exists but cannot resolve the question, the escalated shape preserves the gap and hands the decision to the human owner instead of letting the agent fabricate a path.',
  },
};
