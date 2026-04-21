# Working Notes — Organized & Scoped

**Source document:** `A_spec-driven_approach_to_enterprise_context_engineering.md` (≈14,650 words, 3/24/26 → 4/15/26+)
**Organized:** 4/21/26

> This is the reorganized, summarized, and scoped version of your one-month working notes. Section 1 preserves every flagged item verbatim — this is the section to revisit most often. Sections 2–8 condense the rest into navigable topical areas. Section 9 preserves the chronological spine for historical context. Section 10 catalogs external references.

---

## Table of Contents

1. **Flagged Items** — every `AN IDEA` / `IDEA` / `IMPORTANT` / `Worth Considering` / `DEMO-INFO` tag, preserved verbatim and sorted by type
2. **Framing Insights** — standalone realizations worth preserving (unflagged but substantive)
3. **Research Foundations** — SDD toolkits, context rot, guideline adherence, research gaps
4. **Enterprise AI Landscape** — players, layers, context engines, eight alternate approaches
5. **Architectural Patterns & Protocols** — agentic retrieval deep dive, MCP/A2A, RAG pros/cons, hybrid search
6. **Scope Definition & Demo Plan Evolution** — from 4-day outline to extended build
7. **Demo Build Timeline** — Day 1 → Day 16, condensed with key decisions per day
8. **Finalized Business Scenario** — Lichen Manufacturing / OptiChain (preserved near-verbatim)
9. **Presentation Plan** — layout, modes, UI structure
10. **External References Catalog** — every link and source cited
11. **Scope Discipline** — what to de-emphasize going forward

---

# 1. Flagged Items

Every explicit marker you used throughout the month, preserved verbatim, grouped by marker type, in chronological order within each group. Dates and surrounding context added where helpful.

## 1.1 `AN IDEA` / `IDEA` / `Idea` — Forward-Looking Ideas

Ideas you flagged for future consideration. Several have already been decided on (noted inline).

### Document & Template Ideas

**Day 1 (~3/30/26) — UI automation for the spec chain:**
> *"An idea I have: we could automate part of this process, or even create a simplistic UI for it (potentially even using a simple PyQt6 UI app for the sake of demo). Where the stakeholders fill in the PRD, and automatically part of the design doc is filled in, and then engineers fill-in the rest of the design doc, making edits to the automated bits when needed, and so on for the context contract and then the agent spec doc."*

**Day 3 — Design doc as pamphlet:**
> **AN IDEA:** Create a visually appealing, condensed version of the design doc, almost like a pamphlet, for engineers to have a quick, easy reference point

**Day 3 — Verbatim design principles:**
> **AN IDEA:** Translate Design Principles verbatim from Design Doc to Agent Spec

### Agent Architecture Ideas

**Day 4 — Supervisor-of-agents with document mastery:**
> **AN IDEA:** Create an additional agent which is a supervisor of other agents and a master of design docs, context contract, and AI spec

**Day 4 — Per-document guardian agents:**
> **AN IDEA:** Or, expanding upon the last point, we could have unique agents which are masters of each document, and whose job is to make sure project guidelines are upheld throughout development.

**Day 5 — Request artifacts from vendor:**
> **AN IDEA:** Perhaps add this --> **Architecture Diagram / Data Flow Attachment Request**

**Day 5 — Guardrails for agents:**
> **AN IDEA:** Apply guardrails for the Agents somehow?

**Day 5 — Slack conflict escalation:**
> **AN IDEA:** when two slack threads conflict, escalate

### Retrieval & Evaluation Ideas

**Day 6 — Evaluation stage illustration:**
> **AN IDEA:** Maybe there is a way to illustrate the differences in outputs here, in our evaluation stage?

**Day 7 — Automate retrieval method selection:**
> **AN IDEA:** We could automate pre-determined retrieval methods as they are listed in the Context Contract

### Orchestration Ideas

**Day 10 — Parallelism decision (DECIDED):**
> **AN IDEA:** Either remove the Step 3, Step 4 parallelism or use it as a point of demo
> *Decided: removing parallelism, now steps 3 and 4 are sequential.*

**Day 10 — Document sync storytelling:**
> **AN IDEA:** Find a way to talk about document sync, how things locked in the orchestration plan later need to update the design doc, and so on—working backwards

### Reflection / Presentation Ideas

**Day 13 — Trim agent spec docs:**
> **IDEA:** I could potentially trim up the Agent Spec Docs.

**Day 13 — Master log summarization for presentation:**
> **IDEA:** Summarize master_log posts for sake of presentation to discuss the work that went in

**Day 14 — Agent scale argument:**
> **AN IDEA:** Maybe the benefit of having my agents isn't exactly illustrated in this demo due to the small scale of it, which was done for simplicity. Agents, taking chunked and embedded documents, can do so at a massive scale. They can take completely new documents, and be more adaptive to categorizing based on a provided output contract than a programmatic system. The work to program a free-lance agent is much less than pre-coding and anticipating every possibility.

**Day 15 — Reasoning trace diagnostics:**
> **IDEA:** Maybe do some agent reasoning tracing to learn more about the potential flaws or trace of the WHY in agent thought process in coming to decisions.

## 1.2 `IMPORTANT` — Hard Constraints & Non-Negotiables

**Day 1 — Documentation habits:**
> **IMPORTANT POINT FOR ENTERPRISES** *(from Unblocked / Pilarinos notes)* — habits of documentation, writing things down are critical; context engines can't recover information that was never captured.

**Day 4 — Oracle's data convergence:**
> **IMPORTANT INSIGHT:** Oracle is moving enterprise data into a one-stop shop database which uses MCP connections, avoiding conversion time & effort from disparate data sources, and hooking directly into AI agent context bubbles. We should mention this during our presentation.

**Day 7 — Supervisor retrieval boundary:**
> **IMPORTANT:** One thing worth noting: the CC §6.1 table has no column for the Supervisor Agent. The code also omits it from `allowed_agents` on every source, which is consistent — the Supervisor manages the execution graph and manifest but isn't a retrieval agent in the index-query sense. That's the right call, just worth being deliberate about it if the Supervisor ever needs to do a manifest validation pass at init.

**Day 8 — Deferred checklist/audit work:**
> ***IMPORTANT:*** The checklist & audit mechanisms, file formatting, and pipeline are going to have to be built in later.

**Day 9 — Audit system reminder:**
> ***IMPORTANT: Remember to build agent auditing system.***

**Day 13 — Competitive positioning work needed:**
> **IMPORTANT CONSIDERATIONS:**
> - What do orchestration layers look like across other tools like LangGraph? How is mine different?
> - Find players doing similar things to hybrid agent retrieval with custom orchestration layer.
> - Compare players and approaches for demo.

