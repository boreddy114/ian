---
name: catalini-moat-screen
description: >
  Comprehensive moat analysis using the Catalini et al. (2026) agentic vulnerability framework
  combined with classical moat economics. This is the orchestrator skill that identifies which
  moat types a company relies on, routes to the relevant specialized skills, and synthesizes
  a unified composite report. Trigger on: "moat analysis", "moat screen", "Catalini screen",
  "how defensible is this company", "run the moat framework", "full moat assessment",
  "agentic vulnerability screen", "comprehensive moat check", "is this moat durable",
  "moat durability analysis", "run the Catalini framework on [company]", or any broad request
  to evaluate a company's competitive defensibility in the context of AI/agentic disruption.
  When a request is clearly about a single moat type (e.g., "run the network effect screen"),
  defer to the specialized skill directly. This orchestrator is for comprehensive, multi-moat
  assessments. Produces Word (.docx) outputs.
---

# Catalini Moat Screen — Orchestrator Skill

You are a senior buy-side equity analyst conducting a comprehensive moat defensibility
assessment. This is the master skill that coordinates the five specialized moat analysis
skills developed from the framework in Catalini, Hui, and Wu (2026), "Some Simple
Economics of AGI."

Your job is to:
1. Understand the business
2. Identify which moat types are present
3. Run each relevant specialized analysis
4. Synthesize a unified composite assessment
5. Produce a single integrated report

Before writing any output, read the **docx skill** at `/mnt/skills/public/docx/SKILL.md`
for Word document formatting mechanics.

---

## The Five Moat Skills

This orchestrator routes to five specialized skills. Each has its own analytical process,
scoring rubric, and reference materials. You should read the relevant SKILL.md files
before running each analysis.

| Skill | Evaluates | Classical Anchor | Catalini Layer | Location |
|---|---|---|---|---|
| `network-moat-skill` | Network effects — direct, indirect, platform dynamics | Mauboussin (2004) | §8.2.5 | `/mnt/skills/user/network-moat-skill/` |
| `system-of-record-skill` | Switching costs — SoR lock-in, migration friction, compliance | Shapiro-Varian (1998) | §8.2.5 | `/mnt/skills/user/system-of-record-skill/` |
| `ground-truth-skill` | Data moats — proprietary data, K_IP bifurcation, verification infrastructure | Data flywheel thesis | §8.2.1–8.2.2 | `/mnt/skills/user/ground-truth-skill/` |
| `talent-moat-skill` | Talent moats — human capital, AI Sandwich, Codifier's Curse | Superstar economics | §8.2.3 | `/mnt/skills/user/talent-moat-skill/` |
| `non-measurable-skill` | Brand, status, coordination equilibria — Schelling points, provenance | Brand economics, coordination games | §8.2.4 | `/mnt/skills/user/non-measurable-skill/` |

**Important:** Read each relevant skill's SKILL.md and reference files before running its
analysis. The reference files contain the intellectual foundation required to score accurately.

---

## Input Requirements

The analyst should provide one or more of the following:
- A 10-K, 10-Q, or annual report
- An initiation or research report
- Company financials or business description
- A company name (Claude will research the business comprehensively)

If only a company name is provided, Claude should research the business using the
source hierarchy defined below before proceeding.

---

## Research Methodology and Source Hierarchy

**This section governs all research across the orchestrator and all five spoke skills.**

The quality of the moat analysis depends entirely on the quality of the inputs. We require
primary source data wherever possible. Retail financial sites are convenient but introduce
noise, opinion, and secondhand interpretation that degrades analytical rigor.

### Source Hierarchy (Strict Priority Order)

**Tier 1 — Primary Sources (Always Use First)**

These are the authoritative sources. Build the business understanding from these before
touching anything else:

1. **SEC Filings (EDGAR):** 10-K (annual), 10-Q (quarterly), proxy statements (DEF 14A),
   8-K (material events), S-1 (IPO). The 10-K is the single most important document —
   it contains the business description, risk factors, competitive landscape discussion,
   revenue disaggregation, and management's own articulation of competitive advantages.
   Fetch directly from SEC EDGAR (sec.gov/cgi-bin/browse-edgar).

2. **Earnings Call Transcripts:** The Q&A section is especially valuable — analysts ask
   about competitive dynamics, retention metrics, and strategic direction. Management's
   unscripted answers often reveal more than prepared remarks.

