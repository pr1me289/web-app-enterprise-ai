# USER_MANUAL

Operator reference for the `web-app-enterprise-ai` repo. For _why_ over _how_, see `README.md` and `CLAUDE.md`.

## Stack at a glance

Astro 4 · React 18 (islands only) · MDX · Tailwind · TypeScript · `pnpm` · Node 20+.

## Repo structure

```
src/
├── pages/            # Routes: index.astro (/), demo.astro (/demo), findings.astro (/findings)
├── layouts/          # BaseLayout.astro — <html>, header/footer, global styles
├── components/
│   ├── astro/        # Static primitives (Container, NarrativeSection, SectionHero,
│   │                 # Callout, TakeawayCard, PrincipleList, ComparisonBlock,
│   │                 # SpecHierarchy, PipelineStep, Quote, SiteHeader, SiteFooter)
│   └── react/        # Interactive islands (DetailExpander, ReplayConsole)
├── content/
│   ├── config.ts     # 'parts' collection schema (order, key, eyebrow, title, lede, tone)
│   └── parts/        # part-01..05 MDX — frontmatter + prose for homepage sections
├── data/             # pipeline-run.json — mock replay fixture consumed by /demo
└── styles/           # global.css — Tailwind layers + .eyebrow/.lede/.prose-narrative
public/               # favicon.svg and future static assets
tests/                # Reserved (empty)
```

Root docs: `README.md` (external-facing), `CLAUDE.md` (engineering protocol), `AGENTS.md`,
`master_log.md` (session log), `presentation_flow.md`, `scaffolding_prompt.md`,
`product_docs/` (upstream spec artefacts).

## Entry points

- `/` → `src/pages/index.astro` — long-scroll narrative (parts 1–5, from `src/content/parts/`)
- `/demo` → `src/pages/demo.astro` — replay interface, data from `src/data/pipeline-run.json`
- `/findings` → `src/pages/findings.astro` — findings / limitations / reflections / future work

## Key configuration files

| File                                | What it does                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `astro.config.mjs`                  | Astro integrations: `@astrojs/react`, `@astrojs/mdx`, `@astrojs/tailwind`.                |
| `tailwind.config.cjs`               | Extended theme — `ink` / `paper` / `accent` palette, display/lede fonts, section spacing. |
| `tsconfig.json`                     | Extends `astro/tsconfigs/strict`; `@/*` alias → `src/*`.                                  |
| `.eslintrc.cjs`, `.prettierrc.json` | Lint + format rules (with `prettier-plugin-astro`, `prettier-plugin-tailwindcss`).        |
| `.nvmrc`                            | Pins Node 20.                                                                             |
| `.env.example`                      | Placeholder; no secrets required in v1.                                                   |

## Commands (run from repo root)

```bash
pnpm install            # install deps (use --frozen-lockfile in CI)
pnpm dev                # dev server on http://localhost:4321
pnpm build              # static build → dist/
pnpm preview            # serve the built site locally
pnpm lint               # ESLint across .js/.jsx/.ts/.tsx/.astro
pnpm format             # Prettier write
pnpm format:check       # Prettier check (CI)
pnpm test               # placeholder — no suite yet
```

First-time setup: `corepack enable pnpm && nvm use && pnpm install`.

## Editing content

- Homepage sections live in `src/content/parts/part-0{1..5}-*.mdx`. Frontmatter (`order`, `key`, `eyebrow`, `title`, `lede`, `tone`) drives the section hero; body is MDX prose. Schema enforced by `src/content/config.ts`.
- `/demo` and `/findings` do **not** use the content collection — their structure lives in the page file.
- The demo replay reads `src/data/pipeline-run.json` (fields: `run`, `steps[]` with `state`, `evidence`, `rationale`). Swap this file to swap the replay.

## Workflow reminders

- Never commit to `main`. Branch as `feat/...`, `fix/...`, `chore/...`, `content/...`.
- Log meaningful changes in `master_log.md` (format in `CLAUDE.md`).
- Never touch `past_prompts.md`.