**Day 14 — Version log cleanup:**
> **Important:** Remove version log from agent spec docs, maybe other docs too.

**Day 14 — Agent failure mode insight (this is one of the most important framings in the whole doc):**
> **IMPORTANT:** When data sources are weakly controlled / maintained by enterprise departments, AI agents will fail equivalently as a human would.

## 1.3 `Worth Considering` — Open Questions

**Day 14:**
> **Worth considering:** can you build spec docs or somehow guide AI agent behavior such that it can find structural gaps in documents without being directly reasoned on the specific structural gap?

## 1.4 `DEMO-INFO` — Simplifications Made for Demo

**Day 7:**
> **DEMO-INFO:** We have other source-level and chunk-level metadata ideas, but we simplified it for the sake of this demo.

---

# 2. Framing Insights

Standalone insights that weren't explicitly flagged but deserve to be. These are the ideas that shape the whole project's positioning.

## 2.1 The Source-of-Truth Inversion

> **The PRD is NOT our source of truth — the source of truth will be the spec docs.**

Paradigm shift: PRD stays as the human-stakeholder anchor, but the spec docs become the living source of truth for development. Later iterations could make the PRD itself a living document AI agents update in real time as a log.

## 2.2 Your Positioning vs. the SDD Field

> "GitHub Spec Kit centers the spec; Kiro centers the workflow (requirements vs. design); **my model centers the governed translation from enterprise intent into agent-usable context.**"

This is the clearest one-line positioning statement in the entire document. It belongs in the presentation.

## 2.3 Process Knowledge

> The context contract solves the "Process Knowledge" problem that AI agents have while working for enterprises.

## 2.4 Deliberate Non-Flashy Choice

> "I am intentionally using a practical hybrid agentic retrieval approach rather than a flashy autonomous one, because our goal is governed enterprise reliability and explainability, not novelty theater."

This is your rationale for choosing a deterministic Python supervisor over an LLM orchestrator. It is also a strong defense-against-criticism line.

## 2.5 Nondeterminism Is the Whole Point

> Real-life documents in real-life enterprises are often nondeterministic; two answers or one confused conclusion can result from analysis. **Agents beat programmatic assessment here.**

Pairs with the flagged Day 14 insight: "When data sources are weakly controlled, AI agents will fail equivalently as a human would."

## 2.6 The Most Subtle Failure Mode You Caught

From Day 14 testing:
> The model kept the citation-level rules clean (no Slack cited as PRIMARY, correct matrix row, status: complete) and then used Slack content to reshape the determination field that citation rules don't govern. This is the most interesting kind of failure: **surface compliance, substantive violation.**
>
> That pattern is worth naming. It's qualitatively different from scenario 1 / scenario 7 failures, where the model was violating explicit §8.3 rules. Here the model is exploiting an *ambiguity*.

**Quotable line for presentation:**
> "We designed a scenario specifically to detect the subtle failure mode of *surface compliance with substantive drift*. Our agent showed exactly that drift pattern in both runs — kept the citation-level governance rules clean while letting Tier 3 workflow commentary reshape the approver set. Our evaluator caught this behavior that a shape-level check would have missed entirely. This is why the governance layer matters beyond prompt engineering: the model will drift in subtle ways that only scenario-specific semantic checks catch, and we've shown we have that capability."

## 2.7 The Root-Cause Discovery

> **THE PROBLEM CAME DOWN TO CHUNKING PIPELINE ISSUE, NOT THE SPEC DOC OR THE MODEL.**

Worth highlighting in the findings section — spec and model got blamed until the real culprit turned out to be upstream plumbing.

## 2.8 Bundle vs. Document Authority

From Day 9:
> How does it know `data_classification`, `integration_tier`, ERP integration type, and onboarding path classification? The right answer is: it should not "just know." It should derive them from a **Supervisor-assembled evidence bundle.** The Design Doc and orchestration plan are not raw evidence for the agent's determination; they are governing documents that tell engineers how the system works. **The agent should reason from the bundle, not from the Design Doc itself.**

---

# 3. Research Foundations (3/24/26)

## 3.1 Document Hierarchy (as eventually locked)

`PRD (stakeholders) → Design Doc (engineers) → Context Contract (retrieval governance) → Agent Spec (behavioral rules)`

Each document owns a distinct governance dimension — no overlapping authority. This hierarchy is the project's organizing principle.

**De facto evolution during build:** The **Supervisor Orchestration Plan** (ORCH-PLAN-001) effectively became a fifth document — it owns runtime execution sequencing, gate logic, and `PipelineState` mutation rules that don't cleanly belong to any of the original four. The conceptual hierarchy stayed four-deep in framing, but the implementation stack is five documents in practice. Worth naming this in the presentation rather than hiding it — it's honest about how the design evolved under implementation pressure.

## 3.2 Spec-Driven Development Toolkits

Seven live SDD tools analyzed:

| Tool | Who | Approach | Spec Lifecycle | Best For |
|---|---|---|---|---|
| **GitHub Spec Kit** | GitHub, MIT-licensed | 4-phase CLI; 14+ agents | Static | Greenfield, single-repo, agent-agnostic |
| **AWS Kiro** | Amazon | Code OSS IDE; EARS notation; Requirements → Design → Tasks | Static | AWS-native, formal documentation |
| **Intent (Augment Code)** | Augment Code | Living specs with bidirectional updates; multi-agent orchestration | Living | Enterprise multi-repo, brownfield |
| **OpenSpec** | Open-source | Delta format (ADDED, MODIFIED, REMOVED) | Modification-aware | Iterative changes on existing specs |
| **BMAD-METHOD** | Open-source | Codebase flattener + domain expansion packs | Static | Domain-customized SDD |
| **Spec Kitty** | Open-source | Git worktree support for parallel spec branches | Static | Git-heavy parallel workflows |
| **Tessl** | Closed beta | Spec-as-source: edit spec → regenerate code | Source-of-truth | Radical spec-first paradigm |

### Research Claims on SDD Productivity
- MIT Sloan / MS Research / GitHub: **56% programming time reduction**; 18-dev-day projects completing in 6-hour timeframes.
- IEEE/ACM controlled studies: **20% task completion time reduction** across 50 developers.
- *Caveat:* these measure productivity generally, not the effect of spec quality or volume specifically.

## 3.3 Context Rot — The Empirical Core

**Core finding:** more context is not uniformly better; beyond a threshold, it actively degrades performance. Chroma research evaluated 18 LLMs (Claude 4, GPT-4.1, Qwen3-32B, Gemini 2.5 Flash); performance becomes increasingly unreliable as input length grows.

