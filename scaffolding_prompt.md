You are helping me continue development of my enterprise-AI narrative presentation web app.

Current state:
The repo setup and initial scaffolding are already complete.

Already done:
- Astro + React + MDX + Tailwind configured
- three pages exist: /, /demo, /findings
- base layout exists
- initial progressive-disclosure component exists
- placeholder MDX content exists
- content collection exists
- build passes
- initial project structure is in place

If any of the above is not complete, please complete these fulfillments prior to continuing on.

Do not redo initialization or setup work.
Do not rebuild the scaffold from scratch.
Do not spend time on dependency setup unless something is actually missing.

What I need now:
Move this project from “working scaffold” into “real narrative architecture and presentation system.”

Project framing:
This is a narrative web app that presents my enterprise-AI research and implementation work. It is not the underlying product itself. It should feel like a polished, interactive case presentation for technical and semi-technical audiences, with progressive disclosure and a serious, thoughtful visual tone.

Core goal of this phase:
Build the actual information architecture and reusable page patterns that will support the final presentation.

Phase 2 priorities:

1. Refine the content architecture
- Review the current page/content structure
- Improve it if needed so it cleanly supports:
    - homepage long-scroll narrative (parts 1–5)
    - /demo page as a replay/explainer experience
    - /findings page as results/reflections/evaluation
- Keep MDX as the single source of truth for content wherever possible

2. Turn the homepage into a real narrative composition
   The homepage should no longer feel like placeholder sections. It should begin to reflect the true story arc.

Homepage should clearly progress through:
- title / framing
- introduction
- problem & landscape
- approach
- business scenario

For each section, create a stronger content container and presentation pattern so the page feels intentional even before final copy is written.

3. Build reusable presentation primitives
   Create or refine reusable components/patterns for the kinds of content this site will repeatedly use. Examples:
- section hero / section intro block
- narrative section wrapper
- progressive disclosure block
- architecture callout / design rationale callout
- key takeaway card(s)
- principle list / structured bullet treatment
- comparison block for “naive RAG vs hybrid agentic retrieval” style content
- spec hierarchy visual/panel
- process step / pipeline step block
- quote or insight callout if useful

Do not overengineer a design system, but do create a coherent set of reusable primitives.

4. Improve the site-wide visual language
   Without aiming for final polish yet, establish a stronger default visual identity:
- typography hierarchy
- spacing rhythm
- container widths
- section spacing
- restrained color usage
- subtle depth or borders where appropriate
- more premium and intentional feel

Tone should be:
- serious
- technical
- elegant
- restrained
- readable
- not flashy
- not startup-gimmicky

5. Upgrade /demo into a true interface scaffold
   Do not build the full final replay yet, but make /demo look like the beginning of a real interactive replay page.

It should anticipate:
- run summary/header
- pipeline steps rail or step navigation
- selected step detail panel
- status/state treatment
- evidence/rationale/citation area
- maybe a space for audit trail or determination output

Use placeholder or mock data where needed, but structure the page so it feels like a real future replay interface, not a blank placeholder page.

6. Upgrade /findings into a credible narrative page
   Turn /findings into a thoughtful page scaffold with sections for:
- key findings
- what the system demonstrated
- evaluation / test coverage
- limitations
- reflections
- future work

Again, not final content yet, but real page structure and stronger placeholders.

7. Preserve simplicity
- Prefer Astro for static rendering
- Use React only where interactivity actually helps
- Avoid unnecessary complexity
- Avoid premature animation
- Avoid overbuilding charts/visualizations before content structure is clear

8. Respect current repository state
- Work from the existing scaffold
- Improve existing components where appropriate instead of duplicating them
- If a component should be renamed or reorganized, do so cleanly
- Keep codebase readable and maintainable

Concrete tasks I want from you:
1. Audit the current scaffold and identify what should be kept vs refined
2. Refactor the homepage into a stronger long-scroll narrative composition
3. Refine or add reusable presentation primitives
4. Upgrade /demo and /findings from placeholders into credible structured pages
5. Improve global styling and layout rhythm
6. Keep the build passing

Deliverables:
1. Updated pages/components/content structure
2. Brief explanation of the architectural decisions you made
3. Notes on which reusable patterns now exist
4. Confirmation that pnpm build still passes
5. Recommendation for the next development phase after this one

Important constraints:
- Do not spend time on Vercel setup yet
- Do not implement final production polish yet
- Do not build the full interactive replay logic yet
- Do not deeply rewrite all content into final prose yet
- Focus on structure, narrative composition, and reusable presentation patterns