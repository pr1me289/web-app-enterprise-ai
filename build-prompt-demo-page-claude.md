# Build Prompt: Part 06 — Demo Page

## What you're building

The Demo page of a Next.js narrative web app for `enterprise-ai`, a portfolio project demonstrating spec-driven enterprise context engineering. This page is the climax of the site — the place where everything explained in earlier parts gets shown working on a concrete scenario.

The page is a **replay-driven, reader-controlled demo** of two real pipeline runs of an AI-assisted vendor onboarding system. It is not live; the runs have already happened and their outputs are recorded fixtures. Your job is to build the structure that presents those fixtures with the visual sophistication of a Distill article and the operational legibility of LangSmith.

The system being demonstrated runs a six-step deterministic pipeline (Supervisor Agent + five domain agents) over governed enterprise documents, producing a structured approval checklist with a complete audit trail. The two scenarios are:

- **Clean Run** — all six steps complete; approval checklist generated; FAST_TRACK approved
- **Escalated Run** — pipeline halts at STEP-03 (Legal) because a GDPR Art. 28 DPA is required but not executed, and NDA execution is unconfirmed

Both scenarios share STEP-01 and STEP-02 logic; they diverge at STEP-03. The Escalated Run is the *primary* demo (load it by default) because it demonstrates governance more clearly than the happy path.

## Audiences this must serve simultaneously

- **Non-technical hiring managers and consultants** — must understand at a glance: what the pipeline does, why it's well-designed, and what the architectural argument is. They will skim. Headlines and visuals must carry the argument without requiring expansion.
- **Technical hiring managers and engineers** — must be able to inspect every artifact. Bundle composition, full agent outputs, citation chains, audit log entries. They will dwell. Disclosure must reach all the way to raw structured JSON.

The page must serve both without compromising either. The pattern that resolves this tension: **summary always visible; raw artifacts one click away, collapsed by default**.

## What audiences should learn from this page

By the end of the page, a reader should understand:

1. **Deterministic orchestration in action** — how the Supervisor Agent gates each step, what evidence it requires before advancing, and how status signals (COMPLETE / ESCALATED / BLOCKED) drive routing
2. **Source-aware retrieval** — that different sources are queried via different lanes (direct structured lookup, indexed hybrid, non-retrieval), reranked by source authority, and assembled into scoped bundles
3. **Bundle as a structured object** — what a context bundle actually contains (instructions, evidence, citations, source authority tier, permissions, non-goals, output contract)
4. **The provisional-vs-blocker distinction** — why the system can preserve unresolved technical ambiguity (ERP integration tier) while halting on a human-owned legal blocker (DPA, NDA), without conflating them
5. **Citation-complete outputs** — every determination traces back to its authoritative source; no silent inference

These are the architectural arguments. Your visual choices should reinforce them. Specifically:

- When STEP-02 retrieves, show that ISP-001 (high authority) was queried via indexed_hybrid AND a Slack thread (low authority) was retrieved alongside but capped as supplementary only. The contrast between authority tiers must be visible.
- When STEP-03 escalates, show the two distinct unresolved-state types side by side: ERP tier (provisional, technical) vs. DPA + NDA (escalated, human-owned).
- When citations appear inline in agent outputs, hovering or clicking them should reveal the source matrix row that justified the determination. Audit trail made interactive.

## Architectural decisions already locked

Do not relitigate these:

- **Replay, not live.** No "Start" button that animates a fake real-time run. Time-driven animations create expectations the system can't honor and put the reader in passenger mode.
- **Reader-controlled timeline.** A persistent step cursor at the top of the page lets the reader scrub forward and backward through steps. Page does not reload between steps; the focused panel updates while the graph remains stable.
- **Scenario toggle.** Two scenarios are accessible from a selector. Default to Escalated Run on first load.
- **Two-layer disclosure.** Summary always visible; raw JSON, audit log entries, full bundle contents, and document chunks expandable but collapsed by default.
- **Optional auto-advance.** A play button can auto-advance the cursor at ~4 seconds per step. This is a *garnish* on the controllable timeline, never the primary mode. No fake "thinking..." latency.
- **No fake reasoning visualization.** No "agent thinking" animation. Show inputs (the bundle), show outputs (structured JSON), show citations. What happened in between is the model's business.

## Tech stack