**"Lost in the middle" is real.** LLMs weight information at the start and end of long prompts more than information buried in the middle. IBM research: quality of examples matters more than quantity.

**Multi-file agentic coding benchmark:** AI models hit only **19.36% Pass@1** on multi-file infrastructure tasks vs. 87.2% on single-function benchmarks — a 68pp drop when distributed files are involved.

## 3.4 Do Coding Guidelines Actually Work?

- Research on stylistic control in multi-turn generation: LLMs tend toward excessive verbosity; two mechanisms emerge — instruction-based vs. example-based prompts. Whether stylistic constraints persist across enhancement turns is **inconsistent**.
- **Key distinction:** prompt engineering (human-LLM) vs. context engineering (agent-LLM). Agents need larger, richer context.
- BDD / few-shot appears to be the strongest signal for constraining agent behavior.

## 3.5 Do Agents Forget Rules?

AGENTIF (Tsinghua) introduces two metrics:
- **Constraint Success Rate (CSR):** proportion of individual constraints correctly satisfied
- **Instruction Success Rate (ISR):** proportion of instructions for which *all* constraints are satisfied. If an agent follows 9/10 rules → ISR = 0. Brutal metric.

JetBrains research: as context grows, models struggle to use all information, despite the centrality of context management.

## 3.6 The Research Gaps You Identified

1. **Spec volume curve.** No one has systematically tested minimal → moderate → maximal spec against the same task/agent and measured output quality.
2. **Guideline persistence across session length.** Does an agent given 20 rules at token 0 still respect them at token 50,000? Directly measurable via CSR/ISR applied to coding.
3. **Guideline format effects.** Do "do X" vs. "never do Y" vs. few-shot "here's correct X" produce different adherence? Ties into the instruction-vs-example split.
4. **Spec granularity vs. quality tradeoff.** Excessive detail over-constrains; insufficient detail forces multiple interpretations. Nobody has empirically mapped the optimal threshold.

## 3.7 Enterprise vs. Project Context

| Enterprise context | Project context |
|---|---|
| Security policies | Feature requirements |
| Coding standards | Specific APIs and schemas |
| Architecture principles | Local design decisions |
| Domain glossary / ontology | Sprint-level acceptance criteria |
| Compliance / legal constraints | Project-specific exceptions |
| Source-of-truth systems | |
| Shared platform capabilities | |

## 3.8 Executable Context (not just markdown)

The eventual output of governance is not a markdown spec — it's a **bundle of executable context**:
- instructions
- retrieval endpoints
- tool permissions
- source priorities
- examples
- tests / evals
- stop conditions
- non-goals

## 3.9 Evaluation Dimensions for Context Building

- Did the agent retrieve the right sources?
- Did it cite them?
- Did it obey enterprise constraints?
- Did it overfit to project-local instructions?
- Did performance degrade with too much context?
- Did examples outperform pure rules?

## 3.10 Context-as-Supply-Chain (mental model)

- Raw data + stakeholder inputs → upstream
- Validated requirements + architecture decisions → transformed goods
- Scoped, executable context → packaged product delivered to agent
- Governance + evaluation → QA

---

# 4. Enterprise AI Landscape

## 4.1 Players by Layer

**Model / agent platform layer:** OpenAI Agents SDK · Anthropic + MCP ecosystem · Google Vertex AI / Agent Builder · Amazon Bedrock / Knowledge Bases

**Retrieval / knowledge layer:** Azure AI Search · Bedrock Knowledge Bases · Databricks Mosaic AI Vector Search · Pinecone · Elastic · Cohere RAG

**Workflow / orchestration / memory layer:** LangGraph / LangChain memory and agentic RAG patterns · OpenAI Agents state/context patterns · MCP-based tool ecosystems

**Spec-driven development layer:** GitHub Spec Kit · Kiro · Tessl

## 4.2 Context Engine Competitors (the new "Context Engine Layer")

A category that crystallized in early 2026.

| Product | Differentiator |
|---|---|
| **Unblocked** | Conflict resolution via authority signals — who reviewed whose code, who's the domain expert; MCP delivery |
| **Augment Code Context Engine** | Semantic dependency analysis across 400K+ files; multi-repo; SOC 2 Type II |
| **Qodo Context Engine** | Highest DeepCodeBench accuracy; deep research agent |
| **Context Hub (Andrew Ng / DeepLearning.AI)** | Open-source CLI; agents can annotate and "remember" workarounds |
| **Kayba ACE** | Self-improving context via reflection; evolving "Skillbook" as system prompt |
| **Microsoft Agent Skills** | 126 modular knowledge packages for Azure/Foundry |
| **Faros Clara** | Enhanced AGENTS.md; built from 2+ years of heavy coding assistant usage |
| **Tabnine Enterprise Context Engine** (Feb 2026 launch) | Privacy-first; on-prem or air-gapped deployments |
| **Greptile** (YC) | Graph-first semantic code graph; cross-service propagation detection |
| **Sourcegraph (Amp / Cody)** | Most established; enterprise knowledge graph; SOC 2 + ISO 27001 |
| **Hyland Enterprise Context Engine** | Broad content/process/people linking across ERP, CRM, EHR |
| **GitNexus / CodeGraphContext** | Open-source knowledge graph engines exposed via MCP |

## 4.3 Key Quote from the Landscape (Unblocked, QCon London 2026)

> "Every AI coding tool can generate code. Very few can generate the right code for your organization — because they're missing context. They don't know why your team chose Redis over DynamoDB, what the team decided in a Slack thread from two months ago, or which architectural patterns your principal engineers actually enforce in review."

## 4.4 Unblocked Context Engine Insights (from Pilarinos podcast)

- Context is similar for agents and people.
- SDLC planning is the same planning agents need.
- Sources: Slack, Teams, source code, PRs, bug trackers, docs systems, runtime (Sentry, Datadog).
- Problems: *Where does context live? How does context drift?*
- Discrepancies have a **temporal aspect** — Unblocked positions itself as "another team member with knowledge of the past & the why."
- Access control is a **runtime problem** — permissions-aware model, strong identity, refusing escalation of privilege.
- Background knowledge graph built on PRs + cross-identity reconciliation (GitHub / Slack / etc.).
- Hybrid RAG beneath (lexical + semantic).
- Observability: worries less about hallucinations, more about human factor (knowing how to use tools) and fast vs. thorough answers — most users prefer thorough.
- **Source code is the truth**; much of context can be inferred from it, but root cause analysis remains vital.
- Customizable human-vs-autonomous dependency graph.
- **MoE:** limits active parameters at inference, minimizing token usage via expert routing.

## 4.5 Eight Alternate Approaches to the Context Problem

