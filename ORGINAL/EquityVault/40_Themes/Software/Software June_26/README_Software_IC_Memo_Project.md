# README — Software Underweight Re-Entry: IC Memo Project (Handoff)

**Last updated:** 2026-05-25 · **For:** Ian McDonald (APM, Janus Henderson) · **Purpose:** brief a fresh chat window to continue this work without re-deriving anything.

---

## 1. What this project is

We are closing roughly half of a ~250bps software/services **underweight** by selling INTU and adding 3-6 durability-gated names. Each name gets a full **IC memo** written with the **v2 IC memo skill** (`/mnt/skills/user/ic-memo-skill-v2/SKILL.md`). The memos hang off a single **house-view thesis doc** (the spine).

**Governing framework (settled):** Classical moats were implicitly *labor* moats. AI dissolves labor moats but NOT moats anchored in **verification, coordination, or physical/legal consequence**. The market sorts software on *AI-coupling* (does revenue track AI capex); we sort on *durability* (does the moat survive AI). The mispricing lives in that gap. Discipline rules: **"durable ≠ buy," "beaten-down ≠ cheap."** Durability is a non-negotiable gate; price is the second test.

---

## 2. The trade (locked)

- **Sell:** INTU, 40bps (own screen: labor+habit moat, not the data moat the multiple implies).
- **Add ~130bps**, stay ~120bps underweight. ~90bps funding gap beyond INTU is sourced **elsewhere in the book** (Ian handles outside the basket — do NOT re-litigate this).
- **Core (cheap & durable, ~85bps):** VEEV 20 · VRSK 25 · TYL 25 · PTC 15
- **Satellite (expensive but durable + AI-coupled, ~45bps):** PLTR 25 · CRWD 20
- Quality-tilted ~65/35. CRWD is the **flagged highest-risk line** (~177x, near highs, telemetry-decay moat question open). PLTR key risk = customer concentration (top-20 ≈ half of revenue), not just multiple.

---

## 3. Memo status — what's done, what's left

| Name | Sleeve | Memo status | Rating | One-line |
|---|---|---|---|---|
| **VRSK** | Core | ✅ DONE (.docx + .md) | Buy +25bps | Verification-data moat AI strengthens; ~23x vs ~43x 5yr-avg; return from earnings algorithm not re-rating |
| **TYL** | Core | ✅ DONE (.docx + .md) | Buy +25bps | Gov system-of-record; procurement/data/liability barriers AI can't erode; out-of-favor quality NOT cheap |
| **VEEV** | Core | ⬜ NEXT | (lean Buy) | Regulated life-sci SoR; FDA-validation moat (most VRSK-like); ~20x = genuinely cheapest, value framing is real |
| **PTC** | Core | ⬜ TODO | (lean Buy) | Industrial PLM/CAD; physical-consequence output; ~15x, near 52wk low, Q2 beat-raise |
| **PLTR** | Satellite | ⬜ TODO | (lean Buy, low-conviction) | Bifurcated: govt Fortress / commercial Contested-firming; ~82x; concentration risk |
| **CRWD** | Satellite | ⬜ TODO | (open) | Security consumption flywheel; ~177x near highs; telemetry-decay moat question UNRESOLVED |

