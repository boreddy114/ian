# Tag Vocabulary

**Save location:** `~/Agents/EquityVault/00_README/tag-vocabulary.md`

This is the canonical theme vocabulary for the EquityVault. Every IC memo,
earnings note, and ACTIVE document has a companion `.md` file with a
`themes:` field in YAML frontmatter. The values in that field MUST come
from this list.

## Why this exists

Cross-vault retrieval works on lexical match (grep). Without a controlled
vocabulary, tags drift — `#headless` and `#composable` and `#decoupled`
describe the same idea but don't match each other. A controlled list keeps
queries reliable. A note's themes are how the system finds it later.

## Rules

1. Tags in the `themes:` field of a companion .md must appear in this file.
2. New tags require adding here first. If the IC memo skill proposes a tag
   that isn't here, it surfaces the proposal for Ian to approve before use.
3. Keep the vocabulary small. Drift comes from sprawl. Twenty to thirty
   active substantive tags is the target. Retire tags that aren't earning
   their keep.
4. Tag granularity: a tag should describe an idea that recurs across at
   least two companies or two analyses. One-off descriptors belong in the
   note body, not the tag list.
5. Format: lowercase, hyphen-separated, no spaces. `physical-world-anchor`
   not `Physical World Anchor` or `physical_world_anchor`.

## What goes in `themes:` vs. other YAML fields

The `themes:` array holds **substantive** themes only — ideas, frameworks,
moat types, sector classification, and structural patterns that describe
*what the thesis is about*.

Administrative metadata does NOT go in `themes:`. It has its own YAML fields:

- `rating:` — buy / neutral / avoid (its own field, not a theme tag)
- `status:` — draft / active / superseded (its own field, not a theme tag)
- `type:` — ic-memo / earnings-note / thematic (its own field)
- `date:` — date stamp (its own field)

Themes are for retrieval ("show me everything tagged `capital-cycle`").
Administrative fields are for filters ("show me everything with `status:
active` and `rating: buy`"). Keep them separate — combining them makes
both worse.

## Cap

Maximum 7 themes per note. Hard cap. If more than 7 candidates surface,
pick the ones that are *load-bearing* for the thesis — the ideas that make
THIS note distinctive — and drop the ones that would be true of any note
on the same sector. A tag earns its place by being substantively important
to *this specific* analysis, not by being descriptively accurate.

---

## AI / Disruption Risk

- `ai-disruption-risk` — Company exposed to AI substitution of core function
- `ai-disruption-beneficiary` — Company benefits from AI demand or workflow
- `ai-sandwich` — Catalini AI Sandwich vulnerability applies
- `codifiers-curse` — Knowledge work being codified into models
- `physical-world-anchor` — Moat anchored in physical/hardware/regulated assets
- `software-in-hardware-clothing` — Software business with hardware/physical tether
- `agentic-infrastructure` — Company supplies the substrate for agentic AI
  workloads (runtime, orchestration, governance, memory, identity)

## Software Architecture

- `headless` — Headless / decoupled front-end and back-end architecture
- `composable` — Composable / modular / API-first stack
- `monolithic-incumbent` — Suite vendor at risk from composable competition
- `system-of-record` — System-of-record / lock-in moat

## Catalini Moat Framework

- `moat-network` — Network effect moat
- `moat-data` — Data / ground-truth moat
- `moat-talent` — Talent / human capital moat
- `moat-switching-cost` — Switching cost / SoR moat
- `moat-non-measurable` — Brand / status / coordination equilibrium moat
- `moat-fortress` — Composite: classical strong + agentic strong
- `moat-contested` — Composite: classical strong + agentic weak
- `pressure-test-complete` — Phase 2 AlphaSense pressure test done

## Investment Themes / Patterns

- `scarcity-abstraction-abundance` — Scarcity → Abstraction → Abundance arc
- `prediction-markets` — Prediction market structure / opportunity
- `merchant-ipp` — Merchant independent power producer thesis
- `content-ip-half-life` — Content IP durability and amortization
- `capital-cycle` — Marathon capital cycle framework applies
- `aggregation-theory` — Ben Thompson aggregation theory applies
- `consensus-gap` — Our estimate / view is materially differentiated from
  sell-side base case; the alpha is in something they haven't modeled yet

## Sectors (coverage)

- `sector-tech-hardware`
- `sector-tech-software`
- `sector-hyperscaler` — Mega-cap cloud / hyperscaler platform business
  (AWS, Azure, GCP segments and their parent stories)
- `sector-us-payments`
- `sector-payments-infra`
- `sector-pc-insurance`
- `sector-payroll`
- `sector-crypto`

## Document Type Markers

(Use these only when the type isn't already captured by the `type:` YAML
field, or when the note straddles types.)

- `type-thematic` — Sector or theme framework, not a single-name note
- `type-pressure-test` — Catalini pressure test output

---

## Vocabulary growth log

When a new tag is added, append a one-line entry here with the date and the
note that triggered it. This is the audit trail for how the vocabulary
evolves.

- 2026-05-12 — Initial vocabulary established
- 2026-05-12 — Added `agentic-infrastructure` (AMZN BMA note — first test run)
- 2026-05-12 — Added `sector-hyperscaler` (AMZN BMA note — AMZN/GOOG/MSFT
  hyperscaler segments don't fit `sector-tech-software`)
- 2026-05-12 — Added `consensus-gap` (AMZN BMA note — pattern of "sell-side
  hasn't modeled X" recurs across coverage; deserves a dedicated tag)
- 2026-05-12 — Removed `rating-buy` / `rating-neutral` / `rating-avoid` from
  vocabulary — rating belongs in `rating:` YAML field, not as a theme
- 2026-05-12 — Removed `active-thesis` / `superseded` from vocabulary —
  status belongs in `status:` YAML field, not as a theme
- 2026-05-12 — Removed `type-initiation` / `type-thesis-change` /
  `type-earnings-note` from vocabulary — captured by `type:` YAML field
