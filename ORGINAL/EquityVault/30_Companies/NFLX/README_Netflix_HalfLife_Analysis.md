# Netflix Content IP Half-Life Analysis

**Purpose:** Measure viewership decay curves for WBD (and all) content on Netflix using their biannual engagement reports. Produces the "Attention Half-Life" appendix for the NFLX/WBD IC memo.

**Last run:** February 2026 (6 periods: H1 2023 – H2 2025)
**Next update:** When H1 2026 report drops (~Q3 2026), this becomes a 7-period panel.

---

## Data Sources

Netflix publishes "What We Watched" engagement reports twice per year. Each report discloses hours viewed for every title exceeding a minimum threshold during that half-year.

**Official Netflix reports (individual PDFs/CSVs):**
- H1 2023: https://about.netflix.com/en/news/what-we-watched-a-netflix-engagement-report
- H2 2023: https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2023
- H1 2024: https://about.netflix.com/en/news/what-we-watched-the-first-half-of-2024
- H2 2024: https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2024
- H1 2025: https://about.netflix.com/en/news/what-we-watched-the-first-half-of-2025
- H2 2025: https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2025
- **H1 2026:** URL TBD — check https://about.netflix.com/en/news/ when it drops

**Pre-combined dataset (easier — all periods in one table):**
- What's on Netflix: https://www.whats-on-netflix.com/most-popular/netflix-engagement-report-search/
  - Use the "Combined Hours Report" tab — has all periods in one table with columns for each half-year
- Kaggle mirrors:
  - https://www.kaggle.com/datasets/konradb/netflix-engagement-report
  - https://www.kaggle.com/datasets/sujaykapadnis/official-netflix-streaming-data

The combined dataset is strongly preferred — it saves 30+ minutes of title-matching across individual reports.

---

## Pipeline Overview

The analysis has five stages. Each can be run in Claude with the script `content_halflife_analysis.py` or done step-by-step:

### Stage 1: Panel Construction

