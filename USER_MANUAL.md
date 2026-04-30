# USER_MANUAL

Operator reference for the `web-app-enterprise-ai` repo. For _why_ over _how_, see `README.md` and `CLAUDE.md`.

## Stack at a glance

Astro 4 · React 18 (islands only) · MDX · Tailwind 3 · TypeScript (strict) · Zustand · Framer Motion · Radix UI · `pnpm` · Node 20+. Sheet/document previews are powered by `xlsx` and `mammoth` via build-time conversion scripts.

## Repo structure

```
src/
├── pages/                       # Routes
│   ├── index.astro              # /          — long-scroll narrative (Parts 1–5)
│   ├── demo.astro               # /demo      — pipeline replay (DemoExperience island)
│   └── findings.astro           # /findings  — Summary & closing thoughts (tab labeled "Summary")
├── layouts/
│   └── BaseLayout.astro         # <html>, SiteHeader, SiteFooter, global styles
├── components/
│   ├── astro/                   # Static primitives
│   │   ├── Container, NarrativeSection, SectionHero, SiteHeader, SiteFooter
│   │   ├── Callout, StatementCallout, Quote, StatBlock, TakeawayCard
│   │   ├── PrincipleList, ComparisonBlock, SpecHierarchy, PipelineStep
│   │   ├── ActCard, AgentIcon, CompetitorGrid, HeadlineMarquee, SchoolsOfThought
│   └── react/                   # Interactive islands (`client:visible` / `client:load`)
│       ├── DocumentViewer.tsx   # Site-wide modal viewer for PDF / JSON / Markdown / XLSX / DOCX
│       ├── DetailExpander.tsx   # Progressive-disclosure expander
│       ├── ZoomableImage.tsx    # Hover magnifier + lightbox (Part 04 diagrams)
│       ├── StackedCards.tsx     # Stacked-card list (Part 05 onboarding difficulties)
│       ├── ReplayConsole.tsx    # (legacy / unused — pre-codex replay)
│       └── demo-codex/          # The /demo experience (see "Demo replay architecture")
├── content/
│   ├── config.ts                # 'parts' collection schema
│   └── parts/                   # part-01..05 MDX (frontmatter + prose for Overview sections)
├── data/
│   ├── pipeline-run.json        # (legacy fixture — superseded by demo-codex/)
│   └── demo-codex/              # Four-scenario replay data (see below)
│       ├── index.ts             # scenarios registry: { clean, escalated, blocked, escalated_step4 }
│       ├── types.ts             # DemoScenario, DemoStep, RetrievedEvidenceItem, etc.
│       └── scenarios/
│           ├── clean.ts             # Happy path · COMPLETE
│           ├── escalated.ts         # Legal blockers · ESCALATED (halts at STEP-03)
│           ├── blocked.ts           # Missing source · BLOCKED (halts at STEP-04)
│           └── escalatedStep4.ts    # Coverage gap · ESCALATED (halts at STEP-04)
└── styles/
    └── global.css               # Tailwind layers + .eyebrow / .lede / .prose-narrative

public/
├── favicon.svg
├── headlines/                   # Press-headline images for Part 01 marquee
├── mock-documents/              # Cross-scenario mock corpus (.xlsx + generated .sheet.json siblings)
├── stack-documents/             # PRD / Design Doc / Context Contract / Agent Specs (PDF, DOCX, MD)
├── scenarios/                   # Per-scenario captured artefacts served at /scenarios/scenario-N/
│   ├── scenario-1/              # Happy-path COMPLETE — agent_outputs, agent_input_bundles, mock_documents, supervisor_audit_log.json
│   ├── scenario-2/              # Legal-blockers ESCALATED
│   ├── scenario-3/              # Missing-source BLOCKED
│   └── scenario-4/              # Coverage-gap ESCALATED
├── retrieval.png, retrieval-explain.png, robot_diagram_fixed.png, outlook.png   # Part 04 diagrams (ZoomableImage)
└── three-pillars.svg

scripts/
├── convert-xlsx.mjs             # .xlsx → .sheet.json (consumed by DocumentViewer kind="sheet")
└── convert-docx.mjs             # .docx → .html.json  (consumed by DocumentViewer kind="docx")

scenario_blocked_demo/, scenario_escalated_step4_demo/,
scenario1_docs_for_web_app/, scenario2_docs_for_web_app/   # Upstream-pipeline source artefacts;
                                                          # mirror into public/scenarios/scenario-N/

product_docs/                    # Canonical PRD / Design Doc / Context Contract source files;
                                 # mirror into public/stack-documents/ for serving
tests/                           # Reserved (empty)
```

