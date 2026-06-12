# Skill Updates — Phase 0 Research Gate

## Problem

The orchestrator and all five spoke skills had a Research Protocol section that described
*what* sources to use and *in what order*, but nothing structurally prevented skipping it.
The protocol read as guidance, not as a gate. In practice, this meant web search summaries
(Tier 3) were substituted for primary sources (Tier 1) without producing any visible
evidence of the shortcut.

## Fix

### Orchestrator (`catalini-moat-screen/SKILL.md`)

**Added: Phase 0 — Source Inventory & Primary Extraction** (140 new lines)

Inserted between the existing Research Methodology section and Phase 1: Business Understanding.

Phase 0 has three mandatory steps, each producing a visible intermediate output:

- **Step 0.1 — Source Inventory**: Check uploads, conversation history, Portfolio Tracker,
  SEC EDGAR, and earnings transcripts. Output: **Source Ledger** table shown to user.

- **Step 0.2 — Primary Source Extraction**: Read the actual 10-K (Items 1, 1A, 7),
  earnings transcript (prepared remarks + Q&A), prior user analysis, and any expert
  transcripts. Output: **Evidence Base** organized by source.

- **Step 0.3 — Gap Assessment**: Identify what Tier 2 and Tier 3 research is still
  needed. Output: **Research Plan**.

Two explicit gates:
1. Opening gate: "Phase 0 must be completed before ANY analysis begins."
2. Closing checkpoint: "Do not proceed to Phase 1 until Phase 0 is complete."

Includes a "why this gate exists" paragraph that names the specific failure mode
(skipping to web search because it feels faster).

### All Five Spoke Skills

**Added: Standalone Source Gate** (~35 new lines each)

Inserted between the existing Research Source Hierarchy section and the Analysis Process.

The gate is conditional:
- If invoked by the orchestrator → Phase 0 already done, proceed to Step 1.
- If invoked standalone → run a condensed source audit (check uploads, search
  conversation history, locate primary sources, present brief Source Ledger,
  read primary sources before scoring).

Includes checkpoint: "Do not proceed to Step 1 until you have read at least one
Tier 1 primary source."

**Files modified:**
- `system-of-record-skill/SKILL.md`
- `network-moat-skill/SKILL.md`
- `ground-truth-skill/SKILL.md`
- `talent-moat-skill/SKILL.md`
- `non-measurable-skill/SKILL.md`

## What Did NOT Change

- No changes to the scoring rubrics, reference files, output format, or any
  analytical content in any skill.
- No changes to the Research Protocol's source hierarchy (Tier 1/2/3 definitions
  remain the same).
- No changes to Phase 1 through Phase 5 of the orchestrator.
- No changes to the spoke skills' analysis steps, scoring, or output sections.

## Installation

Replace each skill's `SKILL.md` with the corresponding file in this package.
The directory structure matches the installed skill paths:

```
skill-updates/
├── catalini-moat-screen/SKILL.md    → /mnt/skills/user/catalini-moat-screen/SKILL.md
├── system-of-record-skill/SKILL.md  → /mnt/skills/user/system-of-record-skill/SKILL.md
├── network-moat-skill/SKILL.md      → /mnt/skills/user/network-moat-skill/SKILL.md
├── ground-truth-skill/SKILL.md      → /mnt/skills/user/ground-truth-skill/SKILL.md
├── talent-moat-skill/SKILL.md       → /mnt/skills/user/talent-moat-skill/SKILL.md
└── non-measurable-skill/SKILL.md    → /mnt/skills/user/non-measurable-skill/SKILL.md
```
