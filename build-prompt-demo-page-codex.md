# BUILD PROMPT — Develop the `Demo` Page for the Enterprise-AI Narrative Web App

## 0. Mission

Build and flesh out the **`Demo` page** of this narrative web app.

This page is **not** a live production execution environment. It is a **guided replay viewer** for precomputed scenario runs from our governed multi-agent system. The goal is to make the architecture legible, persuasive, and inspectable for both:

1. **non-technical audiences** who need to understand what the system is doing at a high level, and
2. **technical audiences** who want to inspect how the supervisor, retrieval, bundle assembly, agent outputs, gates, and audits actually work.

This page should feel like a **replayable governed run**, not a static report, not a dashboard full of logs, and not a fake “magic AI” interface.

The page must communicate that:

* the system is **deterministic at the orchestration layer**
* retrieval is **source-aware and governed**
* domain agents reason **inside scoped context bundles**
* the supervisor validates outputs, checks gates, and decides whether the run continues or halts
* escalation is a **correct governed outcome**, not necessarily a failure
* the final outputs are **stakeholder-usable**, not just technical traces

We already have foundational materials elsewhere in the project explaining:

* the document stack
* the orchestration layer
* retrieval lanes
* the scenario framing

This `Demo` page should now show **what a run looks like in action**.

---

## 1. Core product goal of the page

The audience should leave this page understanding:

### A. At a beginner-friendly level

* a run proceeds **step by step**
* each step has a defined purpose
* the supervisor controls progression
* each domain agent receives a scoped bundle, not all enterprise knowledge
* the system can either complete cleanly or halt safely on escalation
* the final outputs are useful to business stakeholders

### B. At a technical level

* the supervisor governs step order, gates, state transitions, and audits
* retrieval is decomposed and routed by source type
* different source types are retrieved differently
* evidence is bundled deliberately with citations, source priorities, and access boundaries
* agent outputs are structured and validated before progression
* audits and gate checks are visible and inspectable
* low-authority supplemental sources are not treated the same as authoritative sources
* the run preserves the distinction between:

    * resolved determinations
    * ambiguity
    * blockers
    * escalations

---

## 2. High-level UX decision

Implement the page as a **guided replay + inspectable trace view**.

Do **not** make this page just a static results summary.
Do **not** make this page a fake real-time terminal or a noisy node-debugger.

Instead, build a **replayable run viewer** with:

1. a scenario selector
2. a **Start Replay** / **Replay Scenario** interaction
3. a visible step-by-step execution strip / graph
4. a current-step detail panel
5. expandable drawers for deeper technical inspection
6. a final results area for checklist / blockers / next actions

The replay should feel deliberate and governed.
The technical drawers should feel trustworthy and rich.
The overall page should remain elegant and narrative.

---

## 3. Scenarios to support

Build the page structure around **at least two replayable scenarios**.

### Scenario A — Clean governed completion

This is the “system works cleanly under sufficient evidence” path.

User should be able to watch:

* intake clears
* IT Security determines classification / fast-track
* Legal clears
* Procurement routes correctly
* Checklist Assembler compiles results
* Checkoff emits stakeholder guidance
* final state = COMPLETE

### Scenario B — Governed escalation

This is the “system halts correctly on the first true escalated status” path.

User should be able to watch:

* intake clears
* classification proceeds
* legal determines a blocker / escalation
* supervisor halts downstream execution
* final state = ESCALATED
* unresolved issue is shown with owner and required human action

### Placeholder support

The page must be built to accept **additional scenario JSON files later**.
Use placeholder scenario content and structured stubs where real outputs are not yet available.

---

## 4. What the page should feel like

Use a UX language inspired by:

* workflow replay / event history
* trace inspection
* execution-step storytelling
* expandable structured diagnostics
* narrative case replay

The page should feel like:

* a replayable case study
* an inspectable run
* a governed system walkthrough

It should **not** feel like:

* a generic chat UI
* a no-code editor clone
* a DevOps dashboard
* a terminal log dump

---

## 5. Base page structure

Build the page in the following major sections.

---

## 5.1 Hero / top control area

At the top of the page, include:

### Required elements

