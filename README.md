# Enterprise AI Narrative Web App

A presentation website walking through a spec-driven approach to enterprise context engineering — a governance philosophy and multi-agent architecture for deploying LLM agents safely and effectively over enterprise data.

The approach is demonstrated via a mock business scenario featuring a fictional manufacturer ("Lichen Manufacturing") onboarding a fictional software vendor ("OptiChain"). The scenario makes the governance and architectural principles concrete; it is not the subject.

The underlying pipeline was built in a separate repository. This repository presents the approach, architecture, and findings.

---

## Overview

This site is a narrative web application structured around seven content parts, split across three deployable pages:

**Main page (long-scroll, parts 1–5):**

1. **Title** — framing the enterprise AI paradox: investment vs. impact
2. **Introduction** — a spec-driven approach to enterprise context engineering
3. **Problem & Landscape** — current approaches, players, and constraints in enterprise AI
4. **Approach** — spec-driven development philosophy, deterministic supervisor rationale, hybrid agentic retrieval architecture, domain agent model
5. **Business Scenario** — the mock scenario used for demonstration; stakeholders, problem shape

**/demo page (part 6):** Interactive replay of a captured pipeline run on the mock scenario.

**/findings page (part 7):** What was learned, evaluation results, reflections.

Every section uses progressive disclosure — a plain-language default view with optional expanders revealing spec excerpts, architectural detail, and design rationale. The site is built to serve both non-technical and technical readers without compromising either.

---

## Prior To Working (IMPORTANT)

Read presentation_flow.md

This is our current working (subject to change) presentation flow and ideation doc

---

## What This Site Presents

The subject is a governance philosophy and architecture for enterprise AI: how to deploy LLM agents over sensitive enterprise data with auditability, role-based access, and determinism built in from the start rather than retrofitted. The approach is demonstrated end-to-end through a working pipeline, but the principles generalize across enterprise workflows and are not tied to any particular business function.

The system being presented consists of:

- **Four-document spec hierarchy** — PRD → Design Doc → Context Contract → Agent Specs. Each document owns a specific governance dimension with no overlapping authority.
- **Deterministic supervisor orchestration** — a Python state machine walks six pipeline steps with explicit gate conditions, retrieval routing, and PipelineState mutation rules.
- **Hybrid agentic retrieval** — per-source Chroma (dense) + BM25 (lexical) collections, row-targeted matrix retrieval, cross-encoder re-ranking, authority-weighted bundle assembly across multiple governed source types.
- **LLM domain agents** — five agents (IT Security, Legal, Procurement, Checklist Assembler, Checkoff), each governed by a behavioral spec with strict DOs/DON'Ts, output contracts, and distinct blocked/escalated/complete output shapes.
- **Scenario-based evaluation** — 15+ adversarial test fixtures exercising specific behavioral dimensions: silent-swallow of upstream escalation, policy-over-questionnaire conflict, retrieval-layer failure handling, null-passthrough discipline, cross-agent escalation cascades.

The mock business scenario is built from realistic production-format enterprise documents (PDF policies, XLSX matrices, JSON questionnaires, Slack thread exports) and instantiates a vendor onboarding pipeline — a concrete setting that illustrates the architectural principles without defining them.

---

## Guiding Philosophies

A few principles drive how this site is built:

- **Substance over polish.** The work being presented is the value proposition. Visual refinement matters but never at the cost of substance.
- **Progressive disclosure as core pattern.** Default views stay approachable; technical detail lives one click away. Applied consistently across every section.
- **Content in MDX as single source of truth.** No duplicated prose across components, no content trapped in React props.
- **Ship end-to-end before iterating.** Placeholder content on every section beats polished content on half of them.
- **Simplicity over cleverness.** Reach for frameworks only where interactivity demands them. Most of the site is static HTML by design.

---

## Tech Stack