Site stack already locked (do not change):
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Framer Motion v11 (already in use across the site)
- MDX (for prose-heavy sections)
- TypeScript throughout
- Vercel deployment

Add for this page (all free / open source):

- **`recharts`** — for any data visualizations (already in deps, reuse)
- **`shiki`** for syntax-highlighted JSON in expandable panels (zero-runtime, build-time highlighting; lighter than Prism for our use case)
- **`@radix-ui/react-dialog`** and **`@radix-ui/react-collapsible`** for accessible modal/drawer and disclosure primitives
- **`lucide-react`** for iconography (status icons, document icons, lane icons)
- **`zustand`** for demo page state management (current step, current scenario, expanded sections) — Context API would work but Zustand is cleaner for this many concurrent state shards
- **Custom SVG components** for the execution graph, lane diagrams, bundle visual — do not pull in a graph library like ReactFlow. The graph is six nodes; hand-built SVG with Framer Motion is lighter and more controllable.

Do not add any 3D library, scrollytelling library (Scrollama, etc.), or animation framework beyond Framer Motion. Everything visual builds on Framer Motion + SVG + Tailwind.

## Page architecture

Single Next.js route at `app/(parts)/06-demo/page.tsx`. The page is one continuous document with internal navigation, not paginated.

### Top of page

**Hero section.** Brief framing copy (~80 words) explaining what this demo is: a replay of two real runs of a governed onboarding pipeline. State explicitly that this is recorded, not live, and that runs are reproducible from the project repo.

**Scenario selector.** Two-option toggle: *Escalated Run* (default) / *Clean Run*. Use `motion.div` with a sliding pill indicator. When toggled, the rest of the page transitions: graph status icons update, focused-step content swaps. Don't reload the page; cross-fade the changing regions only.

### Persistent execution graph

A horizontal SVG of the six pipeline steps — STEP-01 through STEP-06. This component stays at the top of the viewport during the demo (sticky positioning) so the reader can always see where they are.

Each node shows:
- Step number and short name
- Status icon (varies by scenario and current cursor position)
- The agent that owns the step

Status iconography (steal from GitHub Actions because readers already know it):
- Green check — COMPLETE
- Amber circle with pause — current step the cursor is on (in-focus)
- Red exclamation — ESCALATED
- Grey dash — not yet reached / halted by upstream
- Empty circle — not run

In the Escalated Run, STEP-04 through STEP-06 show as grey-dashed (not run because pipeline halted at STEP-03). Make this visually obvious — these aren't pending, they were *prevented from running*. Use a slightly different visual treatment (dashed border, lower opacity).

Connecting arrows between steps. On the focused-step transition, animate the arrow from the previous step lighting up. On the escalation transition (STEP-02 → STEP-03 in Escalated Run), the arrow reaches STEP-03 normally; the arrows from STEP-03 onward stay dimmed.

The cursor is implicit — the focused step is whichever node is currently expanded in the detail panel. Clicking any node moves the focus. Keyboard navigation (left/right arrows) advances/rewinds.

### Step detail panel

Below the graph, a single panel that shows everything about the currently-focused step. This is where most of the page's content lives. Updates with cross-fade when the focused step changes.

For each step, the panel has these regions, in this vertical order:

1. **Step heading + one-sentence governance principle.** Use the headlines from the previous turn: "Nothing starts without the questionnaire" / "The data profile decides the path" / "Legal triggers come from the matrix, not inference" etc. Below the heading, the one-line principle ("Each step enforces a rule that naive pipelines skip" tone). Non-technical readers can stop at this line and still understand what the step does.

2. **What the Supervisor retrieved.** Visualized as a small lane diagram: each source the Supervisor pulled from, labeled with its retrieval lane (`direct_structured` / `indexed_hybrid` / `non_retrieval`), its authority tier, and how many chunks were admitted. This is the single most architecturally compelling visual on the page — it shows source-aware retrieval working. In STEP-02 specifically, surface the ISP-001 (high authority, indexed_hybrid) vs. Slack thread (low authority, supplementary only) contrast prominently. Make the authority tier badges color-coded.

3. **The bundle that was assembled.** A collapsible "Bundle" panel rendered as a layered visual artifact (think nutrition label or passport — sectioned and labeled). Sections: task & instructions, evidence with source tags, authority tier of each piece, permissions context, non-goals, output contract. Default state: collapsed with a thumbnail visual. Expanded state: full bundle with each section scannable. If attorney-client privileged content was excluded at index time, show a faint greyed-out "excluded at index" item — making the *exclusion* visible is part of the architectural argument.