* page title: `Demo`
* short subtitle explaining this is a **guided replay of governed runs**
* scenario selector
* run status summary chips
* a primary CTA:

    * `Start Replay`
    * after first run, also allow `Replay`
* optional secondary controls:

    * `Pause`
    * `Resume`
    * `Step Through`
    * `Jump to Final State`

### Suggested summary chips

These can vary by scenario, but examples:

* `Run Status`
* `Approval Path`
* `Fast-Track`
* `Blockers`
* `Escalation Owner`

### UX note

The hero area should immediately tell the user:

* what scenario they are looking at
* whether it ended COMPLETE or ESCALATED
* whether they are about to watch a replay or inspect a completed run

---

## 5.2 Replay execution strip / governed run timeline

This is the centerpiece.

Represent the run as a sequence of governed steps, ideally horizontally on desktop and vertically stacked on smaller screens.

### Canonical steps

Use the following step order:

1. Intake Validation
2. IT Security / Path Classification
3. Legal / Compliance Trigger Determination
4. Procurement / Approval Routing
5. Checklist Assembly
6. Checkoff / Stakeholder Guidance

### Required behavior

During replay:

* only one active step should animate at a time
* completed steps clearly show status
* the next step should not begin until the prior step is accepted by the supervisor
* if a scenario halts on escalation, downstream steps should visibly show:

    * not executed
    * pending
    * halted due to escalation
* the supervisor’s gate logic should be visible in the progression

### Status states to support visually

* `PENDING`
* `IN_PROGRESS`
* `COMPLETE`
* `ESCALATED`
* `BLOCKED`
* `NOT_RUN`

### Visual goal

This strip should make it obvious that:

* the run is sequential
* the supervisor is in charge
* the system checks whether it may continue

---

## 5.3 Supervisor layer / orchestration overlay

The supervisor must be present in the Demo page UI as an active architectural actor.

### Required concepts to show

The supervisor:

* initiates the step
* retrieves / routes evidence
* assembles the context bundle
* sends the bundle to the correct domain agent
* receives structured output
* validates output contract
* checks status signal
* decides whether to continue or halt
* records audit events

### UX requirement

Do not make the supervisor a vague label.
Give it a visible presence in the page, such as:

* a top control ribbon above the step strip
* a floating orchestration rail
* a central “Supervisor” control layer that lights up during state transitions

### During replay, show supervisor actions such as:

* `Retrieving evidence`
* `Assembling bundle`
* `Dispatching to IT Security`
* `Validating structured output`
* `Gate passed`
* `Gate denied`
* `Recording escalation`

This should be elegant, not noisy.

---

## 5.4 Current-step detail panel

When a step is active, show a detail panel that answers:

1. **What was retrieved?**
2. **What bundle was assembled?**
3. **What question was this agent responsible for?**
4. **What output came back?**
5. **What did the supervisor do next?**

This panel is where the run becomes understandable.

### Minimum subsections in the panel

* `Step summary`
* `Retrieved evidence`
* `Context bundle`
* `Agent output`
* `Supervisor gate decision`

### Suggested copy pattern

For each step:

* plain-English summary first
* structured details second
* deep technical content hidden behind expansion

---

## 5.5 Expandable technical inspection drawers

Each step must allow optional inspection for technical audiences.

Support expandable sections like:

* `Retrieved Evidence`
* `Bundle Contents`
* `Structured Output`
* `Audit Events`
* `Gate Check`
* `Source Handling`
* `Optional Full JSON`

These should default to collapsed.

### What should appear in them

#### Retrieved Evidence

* source names
* source type
* retrieval lane used
* why the source was included
* whether it was primary or supplementary

#### Bundle Contents

* task / instructions
* relevant evidence
* citations / metadata
* source priorities
* access boundaries
* output contract / non-goals

#### Structured Output

* actual agent return payload
* rendered as readable structured JSON or key-value blocks
* syntax-highlighted if possible

#### Audit Events

* retrieval query issued
* chunks admitted
* chunks excluded
* status emitted
* escalation recorded
* gate decision logged

#### Gate Check

* expected output contract
* received status
* schema valid? yes/no
* continue? yes/no
* reason

---

## 5.6 Final output section