1. **Reinventing retrieval — Databricks Instructed Retriever.** Propagates system specs (instructions, examples, schemas) through retrieval + generation. Natural language → DB filters ("last year" → date filter). 35–50% retrieval recall gain, 70% end-to-end quality gain vs. standard RAG.

2. **End-to-end optimized RAG — Contextual AI RAG 2.0 / Grounded Language Model.** Founded by RAG's inventors (Douwe Kiela). Argument: first-gen RAG failed because it stitched frozen off-the-shelf components. GLM: 88% FACTS factuality vs. 84.6% Gemini 2.0 Flash, 79.4% Claude 3.5 Sonnet, 78.8% GPT-4o.

3. **Knowledge graphs and Graph RAG.** Make the *data* smarter. Key players: Graphiti (Zep) with temporal fact management; Contextual AI's Metadata Search Tool; Neo4j / Amazon Neptune / Graphwise. Strength: multi-hop reasoning, traceable paths, vs. black-box similarity.

4. **Long-context and cached-context systems.** *(Your notes left this sparse.)*

5. **Agentic retrieval — RAG being reinvented, not abandoned.** Azure describes agentic retrieval as multi-query, planned pipelines. "Classic vector RAG is no longer the whole story; retrieval is becoming agentic, structured, query-planned."

6. **Tool/protocol-centric — MCP and A2A.** Reframes the problem as interoperability, not retrieval. MCP = agents ↔ tools/data. A2A = agents ↔ agents. Philosophically different from enterprise search — *runtime access orchestration*.

7. **Memory-native systems.** LangChain/LangGraph: short-term state vs. long-term memory across threads/sessions. Deep agents: subagents for context isolation. RAG asks *"what external knowledge should I fetch now?"* while memory asks *"what should the system retain and recall over time?"*

8. **Multi-agent long-context approaches.** Google Research's Chain-of-Agents — training-free long-context framework that Google claims outperforms both RAG and long-context LLM baselines on long-context tasks.

---

# 5. Architectural Patterns & Protocols

## 5.1 A2A, MCP, RAG (3/26/26)

- **A2A** — agent-to-agent communication standard; JSON-RPC; agent cards.
- **MCP** — model context protocol; agents ↔ external data; primitives: tools, resources, prompts.

**RAG, unpacked:**
- Retrieval step: vector database (Pinecone, Weaviate, Chroma, pgvector) stores embeddings; nearest-neighbor search at query time.
- Embedding model separate from generation LLM — **"retrieval bottleneck"**: garbage retrieval = garbage generation.
- Chunking strategy: no universal best — domain-dependent.
- Reranking, hybrid search, query decomposition are all quality-lift mechanisms.

**Against RAG:**
- Infrastructure collapse: chunking strategy, embedding model, vector DB, reranker, keeping vectors in sync.
- Retrieval lottery (semantic search is probabilistic → silent failure).
- "Whole book" problem — models only see snippets, miss middle.

**For RAG:**
- Re-reading tax paid once (at indexing time).
- Needle-in-haystack — less noise than long-context dump.
- Infinite dataset — enterprise data lakes can't fit into context windows.

**Findings:** Long context for simple/concise tasks. Vector DB + RAG for most enterprise solutions.

## 5.2 Agentic Retrieval Deep Dive

> **Agentic retrieval is a retrieval architecture in which an LLM-assisted orchestrator dynamically plans, decomposes, routes, and validates evidence gathering across multiple sources and tools, instead of relying on one static search pass over one index.**

**Mental model:** Classic RAG is a pre-written database query. Agentic retrieval is a junior analyst who reads your question, figures out which filing cabinet to open, realizes the answer is in a footnote that cross-references another document, pulls that too, and hands you a curated packet.

**Components:**

**A. Query planning** — extract entities, identify subgoals, detect ambiguities, decide if clarification needed, decide which stores/tools are relevant. In your demo: the Supervisor deciding SQ1 "does OptiChain touch regulated data?" SQ2 "what does the DPA matrix say for that class?" SQ3 "what approval path corresponds?"

**B. Tool/source routing** — different sources need different strategies. Policy PDF ≠ JSON questionnaire ≠ Slack thread ≠ approval matrix ≠ live API. Oracle's pitch: future agents need to reason across vector, JSON, graph, relational, spatial, and columnar together.

**C. Multi-step retrieval** — search → inspect → recognize gap → reformulate → re-search → compare authority → assemble bundle.

**D. Hybrid search (not just vectors).** Essential for enterprise policy questions with exact clause numbers, legal phrases, abbreviations, matrix row labels. Azure recommends hybrid; OpenSearch explicitly combines BM25 + vectors.

**E. Reranking and evidence assembly** — by relevance, source authority, permissions, freshness, document type, structured rules. Your design-doc intuition about source authority is aligned with where enterprise systems are going.

**F. Structured outputs and traceability** — not just answer text but evidence, citations, decomposition trace, status, tool invocations, confidence/escalation flags.

**What agentic retrieval is NOT:** a swarm of autonomous agents, a substitute for system design, a correctness guarantee, or a reason to skip source governance. Microsoft still recommends classic RAG when simplicity or fine-grained manual control matter more.

## 5.3 Hybrid Agentic Retrieval Is More Than Hybrid Search

> Hybrid search is just the **engine**. Agentic retrieval is the **planner + router + judge + assembler**.

## 5.4 Pipeline Order (for your implementation)

1. Take source document
2. Chunk into meaningful evidence units
3. Attach metadata (source-level in preprocessing, chunk-level in chunking)
4. Embed if source belongs in indexed semantic lane
5. Store/index for retrieval
6. At retrieval time: bundle assembly for agent

Terminology:
- **Chunking** = defining units
- **Embedding** = representing units for semantic retrieval
- **Retrieval** = pulling right units
- **Context bundle assembly** = feeding selected evidence to agent

## 5.5 The Clean Retrieval Flow (9 steps, Day 9)

1. Supervisor receives a pipeline task
2. Supervisor decides what must be known
3. Supervisor turns that into targeted subqueries
4. Source router maps each subquery to the right lane
5. Retrieval engine executes searches/lookups
6. Reranker suppresses or downweights weak evidence
7. Bundle assembler builds a scoped evidence packet
8. Domain agent reasons over the packet and returns a structured determination
9. Supervisor updates pipeline state and decides next step

## 5.6 Storage & Indexing Decisions (Day 8)