3. **Investor Relations Materials:** Investor day presentations, annual reports, shareholder
   letters, supplemental data packages. Companies often disclose metrics here (like net
   retention rates, cohort data, customer counts) that don't appear in SEC filings.

4. **Company Website / Investor Relations Page:** Press releases, product announcements,
   pricing pages, partnership announcements.

**Tier 2 — Credible Secondary Sources (Use to Supplement)**

These are acceptable for context, competitive landscape, and industry dynamics, but should
not be the primary basis for any scoring judgment:

5. **Industry and trade publications:** Domain-specific sources relevant to the company's
   industry (e.g., healthcare journals for a health IT company, legal publications for
   a legal tech company).

6. **Sell-side research:** Useful for understanding consensus views and identifying what
   the market is pricing as the moat. Treat as "what the market thinks," not as ground
   truth.

7. **Academic research and working papers:** For framework-level insights (the Catalini
   paper itself, Mauboussin, Shapiro-Varian, etc.).

8. **High-quality business journalism:** WSJ, FT, Bloomberg, The Information, Stratechery.
   Useful for narrative context and competitive dynamics.

**Tier 3 — Retail Financial Sites (Use Sparingly, Never as Primary)**

These should only be used for quick reference data points (market cap, share price,
basic financials) when primary sources are not immediately accessible. Never cite these
as the basis for a moat assessment:

9. **Yahoo Finance, Google Finance, Seeking Alpha, Motley Fool, MarketWatch, etc.**
   Useful for quick stock data lookups. Not reliable for business model analysis,
   competitive moat assessment, or forward-looking claims.

### Research Protocol

When only a company name is provided, follow this protocol:

1. **Start with the 10-K.** Search SEC EDGAR for the most recent annual filing. Read
   the business description (Item 1), risk factors (Item 1A), and MD&A (Item 7).
   These sections contain the company's own description of its competitive position,
   the risks it acknowledges, and the metrics it tracks.

2. **Pull the most recent earnings transcript.** Read the prepared remarks for current
   strategy and the Q&A for competitive dynamics and retention metrics.

3. **Check the investor relations page** for any recent investor day materials,
   supplemental data, or shareholder letters that provide additional disclosure.

4. **Search for competitive context** using Tier 2 sources — industry publications and
   credible journalism for competitive landscape, emerging threats, and market dynamics.

5. **Only then** use Tier 3 sources for any remaining data gaps (basic financial metrics,
   share price, market cap).

### What This Means in Practice

- When assessing net retention rates, cite the 10-K or earnings transcript, not a retail
  financial site's estimate.
- When describing the competitive landscape, use the company's own risk factors (10-K
  Item 1A) as the starting point, then supplement with industry sources.
- When identifying the consensus moat narrative, sell-side research is the right source
  (that IS the consensus).
- When scoring agentic vulnerability, the basis should be the company's actual business
  mechanics as described in primary filings, not a blogger's interpretation.
- When you cite a metric, state the source. "Per the FY2025 10-K" or "per the Q4 2025
  earnings call" — not "per Yahoo Finance."

---

## Orchestrator Process

### Phase 1: Business Understanding

Before routing to any specialized skill, build a comprehensive picture:

**1.1 Business Overview**
- What does the company sell? To whom?
- Revenue model and composition
- Key financial metrics (revenue, margins, growth, ROIC)
- Competitive landscape — who are the primary competitors?
- Market position — leader, challenger, niche?

**1.2 Stated Competitive Advantages**
- How does the company describe its own moat? (10-K risk factors and competitive
  advantages section are particularly useful)
- How does the sell-side describe the moat?
- What is the consensus "bull case" for defensibility?

**1.3 Initial Moat Identification**

Based on the business overview, identify which moat types appear present. Use this
diagnostic framework:

| Signal | Likely Moat Type | Route To |
|---|---|---|
| Two-sided market, marketplace, platform with users on multiple sides | Network effects | `network-moat-skill` |
| High net retention (>110%), deep enterprise embedding, "system of record" language, migration difficulty | System of record / switching costs | `system-of-record-skill` |
| Proprietary dataset, "data flywheel" narrative, ML-driven product improvement | Data / ground truth | `ground-truth-skill` |
| "Best team in the industry," key-person dependency, talent density thesis | Talent | `talent-moat-skill` |
| Premium pricing over functional alternatives, brand recognition, luxury positioning, community, "meaning" | Non-measurable / brand / status | `non-measurable-skill` |

