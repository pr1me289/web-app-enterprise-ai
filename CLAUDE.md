# Engineering & Project Development Guidelines — Narrative Web App for Enterprise-AI Project

---

## SECURITY REQUIREMENT (MANDATORY)

This repository must NEVER contain:

- Personal Access Tokens (PATs)
- API keys (Anthropic, Vercel deploy tokens, domain registrar tokens, etc.)
- Private SSH keys
- `.env` files containing secrets
- Any hard-coded credentials

Authentication must be handled via:

- `gh auth login`
- SSH keys
- Environment variables stored outside the repository
- Vercel's environment variable management for deploy-time secrets

Under no circumstances should secrets be committed. If this web app ever gains a "try it live" backend that calls the Anthropic API, the API key lives in Vercel env vars or the backend host's secret store — never in this repo.

---

## Project Context

This repository builds a narrative web application presenting a **spec-driven approach to enterprise context engineering** — a governance philosophy and multi-agent architecture for deploying LLM agents safely and effectively over enterprise data. The underlying system was built in a separate repository; this repo exists to present the approach, architecture, and findings, not to run the pipeline.

**What the presented work is about:**

The broader subject is enterprise AI implementation — specifically, how governance, auditability, and role-based access can be designed into an LLM-driven workflow rather than bolted on after. The approach is spec-driven: system behavior is governed by a tight hierarchy of authoritative documents (PRD → Design Doc → Context Contract → Agent Specs), each with non-overlapping jurisdiction. The architecture is a deterministic supervisor orchestrating LLM domain agents, with hybrid agentic retrieval over governed source material.

The approach is demonstrated via a mock business scenario: a fictional manufacturer ("Lichen Manufacturing") running a vendor onboarding pipeline on a fictional candidate software vendor ("OptiChain"). The scenario exists to make the governance and architectural principles concrete — it is not the subject of the presentation. The subject is the approach itself, which generalizes across enterprise workflows and is not tied to vendor onboarding or to any particular business function.

**What was built upstream (lives in a separate repo):**

- **Four-document spec hierarchy**: PRD → Design Doc → Context Contract → Agent Specs. Each document has tightly scoped authority and no overlapping jurisdictions.
- **Deterministic supervisor orchestration**: a Python state machine walking six pipeline steps with explicit gate conditions, subqueries, retrieval routing, and PipelineState mutation rules.
- **Hybrid agentic retrieval layer**: per-source Chroma collections (dense) + BM25 (lexical), row-targeted matrix retrieval, cross-encoder re-ranking, authority-weighted bundle assembly.
- **LLM domain agents**: five agents (IT Security, Legal, Procurement, Checklist Assembler, Checkoff), each governed by a behavioral spec with strict DOs/DON'Ts, output contracts, blocked/escalated/complete output shapes, and critical acceptance checks.
- **Scenario test suite**: 15+ adversarial fixtures exercising specific behavioral dimensions (silent-swallow of upstream escalation, policy-over-questionnaire conflict, retrieval-layer failure handling, blocked-shape discipline, null-passthrough on escalated runs, cross-agent escalation cascades).
- **Mock enterprise corpus**: realistic production-format documents (PDF policies, XLSX matrices, JSON questionnaires, Slack thread exports) instantiating the mock scenario.

**What this repo is building:**