| Layer                  | Tool                                                 | Purpose                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | [Astro](https://astro.build)                         | Content-first static site generator with React island support. Fast to build, low framework overhead, MDX-native — ideal for narrative sites with interactive bits. |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com)              | Utility-first CSS framework. Inline classes mean fast iteration, no separate CSS files to maintain, pairs natively with Astro.                                      |
| **Content**            | [MDX](https://mdxjs.com)                             | Markdown with embedded JSX components. Prose as markdown, React components inline wherever interactivity is needed. Native Astro support.                           |
| **UI primitives**      | [Radix UI](https://www.radix-ui.com)                 | Headless accessible component primitives (accordions, modals, tabs, dialogs). Tailwind styling on top. Comprehensive and battle-tested.                             |
| **Component patterns** | [shadcn/ui](https://ui.shadcn.com)                   | Copy-paste component patterns built on Radix + Tailwind. You own the code. Excellent starting points for expanders, tabs, dialogs.                                  |
| **Animation**          | [Framer Motion](https://motion.dev)                  | React animation library. Wrap elements in `<motion.div>`, add props. Handles scroll-driven reveals, state transitions, gestures.                                    |
| **Data visualization** | [D3.js](https://d3js.org)                            | Low-level visualization library for the orchestration graph, retrieval flow, and any custom data viz.                                                               |
| **Diagrams**           | [Mermaid](https://mermaid.js.org)                    | Text-to-diagram rendering (flowcharts, sequence diagrams, state machines). Write diagrams as code.                                                                  |
| **Hosting**            | [Vercel](https://vercel.com)                         | One-command deploys, automatic preview URLs on every push, free tier covers portfolio traffic. Native Astro integration.                                            |
| **Runtime**            | [Node.js 20+](https://nodejs.org)                    | Required by Astro. Managed via `nvm`.                                                                                                                               |
| **Package manager**    | [pnpm](https://pnpm.io)                              | Faster than npm, disk-efficient, clean workspace support.                                                                                                           |
| **Editor**             | [VSCode](https://code.visualstudio.com)              | With Astro, MDX, and Tailwind IntelliSense extensions.                                                                                                              |
| **AI pair**            | [Claude Code](https://www.anthropic.com/claude-code) | Agentic coding for scaffolding and iteration. Driven by `CLAUDE.md`.                                                                                                |

---

## Architecture

```
src/
├── pages/              # Route files — one per deployable page
│   ├── index.astro     # Parts 1–5 (long-scroll)
│   ├── demo.astro      # Part 6 (interactive pipeline replay)
│   └── findings.astro  # Part 7 (results and reflections)
├── layouts/            # Shared page layouts and site chrome
├── components/
│   ├── react/          # Interactive React islands
│   │   ├── DetailExpander.tsx   # Progressive-disclosure pattern used site-wide
│   │   ├── ReasoningCallout.tsx # Consistent design-note treatment
│   │   ├── DemoReplay.tsx       # Pipeline run playback component
│   │   └── ...
│   └── astro/          # Static Astro components (headers, footers, section frames)
├── content/            # MDX content organized by section
│   ├── part-01-title.mdx
│   ├── part-02-intro.mdx
│   └── ...
├── data/               # JSON — e.g., captured pipeline run state for demo replay
└── styles/             # Global CSS, Tailwind extensions
```

The site is static by default. Interactivity is added via React islands for the expander, demo replay, and any animated visualizations. There is no backend in v1 — the "demo" plays back a pre-captured run.

---

## Setup

### Prerequisites

- [Node.js 20+](https://nodejs.org) (install via [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/installation)
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd <repo-name>

# Install Node.js version specified in .nvmrc
nvm use

# Install dependencies
pnpm install
```

### Environment variables

None required for v1. If a "try it live" backend is added later, Anthropic API credentials will be managed via Vercel environment variables — never committed to the repo.

See `.env.example` (if present) for any forward-looking variables.

---

## Project Commands

> Keep this section updated as the project evolves.

```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:4321)
pnpm dev

# Run tests (when added)
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Check formatting without writing
pnpm format:check

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## Deployment

The site deploys automatically to Vercel on every push to `main`. Pull requests get automatic preview deploys at a unique URL, visible in the PR's Vercel comment.

To deploy manually:

```bash
# From repo root, after installing Vercel CLI globally
vercel
```

The production domain is managed via Cloudflare Registrar / Vercel domain settings.

---

## System Requirements

- **Node.js**: 20 or higher
- **pnpm**: 9 or higher
- **OS**: macOS, Linux, or Windows (WSL2 recommended for Windows)
- **Browser** (for local development): any modern evergreen browser

---

## Repository Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(...)`, `fix(...)`, `chore(...)`, `content(...)` for copy changes.
- Feature branches are used for all changes — nothing commits directly to `main`.
- See `CLAUDE.md` for the full engineering protocol followed in this repository.

---

## License

All rights reserved. Pierce Nellessen, 2026.
