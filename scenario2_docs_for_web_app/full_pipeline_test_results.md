## Pipeline Run #5 — scenario_2 — 2026-04-27
**Overall verdict:** PASS
**Supervisor status:** ESCALATED
**Pipeline run id:** run_46b0736b8b
**Halted at:** STEP-02

| Step | Agent | Status | Verdict | Elapsed | In tokens | Out tokens |
|------|-------|--------|---------|---------|-----------|------------|
| STEP-01 | intake (deterministic) | COMPLETE | n/a | — | — | — |
| STEP-02 | it_security_agent | ESCALATED | PASS | 10.11s | 20,199 | 757 |
| STEP-03 | legal_agent | PENDING | — | — | — | — |
| STEP-04 | procurement_agent | PENDING | — | — | — | — |
| STEP-05 | checklist_assembler | PENDING | — | — | — | — |
| STEP-06 | checkoff_agent | PENDING | — | — | — | — |

**Totals:** 1 agent call(s), 20,199 input tokens, 757 output tokens, 10.11s cumulative.

**Recorded responses:**
- STEP-02 → `tests/recorded_responses/full_pipeline/pipeline_5__it_security_agent__scenario_2_pass.json`