- **Dense:** Chroma (semantic)
- **Lexical:** BM25 (keyword / exact-term)
- **Indexed sources:** ISP-001, DPA-TM-001, PAM-001, PVD-001, SLK-001
- **Not indexed:** VQ-OC-001 (direct structured access only), checklist state, audit state, pipeline runtime
- **Architecture:** one Chroma backend but **separate collection per source**; same for BM25
- **Collections:** `idx_security_policy`, `idx_dpa_matrix`, `idx_procurement_matrix`, `idx_precedents`, `idx_slack_notes`

**Chunk metadata (core):** `chunk_id`, `source_id`, `source_type`, `authority_tier`, `retrieval_lane`, `version`, `freshness_status`, `allowed_agents`, `section_id` / `row_id` / `thread_id`.

**Filters available:** source, authority tier, permissions, source type, freshness.

**Design principle:** Do NOT build one giant searchable corpus. Build governed, per-source indices. Retrieval must be source-aware, permission-aware, authority-aware, auditable.

## 5.7 The Design Principle for Embedding

> "Embedding is not the intelligence of the system. The intelligence is in the later retrieval flow where the Supervisor decomposes the task, routes subqueries to the right lane, applies authority and permission rules, and builds a scoped context bundle. Step 7 should stay boring, deterministic, and easy to audit."

## 5.8 Supervisor Design Decision (Day 9)

> For the demo, the Supervisor should be a **plain Python orchestrator/state machine**, not a free-roaming LLM agent.

---

# 6. Scope Definition & Demo Plan Evolution

## 6.1 The Original 4-Day Plan (3/30/26)

**Scenario topic:** Vendor onboarding / workflow automation with compliance constraints.

**Specific scenario:** Mid-size manufacturer onboarding a new supply-chain software vendor. Coordinated review across IT security, legal, procurement, and compliance. Reduce cycle time while preserving governed context, role-based access, and enterprise policy.

**The demo request:** A request to onboard "OptiChain" (supply-chain forecasting). Pipeline determines:
- Regulated/sensitive data exposure?
- ERP / procurement integration?
- Legal: DPA or custom terms?
- Security: questionnaire or architecture review?
- Procurement: standard or executive approval?
- Project-specific exceptions in discussion notes?

### Day 1 — Lock scope and artifacts
PRD, Design Doc, Context Contract schema, Agent Spec template. Define 3–4 evaluation tasks, 5–8 mock data sources, scoring rubric.

### Day 2 — Build mock enterprise context and orchestration
Mock sources: policies, SOPs, system notes, Slack/meeting threads, project notes. Lightweight orchestrator: load sources → apply CC → retrieve and rank → assemble agent bundle → structured output.

### Day 3 — Evaluation and refinement
Run same tasks under naive baseline, project-only, overloaded context, governed pipeline. Score on relevance, authority adherence, policy compliance, citations, usefulness.

**Evaluation metrics:**
- **CSR** (Constraint Success Rate) — did each Agent Spec rule hold?
- **ISR** (Instruction Success Rate from AGENTIF) — did ALL constraints hold simultaneously?
- **Hallucination count** — facts not in any source
- **Context efficiency** — tokens consumed vs. relevant info
- **Task completion accuracy** — did the agent find the seeded compliance gap?

### Day 4 — Package for presentation
Clean repo, one-page explainer, walkthrough video or live script, optional slide deck or simple UI.

## 6.2 The Three-Layer Framing

> **Layer 1 (Method):** How should organizations turn stakeholder intent, policies, and operational context into something AI agents can use safely and effectively?
> **Layer 2 (Workflow):** Vendor onboarding is the example business process.
> **Layer 3 (Instance):** OptiChain is the specific sample vendor request.

## 6.3 Plan Evolution

The original 4-day plan became a 16+ day build. Driver: the complexity of the document chain itself demanded more iteration than anticipated — the "needing a shovel to get to the shovel" problem (your phrase).

## 6.4 Current Strategy Outline (post-evolution)

1. Make data sources — AI-generated where content is arbitrary
2. Chunking strategy — adapted to embedding/reranking choices
3. Embedding — hybrid embedding, simple approach; deliberately NOT uniform (questionnaire excluded as teaching moment)
4. Orchestration — based on CC; agent roles defined; orchestration script guides agents
5. Agentic retrieval

---

# 7. Demo Build Timeline

Condensed day-by-day record. Full details for the finalized scenario live in §8.

## Day 1 (3/30/26) — Taking stock of Spec-Driven Development
- Locked three-layer framing (method / workflow / instance)
- Demo is "a generalized enterprise method for translating business intent into governed AI-executable context, using vendor onboarding as the workflow and OptiChain as the illustrative example"

## Day 2 — Finalizing PRD & Design Doc
- Design Doc as the **engineering bridge** between PRD's business workflow and the downstream CC / Agent Spec
- Pulls from: Kiro (design-first structure, sequence/data-flow, NFRs, traceability), Spec Kit (governing principles, constraints, downstream handoff)
- Kiro's model: "we use hybrid BM25 + vector + cross-encoder" → Design Doc. "Use `rank_bm25==0.2.2`, never rerank chunks below 0.4" → Agent Spec.

## Day 3 — Finalizing Design Doc & moving to Context Contract
- [AN IDEA] Pamphlet-style design doc for engineers
- [AN IDEA] Translate design principles verbatim into Agent Spec

## Day 4 — Finalizing Context Contract
- [AN IDEA] Supervisor-of-agents concept
- [AN IDEA] Per-document guardian agents
- [IMPORTANT INSIGHT] Oracle's one-stop DB with MCP connections
- **Context Contract outline:** which sources are authoritative; authority hierarchy & overrides; freshness & staleness; context budget & prioritization; conflict resolution; retrieval endpoint permissions

## Day 5 — Mock Documents & CC finalization
- **DPA Legal Matrix** built: 26 trigger rows across 7 sections (personal data, cross-border, sub-processing, sensitive regulated data, operational triggers, incident/breach, audit/accountability)
- Demo edge cases live in the matrix: Row A-01 fires DPA requirement for OptiChain; ISP-001 §12.1.4 NDA cross-ref holds; E-07 non-personal data carveout preserved
- **Precedent records** calibrated per agent:
  - Record 1 → Legal retrieves for EU personal data (prior vendor, DPA executed)
  - Record 2 → IT Security retrieves for ambiguous ERP integration (prior PROVISIONAL → resolved)
  - Record 3 → Legal + Procurement retrieve for unconfirmed NDA (information-exchange blocked)
  - Record 4 → Procurement retrieves as fast-track contrast case
- [AN IDEA] Architecture diagram / data flow attachment request
- [AN IDEA] Agent guardrails
- [AN IDEA] Slack conflict escalation