4. **Agent output.** The structured JSON the agent emitted. Show a summary first (the determination in plain language: "Data classification: REGULATED. Fast-track ineligible.") and the raw JSON below in a collapsible code block. Use `shiki` for syntax highlighting. Citations within the JSON should be hoverable — hovering reveals the source matrix row or document section that justified the value.

5. **Status emitted.** A prominent status pill: COMPLETE / ESCALATED / BLOCKED. Same iconography as the graph. Below it, one sentence on the supervisor's gate decision: "Status COMPLETE; supervisor advances to STEP-03." Or for the escalated case: "Status ESCALATED; supervisor halts pipeline; escalation routed to General Counsel + Procurement/Legal."

6. **Audit log entries.** Collapsible list of every audit event STEP-N produced: retrieval attempts, admitted chunks, determination logged, status transition, etc. Closed by default. When expanded, render as a clean table with timestamp, event type, payload preview, and expand-to-see-full-payload affordance.

### The handoff moment

Between steps, when the cursor advances, briefly show what got handed forward. STEP-02 → STEP-03 hands forward `data_classification`, `eu_personal_data_present`, `fast_track_eligible`. STEP-03 → STEP-04 (in clean run only) hands forward the legal determination. Render this as a small "passing the bundle" animation when the cursor moves: the relevant fields slide from the closing step's output into the next step's incoming bundle. This is one of the few places where motion is doing teaching work, not decoration. Keep it under 600ms and avoid overly playful easing.

### Below the step detail panel

After the per-step content, three end-of-page sections:

1. **The two scenarios, side by side.** A small comparison view that lets readers see the two runs at a glance: which steps completed, where the escalated run halted, what each produced as a final artifact. This is where the "compare runs" pattern from the inspiration set earns its keep.

2. **The provisional-vs-blocker distinction.** A short section (~100 words + a small visual) explicitly calling out the architectural distinction the escalated run demonstrates: ERP tier was preserved as provisional pending review (technical ambiguity, not human-owned); DPA + NDA were preserved as escalated blockers (human-owned legal action required). The system distinguished them and halted only on the latter.

3. **What you've just seen.** Bulleted summary of the architectural arguments the demo proved. Five bullets, derived from the "what audiences should learn" list above. This is the closer.

4. **Transition to next part.** Whatever Part 07 is, link forward.

## Animation principles

- Animations earn their place by *teaching* something, not by demonstrating that animation is possible.
- The handoff between steps teaches the dependency relationship. Animate it.
- The retrieval lane diagram teaches the authority-tiered routing. The lanes can fade in sequentially when a step is first focused, so the eye is led from source → lane → bundle.
- The bundle assembly teaches what a structured context object looks like. When the bundle expands, the sections can stagger-reveal.
- Scenario switching does NOT animate piece-by-piece. Cross-fade the changing regions; don't make the reader watch every node refresh.
- No bouncy easing anywhere. This is a serious architectural artifact. Use `easeOut` for entrance, `easeInOut` for state transitions, durations 200-500ms unless there's a specific teaching reason to go longer.
- Respect `prefers-reduced-motion`. Disable handoff and stagger animations; keep cross-fades only. Implement at the Framer Motion level using `useReducedMotion`.

## State management

Zustand store at `lib/demo/store.ts` with this shape:

```typescript
interface DemoState {
  scenario: 'clean' | 'escalated';
  focusedStep: 1 | 2 | 3 | 4 | 5 | 6;
  expandedSections: Set<string>; // section IDs that are currently open
  isAutoPlaying: boolean;
  setScenario: (s: 'clean' | 'escalated') => void;
  setFocusedStep: (n: number) => void;
  toggleSection: (id: string) => void;
  startAutoPlay: () => void;
  stopAutoPlay: () => void;
}
```

When `scenario` changes, reset `focusedStep` to 1 and clear `expandedSections`. When `focusedStep` advances past a halted step in the escalated run, snap back to STEP-03.

URL state: serialize `scenario` and `focusedStep` to query params (`?run=escalated&step=3`) so deep links work for sharing.

## Data architecture

Pipeline run data lives in fixture files. Create the directory structure:

```
content/demo/
  scenarios/
    clean/
      run-metadata.json
      step-01-intake.json
      step-02-it-security.json
      step-03-legal.json
      step-04-procurement.json
      step-05-checklist.json
      step-06-checkoff.json
    escalated/
      run-metadata.json
      step-01-intake.json
      step-02-it-security.json
      step-03-legal.json
  bundles/
    clean/
      step-02-bundle.json
      step-03-bundle.json
      ...
    escalated/
      step-02-bundle.json
      step-03-bundle.json
  audit-logs/
    clean/
      events.jsonl
    escalated/
      events.jsonl
  documents/
    isp-001.md          // IT Security Policy
    dpa-tm-001.md       // DPA Trigger Matrix
    pam-001.md          // Procurement Approval Matrix
    vq-oc-001.json      // Vendor Questionnaire
    slk-001.md          // Slack thread export
```

For each file, create a placeholder with realistic-but-clearly-stub content if you don't have the real data yet. Mark every stub with `// TODO: replace with actual fixture data — see scenario_data/ in pipeline repo` so they're trivial to find later. Type each fixture against TypeScript interfaces in `lib/demo/types.ts` so when real data arrives, the TS compiler catches schema mismatches immediately.

Schema for each step fixture (skeleton):

```typescript
interface StepFixture {
  stepId: 'STEP-01' | 'STEP-02' | ...;
  agent: 'Supervisor' | 'IT Security' | 'Legal' | 'Procurement' | 'Checklist Assembler' | 'Checkoff';
  governancePrinciple: string;  // one-line
  retrieval: {
    sources: Array<{
      name: string;          // e.g., "ISP-001 §4.2"
      lane: 'direct_structured' | 'indexed_hybrid' | 'non_retrieval';
      authorityTier: 1 | 2 | 3 | 4;
      chunksRetrieved: number;
      chunksAdmitted: number;
      treatment: 'primary' | 'supplementary' | 'excluded';
    }>;
  };
  bundleId: string;          // ref to bundles/{scenario}/step-N-bundle.json
  output: {
    summary: string;         // plain-language determination
    structured: Record<string, unknown>;  // raw JSON from agent
    citations: Array<{ field: string; source: string; section: string; }>;
  };
  status: 'COMPLETE' | 'ESCALATED' | 'BLOCKED';
  gateDecision: string;      // supervisor's gate explanation
  auditEventIds: string[];   // refs into events.jsonl
}
```

## Component breakdown

```
app/(parts)/06-demo/
  page.tsx                          // root page, sticky graph + detail panel
  components/
    ExecutionGraph.tsx              // SVG of the 6-step graph, sticky-positioned
    ScenarioSelector.tsx            // 2-option toggle with sliding pill
    StepDetailPanel.tsx             // the swappable detail region
    GovernancePrinciple.tsx         // headline + one-line subhead
    RetrievalLanes.tsx              // SVG lane diagram per step
    BundleVisual.tsx                // collapsible structured-object render
    AgentOutput.tsx                 // summary + collapsible JSON via shiki
    StatusPill.tsx                  // COMPLETE / ESCALATED / BLOCKED indicator
    AuditLogTable.tsx               // collapsible event log
    HandoffAnimation.tsx            // bundle-passing motion between steps
    ScenarioComparison.tsx          // side-by-side end-of-page comparison
    ProvisionalVsBlocker.tsx        // architectural distinction callout
    DocumentDrawer.tsx              // Radix Dialog wrapping a document viewer
    AutoPlayControl.tsx             // play/pause button + speed selector
  lib/
    store.ts                        // Zustand state
    types.ts                        // fixture schemas
    fixtures.ts                     // typed loaders for the JSON files
    keyboard.ts                     // arrow-key cursor handler
```

Every component must:
- Have a clear single responsibility
- Accept its data as props (no fetching inside components — load fixtures at the page level and pass down)
- Include a Storybook-friendly default export with mock data so it can be developed in isolation if needed (no Storybook config required, but write the component so it could be added later)
- Have a JSDoc block at the top stating its role in the demo

## Step-by-step build order

Build in this order. Don't skip ahead — each phase de-risks the next.

### Phase 1 — Skeleton

