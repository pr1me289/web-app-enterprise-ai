# Narrative Web-app for Enterprise-AI Project

> A narrative web application presenting a spec-driven approach to enterprise context engineering — a governance philosophy and multi-agent architecture for deploying LLM agents safely and effectively over enterprise data.

[![Built with Astro](https://img.shields.io/badge/built%20with-Astro%204-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9%2B-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

The system being presented was built in a separate engineering repository. **This site presents the approach, architecture, and findings** — backed by four pre-captured pipeline runs the visitor can replay step-by-step.

---

## Table of contents

- [What this site is](#what-this-site-is)
- [Pages](#pages)
- [The spec stack](#the-spec-stack)
- [The demo](#the-demo)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Build pipeline](#build-pipeline)
- [Commands](#commands)
- [Deployment](#deployment)
- [License](#license)

---

## What this site is

The subject is a **governance philosophy and architecture for enterprise AI**: how to deploy LLM agents over sensitive enterprise data with auditability, role-based access, and determinism built in from the start rather than retrofitted. The presentation is structured for two audiences in parallel — recruiters / hiring managers / non-technical stakeholders, and engineers / architects — using progressive disclosure throughout.

The approach is demonstrated end-to-end through a mock vendor-onboarding pipeline (a fictional manufacturer "Lichen Manufacturing" onboarding a fictional vendor "OptiChain"). The scenario is the vehicle, not the subject; the principles generalize across enterprise workflows.

The system being presented consists of:

- **Five-document spec hierarchy** — PRD → Design Doc → Context Contract → Orchestration Plan → Agent Specs. Each document owns a non-overlapping governance dimension.
- **Deterministic supervisor orchestration** — a Python state machine walking six pipeline steps with explicit gate conditions, retrieval routing, and `PipelineState` mutation rules.
- **Hybrid agentic retrieval** — per-source Chroma (dense) + BM25 (lexical) collections, row-targeted matrix retrieval, cross-encoder re-ranking, authority-weighted bundle assembly across multiple governed source types.
- **LLM domain agents** — five agents (IT Security, Legal, Procurement, Checklist Assembler, Checkoff), each governed by a behavioral spec with strict DOs / DON'Ts, output contracts, and distinct `complete` / `escalated` / `blocked` output shapes.
- **Scenario-based evaluation** — adversarial test fixtures exercising specific behavioral dimensions: silent-swallow of upstream escalation, policy-over-questionnaire conflict, retrieval-layer failure handling, null-passthrough discipline, cross-agent escalation cascades.

---

## Pages

The site is organized as **seven content parts across three deployable pages**.

| Route       | Page              | Contents                                                                                                  |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| `/`         | **Overview**      | Parts 1–5: title framing, problem & landscape, introduction, approach, business scenario                  |
| `/demo`     | **Demo**          | Part 6: interactive replay of four pre-captured pipeline runs                                             |
| `/findings` | **Summary**       | Part 7: closing thoughts, the working argument, status-emission semantics                                 |

Top-nav labels: **Overview · Demo · Summary**.

---

## The spec stack

The architecture is governed by a tight hierarchy of authoritative documents. Each one is previewable directly in the site (PDF, MDX, DOCX, XLSX, JSON — all rendered in a unified `DocumentViewer` modal):

| Stage | Document            | Jurisdiction                                                                              |
| ----- | ------------------- | ----------------------------------------------------------------------------------------- |
| 01    | **PRD**             | Stakeholder intent — what the system must do, why it exists, who it is for.              |
| 02    | **Design Doc**      | System architecture — how the system is designed and what technical shape it takes.       |
| 03    | **Context Contract**| Context governance — source authority, retrieval rules, agent visibility boundaries.      |
| 04    | **Orchestration Plan** | Runtime workflow — execution order, gates, state changes, escalation flow.             |
| 05    | **Agent Specs**     | Agent behavior — DOs, DON'Ts, scope boundaries, output contracts (one per domain agent).  |

---

## The demo

The `/demo` page replays **four captured runs** of the vendor-onboarding pipeline, each illustrating a different terminal status emission of the deterministic supervisor:

| # | Scenario                                | Outcome    | Halts at  | Demonstrates                                                                  |
| - | --------------------------------------- | ---------- | --------- | ----------------------------------------------------------------------------- |
| 1 | **Legal blockers**                      | ESCALATED  | STEP-03   | DPA missing + NDA unconfirmed → escalation routes to legal                    |
| 2 | **Happy path fast-track**               | COMPLETE   | —         | Six steps complete; fast-track approved; stakeholder-ready package emitted    |
| 3 | **Missing source**                      | BLOCKED    | STEP-04   | Required matrix not registered in retrieval layer; agent refuses to fabricate |
| 4 | **Coverage gap**                        | ESCALATED  | STEP-04   | Matrix returns rows but none match vendor profile; escalates to Procurement   |

The supervisor's **three terminal status emissions** are first-class concepts:

- **`COMPLETE`** — step succeeds and pipeline proceeds.
- **`ESCALATED`** — conflicting evidence or ambiguous decision; pipeline halts and routes to a human owner.
- **`BLOCKED`** — required evidence absent; pipeline halts before work begins.

Each replay exposes the underlying signals — supervisor audit log, agent input bundles, raw structured outputs, and source documents — so the architecture is not just narrated but **inspectable**.

---

## Tech stack

| Layer                    | Tool                                                                                                                | Purpose                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Framework**            | [Astro 4](https://astro.build)                                                                                       | Content-first static site generator with React island support; native MDX                            |
| **UI runtime**           | [React 18](https://react.dev) (islands only)                                                                         | Interactive components — `DocumentViewer`, `ZoomableImage`, the entire `/demo` experience            |
| **State (demo)**         | [Zustand](https://github.com/pmndrs/zustand)                                                                         | Single-store state for the replay machine (mode, scenario, currentStep, phase)                       |
| **Styling**              | [Tailwind CSS 3](https://tailwindcss.com)                                                                            | Utility-first; extended `ink` / `paper` / `accent` / `spruce` / `rose` palette                       |
| **Content**              | [MDX](https://mdxjs.com) + [Astro content collections](https://docs.astro.build/en/guides/content-collections/)      | Overview prose lives in MDX; schema enforced by `src/content/config.ts`                              |
| **UI primitives**        | [Radix UI](https://www.radix-ui.com)                                                                                 | Headless accessibility (Dialog, Accordion, Collapsible, Tabs, Tooltip)                               |
| **Animation**            | [Framer Motion](https://motion.dev)                                                                                  | Sliding scenario selector, replay-phase transitions, scroll-driven reveals                           |
| **Icons**                | [lucide-react](https://lucide.dev)                                                                                   | Consistent line-icon set                                                                             |
| **Document rendering**   | [`marked`](https://marked.js.org), [`mammoth`](https://github.com/mwilliamson/mammoth.js), [`xlsx`](https://sheetjs.com) | Markdown → HTML; DOCX → HTML (build-time); XLSX → JSON (build-time)                                  |
| **Data viz** (available) | [D3.js](https://d3js.org), [Mermaid](https://mermaid.js.org)                                                          | Bundled for upcoming visualizations                                                                  |
| **Hosting**              | [Vercel](https://vercel.com)                                                                                         | Static hosting with preview deploys per branch                                                       |
| **Runtime**              | [Node.js 20+](https://nodejs.org)                                                                                    | Required by Astro; managed via `nvm`                                                                 |
| **Package manager**      | [pnpm](https://pnpm.io)                                                                                              | Strict, fast, disk-efficient                                                                         |
| **Quality**              | [TypeScript](https://www.typescriptlang.org/) (strict), [ESLint](https://eslint.org), [Prettier](https://prettier.io) | Static checking + lint + format                                                                      |

---

## Project structure

```
src/
├── pages/                       # Routes
│   ├── index.astro              # /          — Overview (Parts 1–5)
│   ├── demo.astro               # /demo      — DemoExperience React island
│   └── findings.astro           # /findings  — Summary & closing thoughts
├── layouts/
│   └── BaseLayout.astro         # <html>, SiteHeader, SiteFooter, global styles
├── components/
│   ├── astro/                   # Static primitives — Container, NarrativeSection,
│   │                            # SectionHero, Callout, StatementCallout, Quote,
│   │                            # StatBlock, TakeawayCard, PrincipleList,
│   │                            # ComparisonBlock, SpecHierarchy, PipelineStep,
│   │                            # ActCard, AgentIcon, CompetitorGrid, HeadlineMarquee,
│   │                            # SchoolsOfThought, SiteHeader, SiteFooter
│   └── react/
│       ├── DocumentViewer.tsx   # Site-wide modal for PDF / JSON / MD / XLSX / DOCX
│       ├── DetailExpander.tsx   # Progressive-disclosure expander
│       ├── ZoomableImage.tsx    # Hover magnifier + lightbox
│       ├── StackedCards.tsx     # Stacked-card list
│       └── demo-codex/          # The /demo replay experience (16 files)
├── content/
│   ├── config.ts                # 'parts' content-collection schema
│   └── parts/                   # part-01..05 MDX (Overview source-of-truth)
├── data/
│   └── demo-codex/              # Four-scenario replay data
│       ├── index.ts             # scenarios registry
│       ├── types.ts             # DemoScenario / DemoStep / RetrievedEvidenceItem / …
│       └── scenarios/           # clean.ts, escalated.ts, blocked.ts, escalatedStep4.ts
└── styles/
    └── global.css               # Tailwind layers + .eyebrow / .lede / .prose-narrative

public/
├── favicon.svg
├── headlines/                   # Press-headline images (Part 01 marquee)
├── stack-documents/             # PRD / Design Doc / Context Contract / Agent Specs
├── mock-documents/              # Cross-scenario mock corpus (.xlsx + generated siblings)
├── scenarios/scenario-{1..4}/   # Per-scenario captured artefacts (bundles, outputs, audit log)
└── *.png, *.svg                 # Inline diagrams (retrieval, robot, outlook, three-pillars)

scripts/
├── convert-xlsx.mjs             # Build-time: .xlsx → .sheet.json siblings
└── convert-docx.mjs             # Build-time: .docx → .html.json siblings
```

A more granular reference (including the `demo-codex/` internals and asset layout) lives in [`USER_MANUAL.md`](./USER_MANUAL.md).

---

## Getting started

### Prerequisites

- **Node.js 20+** — install via [nvm](https://github.com/nvm-sh/nvm). The repo pins the version in `.nvmrc`.
- **pnpm 9+** — enable via Corepack: `corepack enable pnpm`.
- **Git**

### Clone and install

```bash
git clone <repo-url>
cd web-app-enterprise-ai
nvm use            # picks up the pinned Node version
pnpm install       # installs deps + builds .sheet.json / .html.json siblings on first dev/build
```

### Run the dev server

```bash
pnpm dev
```

Visit <http://localhost:4321>.

### Environment variables

None required for v1. If a "try it live" backend is added later, Anthropic API credentials will be managed via Vercel environment variables — never committed.

---

## Build pipeline

The site ships a small two-step content pipeline that runs automatically on every `pnpm dev` and `pnpm build`:

1. **`scripts/convert-xlsx.mjs`** — walks `public/**/*.xlsx` and writes `<name>.sheet.json` siblings (consumed by `DocumentViewer kind="sheet"`).
2. **`scripts/convert-docx.mjs`** — walks `public/**/*.docx` and writes `<name>.html.json` siblings via [Mammoth](https://github.com/mwilliamson/mammoth.js) (consumed by `DocumentViewer kind="docx"`).

Both can be invoked manually:

```bash
pnpm docs:sheets
pnpm docs:docx
```

PDFs and Markdown are served directly with no conversion step. When updating a PDF in `product_docs/`, copy it into `public/stack-documents/` manually.

---

## Commands

```bash
pnpm install              # install dependencies (--frozen-lockfile in CI)
pnpm dev                  # convert-xlsx + convert-docx → dev server on :4321
pnpm build                # convert-xlsx + convert-docx → static build → dist/
pnpm preview              # serve the built site locally
pnpm docs:sheets          # one-off: regenerate .sheet.json siblings
pnpm docs:docx            # one-off: regenerate .html.json siblings
pnpm lint                 # ESLint across .js/.jsx/.ts/.tsx/.astro
pnpm format               # Prettier write
pnpm format:check         # Prettier check (CI)
```

---

## Deployment

The site deploys to **Vercel** on every push. Pull requests get automatic preview deploys at a unique URL, visible in the PR's Vercel comment.

To deploy manually with the Vercel CLI:

```bash
vercel
```

The production domain is managed via Cloudflare Registrar / Vercel domain settings.

CI (Vercel build runner) executes:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm format:check`
- `pnpm build`

All checks must pass.

---

## License

All rights reserved. © 2026 Pierce Nellessen.

---

<sub>Built with [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com).</sub>