## Day 6 — CC done; moved to Retrieval Pipeline (Chunking, Embedding)
- [REMEMBER] Do NOT embed everything. Deliberate non-embedding of questionnaire (and maybe one other) as a teaching moment
- [AN IDEA] Illustrate output differences in evaluation stage
- Pipeline order crystallized (§5.4)

## Day 7 — Retrieval Pipeline
- [AN IDEA] Automate pre-determined retrieval methods per CC
- [IMPORTANT] Supervisor is not in CC §6.1 `allowed_agents` — correct, deliberate call
- [DEMO-INFO] Source-level & chunk-level metadata simplified for demo

## Day 8 — Finalizing Chunking & Embedding
- Status: `DPA-TM-001.json`, `PAM-001.json`, `PVD-001.json`, `SLK-001.json` complete; `ISP-001.json` still needed; questionnaire + checklist + audit files correctly excluded
- [***IMPORTANT***] Checklist & audit mechanisms deferred to later build
- **Storage & Indexing decisions fully locked** — see §5.6

## Day 9 — Nearing the End
- Clean 9-step retrieval flow articulated (§5.5)
- [***IMPORTANT***] Build agent auditing system
- Supervisor = plain Python state machine, not LLM agent
- **Build order:**
  1. Finalize Agent Spec (behavioral rules, output contracts, citation, refusal/escalation)
  2. Cross-doc integrity pass (Design Doc, CC, Orchestration Plan, Agent Spec — same field names, statuses, step ownership, retrieval boundaries)
  3. Orchestration layer (PipelineState, step executor, gate evaluator, parallelism, reconciliation, mutation, audit refs, escalation plumbing)
  4. Retrieval + ingestion plumbing (manifest loading, lane-aware routing, chunk metadata, direct structured questionnaire access, index registry, adapters)
- Agent determination principle: reason from the **bundle**, not from the Design Doc itself

## Day 10 — Finalizing Specs, Orchestration, Retrieval
- [AN IDEA, DECIDED] STEP-03 / STEP-04 parallelism removed → fully sequential
- [AN IDEA] Document sync storytelling — working backwards from orchestration plan updates

## Day 13 — Testing
- [IMPORTANT CONSIDERATIONS] LangGraph comparison, players doing similar hybrid retrieval + custom orchestration, comparison for demo
- [IDEA] Trim Agent Spec docs
- [IDEA] Summarize master_log for presentation

## Day 14 — Testing LLM domain agents
- **Tier 1 vs. Tier 1 conflict insight:** genuinely hard to construct artificially. A well-maintained legal matrix shouldn't contain two rows firing on identical facts with conflicting outcomes — that'd be a drafting defect. The coding agent's instinct to carve out a non-overlapping exception (A-06 as anonymization carveout) is what a competent legal drafter *would* do.
- [IMPORTANT] When data sources are weakly controlled/maintained, AI agents fail equivalently to humans
- Scenario framing: enterprise consistently maintains docs so agents can reason over them, paired with spec docs accounting for each scenario
- [Worth considering] Can spec docs guide agent behavior to find structural gaps without being reasoned on the specific gap?
- [AN IDEA] Scale argument — small-scale demo understates the agent benefit; agents handle massive scale and new documents with an output contract more adaptively than programmatic systems
- [Important] Remove version log from agent spec docs
- Real enterprise documents are nondeterministic — agents beat programmatic assessment here

## Day 15 — Hopefully finishing LLM agent testing
- Diagnostic recommendation: re-run scenario 1 with extended thinking enabled; inspect trace
- [IDEA] Agent reasoning tracing for understanding WHY
- **"Surface compliance, substantive violation" failure mode identified** (see §2.6)
- **Root cause was the chunking pipeline, not the spec or the model** (§2.7)
- Forward plan: finish LLM agent testing → full pipeline test → more scenario docs → SDD templates → plan presentation

## Day 16 — Building the Presentation
- Layout, modes, and UI structure drafted — see §9

---

# 8. Finalized Business Scenario — Lichen Manufacturing / OptiChain

Preserved near-verbatim as this is the demo content itself.

## 8.1 Company Roles
- **Lichen Manufacturing, Inc.** — the enterprise operating the AI-assisted vendor onboarding pipeline
- **OptiChain** — the software vendor under evaluation (demand forecasting, inventory optimization)

## 8.2 Scenario Purpose
Demonstrate that a governed, AI-orchestrated onboarding pipeline can reduce coordination overhead while preserving compliance, auditability, and human decision authority.

Designed to show:
- A hard intake gate
- A blocked initial run
- Human intervention
- Regulated-path classification
- Domain-specific review in parallel (later changed to sequential)
- A structured approval checklist
- Stakeholder-ready next-step guidance

## 8.3 Execution Path

### ACT 1 — R-01: Questionnaire Not Submitted → `BLOCKED`
- No questionnaire submission found
- Supervisor emits `BLOCKED`, all downstream halted, Procurement notified
- Human intervention: Procurement requests submission; OptiChain submits
- R-01 final: `RESOLVED`

### ACT 2 — R-02: Onboarding Path Classification → `REGULATED`
- Questionnaire reveals: SAP S/4HANA data exports consumed; ambiguous middleware-vs-export integration; EU employee scheduling/shift data processed; NDA "in progress"
- Classification: `REGULATED` (EU personal data alone sufficient; ERP involvement increases review posture; tier remains technically ambiguous)
- Fast-track: `INELIGIBLE` (regulated data + ERP + unresolved items)

### ACT 3 — R-03 and R-04: Domain Reviews

**3A — Legal Agent (R-03)**
- Sources: DPA Matrix A-01, E-01; ISP-001 §12.1.4 NDA clause
- `dpa_required = true`; `dpa_blocker = true`; `nda_status = provisional`
- Status: `ESCALATED` (human-owned legal execution required)

**3B — IT Security Agent**
- Sources: ISP-001 §12.2 ERP Integration Tier table
- Evidence doesn't satisfy Tier 2 (mediated) or Tier 3 (indirect)
- `integration_tier = unclassified_pending_review`; `security_followup_required = true`; `fast_track_eligible = false`
- OptiChain must provide architecture diagram + data-flow docs within 10 business days
- Status: `PROVISIONAL`

**3C — Procurement Agent (R-04)**
- Source: Procurement Approval Matrix
- `approval_path = standard`; `executive_approval_required = false`; `fast_track_eligible = false`
- Status: `RESOLVED`

### ACT 4 — R-05: Approval Checklist Generated
**Overall pipeline status:** `ESCALATED`

**Blocking items:**

| # | Blocker | Owner | Citation |
|---|---|---|---|
| 1 | GDPR Art. 28 DPA not yet executed | Legal | DPA Matrix A-01, E-01 |
| 2 | NDA execution unconfirmed | Procurement / Legal | ISP-001 §12.1.4 |
| 3 | ERP integration tier unclassified | IT Security | ISP-001 §12.2 |