A narrative web application that walks visitors through the problem (enterprise AI's investment-vs-impact gap), the proposed approach (spec-driven context engineering), the architecture that realizes the approach (orchestration, retrieval, agents, evaluation), and the findings. The audience is split between non-technical stakeholders (recruiters, hiring managers, peers) and technical audiences (engineers, architects). Every section must work at both altitudes — a high-level explanation by default, optional progressive disclosure for technical depth.

The site is primarily a portfolio artifact and will live at a custom domain linked from job applications.

---

## Presentation Flow (Reference)

The site is structured as seven content parts across three deployable pages:

This is subject to change, do not use this presentation flow as the source-of-truth

1. **Title** — news-headline framing of the enterprise AI paradox; McKinsey quote on the gap between AI investment and impact
2. **Introduction** — the working title framing of the approach (currently "A Spec-Driven Approach to Enterprise Context Engineering"); byline
3. **Problem & Landscape** — current approaches to enterprise AI; the players, their perspectives, their constraints
4. **Approach** — spec-driven development philosophy, comparison to adjacent frameworks (Kiro, GitHub Spec Kit), deterministic supervisor rationale, hybrid agentic retrieval architecture, domain agent model, chunking/embedding choices
5. **Business Scenario** — introduction to the mock scenario used for demonstration (Lichen Manufacturing as the onboarding organization, a candidate vendor as the subject), stakeholders, problem shape

**/demo page (part 6):** 6. **Demo in action** — interactive replay of a captured pipeline run on the mock scenario (or video fallback)

**/findings page (part 7):** 7. **Findings** — what was learned, evaluation results, reflections

Progressive disclosure is the site's core interaction pattern. Default views are plain-language. A consistent expander component reveals spec excerpts, architectural detail, or design rationale. The demo is a pre-captured run played back by a React component — not a live backend call in v1.

The mock scenario is a means of demonstration, not the subject. When writing or editing content, keep the spec-driven approach in frame; reference the scenario when it makes the approach concrete, but do not let it become the headline.

---

## Seek Clarification When Necessary

Whenever you encounter conflicting information, unclear instructions, or uncertainty about the meaning or implications of a prompt, stop and ask before proceeding. Do not implement uncertain features or make ambiguous changes. Only act when the instructions, development philosophy, and rationale are clearly understood.

This applies with particular force to content decisions — when rewriting or condensing spec content for presentation, confirm the technical meaning is preserved before committing prose changes.

---

## Development Philosophy

These are operating principles for this project, in priority order:

1. **Substance over polish.** The work being presented is the value proposition. Visual refinement matters but never at the cost of substance time. A rough version of the real content beats a polished version of vague content.
2. **Single source of truth for content.** All prose lives in MDX files. No content in React component props, no duplicated text across components.
3. **One pattern per job.** One progressive-disclosure component, one callout component, one diagram renderer. Consistency beats variety — the reader shouldn't have to re-learn the interface in each section.
4. **Ship something deployable end-to-end before iterating on any single section.** Placeholder content on every section is better than polished content on half the sections.
5. **Simplicity over cleverness.** Prefer straightforward Astro components over elaborate abstractions. Reach for JavaScript frameworks only where interactivity demands them.
6. **Document context that isn't obvious.** When a design decision will look arbitrary to a future reader, leave a comment explaining why.

---

## Dependency & Environment Management

This project uses `pnpm` for dependency management.

### Dependency Rules

- Runtime dependencies: `pnpm add <package>`
- Development tools: `pnpm add -D <package>`
- If CI runs a tool, it must be a project dependency.
- Never rely on globally installed packages.
- Always commit `pnpm-lock.yaml`.
- Use Node.js 20+ (specified in `.nvmrc`).

### When to reach for a new dependency

Add a dependency when it solves a problem that would take more than a day to build correctly (accessibility primitives, animation runtimes, MDX processing). Do not add a dependency for something trivial that a short custom implementation would cover. Every dependency is a commitment to keep working.

---

## Token & Agent Efficiency

- Prefer minimal tool calls; batch related operations when it reduces overhead.
- Do not spawn subagents for tasks achievable in a single pass.
- Be concise by default; provide detailed reasoning only when requested.
- Avoid redundant analysis or repeated explanations.
- When in doubt about scope, ask rather than build speculatively.

---

## Project Structure Expectations

Standard Astro layout:

```
project-root/
│
├── src/
│   ├── pages/              # Route files — index.astro, demo.astro, findings.astro
│   ├── layouts/            # Shared page layouts
│   ├── components/         # Reusable Astro + React components
│   │   ├── react/          # React islands (interactive components)
│   │   └── astro/          # Static Astro components
│   ├── content/            # MDX content, organized by section
│   ├── data/               # JSON — e.g., captured pipeline run for demo replay
│   └── styles/             # Global CSS, Tailwind config extensions
├── public/                 # Static assets — images, fonts, favicon
├── tests/                  # Component and integration tests (when added)
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json           # Only if TypeScript is adopted later
├── package.json
├── pnpm-lock.yaml
├── README.md
├── CLAUDE.md
├── .gitignore
├── .nvmrc
├── master_log.md
└── past_prompts.md
```

Rules:

- Page files live in `src/pages/` — one per route.
- Content (MDX) lives in `src/content/` organized by section.
- React components go in `src/components/react/` and are only used where interactivity is required.
- Static Astro components go in `src/components/astro/`.
- No content in `public/` except binary assets (images, fonts).
- No experimental files in root.

---

## Code Quality Standards

- ESLint passes for JavaScript/JSX.
- Prettier passes for formatting.
- Components are small and focused — one responsibility per component.
- Prop interfaces are explicit (document expected props in comments if not using TypeScript).
- No commented-out blocks of legacy code.
- Avoid premature abstraction — extract a component only when it's used in two or more places.

CI must:

- Install dependencies via `pnpm install --frozen-lockfile`
- Run `pnpm lint`
- Run `pnpm format:check`
- Run `pnpm build` (catches Astro compile errors and broken links)
- Fail on any error

---

## .gitignore Essentials

Never commit:

- `node_modules/`
- `.astro/`
- `dist/`
- `.vercel/`
- `.env`
- `.env.*` (except `.env.example`)
- `.DS_Store`
- `*.log`
- `.idea/`
- `.vscode/`
- Editor swap files
- Local build caches

---

## master_log.md

Record all meaningful changes in `master_log.md` at the project root.

**Entry format:**

```
### [#N] YYYY-MM-DD | {Claude Code | Codex | Manual}
**Task:** What was requested
**Plan:** Steps taken or intended
**Changes:** Files created/modified/deleted, commands run
**Result:** Outcome, errors hit, anything left incomplete
**Next:** Remaining work or open questions (if any)
```

- Session number is ever-incrementing from `#1` — never reset it.
- Log _before_ starting long tasks (plan) and _after_ completing them (result).
- Content-only edits (copy tweaks, typo fixes) don't need full entries — batch them as "copy pass" entries.
- Infrastructure changes, component additions, and structural decisions always get their own entry.

---

## README.md

The README is for external readers (recruiters clicking through the GitHub repo, engineers evaluating the work). Keep it accurate and oriented around what the project is and how to run it locally.

Update it when you change:

- How to install, run, or build the project
- The tech stack (add/remove major dependencies)
- The site structure (add/remove pages)
- Deployment process or hosting target

---

## USER_MANUAL.md

Maintain a `USER_MANUAL.md` file at the project root as a lightweight operator reference for the repository.

**Purpose:**

- Briefly describe the repo structure
- List key files and scripts with a one-line description of what each does
- Identify the main files or entry points used to run the system or program
- Document how to run or use important scripts, including command-line arguments when relevant

**Maintenance rules:**

- Update `USER_MANUAL.md` only when major repository changes are made, such as meaningful structural changes, new key scripts, changed entry points, or changed run flows
- Also update it whenever the user explicitly asks for it to be updated
- Do not make routine minor edits to `USER_MANUAL.md` for small code changes that do not materially affect how a human navigates, runs, or understands the repository
- Keep it concise, practical, and easy for a human or coding agent to scan quickly

---

## past_prompts.md

Do not touch past_prompts.md.

---

## Core Engineering Principles

1. Simplicity over cleverness.
2. Readability over micro-optimization.
3. Performance only when necessary.
4. Less code = less technical debt.
5. Code must be testable and maintainable.
6. Prefer clean logic; push complexity to component boundaries.
7. Build iteratively — verify minimal functionality before expanding.

---

## Code Standards

- Use descriptive names (prefix event handlers with `handle`, e.g. `handleExpanderToggle`).
- Prefer early returns to avoid nesting.
- Follow DRY principles — but only after two concrete usages appear.
- Keep components small and focused.
- Prefer immutable/functional style when it improves clarity.
- Define parent components before their children in the same file.
- Mark existing issues with `TODO:` prefix.
- Keep file organization proportional to project scale.
- Document non-obvious design decisions inline.

---

## AI Modification Protocol (MANDATORY)

When modifying code:

- Make minimal changes required to solve the task.
- Do not refactor unrelated sections.
- Do not rename variables unless necessary.
- Do not introduce new dependencies without explicit justification.
- Preserve existing structure and conventions.
- Prefer extending code over rewriting it.
- Ask before large structural changes.
- Keep changes atomic and logically isolated.

When modifying content (MDX, prose):

- Never rewrite spec-derived content without preserving technical meaning.
- Flag any change where the semantic accuracy of a technical claim is uncertain.
- Treat the spec documents in the upstream pipeline repo as source of truth — this repo's content is derivative.
- Keep the framing consistent: the spec-driven approach is the subject; the mock business scenario is an illustrative vehicle. Do not write copy that recenters the presentation around the scenario.

---

## Git Workflow Protocol

- Never commit directly to `main`.
- Use feature branches: `feat/...`, `fix/...`, `chore/...`, `content/...` (for copy changes).
- One logical change per branch.
- Make atomic commits.
- Use conventional commit format:
  - `feat(demo): add pipeline replay controls`
  - `fix(expander): keyboard navigation traps focus`
  - `content(part-4): tighten supervisor rationale section`
- Open draft PRs early; Vercel auto-generates preview deploys.
- Ensure lint + build pass locally before marking ready.
- CI must pass before merging.

---

## CI Enforcement

CI runs on every push/PR and executes:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm format:check`
- `pnpm build`

All checks must pass before merging.

---

## Error Resolution Order

When CI fails, fix in this order:

1. Formatting (`pnpm format`)
2. Lint errors (`pnpm lint --fix` where safe, manual otherwise)
3. Build errors (broken imports, invalid MDX, missing props)
4. Type errors (if TypeScript is in use)

Guidelines:

- Run formatter before lint.
- Keep changes minimal.
- Follow existing patterns.
- Test the affected page locally before pushing.

---

## Security Requirement (Non-Negotiable)

Remember the first section of this document.

If unsure whether something is sensitive, assume it is and do not commit it.
