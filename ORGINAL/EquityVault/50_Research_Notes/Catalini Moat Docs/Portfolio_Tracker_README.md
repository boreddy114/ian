# Catalini Moat Portfolio Tracker — README

## What This Is

The Portfolio Tracker (`Catalini_Moat_Portfolio_Tracker.xlsx`) is the master file that aggregates every moat screen you run into a single portfolio-level view. Each time you complete a moat screen on a company (producing a Word doc), you update the tracker with the results.

This README walks you through exactly how to do that.

---

## The Four Tabs

| Tab | Purpose | When to Update |
|-----|---------|----------------|
| **Portfolio Dashboard** | One row per company. The master view. | Every time you run a new screen or re-screen an existing name |
| **Scoring Detail** | Sub-dimension scores with evidence and sources. The audit trail. | Every time you run a new screen |
| **Vulnerability Spectrum** | Reference table. The six-tier spectrum and 2×2 matrix. | Never — this is static reference |
| **Change Log** | Tracks when and why assessments change over time. | Every time you update an existing company's assessment |

---

## How to Update: New Company Screen

When you run a moat screen on a company for the first time, you'll produce a Word doc (either from the orchestrator or from an individual moat skill). Here's how to get the results into the tracker.

### Step 1: Open the Word Doc and Find the Key Outputs

Every moat screen Word doc has the same structure. You need three things from it:

**From the Executive Summary Table (page 1 of the doc):**
- Which moat types are present (Y/N for each of the five)
- The vulnerability tier placement (1–6)
- The 2×2 matrix classification (Fortress / Contested / Emerging / Vulnerable)
- The gap type (Overpriced moat / Fairly priced / Underappreciated defensibility / Misallocated risk)
- The one-sentence key insight

**From the Composite Scorecard section:**
- Classical Moat Strength scores (one per moat type present, plus the weighted average)
- Agentic Vulnerability scores (one per moat type present, plus the weighted average)

**From the individual moat analysis sections:**
- The sub-dimension scores (e.g., for a network screen: network effect intensity = 4.5, agent-manufactured liquidity risk = 1.0, etc.)
- The evidence and source for each score

### Step 2: Fill In the Portfolio Dashboard (Tab 1)

Find the next empty row (or the existing row if re-screening). Fill in left to right:

| Column(s) | What to Enter | Where to Find It |
|-----------|---------------|------------------|
| A — Company | Company name | — |
| B — Ticker | Stock ticker | — |
| C — Date Screened | Today's date | — |
| D — Analyst | Your name | — |
| E through I — Moat Types Present | Y or N for each: Network, SoR, Data, Talent, Brand | Executive Summary Table in the Word doc |
| J through N — Classical Strength | Score (1–5) for each moat type present. Leave blank for moat types marked N. | Composite Scorecard section |
| O — Classical Wtd Avg | The weighted average classical score | Composite Scorecard section |
| P through T — Agentic Vulnerability | Score (1–5) for each moat type present. Leave blank for N. | Composite Scorecard section |
| U — Agentic Wtd Avg | The weighted average agentic vulnerability score | Composite Scorecard section |
| V — Tier | The vulnerability tier (1–6) | Executive Summary Table |
| W — Matrix | Fortress, Contested, Emerging, or Vulnerable | Executive Summary Table |
| X — Gap Type | The market pricing gap classification | Market Pricing Gap section |
| Y — Key Insight | One sentence: what does the market get wrong? | Executive Summary Table |
| Z — Next Review | When to re-screen (typically next earnings or 6 months) | Your judgment |
| AA — Link to Report | File path or hyperlink to the saved Word doc | Where you saved the doc |

### Step 3: Fill In the Scoring Detail (Tab 2)

This is the audit trail. For each moat type you scored, enter one row per sub-dimension:

| Column | What to Enter | Where to Find It |
|--------|---------------|------------------|
| A — Company / Ticker | e.g., "V — Visa" | — |
| B — Moat Type | Network, SoR, Data, Talent, or Brand | — |
| C — Dimension | The specific scoring dimension (e.g., "Network Effect Intensity" or "Migration Automation Risk") | The scoring tables in the Word doc |
| D — Score (1–5) | The score you assigned | The scoring tables |
| E — Key Evidence | The specific fact or observation that drove the score | The rationale text next to each score |
| F — Source | Where the evidence came from (e.g., "FY2025 10-K Item 1A" or "Q4 2025 earnings transcript") | Should be cited in the Word doc per research methodology |
| G — Date | Date of the assessment | — |

**How many rows per company?** It depends on how many moat types were scored and how many sub-dimensions each has:

| Moat Skill | Sub-Dimensions | Rows per Company |
|------------|---------------|-----------------|
| Network | 5 classical + 4 agentic = 9 | 9 |
| System of Record | 6 classical + 5 agentic = 11 | 11 |
| Ground Truth / Data | 5 classical + 5 agentic = 10 | 10 |
| Talent | 5 classical + 5 agentic = 10 | 10 |
| Non-Measurable / Brand | 5 classical + 5 agentic = 10 | 10 |

A company with three moat types scored will have ~30 rows in the Scoring Detail tab.

**Tip:** You don't need to enter every sub-dimension for secondary and tertiary moats. For abbreviated analyses (secondary moats), enter only the composite scores. For brief notes (tertiary moats), a single row with the overall score and rationale is sufficient.

### Step 4: Save the Word Doc

Save the completed moat screen Word doc in your moat screen folder. Use a consistent naming convention:

```
[Ticker]_Moat_Screen_[Date].docx
```

Examples:
- `V_Moat_Screen_20260410.docx`
- `CRM_Moat_Screen_20260415.docx`
- `AAPL_Moat_Screen_20260501.docx`