1. Create the route, the Zustand store, and the TypeScript types
2. Stub all fixture files with placeholder content (clearly marked TODO)
3. Build the ExecutionGraph as static SVG with hard-coded statuses for one scenario; verify it renders
4. Build the ScenarioSelector and wire it to the store
5. Build StepDetailPanel as a stub that just shows "Step N selected" — verify cursor advances on click and arrow keys

### Phase 2 — Detail panel content

6. Build GovernancePrinciple, StatusPill — these are presentation-only, fast wins
7. Build AgentOutput with shiki integration and collapsible behavior
8. Build BundleVisual with collapsed thumbnail + expanded section view
9. Build RetrievalLanes — this is the highest-value visual; spend time on it. Three lane styles, authority tier badges, source-to-lane connections
10. Build AuditLogTable

### Phase 3 — Animations

11. Wire Framer Motion entrance animations on each region of the detail panel; stagger-reveal on focused step change
12. Build HandoffAnimation — this is the most ambitious motion piece; budget time
13. Build ExecutionGraph status transitions on scenario change (cross-fade, not piece-by-piece)
14. Implement `prefers-reduced-motion` fallbacks

### Phase 4 — End-of-page sections + polish

15. Build ScenarioComparison
16. Build ProvisionalVsBlocker
17. Build DocumentDrawer (Radix Dialog wrapping document viewer with section jump-nav)
18. Wire AutoPlayControl
19. URL state serialization
20. Keyboard nav (left/right arrows, escape closes drawers)
21. Mobile layout — graph becomes vertical, detail panel stacks. Don't try to keep the desktop experience on mobile; design for thumb scrolling and tap targets.

### Phase 5 — Verification

22. Verify both scenarios render end to end with stub data
23. Verify scenario switching is smooth and resets state correctly
24. Verify deep links work (`?run=escalated&step=3` lands you on the right step in the right scenario)
25. Lighthouse pass — Demo page should hit 90+ on Performance and 95+ on Accessibility
26. Manual a11y check: tab order, focus rings, ARIA labels on the SVG graph, screen reader announces step changes

## What you do NOT need to build yet

- The actual content of the fixtures. Stub them. The user will provide real run data later.
- The full text of the source documents (ISP-001, DPA-TM-001, etc.). Stub these as short markdown placeholders. The user will provide real content later.
- The Part 07 transition target. Link to a stub route.
- Analytics. Don't add any.

## Things to watch for

- **Don't fake reasoning visualizations.** No "agent is thinking..." spinner, no streaming-token effect on the agent output, no fake retrieval delay. The runs are recorded; show the artifacts, not theater.
- **Don't let the graph and detail panel get out of sync.** If the user clicks STEP-04 and it's a halted step in the escalated run, snap focus back to STEP-03 and surface a small toast: "STEP-04 didn't run in this scenario — pipeline halted at STEP-03."
- **Don't auto-expand everything.** Default state of every collapsible should be collapsed. The page must be skimmable in under 90 seconds for a non-technical reader. Detail is opt-in.
- **Don't mix scenarios in one view.** The ScenarioComparison section is the only place where both scenarios coexist on screen. Everywhere else, one scenario at a time.
- **Don't reach for libraries beyond the stack.** No d3, no ReactFlow, no GSAP, no Lottie. SVG + Framer Motion is enough for everything specified here.
- **Don't write CSS files.** Tailwind only. If you need a custom animation, define it as a Framer Motion variant in the component.

## Definition of done

The page is done when:

- A reader can land on it cold, read the hero, see the execution graph, and understand the architecture in under 30 seconds without expanding anything
- A technical reader can expand every section and reach the actual structured JSON output of every agent and the full audit log, with no dead ends
- Switching scenarios feels instantaneous (under 200ms perceived)
- The escalated run's halt is visually unmistakable — no reader confuses "didn't run" with "ran and passed"
- Deep links work
- Reduced-motion preference is respected
- Mobile is usable, even if not optimal
- All TODO markers point at exactly what real data is missing and where it goes

## Final note

This page is the proof that everything claimed in Parts 01-05 actually works. Every visual decision should reinforce the architectural argument: governance is real, retrieval is source-aware, the bundle is a structured object, the supervisor is deterministic, the audit trail is complete. If a visual flourish doesn't reinforce one of those, cut it.

Start with Phase 1. Show the user the skeleton before moving to Phase 2. After each phase, surface a brief status: what was built, what's stubbed, what needs real data to feel finished.