At the end of replay, show the business-facing results.

This section should differ by scenario.

### For completion scenario

Show:

* overall status = COMPLETE
* approval path
* final checklist
* required approvals
* no blockers or closed blockers
* stakeholder-ready next-step guidance

### For escalation scenario

Show:

* overall status = ESCALATED
* point of halt
* what was successfully determined before halt
* open blockers
* resolution owners
* required human action before continuation

### UX requirement

This section must feel like the practical value of the system, not just technical residue.

---

## 5.7 Takeaway panel

At the very bottom of each scenario replay, include a short takeaway panel:

* what this scenario demonstrates
* why the supervisor’s behavior was correct
* what the audience should learn from it

This should be scenario-specific and concise.

---

## 6. What to show from retrieval

This is very important.

The Demo page should show retrieval in a way that is understandable, but not over-engineered visually.

### Must show

#### A. Source-aware lanes

Make it visible that sources are not all handled the same way.

Examples to represent:

* Policy documents
* Matrices
* Structured questionnaire
* Slack / discussion threads

#### B. Source-specific retrieval behavior

Represent that:

* policies are section-based
* matrices are row-targeted
* questionnaire is direct structured lookup
* Slack is supplementary

#### C. Bundle assembly

This must be visible.
The agent should never appear to reason over “everything.”

Show that the bundle includes:

* task + instructions
* relevant evidence
* citations + metadata
* source priorities
* access boundaries
* output contract / non-goals

#### D. Downweighting / source priority

Show this selectively and meaningfully.

Example:

* a supplementary Slack thread appears
* a policy clause outranks it
* a note says Slack is supplementary only / downweighted / not primary

Do not show giant ranking-debug charts unless behind an expandable section.

---

## 7. What not to over-show

Do not foreground the following on the main replay path:

* raw embedding internals
* every retrieval score
* every chunk ID by default
* huge audit logs
* giant raw JSON dumps
* too much “agent is thinking” animation

These can exist in optional technical drawers, but should not dominate the page.

---

## 8. Animation and motion design requirements

Do not skimp on motion design.
Use motion to teach the architecture.

### Motion goals

Animation should help the audience understand:

* progression
* handoff
* supervisor control
* evidence movement
* bundle assembly
* halting
* final output emission

### Suggested motion moments

#### Replay start

* execution strip comes alive
* supervisor highlights
* first step activates

#### Evidence retrieval

* source cards pulse or illuminate
* selected sources animate into a retrieval tray
* tray condenses into a context bundle

#### Bundle dispatch

* bundle moves from supervisor to active domain agent
* active card or panel lights up

#### Agent reasoning

* subtle animation only
* use disciplined visual language, not “AI magic sparkles”
* think:

    * card shimmer
    * structured lines forming
    * output panel assembling

#### Output validation

* structured output slides back to supervisor
* gate check panel lights up
* decision state animates:

    * proceed
    * halt
    * escalate

#### Escalation halt

* downstream nodes dim
* halted message appears
* escalation owner and next action animate into place

### Animation principles

* motion should be smooth and legible
* avoid too much simultaneous animation
* respect reduced-motion preferences
* animation timing should be replay-driven, not random

---

## 9. Recommended free/open-source stack

Use tools that are free and robust.

### Recommended base stack

Assume the site is already using Astro + React + Tailwind or a similar setup.
Use React for the Demo page interactive layer.

### Recommended libraries

#### Motion / animation

* **Framer Motion** for sequencing, transitions, step activation, and replay animation
* optionally **Motion One** if needed for lighter effects, but Framer Motion is probably enough

#### Diagram / graph UI

Pick one of:

* **React Flow** for pipeline graph / step strip if you want node-based flexibility
* or build custom cards + connectors with React + SVG for tighter visual control

My recommendation:

* use **custom React components + SVG connectors** for the main replay strip
* use React Flow only if node-graph complexity genuinely helps

#### Expandable panels / primitives

* **Radix UI** primitives or **shadcn/ui**
* accordion
* tabs
* dialog
* collapsible
* tooltip
* sheet / drawer

#### Syntax / structured output rendering

* lightweight syntax highlighter for JSON
* or a custom code panel component styled consistently with the site