**Also done:** house-view thesis doc, trade-construction doc, moat-map grid (HTML), SNOW strategy memo + thesis log (SNOW is NOT being bought — Contested; used only as the framework's "what to avoid" example).

---

## 4. HARD-WON STYLE RULES (Ian rejected drafts until these were met — do not regress)

1. **Institutional register, not retail.** No "call it 5%," no "worth roughly a point," no "the algorithm is: X plus Y minus Z," no "I am not modeling them away." State the decomposition; don't narrate the arithmetic to a beginner.
2. **EPS algorithm = a bridge TABLE** (Driver / Contribution / Nature), not a walk-through paragraph. This is mandatory for every memo.
3. **Proof Points = the concerns map, each headed "My judgment: [our conclusion]."** Evidence is cited as SUPPORT for OUR judgment — never "the market worried X, an expert said Y." We read the transcripts and either agreed or disagreed; **our judgment is the content, not the experts'.**
4. **Include where we DISAGREE or concede** (e.g., VRSK Concern 5 "where I am most willing to concede"; TYL Concern 4 "where I concede the most"). A memo that only amplifies the bull side is not analysis.
5. **Override management spin where warranted** (e.g., VRSK: rejected "AI is pure tailwind," wrote it as net-additive but margin-neutral and slower-to-monetize).
6. **NO contrastive negation** ("not X, but Y" / "the question is not A, it's B"). Banned by the skill and Ian flags it as an AI tell. State the positive directly.
7. **No research-process narration.** Never "after pulling the transcript" or inventory the work.
8. **Voice:** "I" for analytical judgments, "we" for firm actions/positioning.
9. **No sell-side analyst names or firm names** in the memo body (standing rule). Management names (CEO/CFO) are fine.
10. **Sources:** primary only. Blocked: Motley Fool, Seeking Alpha, Yahoo, StockAnalysis, GuruFocus, TipRanks, etc. Use SEC filings, IR releases, transcripts, user uploads. The v2 skill lists the full blocked set — re-read it.

---

## 5. Memo structure (v2 skill — READ THE SKILL IN FULL FIRST)

Financial Snapshot (table) → Thesis Tracker (3 monitorable items) → Summary (opens with **Context** hook) → Our Thesis (falsifiable, 2-3 sentences) → **Proof Points** (concern-rebuttal as our judgment) → The Business (incl. the **EPS bridge table**) → What Could Go Wrong (3-4, rating-aware, flag open evidence gaps honestly) → Conclusion. **Companion .md REQUIRED** with YAML frontmatter, every run.

- Filenames: `DRAFT_{TICKER}_{thesis-title}.docx` + matching `.md`.
- The skill mandates reading **both framework appendices** (Investment Philosophy + 37 Making Money Models) before drafting, and confirming you've read them.
- **docx build gotcha:** `pBdr` (paragraph border) children must be ordered top→left→bottom→right or validate.py fails. Fix by post-processing XML (unpack.py → reorder regex → pack.py). Shading needs explicit `type:"clear", color:"auto"`. Always run `/mnt/skills/public/docx/scripts/office/validate.py` then visual-QA via soffice.py→pdftoppm.

---

## 6. TAG APPROVALS PENDING (Ian must resolve — could not read tag-vocabulary.md)

VRSK proposed: `data-that-proves`, `verification-moat`, `ai-disruption-beneficiary`, `consensus-gap`, `regulatory-lock-in`, `earnings-algorithm`
TYL proposed: `system-of-record`, `government-vertical`, `ai-disruption-overblown`, `switching-cost-bifurcation`, `cloud-transition`, `out-of-favor-quality`
→ Ian: add to vocabulary / swap / drop. The .md files use these provisionally.

---

## 7. OPEN RESEARCH GAPS (flagged honestly in each memo's "What Could Go Wrong")

- **VRSK:** switching-cost durability rests on management's account, not former-customer evidence. Highest-value pull = former Verisk customers on whether the binding constraint was automatable data-migration vs. durable regulatory/model-governance continuity. (Concerns map pre-wrote this query.)
- **TYL:** the procurement-vs-inertia crux is resolved bifurcated-leaning-durable using flip data (478 clients flipped on-prem→SaaS and re-contracted, didn't leave) + segment split (ES core accelerating, PT edge lumpy) — but this is management/filings evidence, NOT former-customer accounts of attempting a full *core* switch. Same gap shape as VRSK. Concerns map pre-wrote the query (former gov CIOs).
- Both gaps are the SNOW-playbook pressure-test (pull raw transcripts + adversarial/former-customer sources; the AlphaSense Gen Search *synthesis* layer systematically rounds toward stickiness — rate off raw, not the summary).

---

## 8. KEY DATA ALREADY PULLED (so you don't re-fetch)

**Quartr companyIds:** VRSK=3888, TYL=5684. (Quartr `read_document` sometimes returns "No approval received" — retry, it clears. Large docs store to `/mnt/user-data/tool_results/` — extract via python/grep.)

**VRSK:** price $176.84, EV $26.4B, mkt cap $23.2B. Rev $2,882M(24)→$3,073(25)→$3,212(26E)→$3,429(27E), ~6% CAGR. EBIT margin 43.5%→47%. Adj EPS $6.64→$7.16→$7.66→$8.64. P/E 26.6x→20.5x(27E); 5yr avg ~43x. Q1'26: OCC rev +4.7% (explicit trough), subscription 84% +7%, adj EBITDA margin 55.9% +60bps, adj EPS +5.2%. FY26 guide rev $3.19-3.24B, adj EBITDA margin 56-56.5%, adj EPS $7.45-7.75. Buyback 7.6M shares Q1 ($1.5B ASR + $126M OMR), ~$1B left. Won competitive RFP vs tech/AI bidders to co-build a global insurer's next-gen underwriting platform (mgmt called it one-off). Source data from Ian's `Balanced_Tracker_4_26.numbers` "Header" sheet + comp sheet ("data-that-proves" moat language is Ian's own).

**TYL:** price ~$322, ~$13.5B mkt cap, down ~36% 1yr / ~48% off $621 high, ~30x fwd / ~44x ttm, net cash. Q1'26 (beat-raise): total rev $613.5M +8.6%, recurring $538.6M +10.4% (87.8%), SaaS $222.4M +23.5% (21 straight qtrs >20%), ARR $2.15B. Non-GAAP EPS $3.09 +9.3%, non-GAAP op margin 27.2%, FCF $102.8M (+113%). FY26 guide rev $2.535-2.575B, non-GAAP EPS $12.50-12.75, FCF margin 26-28%. **478 clients flipped on-prem→SaaS TTM** (the key moat-durability datapoint). Segment split: ES (core, ~76%) subscriptions +29%/SaaS +26%; PT (~24%) lumpy on lost payment contract. Repaid $600M convert at maturity (Mar); ~2.5% shares repurchased YTD ~$315 avg, ~$650M authorization left. Acquired For The Record ($223M, AI transcription) + Socrata (judicial intelligence, 45% of US courtrooms). >$20M/yr statewide titling deal starts 2027. CEO Lynn Moore, CFO Brian Miller. June Investor Day upcoming. 10-K: "highly fragmented" market, competes w/ in-house gov IT.

**VEEV (next memo):** ~$172, ~20x fwd (cheapest in basket), down ~24% 1yr, FY26 rev +16%, added to S&P 500. companyId not yet looked up. Moat = regulated life-sci SoR; switching = FDA re-validation (most VRSK-like, liability-anchored).
**PTC:** ~$146, ~15x norm, near 52wk low ($131-220), Q2 beat-raise (ARR +8.5%, 53% op margin, new $2B buyback). Industrial PLM/CAD, physical-consequence output.
**PLTR:** ~$136, ~82x fwd / ~146-154x ttm, down ~27% YTD. Q1'26 rev +84.7%, US commercial +133%, op margin 46%. Top-20 customers ≈ half of revenue (key risk). FY25 $4.5B rev, 54% govt / 46% commercial. Screened bifurcated: govt Fortress-adjacent / commercial Contested-firming (ontology shows coordination/compounding — one customer 4→280 use cases). On grid at x:74/y:62.
**CRWD:** ~$663, ~177x normalized (GAAP neg ttm), +47% 1yr, near all-time highs. Least out-of-favor, most "paying up." Telemetry-decay moat question OPEN (does threat data compound like Verisk or decay like observability?) — this is the pressure-test target before the 20bps goes on.

---

## 9. RECOMMENDED NEXT ACTIONS (in order)

1. **VEEV memo** — next core name, cleanest remaining (VRSK-like FDA-validation moat, genuinely cheap so the value framing is honest). Pull 10-K + latest Q + transcript via Quartr (search_companies "Veeva"). Ian will likely run a moat screen + concerns map in a separate chat and deliver them — ask.
2. Then **PTC**, then the satellite names **PLTR** and **CRWD**.
3. **CRWD pressure test** before finalizing its 20bps — the one name funding real capital with an unresolved moat question. Same 7-pull AlphaSense playbook that settled SNOW.
4. Resolve the **tag approvals** (§6) and the two **open research gaps** (§7) when Ian has bandwidth.

**Workflow note:** Ian runs the Catalini moat screen + concerns map in a SEPARATE chat and delivers them here as uploads. The concerns map is the spine of the Proof Points section — wait for it (or ask) before building a memo, the way we did for VRSK and TYL.

---

## 10. All deliverables live in `/mnt/user-data/outputs/`
- `Software_House_View_Thesis.docx` (the spine)
- `Software_UW_Trade_Construction.docx`
- `Moat_Map_with_Pricing.html`
- `SNOW_Strategy_Arc_Memo.docx`, `SNOW_thesislog_entry.md`
- `DRAFT_VRSK_Verification_Data_Moat_On_Sale_v2.docx` + `.md`
- `DRAFT_TYL_Government_SoR_Out_Of_Favor.docx` + `.md`
- `README_Software_IC_Memo_Project.md` (this file)