**Resolved items:**

| Item | Determination | Owner | Citation |
|---|---|---|---|
| Onboarding path classification | REGULATED | IT Security / Supervisor | Questionnaire + policy |
| Approval path | STANDARD | Procurement | Procurement Approval Matrix |
| Fast-track eligibility | INELIGIBLE | IT Security / Procurement | Regulated path + matrix |
| Executive approval | NOT REQUIRED | Procurement | Procurement Approval Matrix |

### ACT 5 — R-06: Stakeholder Guidance Emitted
- **Legal:** execute GDPR Art. 28 DPA before data exchange; ref. DPA Matrix A-01, E-01
- **IT Security:** request architecture diagram + data-flow docs; assign ERP tier under ISP-001 §12.2
- **Procurement:** confirm NDA execution under ISP-001 §12.1.4
- **Business Owner (Operations):** three blockers open; no implementation until resolved; est. 10 business days with prompt responses

## 8.4 Why This Demo Works

The pipeline enforces prerequisite gates, distinguishes `BLOCKED` / `PROVISIONAL` / `ESCALATED`, routes by domain, preserves human approval authority, and produces an auditable approval package with cited blockers.

## 8.5 Three-Condition Evaluation Design

**Condition 1 — Naive RAG** (single vector index, top-k). Likely misses NDA execution clause; retrieves wrong ERP tier or collapses rows; can't distinguish authority; no retrieval manifest.

**Condition 2 — Long-Context Dump**. May surface some correct issues but weak source discipline; blurs `PROVISIONAL` vs. `BLOCKED`; hard to audit.

**Condition 3 — Governed Pipeline**. Correctly identifies all three blockers, classifies `REGULATED`, denies fast-track, preserves status semantics, produces retrieval manifest + stakeholder guidance.

## 8.6 Key Differentiators to Highlight

- Governed pipeline produces a **retrieval manifest**; naive RAG does not
- Correctly treats NDA confirmation as a blocker via exact clause retrieval
- Preserves **source authority** (formal over informal)
- Preserves **status semantics** (BLOCKED / PROVISIONAL / ESCALATED)
- Produces an **actionable approval package**, not just an answer

## 8.7 Locked Scenario Decisions
- OptiChain processes ERP-related business data
- OptiChain processes EU employee scheduling/shift data
- Path classification: REGULATED
- DPA required
- NDA execution must be confirmed before information exchange
- ERP integration tier remains unresolved from questionnaire evidence alone
- Fast-track ineligible
- Approval path: STANDARD
- Overall result: ESCALATED (not BLOCKED) once questionnaire is submitted

## 8.8 Status Vocabulary — Conceptual vs. Implemented

The scenario as originally written uses four statuses. The implementation (per ORCH-PLAN-001 v0.9 and Design Doc v4.0) simplified to three. Both are worth preserving because the conceptual distinction still drove the design.

| Status | Meaning (as originally conceived) | Present in final impl? |
|---|---|---|
| **BLOCKED** | Missing prerequisite / nothing to reason over | ✓ |
| **PROVISIONAL** | Partially classifiable but unresolved ambiguity | ✗ (folded into ESCALATED) |
| **ESCALATED** | Human judgment / action required | ✓ |
| **COMPLETE / RESOLVED** | Sufficient output reached | ✓ (renamed to COMPLETE) |

The PROVISIONAL → ESCALATED collapse was deliberate simplification for the demo. The four-status conceptual model is the more interesting story for the presentation; the three-status implementation is the pragmatic version.

---

# 9. Presentation Plan

## 9.1 Presentation Layout (rough draft)

**Part 1 — Title Page:** news / article headlines on "Enterprise AI"; in the center, phase-in McKinsey's "Great Paradox" quote:
> "80% of enterprises believe in the transformative impact of AI and thus are financially invested, and yet 80% of companies say they're not yet seeing impact on the bottom line from those investments."
Maybe 1–2 additional quotes on the implementation lag behind AI capabilities.

**Part 2 — Introduction:**
Title candidates: *"A Spec-Driven Approach to Enterprise Context Engineering"* or *"Hybrid Agentic Retrieval with Spec-Driven Philosophy"*.
Credit: Pierce Nellessen. All rights reserved.

**Part 3 — Problem & Landscape:** research, current approaches, players and their perspectives.

**Part 4 — My Approach** (decide: full tech background here or behind "More Details"):
- SDD philosophy for context engineering
- Research on current players (Kiro, Spec Kit) — pros/cons; your innovations on top
- Hybrid agentic retrieval w/ static Python state-machine orchestration — reasoning, pros/cons
- Why deterministic supervisor vs. LLM supervisor
- Other orchestration methods (LangGraph)
- Custom chunking & embedding tailored to enterprise documents
- BM25 + Chroma — reasoning; alternatives for enterprise scale; why vector DB in real enterprise didn't make sense for demo
- Retrieval engine, reranking, context bundle assembly
- LLM domain agents — receive bundle, fulfill output contract, monitored by supervisor, emit status signals
- Checklist Assembler + Checkoff Agent

**Part 5 — The Proposed Business Scenario:** how the approach fits this scenario; stakeholders, concerns, problem structure.

**Part 6 — The Demo in Action** — showcased on mock scenario.

**Part 7 — What I Learned / Findings / Results** (evaluation question open).

## 9.2 UI Structure (proposed)

**Three-pane layout:**
- **Left panel:** pipeline steps / execution graph
- **Center panel:** current step details and status
- **Right panel:** evidence / citations / context bundle / audit trail

When STEP-03 runs, the audience sees: what triggered it, what evidence it got, what Legal determined, whether it escalated, why.

## 9.3 Presentation Modes (proposed)

- **Overview mode** — architecture and document hierarchy
- **Scenario mode** — walk through OptiChain onboarding
- **Trace mode** — retrieval, context bundles, citations, outputs
- **Testing mode** — scenario-based evaluation and failures caught

## 9.4 What the Walkthrough Should Cover

- Business scenario
- Uploaded / source documents
- The document chain: PRD → Design Doc → Context Contract → Orchestration Plan → Agent Specs
- Pipeline steps
- Retrieval process
- Context bundle per step
- Agent outputs
- Audit log
- Final outcome

## 9.5 Additional Presentation Considerations