#### State management

* local component state is fine at first if scoped cleanly
* if needed, use Zustand for replay state and panel state
* avoid overengineering global state if unnecessary

#### Icons / visual language

* **lucide-react** for clean line icons
* supplement with a few custom SVG illustrations for:

    * supervisor
    * bundle
    * audit
    * checklist
    * escalation

### Styling

* Tailwind
* respect current design language:

    * warm paper-like background
    * off-white cards
    * elegant serif headings
    * muted blue-gray body text
    * subtle orange/neutral accent usage
    * strong spacing discipline

---

## 10. Architectural implementation strategy

Build the `Demo` page around structured scenario data, not hardcoded prose.

### Create a replay data model

Design a scenario schema that can support:

* scenario metadata
* step definitions
* retrieval events
* bundle contents
* agent outputs
* gate decisions
* audit events
* final outputs
* takeaway text

### Example shape

Use something like this conceptually:

```ts
type DemoScenario = {
  id: string
  title: string
  subtitle: string
  summaryChips: Array<{ label: string; value: string; tone?: string }>
  outcome: "COMPLETE" | "ESCALATED" | "BLOCKED"
  steps: DemoStep[]
  finalOutputs: { ... }
  takeaway: string
}
```

```ts
type DemoStep = {
  id: string
  title: string
  shortLabel: string
  actor: "Supervisor" | "IT Security" | "Legal" | "Procurement" | "Checklist Assembler" | "Checkoff"
  replayMoments: ReplayMoment[]
  retrievedEvidence?: RetrievedEvidenceItem[]
  bundle?: BundleItem[]
  output?: unknown
  gateDecision?: {
    status: "COMPLETE" | "ESCALATED" | "BLOCKED"
    continue: boolean
    reason: string
  }
  auditEvents?: AuditEvent[]
}
```

### Placeholder requirement

Where we do not yet have real structured outputs or real audit artifacts:

* create realistic placeholders
* label them clearly in code as replaceable fixture content
* do not block UI development waiting for final files

---

## 11. Build the page in phases

### Phase 1 — Skeleton and architecture

Build:

* page shell
* scenario selector
* replay strip
* current-step detail panel
* expandable sections
* final outputs panel

Use placeholder scenario data if needed.

### Phase 2 — Replay state machine

Implement:

* start replay
* pause / resume
* step through
* reset / replay
* active step highlighting
* per-step motion timing
* gate-based advancement logic in the UI

This is a front-end replay machine, not the real backend orchestrator.

### Phase 3 — Retrieval and bundle visualizations

Build reusable components for:

* source cards
* retrieval tray
* bundle assembly
* supplementary vs primary source treatment
* supervisor dispatch

### Phase 4 — Structured output + audit panels

Build:

* structured JSON renderer
* audit event list
* gate decision card
* source handling card
* expandable full-output drawers

### Phase 5 — Final output / stakeholder package panels

Build:

* checklist result panel
* blocker list
* owner list
* next-step guidance card
* scenario takeaway panel

### Phase 6 — polish and responsiveness

Improve:

* motion timing
* mobile / tablet layout
* keyboard accessibility
* reduced motion
* loading transitions
* page coherence with rest of the site

---

## 12. Required UI components

Create reusable components instead of one monolithic page file.

Suggested component breakdown:

* `DemoPageShell`
* `ScenarioSelector`
* `DemoHero`
* `RunSummaryChips`
* `ReplayControls`
* `ExecutionStrip`
* `ExecutionStepCard`
* `SupervisorRail`
* `CurrentStepPanel`
* `RetrievedEvidencePanel`
* `BundleAssemblyPanel`
* `AgentOutputPanel`
* `AuditEventsPanel`
* `GateDecisionPanel`
* `FinalOutputsPanel`
* `TakeawayPanel`

Support subcomponents such as:

* `SourceBadge`
* `LaneBadge`
* `StatusPill`
* `StructuredOutputViewer`
* `AuditEventRow`
* `ExpandableDrawer`
* `BundleDocumentCard`

---

## 13. Information architecture for the page

Organize the page so the reading order is intuitive.

### Top

* scenario context
* controls
* replay CTA

### Middle