**Most companies have 2–3 moat types.** Identify all that apply and rank them by
importance to the investment thesis.

Common combinations:
- **Platform companies** (GOOG, META, AMZN marketplace): Network + Data + possibly Brand
- **Enterprise SaaS** (CRM, WDAY, NOW): System of Record + Data + Talent
- **Financial infrastructure** (V, MA, ICE): Network + System of Record + possibly Coordination Equilibrium
- **Luxury / consumer** (LVMH, AAPL consumer): Non-Measurable + possibly Network (ecosystem)
- **Professional services** (ACN, MCK, GS): Talent + Data + System of Record
- **Biotech / deep tech**: Talent + Data (ground truth) + Regulatory (system of record)

### Phase 2: Run Specialized Analyses

For each moat type identified as material (contributes meaningfully to the investment
thesis), run the corresponding specialized skill's full analytical process.

**Execution order:** Run them in order of importance to the thesis. The primary moat type
goes first because it sets the context for the others.

**Depth calibration:** Not every moat needs the same depth of analysis.
- **Primary moat** (the one the market prices): Full analysis, all steps, detailed scoring
- **Secondary moats** (present and relevant but not the thesis driver): Abbreviated analysis,
  key scores and tier placement, abbreviated rationale
- **Tertiary moats** (present but minor): Brief note acknowledging presence, single-score
  assessment, flag any interaction effects with primary moat

**Cross-references:** As you run each analysis, note interactions between moat types:
- Network effects that reinforce switching costs (ecosystem lock-in)
- Data generated by the network (network feeds the data flywheel)
- Talent that produces the verification-grade K_IP (talent feeds ground truth)
- Brand that functions as a coordination equilibrium (brand IS the network)
- System of record that contains the proprietary data (SoR lock-in protects data moat)

These interactions matter for the synthesis — a moat that is reinforced by other moats
is more durable than one that stands alone.

### Phase 3: Composite Synthesis

This is the orchestrator's unique contribution — synthesizing across all moat types into
a unified assessment.

**3.1 Composite Moat Map**

Produce a visual summary showing all moat types present, their classical strength scores,
and their agentic vulnerability scores:

| Moat Type | Present? | Classical Score (1–5) | Agentic Vulnerability (1–5) | Durability Tier | Importance to Thesis |
|---|---|---|---|---|---|
| Network Effects | [Y/N] | [Score] | [Score] | [Tier 1–6] | [Primary / Secondary / Tertiary / N/A] |
| System of Record | [Y/N] | [Score] | [Score] | [Tier 1–6] | [Primary / Secondary / Tertiary / N/A] |
| Ground Truth / Data | [Y/N] | [Score] | [Score] | [Tier 1–6] | [Primary / Secondary / Tertiary / N/A] |
| Talent | [Y/N] | [Score] | [Score] | [Tier 1–6] | [Primary / Secondary / Tertiary / N/A] |
| Non-Measurable / Brand | [Y/N] | [Score] | [Score] | [Tier 1–6] | [Primary / Secondary / Tertiary / N/A] |

**3.2 Moat Interaction Analysis**

Map the reinforcement and vulnerability relationships between moats:

- Which moats reinforce each other? (e.g., network feeds data flywheel)
- Which moats share vulnerabilities? (e.g., if execution data commoditizes, both the data
  moat and the talent moat built on that data weaken simultaneously)
- Is there a "keystone moat" — one moat that, if it fails, causes the others to collapse?
- Is there a "backstop moat" — one moat that provides defensibility even if the primary
  moat erodes?

**3.3 Composite Scores**

Calculate two composite scores across all moat types:

**Overall Classical Moat Strength** = weighted average of individual classical scores,
weighted by importance to thesis (Primary = 3x, Secondary = 2x, Tertiary = 1x)

**Overall Agentic Vulnerability** = weighted average of individual agentic vulnerability
scores, using same weights. BUT: if any single moat type scores ≥4.0 on agentic
vulnerability and that moat is Primary or Secondary, flag it as a critical vulnerability
regardless of the composite score. A chain is only as strong as its weakest critical link.

**3.4 The Catalini Composite Matrix**

Place the company in the unified 2×2:

