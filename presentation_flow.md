***Presentation Layout***

**Part 1 (Title Page):**
News, article headlines "Enterprise AI", "building agentic infrastructure", "how can AI agents use enterprise data safely & effectively?", etc.

In the middle of the screen: phase-in a quote by McKinsey on 'the great paradox': "80% of enterprises believe in the transformative impact of AI and thus are financially invested" and yet "80% of companies say they’re not yet seeing impact on the bottom line from those investments."

Maybe one or two more quotes or facts about how the implementation of agentic AI in enterprises in lagging behind AI agent capabilities

**Part 2 (Introduction):**
Title: A Spec-Driven Approach to Enterprise Context Engineering (rough draft title)

Or maybe: Hybrid Agentic Retrieval with Spec-Driven Philosophy

We'll figure this out later

Created by Pierce Nellessen. All rights reserved or whatever makes sense for my proprietary creation

**Part 3 (Describing the Problem, Painting the Landscape):**

My research, current approaches to tackling the problem of 'enterprise ai'

The player and their perspectives; their 'game'

**Part 4 (My approach - decide whether the full-technological background should be showcased here or behind a 'More Details' button):**

Spec-Driven Development philosophy for context engineering

    Maybe mention my research on some of the current players-- Kiro and Github Spec Kit --their pros & cons
    How I've innovated on top of their some of their frameworks

Hybrid Agentic Retrieval w/ static Python state machine orchestration layer
    
    My reasoning, pros & cons
    Why deterministic supervisor makes sense? What cases would an LLM supervisor make sense?
    Other organization methods for an orchestration layer - like LangGraph

Custom chunking & embedding tailored to enterprise documents (formatting, organization)
BM25 & Chroma

    Reasoning, partly best for this demo
    Give alternative options for the enterprise scale

Vector database in a real enterprise scenario, didn't make sense for demo

Retrieval engine

Reranking

Context bundle assembly

LLM domain agents - receive context bundle / fulfill output contract

    As monitored by the supervisor for expected output
    Emit status signals which are handled by the supervisor
Checklist Assembler showcases results of the run, Checkoff Agent routes necessary items to proper department / document owners

**Part 5 (Briefly Describing the Proposed Business Scenario):**
How my proposed enterprise-ai approach makes sense for this demo.
The stakeholders, concerns, structure of the problem

**Part 6 (The demo in-action, showcased on our mock business scenario):**

**Part 7 (What I learned, my findings, results, (and do we want evaluation here?) ):**