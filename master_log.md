# Master Log

### [#1] 2026-04-21 | Claude Code
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

