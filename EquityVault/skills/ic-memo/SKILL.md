---
name: ic-memo
description: Write investment committee memos and earnings/event notes for internal equity research. Use when asked to write an IC memo, research note, earnings note, update note, initiation, rating change, or thesis document for a stock, sector, or theme. Also use when iterating on an existing memo or converting research into a distributable document.
---

# IC Memo & Research Note

Write professional buy-side investment documents for internal distribution. Two document types: IC memos (conviction pieces) and thesis-testing notes (earnings/event responses).

## Before Writing

1. Read `references/philosophy.md` for the investment framework, Four M's, source hierarchy, and EquityVault navigation rules.
2. Read `references/making_money_models.md` and run the Quick Reference checklist against the company. Identify which of the 37 frameworks fit, which conflict, and where the market may be mispricing. Surface collisions — e.g., "fits scale economies shared, but the physical tether filter says no atoms."
3. Navigate EquityVault if available:
   - `Thesis_Log.md` first (continuity layer)
   - `ACTIVE_` file if one exists (current distributable thesis)
   - First-party notes and models (highest analytical weight)
   - `3P_Research/` root for consensus positioning (ignore `Archive/`)
   - `40_Themes/THEMES_INDEX.md` for relevant themes
   - `50_Research_Notes/` for cross-cutting sector work

## Fresh Eyes Rule

If the research was conducted in this same conversation over many turns, the memo will be worse. The exploration phase creates attachment to every finding and pressure to include everything. State this to the user: "The research is done. I can write the memo now, but it will be tighter if I write it in a fresh session working from the saved files." If the user wants to proceed anyway, consciously filter: every section must serve the argument spine. Cut anything that exists for completeness rather than persuasion.

## Type 1: IC Memo

A conviction piece that frames a thesis and recommends action. For initiations, rating changes, sector frameworks, thematic research.

### Before Drafting — Find the Spine

State the argument in three sentences. Every section serves this spine or gets cut. If a section exists because the research was interesting rather than because the argument needs it, cut it.

### Structure (in order)

**1. Financial Snapshot** — Placeholder table for Ian to populate from his model. Include field labels: Price Metrics | Estimates | Valuation Metrics | Positions. No FROM/DATE/RE header block.

**2. Thesis Tracker** — Three items maximum. Monitorable — checkable quarterly. Short, one line each. These become the spine of future earnings notes.

**3. Summary** — Most important section. One page maximum. Opens with **Context** — why we are looking at this now (drawdown, event, valuation, macro shift, competitive development, new data). Then thesis, price/valuation, rating, and conditions. Direct declarative prose, no bullets. A reader who stops here has the complete picture. If the user hasn't provided context, ask: "What's driving us to look at this now?"

**4. Our Thesis** — The falsifiable claim. 2-3 sentences. Possible to evaluate as right or wrong in 12 months.

**5. The Business and How It Grows** — The analytical body. Organized by segment or revenue line. For each growth driver: state the driver, then embed the evidence directly underneath. Evidence is a finding with its source ("the 10-K shows...", "state athletic commission data confirms...", "a former Fox Sports executive estimates..."). Never narrate the research process. Never inventory the work done. Just state what was found.

Cover: how it makes money, competitive position and moat, growth vectors, management and capital allocation, valuation (multiple lenses; always show GAAP vs. non-GAAP when SBC is material).

**6. What Could Go Wrong** — 3-4 items maximum. 2-3 sentences each. State the risk, state how it impairs the thesis, state what to watch. Do not repeat material already covered. Rating-aware: Buy = downside risks. Neutral/Avoid = symmetric risks (include what makes us wrong for not owning it).

**7. Conclusion** — Short. Rating. Conditions to upgrade or downgrade. Next decision point. No re-summarizing.

### Rating

Options: **Buy, Neutral, Avoid.** No "Watch." No "Hold" unless the user specifically prefers it. If the evidence supports a rating, commit to it. Open questions belong in the research agenda, not as reasons to avoid a conclusion. Hedging to Neutral because there are unanswered questions is almost always wrong — there are always unanswered questions.

## Type 2: Thesis-Testing Notes

Shorter documents that test the existing thesis against new information. Carry the thesis forward — do not re-derive from scratch.

### Type 2a: Earnings Note

Use after earnings releases when documents are in `Quarterly/Q[X]_[YEAR]/`.

Structure: Financial Snapshot → Thesis Tracker (mark each item strengthened/weakened/unchanged) → What Happened (pure facts, results vs. consensus, comparison table) → What Did We Learn (test each tracker item) → What To Do (rating, conditions, next decision). Length: 3-5 pages.

### Type 2b: Update Note

Use for reactions to data points, market moves, competitive developments without a document package.

Structure: Thesis Tracker → What Happened (few sentences) → What Did We Learn → What To Do. Length: 1-2 pages. No Financial Snapshot unless requested.

## Writing Rules

- **Prose over bullets.** Continuous analytical prose with section headers. Tables for data comparisons and valuation. Bullets only for short enumerated lists.
- **Use "I" for opinions.** Use "we" for portfolio actions and collective decisions.
- **Concrete over abstract.** "Revenue grew 24% YoY to $4.2B, 300bps above consensus" not "revenue growth was strong."
- **No contrastive negation.** Never write "the right question is not X, it's Y" or "this is not a product company — it is a platform." Just state what it is. If correcting a misconception, name it once and move to the correct framing.
- **No narrating the research.** Never write "after six weeks of primary research" or "we built a comprehensive analytical framework." Use findings when they matter; don't inventory the work. The reader does not care how hard you worked. They care what you found.
- **No AI-speak.** Never write "it's important to note," "it's worth highlighting," "interestingly," or "notably."
- **No sycophancy.** Never write "Great question!" or compliment the user's insight.
- **Proof points are evidence, not business description.** A proof point is: "Q4 backtested at 2.4% variance to reported revenue." Not: "UFC has 43 annual events."
- **Frameworks are invisible scaffolding.** Never use framework names as section headers. The analysis is informed by the frameworks; it does not label itself with them.
- **Length: 5-8 pages** for a standard memo. Up to 10-12 for sector frameworks with multiple names.

## Source Rules

Read `references/philosophy.md` for the full source hierarchy. Key rules:

- User-provided documents are always highest priority. Read all before writing.
- SEC filings for GAAP financials. Fetch from EDGAR or IR directly.
- Sell-side research for consensus positioning only. Never adopt sell-side conclusions.
- **Blocked:** Motley Fool, Seeking Alpha, Yahoo Finance articles, TipRanks, MarketBeat, GuruFocus, any AI-generated summary. If only retail sources exist for a data point, flag the gap.

## File Conventions

- New documents start as `DRAFT_`. Only Ian promotes to `ACTIVE_`.
- Version iterations: `_v2`, `_v3`. Never overwrite earlier drafts.
- Title should convey the thesis: `DRAFT_TKO_Scarce_Live_Assets_Buy.docx`, not `DRAFT_TKO_IC_Memo.docx`.
- Update notes (Type 2b) get no prefix — clean descriptive name with date.
- When superseded, old `ACTIVE_` loses prefix and moves to `Outputs/`.