* execution strip + supervisor overlay
* step details panel

### Lower middle

* expandable technical trace panels

### Bottom

* final outputs
* takeaway

Desktop should favor a split-view inspection layout.
Mobile should stack cleanly and preserve scenario replay usefulness.

---

## 14. Content behavior expectations

### Beginner mode by default

By default, show:

* plain-language summary
* minimal step detail
* clean visuals
* not too much jargon

### Technical depth on demand

Allow deeper inspection through:

* accordions
* drawers
* tabs
* modal document viewers if necessary

### “Full document / full output” behavior

We already know the user wants optional detail.
Make sure the page architecture supports:

* expandable full agent outputs
* expandable audit logs
* clickable or modal document previews
* placeholders for full documents not yet wired

If document files are not yet available, create stubbed viewers with placeholder labels like:

* `Full IT Security output — pending fixture`
* `Full checklist JSON — placeholder`
* `Audit trail export — placeholder`

---

## 15. Placeholder assets and data handling

The coding agent should assume some final files are not yet available.

### Use placeholder data for:

* some domain agent outputs
* some audit trails
* some bundle payloads
* some final rendered documents
* some stakeholder-ready guidance docs

### Important

Design the system so that replacing placeholder content with real structured scenario data later is easy and isolated.

Do **not** hardwire content into motion components.

---

## 16. Specific pedagogical outcomes the page must teach

The page must successfully teach these exact ideas:

1. **Nothing begins without valid intake**
2. **The supervisor controls progression**
3. **Different sources are retrieved differently**
4. **The domain agent only sees a scoped bundle**
5. **Agent outputs are structured, not hand-wavy**
6. **The supervisor validates before continuing**
7. **Escalation is preserved instead of erased**
8. **The final output is stakeholder-usable**
9. **This is a governed system, not open-ended RAG**
10. **Auditability is part of the runtime, not an afterthought**

Every major UI decision should reinforce one or more of these.

---

## 17. Scenario-specific content expectations

### Completion scenario must visibly prove

* governed retrieval works
* step sequence completes
* checklist is produced
* stakeholder guidance is produced
* the run reaches COMPLETE without intervention

### Escalation scenario must visibly prove

* the system can still make partial valid determinations
* the first true ESCALATED status halts the run
* ambiguity and blocker are not conflated
* human-owned blockers remain visible
* the supervisor stops safely instead of proceeding blindly

---

## 18. Copy tone and writing style

Use language that is:

* clear
* confident
* enterprise-friendly
* technically accurate
* not overly jargon-heavy on the surface

Plain-language summaries first.
Precise technical detail second.

Avoid:

* hype language
* “AI magic” phrasing
* buzzword-heavy filler
* cheesy animated assistant behavior

The page should feel serious, elegant, and modern.

---

## 19. Accessibility and usability requirements

Implement:

* keyboard navigable replay controls
* accessible accordions / tabs / drawers
* good color contrast
* reduced motion mode
* readable type scale
* responsive layouts
* visible focus states
* clear status labels not based only on color

This page must remain understandable without relying solely on motion.

---

## 20. Deliverables expected from the coding agent

Build the `Demo` page structure and supporting components with:

1. a replayable scenario framework
2. a fully built execution strip
3. a visible supervisor orchestration layer
4. a current-step detail panel
5. expandable technical inspection drawers
6. final output panels
7. placeholder scenario data for two scenarios
8. placeholder full-output / document viewers where files are missing
9. animations and transitions for step progression, bundle movement, and gate decisions
10. responsive and accessible design

Additionally:

* leave clean TODO markers where real run artifacts will later be injected
* document the expected scenario data schema in code comments or a local README
* make the component structure maintainable and modular

---

## 21. Final implementation philosophy

This page should make the viewer feel:

**“I can see exactly how this governed system works.”**

Not:

* “I saw some fancy cards move”
* “I saw a wall of logs”
* “I saw a generic AI interface”

Build the Demo page as a **governed replay + inspectable trace + stakeholder-facing outcome viewer**.

That is the right expression of this project.

---

If you need fixture files that do not yet exist, create clearly named placeholder data files and placeholder viewers, and proceed with the UI and replay architecture now.