Root docs: `README.md`, `CLAUDE.md`, `AGENTS.md`, `master_log.md`, `presentation_flow.md`, `summary_notes.md`, `USER_MANUAL.md` (this file). `past_prompts.md` is operator-private — do not read or modify.

## Entry points / routes

| Route       | Page file                  | What it renders                                                                  |
| ----------- | -------------------------- | -------------------------------------------------------------------------------- |
| `/`         | `src/pages/index.astro`    | Long-scroll Overview: Parts 01–05 (sourced from `src/content/parts/*.mdx`)        |
| `/demo`     | `src/pages/demo.astro`     | Hero + framing strip + `<DemoExperience client:load />` island                    |
| `/findings` | `src/pages/findings.astro` | "Summary & closing thoughts" page (browser tab title is "Summary")                |

Top-nav labels (in `src/components/astro/SiteHeader.astro`): **Overview / Demo / Summary**. The `/findings` URL is preserved for inbound links.

## Demo replay architecture (`src/components/react/demo-codex/`)

Single React island (`DemoExperience.tsx`) wired to a Zustand store (`store.ts`). All replay state lives in the store.

| File                          | Role                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `DemoExperience.tsx`          | Top-level layout — selector, framing strip, sticky controls, stages frame, finals frame    |
| `store.ts`                    | Zustand store: `scenario`, `currentStep`, `phase`, `mode`, plus play/pause/step/reset/etc. |
| `ScenarioSelector.tsx`        | Sliding 4-pill toggle — title / status emission / subtitle per pill                        |
| `RunSummaryChips.tsx`         | Coloured chips driven by `scenarios[id].summaryChips`                                      |
| `ExecutionStrip.tsx`          | Sticky supervisor rail — node per step, animated phase indicator                           |
| `ReplayControls.tsx`          | Play / pause / step-back / step / reset / speed                                            |
| `CurrentStepPanel.tsx`        | "Stages" black box — Stage 1–4 detail for the active step                                  |
| `stages.tsx`                  | Per-phase stage components used inside CurrentStepPanel                                    |
| `StepInspectionDrawers.tsx`   | "Technical Inspection" — agent input bundle + raw structured output + sources + audit log  |
| `SourceDocumentsDrawer.tsx`   | Per-step source cards; resolves names → `DocumentViewer` calls                              |
| `FinalOutputsPanel.tsx`       | Final-outputs frame — checklist, blockers, stakeholder guidance                            |
| `TakeawayPanel.tsx`           | "What this scenario demonstrates" — headline + body                                        |
| `StructuredOutputViewer.tsx`  | Pretty JSON view of agent `parsed_output`                                                  |
| `ExpandableDrawer.tsx`        | Generic accordion drawer used inside Step Inspection                                       |
| `badges.tsx`                  | `AuthorityBadge`, `LaneBadge`, `TreatmentBadge` — meta + colours                           |
| `StatusPill.tsx`              | COMPLETE / ESCALATED / BLOCKED / NOT_RUN pill                                              |

The store treats `'COMPLETE' | 'ESCALATED' | 'BLOCKED' | 'NOT_RUN'` as terminal-halt statuses.

## Spec-document conversion pipeline

`prebuild` and `predev` run **before** `astro dev` / `astro build`:

```
node scripts/convert-xlsx.mjs    # walks public/**/*.xlsx → writes <name>.sheet.json siblings
node scripts/convert-docx.mjs    # walks public/**/*.docx → writes <name>.html.json siblings
```

`DocumentViewer.tsx` fetches the generated `.sheet.json` / `.html.json` at runtime when `kind` is `'sheet'` / `'docx'`. PDFs render in an `<iframe>`. Markdown is fetched and parsed with `marked`. JSON is fetched and pretty-printed.

If you replace a `.xlsx` or `.docx` source, the next `pnpm dev` / `pnpm build` regenerates the JSON. To force a one-off regen without restarting: `pnpm docs:sheets` or `pnpm docs:docx`.

PDFs are served as-is (no conversion). When you update a PDF in `product_docs/`, copy it into `public/stack-documents/` manually.

## Static asset layout (`public/`)