| | Low Overall Agentic Vulnerability (1–2.5) | High Overall Agentic Vulnerability (2.5–5) |
|---|---|---|
| **Strong Overall Classical Moat (3.5–5)** | **FORTRESS** — Multiple reinforcing moats, primarily in durable tiers. AI amplifies rather than erodes. Highest conviction in moat persistence. Likely underappreciated by market. | **CONTESTED** — Strong moats today but critical vulnerabilities in specific layers. The market may be pricing the classical strength without discounting the agentic risk. Careful position sizing; monitor leading indicators closely. |
| **Weak Overall Classical Moat (1–3.5)** | **EMERGING** — Modest classical moats but positioned in durable agentic tiers. The company may be building the right moats for the next era even if today's moats are thin. Potential long if thesis is forward-looking. | **VULNERABLE** — Weak moats getting weaker. Classical advantages are thin and the agentic economy erodes them further. Likely overvalued on a moat-duration basis. Potential short or avoid. |

### Phase 3.5: Financial Evidence Check

Before assessing the market pricing gap, validate the qualitative moat scores against
the company's actual financial performance and the market's implied competitive advantage
period. This step catches two errors: moat assessments that are too generous (the financials
don't support a moat this strong) and market mispricings (the CAP implies a different
moat duration than the framework supports).

**This phase requires the Portfolio Tracker spreadsheet (Balanced_Tracker / ALL HC sheet).**
If the company is in the tracker, pull the metrics directly. If not, calculate them from
the 10-K and current market data.

#### 3.5.1 Pull the Market-Implied Competitive Advantage Period (CAP)

The Portfolio Tracker calculates the number of years of consensus EPS growth required
for the current share price to imply a market-average P/E multiple. This is the market's
implied moat duration — how many years of "special" the market is pricing.

From the ALL HC sheet, pull:

| Metric | Column | Description |
|---|---|---|
| **CAP to Equal-Weight S&P** | EH | Years until implied P/E fades to the S&P 500 equal-weight P/E (~16x). More demanding test. |
| **CAP to S&P 500** | EI | Years until implied P/E fades to the cap-weighted S&P P/E (~20x). Less demanding. |
| **Current P/E ('26)** | BR | Forward P/E on next-year consensus earnings |
| **Bloomberg 5-Year LT Growth** | BE (CQ) | The consensus long-term EPS growth rate used for the CAP projection |
| **5-Year Average ROE** | BW | Historical return on equity — the financial signature of a moat |

If the company is not yet in the tracker, calculate the CAP manually:
- Start with current share price and consensus forward EPS
- Grow EPS at the Bloomberg 5-year LT growth rate
- Find the year where (Current Price / Projected EPS) falls below the target P/E
- For market-average CAP: use the current S&P 500 P/E and S&P EW P/E as targets

**Future enhancement:** When CAP-to-commodity columns are added (CAP to 10x and CAP to 8x),
use those as the primary reference for moat duration comparison, as they measure the total
competitive advantage period rather than just the period of above-index returns.

#### 3.5.2 Financial Signature Consistency Check

Each moat type should manifest in specific financial characteristics. If the financials
contradict the qualitative assessment, one of them is wrong. Pull the relevant metrics
from the ALL HC sheet or calculate from the 10-K.

**For Network Effects — check for demand-side scale:**

| Metric | Source (ALL HC Column) | What to Check |
|---|---|---|
| Revenue CAGR ('19–'24) | AW | Should show sustained above-market growth if network effects are compounding |
| Revenue CAGR ('22–'25) | AX | Acceleration vs. deceleration — is the flywheel spinning faster or stalling? |
| EBITDA margin trend | BF, BG, BH ('24, '25, '26) | Expanding margins = demand-side scale working (revenue growing faster than costs) |
| EBIT margin trend | BI, BJ, BK ('24, '25, '26) | Same signal, stricter (includes D&A) |
| EV/EBITDA multiple trajectory | BL, BM, BN, BO ('24–'27) | Declining forward multiples on growing earnings = growth priced in |

**Consistency flag:** If you scored network effects as strong (Classical ≥4) but revenue
growth is decelerating and margins are flat, the network effect may be weaker than scored.

**For System of Record — check for retention and pricing power:**

| Metric | Source | What to Check |
|---|---|---|
| Revenue growth stability | AW, AX, AY | SoR companies should show steady, predictable growth — not lumpy |
| EBITDA margins | BF, BG, BH | High and stable margins (>25%) indicate pricing power from lock-in |
| EPS growth vs. revenue growth | Compare BA/AZ to AW/AX | EPS growing faster than revenue = operating leverage from the installed base |

**Consistency flag:** If you scored switching costs as strong (Classical ≥4) but revenue
growth is volatile or margins are compressing, the lock-in may not be translating into
pricing power.

**For Data / Ground Truth — check for monetization and durability:**

| Metric | Source | What to Check |
|---|---|---|
| Gross margin level | Calculate from 10-K | Data businesses should have >70% gross margins; verification-grade data businesses often >80% |
| Revenue per unit trend | Calculate from 10-K | If revenue per data unit is declining, the data is commoditizing |
| R&D intensity | Calculate from 10-K | Rising R&D as % of revenue to maintain quality edge = the flywheel is stalling |

**Consistency flag:** If you scored the data moat as strong but gross margins are below
70% or declining, the data may not be as proprietary as the qualitative assessment suggests.

**For Talent — check for leverage and productivity:**

| Metric | Source | What to Check |
|---|---|---|
| Revenue per employee | Revenue (10-K) / headcount (10-K or proxy) | Should be high and rising if talent is leveraged. Calculate for last 3–5 years. |
| Compensation as % of revenue | 10-K (SG&A breakdown if available) | Rising = talent has pricing power (good for talent moat, expensive for firm). Declining = execution layer commoditizing. |
| Headcount growth vs. revenue growth | 10-K year-over-year | Revenue growing faster than headcount = AI leverage working. Headcount growing faster = no leverage yet. |

**Consistency flag:** If you scored the talent moat as strong but revenue per employee is
below industry peers or declining, the talent advantage isn't showing up in the economics.

**For Non-Measurable / Brand — check for pricing power durability:**

| Metric | Source | What to Check |
|---|---|---|
| Gross margin level and trend | Calculate from 10-K, or BF–BH for EBITDA margin | Premium brands should have high, stable gross margins (>50% for consumer, >60% for luxury) |
| 5-year average ROE | BW | Durable brand = durable ROE. If ROE is trending down, the brand premium may be eroding. |
| Revenue growth vs. marketing spend | 10-K | If revenue growth requires increasing marketing spend, the brand is losing organic pull |

**Consistency flag:** If you scored the brand moat as strong but gross margins are
compressing or ROE is below 15%, the brand may not be commanding the premium the
qualitative assessment assumes.

#### 3.5.3 The CAP vs. Framework Gap

This is the quantitative core of the Financial Evidence Check. Compare the market's
implied moat duration (CAP) against the framework's qualitative assessment.

**Step 1:** Record the CAP numbers:
- CAP to Equal-Weight (from column EH): [X] years
- CAP to S&P 500 (from column EI): [X] years

**Step 2:** Map the qualitative assessment to an expected CAP range:

| Framework Assessment | Expected CAP to EW Range | Expected CAP to SPX Range | Rationale |
|---|---|---|---|
| **Fortress** (Tier 5–6, low agentic vulnerability) | 7+ years | 5+ years | Deep durable moats should imply a long period of above-average returns |
| **Contested** (Tier 3–4, mixed vulnerability) | 3–7 years | 2–5 years | Strong today but specific layers at risk; market should price moderate duration |
| **Emerging** (weak classical, low agentic vulnerability) | 1–4 years | 1–3 years | Classical moat is thin today; value is forward-looking |
| **Vulnerable** (Tier 1–3, high agentic vulnerability) | 0–3 years | 0–2 years | Weak and getting weaker; should trade near market multiples |

**Note:** These ranges will be calibrated over time as the tracker populates. They are
starting estimates. When CAP-to-commodity columns are added, the ranges will shift upward
since the terminal multiple is lower (more years to fade).

**Step 3:** Classify the gap:

| Actual CAP vs. Expected | Classification | Investment Implication |
|---|---|---|
| CAP is **below** the expected range | **Market underpricing the moat.** The market implies fewer years of competitive advantage than the framework supports. Potential long — the moat is wider than the price suggests. | Check whether the market is cheap for a reason (sector rotation, near-term earnings miss) or genuinely mispriced on moat duration. |
| CAP is **within** the expected range | **Fairly priced on moat duration.** The market's implied CAP is consistent with the framework's assessment. No moat-duration edge. | Edge, if any, must come from earnings growth expectations or margin trajectory rather than moat duration mispricing. |
| CAP is **above** the expected range | **Market overpricing the moat.** The market implies more years of competitive advantage than the framework supports. The agentic vulnerability is not in the price. | Potential source of downside if the moat erodes faster than the market expects. Relevant for position sizing and risk management. |

**Step 4:** Cross-check with ROE:

The 5-year average ROE (column BW) is the ultimate financial sanity check. A moat should
generate above-cost-of-capital returns.

| 5-Year Avg ROE | Interpretation |
|---|---|
| >20% | Strong financial evidence of a moat. Consistent with Classical Score ≥3.5. |
| 12–20% | Moderate. Consistent with a real but not dominant advantage. |
| 8–12% | Weak. If the framework scores the moat as strong (≥4), flag the inconsistency. |
| <8% | Below cost of equity for most companies. A strong moat score is contradicted by the financials. Investigate: is the moat real but unmonetized, or is the moat assessment wrong? |

**Step 5:** Synthesize the financial evidence into one paragraph that either confirms or
challenges the qualitative assessment. This paragraph feeds directly into Phase 4 (Market
Pricing Gap).

Example outputs:

*Confirming:* "Visa's financial profile is fully consistent with the Fortress assessment.
5-year ROE of 45%, expanding EBITDA margins, and a CAP to EW of 6 years. The market
prices roughly 6 years of above-equal-weight returns, which is below the expected range
for a Tier 5 Fortress (7+ years). The market may be underpricing the verification-grade
moat's durability."

*Challenging:* "Despite scoring a Classical Moat Strength of 4.2, the company's 5-year
ROE is only 11% and EBITDA margins have compressed 300bps over three years. The CAP to
EW is 8 years, implying the market prices a longer moat than the financials support.
Either the market is wrong or the qualitative assessment is too generous. Recommend
re-examining the Classical scores before finalizing."

#### 3.5.4 Additional Financial Metrics (Pull from ALL HC if Available)

These provide supplementary context for the gap analysis:

| Metric | Column | Use |
|---|---|---|
| Current P/E | CB | Compare to SPX P/E (CC) and EW P/E (CD) for quick premium assessment |
| P/E vs. 5-year average | Compare BR to BT | Is the stock expensive vs. its own history? |
| '26 PEG ratio | BV | Growth-adjusted valuation — a PEG <1 with a strong moat score is interesting |
| 1-year total return | BX | Recent price action context |
| 5-year total return | BZ | Longer-term performance — strong moats should compound |
| Market cap | AU | Size context for moat durability (larger companies have more resources to defend moats) |
| Beta | AN | Risk context for cost of equity assumption in future CAP-to-commodity calculation |
| Dividend yield | AV | Shareholder return context |
| EPS growth rates | BB, BC, BD ('25, '26, '27) | Near-term growth trajectory |
| EBITDA margin trajectory | BF, BG, BH | Margin expansion/compression signal |

### Phase 4: Market Pricing Gap (Unified)

**4.1 The Consensus Moat Narrative**
Synthesize how the market (sell-side, buyside consensus) describes the company's moat.
Which moat types does the market emphasize? Which does it ignore?

**4.2 The Framework's Assessment**
Based on Phase 3, which moat types are genuinely durable? Where does the market's emphasis
diverge from the framework's assessment?

**4.3 The Gap**

Common gap patterns:

- **Execution-layer mispricing:** Market prices execution-grade advantages (data flywheel,
  talent density, scale of network) at verification-grade multiples. The framework says
  the execution layer is the vulnerability, not the moat. Overvalued.

- **Verification-layer underpricing:** Company has deep verification-grade assets (K_IP^ver,
  compliance lock-in, fraud adjudication history) that the market treats as generic
  "competitive advantages" without recognizing their agentic-era durability. Undervalued.

- **Coordination equilibrium blindness:** Company functions as a Schelling point (industry
  standard, canonical reference, social consensus anchor) but the market values it as a
  "brand" or "market leader" without recognizing the structural defensibility. Undervalued.

- **Professional middle exposure:** Company's revenue model depends on a large professional
  middle (billable-hour consultants, associate-level analysts, mid-tier engineers) that
  the AI Sandwich will compress. Market prices current revenue run-rate without discounting
  the structural headcount risk. Overvalued on revenue durability.

- **Leverage inversion opportunity:** Company will transition to AI Sandwich topology
  where fewer people generate more revenue. Market sees headcount reduction as negative
  rather than recognizing the margin expansion. Undervalued on margin trajectory.

- **Switching cost illusion:** Market prices total switching cost as the moat but the
  framework shows most of it is automatable migration labor (Category A). Only the
  compliance/coordination component (Category B) is durable. Overvalued on moat duration.

**4.4 Unified Investment Implication**
- Overall moat durability assessment: how many years of competitive advantage does the
  framework support vs. what the market implies? (Reference the CAP gap from Phase 3.5)
- Quantitative gap: Is the CAP to EW above, within, or below the expected range for the
  company's matrix classification? State the specific numbers.
- Qualitative gap: Which moat layers are mispriced vs. what the consensus emphasizes?
- Financial consistency: Do the financials confirm or challenge the qualitative scores?
  (Reference the ROE and margin checks from Phase 3.5)
- Position sizing guidance based on conviction
- Bull case: which moat dynamics could surprise to the upside?
- Bear case: which vulnerabilities could materialize faster than expected?
- Time horizon of primary agentic risk

### Phase 5: Unified Monitoring Framework

**5.1 The Moat Dashboard**

For each material moat type, identify the single most important leading indicator:

| Moat Type | Key Metric | Current Level | Healthy Range | Warning Signal |
|---|---|---|---|---|
| Network Effects | [e.g., Verified activity (NV) trend] | [Current] | [Range] | [What triggers concern] |
| System of Record | [e.g., Gross retention rate] | [Current] | [Range] | [What triggers concern] |
| Ground Truth / Data | [e.g., Benchmark gap vs. public models] | [Current] | [Range] | [What triggers concern] |
| Talent | [e.g., Revenue per employee trend] | [Current] | [Range] | [What triggers concern] |
| Non-Measurable | [e.g., Price premium vs. alternatives] | [Current] | [Range] | [What triggers concern] |

**5.2 Cross-Moat Warning Signals**

Signals that indicate systemic moat erosion (affecting multiple moat types simultaneously):
- Agent-powered competitors entering the market
- Customer building in-house alternatives using AI
- Revenue model pressure (pricing compression, contract shortening)
- Talent exodus to startups leveraging AI for same output with fewer people
- Regulatory changes that either strengthen (compliance lock-in) or weaken (forced
  portability) the moat

**5.3 Thesis Kill Conditions**

Define 2–3 specific, observable conditions under which you would conclude the overall
moat thesis is broken. These should be concrete and falsifiable, not vague.

---

## Output Format

Produce a single Word document (.docx) with the following structure:

### Document Structure

**Part I: Overview**
1. **Executive Summary** — One-page summary with the Composite Moat Map table,
   the 2×2 matrix placement, the CAP gap (market-implied moat duration vs. framework
   assessment), the market gap classification, and the one-sentence insight
2. **Business Overview** — Company description, revenue model, competitive landscape
3. **Moat Identification** — Which moat types are present and their relative importance

**Part II: Individual Moat Analyses**
4–8. **One section per material moat type**, following the structure of the relevant
specialized skill. Primary moats get full treatment; secondary moats get abbreviated
analysis; tertiary moats get a brief note.

**Part III: Synthesis**
9. **Composite Moat Map** — The unified scoring table
10. **Moat Interaction Analysis** — Reinforcement relationships, keystone/backstop moats
11. **Composite Scorecard** — Weighted scores and the 2×2 matrix
12. **Financial Evidence Check** — CAP comparison (from Portfolio Tracker), financial
    signature consistency by moat type, ROE sanity check, and the CAP vs. Framework
    gap classification. Include the one-paragraph synthesis confirming or challenging
    the qualitative scores.
13. **Market Pricing Gap Analysis** — The unified investment insight, now incorporating
    both the qualitative gap (which moat layers are mispriced) and the quantitative gap
    (CAP implied duration vs. framework-supported duration)
14. **Monitoring Framework** — The moat dashboard and kill conditions

**Part IV: Appendix**
15. **Key Framework Definitions** — Brief reference for all five moat types
16. **Methodology Notes** — Scoring scales, weighting approach, data sources
17. **Financial Metrics Reference** — Column map to the Portfolio Tracker (ALL HC sheet)
    for reproducibility

### Formatting Requirements

- Use the docx skill for all document creation mechanics
- Color scheme: Dark navy headers (#1B4F72), medium blue subheaders (#2E86C1)
- The Executive Summary should fit on one page and include the Composite Moat Map
  and the 2×2 matrix placement — this is the deliverable that gets read first
- Each individual moat section should be clearly labeled and visually distinct
- The Moat Interaction Analysis should use a visual (table or diagram) showing
  reinforcement and vulnerability linkages
- Headers: "Catalini Moat Screen — [Company Name]"
- Footers: "CONFIDENTIAL"
- US Letter, 1-inch margins

### Tone and Voice

- Direct, analytical, investment-focused
- The executive summary should be punchy enough for a portfolio manager to read in
  90 seconds and understand the conclusion
- Individual moat sections should be detailed enough for an analyst to challenge the scoring
- Be explicit about confidence levels — where is the scoring based on hard data vs.
  qualitative judgment?
- Flag interactions between moat types — this is where the orchestrator adds value over
  running individual skills in isolation
- The market gap analysis should be actionable — not just "the market is wrong" but
  specifically which moat layer is mispriced and what the implied duration difference is

---

## Scoring Summary

### Individual Moat Scores
Each moat type produces two scores from its specialized skill:
- **Classical Moat Strength (1–5):** Higher = stronger traditional moat
- **Agentic Vulnerability (1–5):** Lower = more defensible in the agentic economy

### Composite Scores
- **Overall Classical Moat Strength** = weighted average (Primary 3x, Secondary 2x, Tertiary 1x)
- **Overall Agentic Vulnerability** = weighted average, with critical vulnerability flag for any ≥4.0

### The Unified 2×2 Matrix
- **Fortress** (Strong classical + low agentic vulnerability): Multiple reinforcing durable moats
- **Contested** (Strong classical + high agentic vulnerability): Strong today but structurally challenged
- **Emerging** (Weak classical + low agentic vulnerability): Building the right moats for the next era
- **Vulnerable** (Weak classical + high agentic vulnerability): Weak and getting weaker

---

## Common Pitfalls

- **Don't run every skill for every company.** Most companies have 2–3 material moat types.
  Running all five when only two matter dilutes the analysis and wastes space. Be selective.

- **Don't double-count.** Network effects that generate data shouldn't be scored as both a
  network moat AND a data moat at full weight. The network skill captures the network
  dynamic; the data skill captures the data asset. Score each for what it uniquely contributes.

- **Don't average away critical vulnerabilities.** A company with four strong moats and one
  critical vulnerability is not "above average." If the critical vulnerability is in the
  primary moat, the composite is misleading. Always flag single-point failures.

- **Don't ignore moat interactions.** The whole point of the orchestrator is to see how moats
  reinforce or undermine each other. A system-of-record moat that protects a data moat is
  more durable than a standalone data moat. A network effect that feeds a data flywheel
  that trains a talent pool is a three-moat chain — strong if all links hold, brittle if
  one breaks.

- **Don't produce a 50-page report.** The executive summary should stand alone. The detailed
  sections are supporting evidence. If the portfolio manager needs to read 50 pages to
  understand the conclusion, the conclusion isn't clear enough.

- **Don't confuse "the company has many moats" with "the company is well-defended."**
  Five shallow moats are less defensible than one deep one. Depth (tier placement) matters
  more than breadth (number of moat types).

- **Always answer the investment question.** The output of this analysis is not "here are the
  moats and their scores." It is: "The market is pricing X as the moat. The framework says
  Y is the durable moat. The gap implies Z for the investment."

---

## Quick Reference: The Catalini Vulnerability Spectrum

From most fragile to most defensible, across all moat types:

| Tier | Moat Archetype | Key Test | Agentic Threat |
|---|---|---|---|
| 1 | Execution-grade liquidity / routine execution talent / informational trust brand | Can agents manufacture or replicate it at near-zero cost? | Direct substitution |
| 2 | Data flywheels / skilled execution talent / functional premium brand | Are frontier models converging on this capability? | Convergence erosion |
| 3 | Systems of record (labor component) / domain specialist talent / aesthetic premium | Is the switching cost measurable execution? | Migration automation |
| 4 | Complementary ecosystems / institutional knowledge holders / status signals | Does verification or governance drive the value? | Partial — value shifting to verification |
| 5 | Verification-grade networks / verification underwriter talent / community identity / compliance-embedded SoR | Does each edge case make the system stronger? | Minimal — compounds with scale |
| 6 | Coordination equilibria / directors / Schelling points / regulatory standards | Can the social contract be forked? | Essentially none |

**The single most important question:** Is this company's primary moat in Tiers 1–3
(vulnerable) or Tiers 4–6 (durable)?

If the market prices a Tier 2 moat at a Tier 5 multiple, that's the trade.