Put the file path in column AA of the Dashboard so you can find it later.

---

## How to Update: Re-Screening an Existing Company

When you re-screen a company (after earnings, a competitive development, or a scheduled review):

### Step 1: Run the Updated Screen

Run the moat screen again with the new information. The Word doc will reflect the updated assessment.

### Step 2: Update the Dashboard Row

Find the existing row for the company. Update the scores, tier, matrix placement, gap type, and key insight. Update the date in column C and the next review date in column Z.

**Do NOT overwrite the old values without logging the change first.**

### Step 3: Log the Change (Tab 4)

Before updating the Dashboard, add a row to the Change Log:

| Column | What to Enter |
|--------|---------------|
| A — Date | Today |
| B — Company / Ticker | The company |
| C — What Changed | Which score or assessment moved (e.g., "Agentic vulnerability: Network" or "Matrix placement") |
| D — Previous Assessment | The old value (e.g., "2.0" or "Fortress") |
| E — New Assessment | The new value (e.g., "3.0" or "Contested") |
| F — Trigger / Reason | Why it changed (e.g., "Q1 earnings revealed agent-powered migration tool gaining traction with customers; gross retention declined 200bps") |

This is critical for institutional memory. Six months from now, when you look at a score and wonder why it changed, the Change Log tells you.

### Step 4: Update the Scoring Detail

Add new rows with the updated sub-dimension scores. Don't delete the old rows — they're your historical record. The date column distinguishes the old scores from the new ones.

### Step 5: Save the New Word Doc

Save alongside the previous version:

```
V_Moat_Screen_20260410.docx    (original)
V_Moat_Screen_20261015.docx    (re-screen after Q3 earnings)
```

---

## When to Re-Screen

Not every company needs re-screening on the same cadence. Use this guide:

| Trigger | Action |
|---------|--------|
| **Quarterly earnings** | Re-screen if the company reported metrics relevant to the moat assessment (NDR, gross retention, user growth, verification-related investments). Focus on whether the key monitoring signals moved. |
| **Competitive development** | Re-screen if a new entrant, a migration tool, or an AI-powered competitor emerges that directly threatens a scored moat layer. |
| **Thesis change** | Re-screen if your investment thesis changes (upgrade, downgrade, or significant conviction shift). |
| **Scheduled review** | Re-screen at the interval you set in column Z (typically 6 months for stable names, 3 months for contested names). |
| **Framework update** | If the skills themselves are updated (new scoring dimensions, revised reference frameworks), consider re-screening names where the update is material. |

---

## Tips for Maintaining the Tracker

**Keep the Dashboard tight.** One row per company, always. If you have multiple assessments over time, the Dashboard always shows the *current* assessment. Historical assessments live in the Scoring Detail (via date stamps) and the Change Log.

**Be disciplined about sources.** Column F in the Scoring Detail ("Source") is what makes this an institutional asset rather than a personal opinion log. "Per the FY2025 10-K" is useful six months later. "I think" is not.

**Use the key insight column aggressively.** Column Y on the Dashboard should be the single most actionable sentence from the entire analysis. If you can't write it in one sentence, the analysis isn't crisp enough. Examples:
- "Market prices execution-grade data flywheel; real moat is verification-grade fraud adjudication history"
- "Switching cost is 80% migration labor (automatable); compliance component alone doesn't justify the multiple"
- "Coordination equilibrium is unforkable but agent-mediated purchasing will erode the brand premium in 30% of revenue"

**Watch the leading indicators.** The monitoring framework in each Word doc identifies specific signals to track. When you see a signal fire, that's when you re-screen — don't wait for the scheduled review.

**Share the Dashboard, not the detail.** The Portfolio Dashboard is the artifact for IC discussion. The Scoring Detail and Change Log are the supporting evidence if someone challenges a score. The Word docs are the full analytical record. Layer the disclosure based on the audience.

---

## Quick Reference: Score Interpretation

**Classical Moat Strength (1–5):**
Higher = stronger traditional moat

| Score | Interpretation |
|-------|---------------|
| 1–2 | Weak — minimal competitive advantage from this moat type |
| 2–3 | Moderate — some advantage but not a primary driver of defensibility |
| 3–4 | Strong — meaningful competitive advantage, hard for competitors to replicate |
| 4–5 | Very strong — deep, entrenched advantage with high barriers |

**Agentic Vulnerability (1–5):**
Lower = more defensible in the agentic economy

| Score | Interpretation |
|-------|---------------|
| 1–1.5 | Low — moat likely strengthens as AI scales |
| 1.5–2.5 | Moderate — moat persists but specific layers are contestable |
| 2.5–3.5 | High — significant moat layers at risk from agentic dynamics |
| 3.5–5 | Critical — moat narrative is fundamentally challenged |

**Vulnerability Tier (1–6):**
Lower = more fragile, Higher = more defensible

| Tier | Shorthand |
|------|-----------|
| 1 | Agents can manufacture it |
| 2 | Frontier models are converging |
| 3 | Migration labor is automatable |
| 4 | Value shifting to verification |
| 5 | Compounds with scale |
| 6 | Social contract is unforkable |

**2×2 Matrix:**

| Classification | Meaning |
|---------------|---------|
| Fortress | Strong classical moat + low agentic vulnerability. Highest conviction. |
| Contested | Strong classical moat + high agentic vulnerability. Strong today, structurally challenged. |
| Emerging | Weak classical moat + low agentic vulnerability. Building the right moats for the next era. |
| Vulnerable | Weak classical moat + high agentic vulnerability. Weak and getting weaker. |