**Input:** Combined Netflix engagement report (CSV or XLSX with one row per title, columns for each half-year's hours)

**Process:**
1. Load the combined report
2. Map columns to standardized names: `hours_h1_2023`, `hours_h2_2023`, ... `hours_h1_2026`
3. Melt from wide to long format: `title | period | period_idx | hours_viewed`
4. Drop rows where hours_viewed is NaN or 0

**Output:** `netflix_panel.csv` — long-form panel, ~100k+ observations across ~30k titles

**When adding H1 2026:** Add `H1_2026` as `period_idx = 6` (currently 0–5). Update period_labels and x_positions in all downstream code.

### Stage 2: WBD Title Attribution

**Process:** Identify WBD-owned titles using keyword/studio matching on the title field. The matching logic uses these franchise/studio buckets:

- **WBD Franchise IP:** Friends, Gossip Girl, Harry Potter, Game of Thrones, Big Bang Theory, Gilmore Girls (and variants like "Friends from College" excluded)
- **WBTV-Produced:** Lucifer, Supernatural, Vampire Diaries, Pretty Little Liars, Riverdale, Blindspot, The 100, iZombie, Charmed, etc.
- **HBO Originals:** Sopranos, Sex and the City, True Blood, Insecure, Barry, Succession, Euphoria, etc.
- **DC:** Sandman, Sweet Tooth, Arrow, Flash, Titans, Doom Patrol, Gotham, etc.
- **WBD Films:** Dune, Matrix, Godzilla, Mad Max, Wonka, Barbie, Meg, Conjuring, etc.
- **WBD Animation:** Gumball, Looney Tunes, Scooby-Doo, Tom and Jerry, Rick and Morty, etc.

Also tag comparison groups: Netflix Franchise IP (Stranger Things, Squid Game, Wednesday, etc.), Library/Comfort (Office, Suits, Grey's Anatomy), Kids & Family (CoComelon, Peppa Pig, Bluey).

**Output:** `netflix_panel_6period_wbd.csv` — panel with `category_final` and `is_wbd` columns

**Important:** When new WBD or Netflix titles appear in H1 2026, manually check if any need to be added to the keyword lists. Major new releases (e.g., Harry Potter HBO series if it premieres) should be tagged.

### Stage 3: Decay Curve Fitting

**Process:** For each title with 3+ period observations:

1. Normalize viewership to peak = 100%
2. Fit three models:
   - **Exponential decay:** V(t) = V₀ × e^(-λt) → half-life = ln(2)/λ
   - **Power-law decay:** V(t) = V₀ × (t+1)^(-α) → half-life from numerical solve
3. Select best model by R²
4. Calculate half-life in years (period spacing = 0.5 years)
5. Classify: half-life ≥ 50 years → "non-decaying"

**Output:** `decay_results_final.csv` with columns:
- `title`, `category_final`, `is_wbd`
- `best_model`, `best_hl_years`, `best_R2`
- `exp_half_life`, `exp_R2`, `power_half_life`, `power_R2`
- `peak_hours_M`, `latest_hours_M`, `retention_pct`
- `n_periods`

**Note on the 50-year threshold:** This is arbitrary but works. Any title with a fitted half-life above ~10 years is effectively non-decaying over our observation window. The 50-year cutoff ensures we don't misclassify slowly-decaying titles.

### Stage 4: Category-Level Aggregation

**Key metrics computed per category:**
- **Permanence rate:** % of titles classified as non-decaying
- **Median half-life:** Among decaying titles only
- **75th percentile half-life:** Upper range of durability among decayers
- **Median retention:** Latest period viewership ÷ peak viewership (%)

**Output:** `category_summary.csv` — the core data for the appendix tables

### Stage 5: Visualization & Appendix

**The money chart** (`WBD_Decay_Curves.png`):
- Filter to titles present in all reporting periods (currently 168 WBD titles in all 6)
- Index to **second period** (H2 2023) = 100% — NOT the first period, NOT peak
  - Reason: H1 2023 was the first report ever, so many titles had licensing/availability noise. Starting from H2 2023 gives a cleaner common baseline
- Color-code: green = non-decaying, red = decaying
- Plot individual title lines (thin, transparent) + thick median lines + IQR shaded bands
- Y-axis: 0–160%, X-axis: H2 2023 through latest period
- Annotate permanence rate and median half-life

**When updating for H1 2026:**
- X-axis extends one period to the right (H2 2023 through H1 2026)
- x_positions becomes `[0, 0.5, 1.0, 1.5, 2.0, 2.5]` (currently `[0, 0.5, 1.0, 1.5, 2.0]` for 5 displayed periods)
- Filter for titles in all 7 periods (will be a smaller N than 168 — some titles drop off Netflix)
- Recalculate all medians and permanence rates with the expanded panel

**Appendix doc** (`WBD_IP_Durability_Appendix.docx`):
- Built with `docx-js` in Node.js
- Structure: Overview → Methodology → Finding 1 (two-regime) + chart → Finding 2 (scorecard tables) → Finding 3 (title trajectories) → Finding 4 (durability premium) → Valuation implications
- Chart embedded as PNG at 560×350px
- Tables: dark header row, light red (#FFF2F2) fill on WBD All roll-up row, all text black

**Workbook** (`Netflix_Content_IP_HalfLife_Analysis.xlsx`):
- 4 tabs: Summary, Title_Detail, WBD_Titles, Panel_Data
- Built with openpyxl

---

## Updating for H1 2026: Step-by-Step

When the new report drops, start a new Claude conversation and say something like:

> "I need to update my Netflix content IP half-life analysis. I have the H1 2026 engagement report. Last time we built a 6-period panel (H1 2023 – H2 2025) covering 270 WBD titles with decay curve fitting. Here's my README with the full methodology. Please add H1 2026 as a 7th period and regenerate all outputs."

Then upload:
1. This README
2. The new H1 2026 report (CSV/XLSX)
3. The previous `decay_results_final.csv` (for comparison — what changed?)
4. The previous `netflix_panel_6period_wbd.csv` (for panel extension)

### Things to watch for in the update:

**Data issues:**
- Netflix sometimes changes column naming conventions between reports
- New titles may not match existing attribution keywords — spot-check the WBD title count
- Some titles get removed from Netflix between periods — the "present in all N periods" filter will shrink

**Analytical changes:**
- With 7 periods, you can require 4+ observations instead of 3+ (more robust fits)
- The chart now spans 3.5 years instead of 2 years — half-life estimates become more reliable
- Non-decaying titles with 7 flat observations are a stronger signal than 6

**Narrative updates:**
- Recalculate all numbers in the appendix text (permanence rates, half-lives, median trajectories)
- Update the Stranger Things / Wednesday re-ignition examples if new seasons dropped
- Check if Harry Potter HBO series has premiered — if so, this is a major new re-ignition data point
- Update "three full years" to "3.5 years" in methodology
- Update observation counts in footnote

**Chart updates:**
- Still index to H2 2023 = 100% (don't shift the baseline forward)
- Add one more x-tick for H1 2026
- The medians may shift — green line should still hold, red line may droop further (longer observation = more decay visible)
- Adjust annotations if permanence rate or half-life numbers change materially

---

## Key Numbers to Track (Current Baseline)

| Metric | WBD All | All Other |
|--------|---------|-----------|
| Titles fitted | 270 | 15,718 |
| Permanence rate | 39.6% | 23.3% |
| Median half-life (decayers) | 2.6 yr | 1.0 yr |
| 75th pctl half-life | 4.8 yr | 2.2 yr |
| Median retention | 36.2% | 25.3% |

**WBD subcategory permanence rates:** WBTV 62.9%, Films 59.6%, Animation 40.9%, Franchise 26.3%, DC 13.6%, HBO 12.5%

**WBD subcategory half-lives (decayers):** WBTV 4.6yr, Films 2.8yr, Animation 2.7yr, Franchise 2.2yr, DC 2.0yr, HBO 0.5yr

---

## File Inventory

| File | Description |
|------|-------------|
| `content_halflife_analysis.py` | Main analysis script (633 lines). Functions for panel construction, WBD attribution, decay fitting, category aggregation. Has a `main()` that runs end-to-end. |
| `netflix_panel_6period_wbd.csv` | Long-form panel: title × period × hours_viewed with WBD flags |
| `decay_results_final.csv` | Title-level decay fit results: half-lives, R², model selection |
| `category_summary.csv` | Category-level aggregates |
| `Netflix_Content_IP_HalfLife_Analysis.xlsx` | 4-tab output workbook |
| `WBD_IP_Durability_Appendix.docx` | Final formatted appendix |
| `WBD_Decay_Curves.png` | Chart: 168 WBD title trajectories, indexed to H2 2023 |

---

## Dependencies

Python: `pandas`, `numpy`, `scipy`, `matplotlib`, `openpyxl`
Node.js: `docx` (docx-js, for building the .docx appendix)

All available in Claude's environment by default.