- Research
- SDD process with your innovation of Context Contract + orchestration layer planning (both demo-purposed docs AND blank templates)
- Demo business scenario and original intent
- Custom-fit orchestration layer — static Python state machine
- RAG-like chunking & embedding — deliberately non-uniform
- Data storage & indexing
- Context bundle assembly
- Retrieval engine
- Agentic retrieval + reasoning via Agent Spec docs
- Testing process (per-agent + full pipeline); iteration through tests
- The "needing a shovel to get to the shovel" storyline
- Web app: simple plain view with explanation tips + click-in per phase for technical audiences

## 9.6 Open Questions for Presentation

- Do we include evaluation metrics / tests? Comparing your method to baselines (naive RAG, long context)?
- Where does the "full technological background" go — inline in Part 4 or behind a "More Details" expander?

---

# 10. External References Catalog

All external links and sources cited in the working doc, grouped by topic. Useful for presentation sourcing and follow-up.

## 10.1 Spec-Driven Development
- Augment Code — AI coding agents for SDD automation ([augmentcode.com](https://www.augmentcode.com/guides/ai-coding-agents-for-spec-driven-development-automation))
- Thoughtworks — SDD unpacking 2025 new engineering practices ([thoughtworks.com](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices))
- ResearchGate — AI-based coding assistants in practice ([researchgate.net](https://www.researchgate.net/publication/385399357))
- AWS re:Post — Kiro agentic AI IDE walkthrough ([repost.aws](https://repost.aws/articles/AROjWKtr5RTjy6T2HbFJD_Mw))

## 10.2 Context / Retrieval Research
- Chroma — "Context Rot" research ([trychroma.com](https://www.trychroma.com/research/context-rot))
- IBM Research — larger context windows ([research.ibm.com](https://research.ibm.com/blog/larger-context-window))
- Tsinghua AGENTIF paper ([keg.cs.tsinghua.edu.cn](https://keg.cs.tsinghua.edu.cn/persons/xubin/papers/AgentIF.pdf))
- Atlan — knowledge graphs vs. RAG ([atlan.com](https://atlan.com/know/knowledge-graphs-vs-rag-for-ai/))
- CF Innovation Labs — Graph RAG next evolution ([cfinnovationlabs.com](https://www.cfinnovationlabs.com/blog/graph-rag-next-evolution-knowledge-ai))
- arXiv — SDD granularity tradeoffs ([arxiv.org](https://arxiv.org/html/2602.00180v1))

## 10.3 Context Engine Players
- Unblocked podcast (Pilarinos, SE Daily) ([softwareengineeringdaily.com](https://softwareengineeringdaily.com/2026/03/05/organizational-context-for-ai-coding-agents-with-dennis-pilarinos))
- Tabnine Enterprise Context Engine launch ([globenewswire.com](https://www.globenewswire.com/news-release/2026/02/26/3245668))
- Rywalker — code intelligence tools review ([rywalker.com](https://rywalker.com/research/code-intelligence-tools))
- Hyland Enterprise Context Engine ([hyland.com](https://www.hyland.com/en/company/newsroom/hyland-unveils-enterprise-context-engine-enterprise-agent-mesh))
- Graphiti (Zep) — GitHub ([github.com/getzep/graphiti](https://github.com/getzep/graphiti))

## 10.4 Retrieval Reinvention
- Databricks Instructed Retriever ([venturebeat.com](https://venturebeat.com/data/databricks-instructed-retriever-beats-traditional-rag-data-retrieval-by-70))
- Techbuddies — Databricks Instructed Retriever ([techbuddies.io](https://www.techbuddies.io/2026/01/11/databricks-instructed-retriever-rethinking-rag-for-metadata-heavy-enterprise-ai/))
- Contextual AI — Intro to RAG 2.0 ([contextual.ai](https://contextual.ai/introducing-rag2/))
- Contextual AI — Grounded Language Model ([contextual.ai](https://contextual.ai/blog/introducing-grounded-language-model))
- Contextual AI — Agentic alternative to GraphRAG ([contextual.ai](https://contextual.ai/blog/an-agentic-alternative-to-graphrag))
- VentureBeat — Contextual AI GLM factuality ([venturebeat.com](https://venturebeat.com/ai/contextual-ais-new-ai-model-crushes-gpt-4o-in-accuracy-heres-why-it-matters))
- VentureBeat — Oracle enterprise data stack ([venturebeat.com](https://venturebeat.com/data/oracle-converges-the-ai-data-stack-to-give-enterprise-agents-a-single))

## 10.5 Agent / Orchestration News
- VentureBeat — harness wars (OpenAI SDK, Cloudflare, Google, Stanford Meta-Harness) — also links to Stanford HAI report on production deployment failure rates
- OpenAI Agents SDK announcement (via VentureBeat link)
- Cloudflare Project Think announcement (via VentureBeat link)
- Google Gemini CLI subagents (via VentureBeat link)
- Microsoft Learn — retrieval/knowledge ([learn.microsoft.com](https://learn.microsoft.com))
- LangChain docs ([docs.langchain.com](https://docs.langchain.com))
- OpenAI Developers ([developers.openai.com](https://developers.openai.com))

## 10.6 Secondary / Adjacent
- FinancialContent on Databricks ([markets.financialcontent.com](https://markets.financialcontent.com/talkmarkets/article/tokenring-2026-1-9-databricks-unveils-instructed-retriever-to-solve-the-ai-accuracy-crisis-threatening-traditional-rag))
- dataleadsfuture — agent skills in enterprise LLM ([dataleadsfuture.com](https://www.dataleadsfuture.com/how-to-use-agent-skills-in-enterprise-llm-agent-systems/))

---

## Closing Note

The ≈14,650 words of original notes compress cleanly into this structure because the project itself has a clean spine: *research → scope → build → test → present*. The flagged items in §1 are the volatile working memory that doesn't compress — keep them accessible. Everything else can be summary.

If any section feels under-specified when you return to it, the source document is still intact and can be re-mined against this index.

---

# 11. Scope Discipline — What to De-Emphasize

A few ideas that appear in the notes but should NOT become load-bearing in the presentation or web app. Listing them explicitly so scope stays tight:

- **Building your own GraphRAG or standalone context engine.** This appeared as ideation early on; you correctly chose the governed-pipeline framing instead. Don't let it creep back in.
- **Over-expanded living-document automation** (PRD auto-updated by AI, real-time stakeholder sync, PyQt6 UI for document authoring). Interesting future direction, not the demo's story.
- **Generalized enterprise AI platform.** The strength of the project is that it is *concrete and governed*, not that it is general. Resist abstraction.
- **High-production-complexity presentation elements** (video production, heavy animation, custom visualizations beyond the 3-pane replay). Substance over polish — your own stated principle.
- **Per-document "guardian" agents.** Interesting idea in §1.1 but scope creep for the demo; belongs in a "future extensions" mention at most.