- **`/scenarios/scenario-{1..4}/`** — captured run artefacts per scenario. Bundle paths (`scenario_N__STEP-XX__bundle.json`), agent outputs, mock documents (with per-scenario questionnaires), and `supervisor_audit_log.json`. `StepInspectionDrawers.tsx` and `SourceDocumentsDrawer.tsx` build URLs against this layout.
- **`/stack-documents/`** — governance document stack: `PRD_v1_2.{pdf,docx,html.json}`, `DesignDoc_v1_2.{pdf,docx,html.json}`, `ContextContractv1_5.{pdf,docx,html.json}`, `Agent_Spec_Version_Log.md`, the five `<role>_Agent_Spec.md` files, `supervisor_orchestration_plan.md`.
- **`/mock-documents/`** — cross-scenario reference XLSX matrices (`DPA_Legal_Trigger_Matrix_v1_3.xlsx`, `Procurement_Approval_Matrix_v2_0.xlsx`).
- **Diagrams (root)** — `retrieval.png`, `retrieval-explain.png`, `robot_diagram_fixed.png`, `outlook.png`. Surfaced via `<ZoomableImage>` on Part 04.

## Key configuration files

| File                               | Purpose                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `astro.config.mjs`                 | Astro integrations: `@astrojs/react`, `@astrojs/mdx`, `@astrojs/tailwind`            |
| `tailwind.config.cjs`              | Theme — `ink` / `paper` / `accent` / `spruce` / `rose` palettes, display/lede sizes  |
| `tsconfig.json`                    | Extends `astro/tsconfigs/strict`; `@/*` alias → `src/*`                              |
| `.eslintrc.cjs`, `.prettierrc.json`| Lint + format rules (with `prettier-plugin-astro`, `prettier-plugin-tailwindcss`)    |
| `.nvmrc`                           | Pins Node 20                                                                         |
| `.env.example`                     | Placeholder; no secrets required in v1                                               |

## Commands (from repo root)

```bash
pnpm install            # install deps (use --frozen-lockfile in CI)
pnpm dev                # runs predev (xlsx + docx convert) → dev server on http://localhost:4321
pnpm build              # runs prebuild → static build → dist/
pnpm preview            # serve the built site locally
pnpm docs:sheets        # one-off: regenerate .sheet.json from public/**/*.xlsx
pnpm docs:docx          # one-off: regenerate .html.json from public/**/*.docx
pnpm lint               # ESLint across .js/.jsx/.ts/.tsx/.astro
pnpm format             # Prettier write
pnpm format:check       # Prettier check (CI)
pnpm test               # placeholder — no suite yet
```

First-time setup: `corepack enable pnpm && nvm use && pnpm install`.

## Editing content

- **Overview prose** — `src/content/parts/part-0{1..5}-*.mdx`. Frontmatter (`order`, `key`, `eyebrow`, `title`, `lede`, `tone`) drives the section hero; body is MDX. Schema enforced by `src/content/config.ts`.
- **Demo / Summary pages** — content lives directly in `src/pages/demo.astro` and `src/pages/findings.astro` (not the content collection).
- **Scenario data** — each scenario file under `src/data/demo-codex/scenarios/` is a `DemoScenario` object: `summaryChips`, six `steps[]`, `finalOutputs`, `takeaway`. Edit values directly; the UI is fully data-driven.
- **Spec / mock documents** — replace files under `public/stack-documents/` or `public/mock-documents/` (and the per-scenario `mock_documents/` dirs). XLSX and DOCX regenerate automatically on next dev/build; PDFs need a manual copy.

## Adding or modifying a scenario

1. Add a new file in `src/data/demo-codex/scenarios/<id>.ts` exporting a `DemoScenario` (use an existing scenario as the template).
2. Extend `ScenarioId` in `src/data/demo-codex/types.ts` and register the export in `src/data/demo-codex/index.ts`.
3. Update the wiring in `src/components/react/demo-codex/`:
   - `ScenarioSelector.tsx` → add to `ORDER` and `PILL_SUBTITLE`
   - `DemoExperience.tsx` → extend the framing-strip Summary paragraph + scenario-number ternary
   - `StepInspectionDrawers.tsx` → add the new id to `BUNDLE_EXISTS` / `SCENARIO_NUMBER` / `SCENARIO_LABEL`
   - `SourceDocumentsDrawer.tsx` → add to `SCENARIO_NUMBER` and any per-scenario filename branches
4. Mirror raw artefacts to `public/scenarios/scenario-N/` (bundles renamed `scenario_N__STEP-XX__bundle.json`).
5. `pnpm build` to verify.

## Workflow reminders

- Never commit to `main` directly. Branch as `feat/...`, `fix/...`, `chore/...`, `content/...`.
- Log meaningful changes in `master_log.md` (format in `CLAUDE.md`).
- Keep `public/stack-documents/` PDFs in sync with `product_docs/core_docs/` by manual copy.
- Never read or modify `past_prompts.md`.
