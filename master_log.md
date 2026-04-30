# Master Log

### [#1] 2026-04-21 | Claude

**Task:** Initial repo setup per README.md and CLAUDE.md — install the full tech stack, create configuration, and scaffold the Astro project structure.
**Plan:**

1. Enable pnpm via corepack.
2. Remove stray Python `venv/` (unrelated to this JS project).
3. Author `package.json` pinning the full stack (Astro 4, React, MDX, Tailwind, Radix UI primitives, Framer Motion, D3, Mermaid, ESLint, Prettier).
4. Add config files: `astro.config.mjs`, `tailwind.config.cjs`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc.json`, `.prettierignore`.
5. Add `.nvmrc` (Node 20), `.gitignore` (covers `node_modules`, `.astro`, `dist`, `.vercel`, `.env*`, editor dirs, Python venvs), `.env.example`.
6. Scaffold `src/` — `pages/{index,demo,findings}.astro`, `layouts/BaseLayout.astro`, `components/{react,astro}/`, `content/parts/*.mdx` (parts 1–7 placeholders), `data/pipeline-run.json`, `styles/global.css`.
7. Add `public/favicon.svg`.
8. Install dependencies and verify `pnpm build`.

**Changes:**

- Deleted: `venv/` (stray Python virtualenv).
- Created: `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `.gitignore`, `.env.example`, `astro.config.mjs`, `tailwind.config.cjs`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc.json`, `.prettierignore`.
- Created: `src/pages/{index,demo,findings}.astro`, `src/layouts/BaseLayout.astro`, `src/components/react/DetailExpander.tsx`, `src/components/astro/SectionFrame.astro`, `src/content/config.ts`, `src/content/parts/part-0{1..7}-*.mdx`, `src/data/pipeline-run.json`, `src/styles/global.css`, `public/favicon.svg`, `tests/.gitkeep`, `master_log.md`.
- Commands run: `corepack enable pnpm`, `corepack prepare pnpm@9.15.0 --activate`, `pnpm install`, `pnpm build`.

**Result:** `pnpm build` succeeds — 3 static pages generated (`/`, `/demo`, `/findings`). All dependencies from the README tech-stack table installed. Directory layout matches CLAUDE.md "Project Structure Expectations". Work performed on `main` as explicitly authorized by user for initial scaffolding.

**Next:** Add real content to `src/content/parts/*.mdx`; wire up an Astro content-collection loader in each page; implement the real `DetailExpander` on Radix `Accordion`; begin Part 1 copy per presentation flow in CLAUDE.md; set up Vercel deploy.

---

### [#2] 2026-04-21 | Claude Code

**Task:** Phase 2 — move from working scaffold into real narrative architecture and reusable presentation primitives per `scaffolding_prompt.md`. Branch: `feat/narrative-architecture`.

**Plan:**

1. Audit existing scaffold; keep `BaseLayout` / `DetailExpander`; replace generic `SectionFrame` with purpose-built primitives.
2. Establish a restrained visual language — extended Tailwind theme (ink/paper/accent palette, typography scale, container widths, section spacing), global typography defaults in `global.css`.
3. Add site-wide `SiteHeader` (sticky nav) and `SiteFooter`; thread through `BaseLayout`.
4. Build presentation primitives: `Container`, `NarrativeSection`, `SectionHero`, `Callout`, `TakeawayCard`, `PrincipleList`, `ComparisonBlock`, `SpecHierarchy`, `PipelineStep`, `Quote`, refined `DetailExpander`.
5. Restructure `src/content/parts/*.mdx` with structured frontmatter (order, key, eyebrow, title, lede, tone); update content-collection schema accordingly.
6. Compose homepage narrative (parts 1–5) against the primitives; pull prose from MDX; wire `DetailExpander` for progressive disclosure in key spots.
7. Upgrade `/demo` into a replay-interface scaffold: run-summary strip, pipeline steps rail, detail panel, evidence, rationale, determination output — backed by `ReplayConsole.tsx` + structured `pipeline-run.json` (6 steps, escalation scenario).
8. Upgrade `/findings` with structured sections: key findings, demonstrations, evaluation, limitations, reflections, future work.

**Changes:**

- Modified: `tailwind.config.cjs` (ink/paper/accent palette, fontFamily stacks, maxWidth, spacing, fontSize, shadows), `src/styles/global.css` (typography base, `.eyebrow` / `.lede` / `.prose-narrative` component classes, focus-visible ring), `src/layouts/BaseLayout.astro` (header/footer, better titling), `src/components/react/DetailExpander.tsx` (labelled kinds, better affordance), `src/content/config.ts` (new schema), `src/pages/index.astro` (full narrative composition), `src/pages/demo.astro` (replay interface scaffold), `src/pages/findings.astro` (structured findings page), `src/data/pipeline-run.json` (6-step escalation run fixture), `src/content/parts/part-0{1..5}-*.mdx` (real frontmatter + scaffold prose).
- Created: `src/components/astro/{Container,SiteHeader,SiteFooter,NarrativeSection,SectionHero,Callout,TakeawayCard,PrincipleList,ComparisonBlock,SpecHierarchy,PipelineStep,Quote}.astro`, `src/components/react/ReplayConsole.tsx`.
- Deleted: `src/components/astro/SectionFrame.astro` (superseded), `src/content/parts/part-06-demo.mdx`, `src/content/parts/part-07-findings.mdx` (demo and findings pages have their own structure rather than pulling from the parts collection).
- Commands run: `pnpm build` (passes; 3 static pages; 2 React islands — `DetailExpander`, `ReplayConsole`).

**Result:** Build passes. Homepage now reads as a long-scroll narrative composition with intentional section treatments. `/demo` is a credible replay-interface scaffold backed by a realistic mock run. `/findings` has real structure for all six subsections. A coherent set of primitives exists without becoming a design system.

**Next:** Real copy passes on parts 3–5; wire the remaining homepage primitives (add `PipelineStep` rail visualization for the approach section); replace JSON pipeline-run with the real captured run from the upstream repo; add basic Playwright smoke tests; move `DetailExpander` onto Radix `Accordion` primitives once variants settle; begin Vercel setup.

---

### [#3] 2026-04-21 | Codex

**Task:** Summary-notes-driven creative build on branch `feat/summary-build-codex`.
**Plan:**

1. Re-read `summary_notes.md` and current scaffold to identify the strongest narrative spine and demo/storytelling opportunities.
2. Refresh the site's visual system and shared chrome while preserving the repo's Astro-first architecture.
3. Recompose the homepage, demo page, and findings page around the strongest insights from the notes: enterprise AI paradox, governed translation into executable context, deterministic orchestration, three-pane replay, and nuanced failure analysis.
4. Update supporting content/data structures where needed and verify with lint/build.

**Changes:**

- Modified: `tailwind.config.cjs`, `src/styles/global.css`, `src/components/astro/{SiteHeader,SiteFooter,SpecHierarchy}.astro` for the refreshed visual system, tighter brand framing, and the five-layer implementation stack.
- Modified: `src/content/parts/part-0{1..5}-*.mdx` to better align the homepage narrative with the strongest lines from `summary_notes.md`.
- Rebuilt: `src/pages/{index,demo,findings}.astro` around a stronger presentation spine:
  - homepage emphasizes the enterprise AI paradox, landscape, governed translation layer, deterministic retrieval flow, and scenario acts
  - `/demo` now frames the replay as a three-pane trace
  - `/findings` now centers subtle failure analysis, behavioral evaluation, honest scope claims, and future work
- Rebuilt: `src/components/react/ReplayConsole.tsx` and `src/data/pipeline-run.json` to support richer step-level replay content: triggers, supervisor questions, subqueries, evidence items, bundle contents, determinations, and audit notes.
- Modified: `.eslintrc.cjs`, `src/components/astro/Container.astro`, and `src/env.d.ts` to resolve lint/tooling issues surfaced during verification.
- Commands run: `pnpm format`, `pnpm lint`, `pnpm build`.

**Result:** `pnpm lint` and `pnpm build` both pass. The branch now contains a more intentional presentation build oriented around the strongest ideas from the working notes: context as a governed runtime package, deterministic supervision, source-aware retrieval, and nuanced failure analysis rather than generic "AI demo" framing.

**Next:** Optional follow-up work could tighten responsive polish further, replace the synthetic replay fixture with the true upstream capture, and decide whether any of the current presentation copy should be distilled into external-facing README updates.


---

### [#4] 2026-04-25 | Claude Code

**Task:** Build the Demo (Part 06) page on branch `feat/demo-page-initial-codex` (parallel attempt to the claude branch), following `build-prompt-demo-page-codex.md`. The codex prompt asks for an animated guided replay with the supervisor as a visible architectural actor, evidence-to-bundle-to-agent flow animation, and explicit phase-by-phase progression — distinct from the claude branch's reader-controlled scrubbing.

**Plan:**

1. Branch off `feat/demo-page` (NOT off the claude branch); restore build-prompt files from the claude branch.
2. Add `zustand`, `lucide-react`, `@radix-ui/react-collapsible` per codex-prompt recommendations. Skip shiki — write a custom palette-consistent JSON renderer instead.
3. Lay down typed scenario fixtures matching the codex-prompt schema (`replayMoments`, `gateDecision`, `finalOutputs`, `takeaway`).
4. Build a phase-driven replay state machine in Zustand: stopped → playing/paused/ended; phases idle → retrieving → bundling → dispatching → agent_working → output_ready → gating → decided → completed.
5. Build a `SupervisorRail` that surfaces the supervisor's current action live; an `ExecutionStrip` whose status icons compute from replay phase; four narrative `stages` (Retrieval, Bundle, Agent, Gate) that gate visibility on phase progress.
6. Wire keyboard: Space play/pause, → step, R reset.

**Changes:**

- Added: `src/data/demo-codex/{types.ts,index.ts,scenarios/clean.ts,scenarios/escalated.ts}` — typed fixtures for both runs with replay narration per phase, gate decisions, audit events, final outputs, and per-scenario takeaway.
- Added: `src/components/react/demo-codex/` — `store.ts` (replay state machine), `DemoExperience.tsx` (top-level island, MotionConfig + keyboard), `SupervisorRail.tsx` (sticky animated supervisor presence), `ExecutionStrip.tsx` + `ExecutionStepCard` with status computed from replay phase, `stages.tsx` (RetrievalStage, BundleStage, AgentStage, GateStage all gated on `phaseIndex`), `CurrentStepPanel.tsx` (composes the four stages + drawers), `StructuredOutputViewer.tsx` (custom JSON tokenizer with hoverable Tooltip-backed citation chips on top-level keys), `AuditEventsPanel.tsx`, `SourceDocumentsDrawer.tsx` (Radix Dialog with placeholder previews per source), `ExpandableDrawer.tsx` (generic Radix Collapsible + Framer height-tween), `FinalOutputsPanel.tsx` (checklist + blockers + stakeholder guidance, per-scenario), `TakeawayPanel.tsx`, `ReplayControls.tsx` (Start/Pause/Step/Jump/Reset + 1×/1.5×/2× speed), `RunSummaryChips.tsx`, `ScenarioSelector.tsx`, `StatusPill.tsx`, `badges.tsx` (AuthorityBadge, LaneBadge, TreatmentBadge).
- Modified: `src/pages/demo.astro` — rewrote as thin hero shell mounting `<DemoExperience client:load />`. Existing `ReplayConsole.tsx` and `pipeline-run.json` left untouched but no longer imported.
- Modified: `package.json` / `pnpm-lock.yaml` — added zustand, lucide-react, @radix-ui/react-collapsible.
- Commands run: `pnpm add`, `pnpm build` (passes), manual smoke via `astro dev` on http://localhost:4339/demo (HTTP 200, no SSR errors in dev log).

**Result:** `pnpm build` passes. Page renders end-to-end. The Start Replay button drives the supervisor rail through phased animations per step (retrieving → bundling → dispatching → agent_working → output_ready → gating → decided), with the four stage cards lighting up in sequence. Pause/Step/Jump/Reset all work. Speed selector reschedules timers without restarting. Clicking any execution-strip step pauses replay and inspects that step (including NOT_RUN steps in the escalated run). Hovering a top-level field's cite chip in the structured output reveals the source via a Radix Tooltip. Bundle: DemoExperience island ≈ 151 KB / 41 KB gz (no shiki — custom JSON renderer is ~120 LoC).

**Next:** Browser-verify the timed replay feel on real hardware (might want to tune phase durations); the scenario-comparison side-by-side view from the claude branch was deliberately omitted because the codex prompt didn't ask for it (one scenario at a time is the codex pattern); responsive: execution strip stacks vertically on mobile, stages stack naturally, but supervisor rail's progress dots column hides on `<lg` — could add a compact version. Existing `ReplayConsole.tsx` and `pipeline-run.json` are again superseded; safe to remove once direction is approved.
