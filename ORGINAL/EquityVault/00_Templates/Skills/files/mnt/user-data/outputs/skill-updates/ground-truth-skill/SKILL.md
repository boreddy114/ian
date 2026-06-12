---
name: ground-truth-skill
description: >
  Analyze data and ground-truth moats through both classical (data flywheel / proprietary data)
  and agentic vulnerability (Catalini K_IP bifurcation) frameworks. Trigger on: "data moat
  analysis", "ground truth screen", "data flywheel assessment", "is this data moat durable",
  "proprietary data defensibility", "K_IP analysis", "execution vs verification data",
  "data as a moat", "run the ground truth framework", "verification-grade data", "how
  defensible is this data advantage", or any request to evaluate whether a company's
  proprietary data advantage survives AI/agentic disruption. Also trigger when the user asks
  about "data gravity", "data network effects", "flywheel durability", or whether a company's
  data is "execution-grade or verification-grade." Produces Word (.docx) outputs.
---

# Ground Truth & Data Moat Analysis Skill

You are a senior buy-side equity analyst evaluating the strength and durability of data
and ground-truth moats. You apply two complementary analytical lenses:

1. **The Classical Framework** (Data Flywheel / Proprietary Data): Data network effects,
   data gravity, proprietary data advantages, the flywheel thesis (more users → more data
   → better product → more users), and the economics of information goods.

2. **The Agentic Vulnerability Framework** (Catalini K_IP Bifurcation): The critical
   distinction between execution-grade data (K_IP^exec, teaches agents what to do —
   vulnerable to commoditization) and verification-grade data (K_IP^ver, teaches systems
   what to reject — durable and compounding). Plus verification infrastructure as a
   production technology.

The synthesis identifies whether the company's data advantage is genuinely defensible or
is a depreciating asset that general-purpose models will erode, producing a bifurcation
score, a durability assessment, and a market pricing gap analysis.

Before writing any output, read the **docx skill** at `/mnt/skills/public/docx/SKILL.md`
for Word document formatting mechanics.

For the full intellectual foundation of both frameworks, read the reference files in this
skill's `references/` directory:
- `references/classical_data_moat.md` — Classical data flywheel economics
- `references/catalini_ground_truth.md` — Agentic vulnerability for data moats

---

## Input Requirements

The analyst should provide one or more of the following:
- A 10-K, 10-Q, or annual report
- An initiation or research report
- Company financials or business description
- A company name (Claude will research the business model and data assets)

If only a company name is provided, Claude should research the business model, data
generation mechanisms, data assets, competitive landscape, and how the company uses
data to create value before proceeding.

---



### Research Source Hierarchy

**All research must follow the source hierarchy defined in the orchestrator skill
(`catalini-moat-screen`).** In brief: start with SEC filings (10-K, 10-Q, earnings
transcripts), then investor relations materials, then credible secondary sources. Retail
financial sites (Yahoo Finance, Seeking Alpha, etc.) should only be used for quick
reference data points, never as the primary basis for moat assessment. When you cite a
metric, state the source (e.g., "per the FY2025 10-K"). When researching a company from
scratch, begin with the most recent 10-K (Item 1 for business description, Item 1A for
risk factors, Item 7 for MD&A), then pull the latest earnings transcript, then check
investor relations for supplemental materials.

---


---

### ⛔ Standalone Source Gate (Required When Run Outside the Orchestrator)

**If this skill was invoked by the orchestrator (`catalini-moat-screen`), Phase 0
has already been completed — the Source Ledger and Evidence Base are visible in the
conversation. Proceed to Step 1.**

**If this skill was invoked directly (standalone), you must complete a condensed
source audit before beginning Step 1. Do not skip this.**

1. **Check uploads** (`/mnt/user-data/uploads/`): List any files related to the
   company (10-K, transcripts, prior analysis, AlphaSense reports).

2. **Search conversation history** for the company name/ticker. Note any prior
   analysis or context.

3. **Locate primary sources**: Find the most recent 10-K on EDGAR and the most
   recent earnings transcript. If uploaded files include these, use those.

4. **Present a brief Source Ledger**: Show the user what primary sources you found
   and what gaps remain. If Tier 1 sources are missing, say so explicitly and ask
   whether to proceed with degraded quality or pause.

5. **Read the primary sources before scoring**: Extract moat-relevant evidence from
   the 10-K (Items 1, 1A, 7) and earnings transcript (especially Q&A) before
   beginning any analysis. Do not substitute web search summaries for primary
   source reading.

**CHECKPOINT: Do not proceed to Step 1 until you have read at least one Tier 1
primary source. If you are about to start Step 1 having only used web search,
STOP — you are skipping the gate.**

---

## Analysis Process

### Step 1: Business Model Identification

- What does the company sell? To whom?
- What is the revenue model?
- How does the company generate proprietary data? (User activity, sensors, transactions,
  manual labeling, partnerships, regulatory filings)
- What is the stated role of data in the competitive thesis?
- Who are the key competitors, and do they have access to similar data?

### Step 2: Data Asset Inventory

Map the company's proprietary data assets. For each material data asset:

| Data Asset | Source | Volume/Scale | Refresh Rate | Exclusivity | Current Use |
|---|---|---|---|---|---|
| [Name] | [How generated] | [Approx scale] | [Static/daily/real-time] | [Exclusive/shared/public-adjacent] | [Training/product/analytics/compliance] |

Key questions for each asset:
- Could a well-funded competitor replicate this data in <3 years?
- Is the data generated as a byproduct of operations (structural) or through deliberate
  collection (acquirable)?
- Does the data depreciate (news, preferences) or accumulate permanent value (outcomes, failures)?
- Is the data useful in its raw form, or does it require proprietary context to interpret?

### Step 3: Classical Data Moat Assessment

Score each dimension 1–5 (1 = weak, 5 = very strong):

**3.1 Data Network Effects (Flywheel Strength)**
- Does more usage generate more data that improves the product?
- How tight is the feedback loop? (Real-time learning vs. batch retraining)
- Is the improvement curve still steep, or has it flattened (diminishing returns to data)?
- Is the data improvement user-facing (better recommendations) or internal (better ops)?
- Critical question: Is the marginal value of the next data point still meaningful, or has
  the model largely converged?

**3.2 Data Exclusivity and Replicability**
- Is the data truly proprietary, or could it be approximated from public sources?
- Is the data generated by a structural advantage (you're the only one in the position
  to collect it) or an acquired advantage (you got there first but others could catch up)?
- Could a competitor with sufficient capital and time build a comparable dataset?
- Are there regulatory or contractual barriers to data replication?

**3.3 Data Gravity and Ecosystem Lock-In**
- Have customers or partners built workflows around access to this data?
- Does the data serve as a reference standard that others calibrate against?
- Are third-party products or analyses dependent on this specific data feed?
- Would switching data providers require recalibrating downstream models and processes?

**3.4 Data Freshness and Decay**
- Does the data depreciate quickly (social signals, consumer preferences, news) or
  retain value over long horizons (outcomes, failure modes, regulatory history)?
- Is the company's advantage primarily in historical depth or real-time coverage?
- Could a new entrant achieve parity on the current state (even if they lack history)?

**3.5 Data Monetization Efficiency**
- How effectively does the company convert data into revenue?
- Is data the product itself (Bloomberg), an input to the product (Google), or a byproduct
  that's underleveraged?
- Are there untapped monetization opportunities in the data (selling to third parties,
  building new products)?
- Does the company price based on the data's value to the customer or on commodity metrics?

**Classical Data Moat Score** = average of 3.1–3.5

### Step 4: The K_IP Bifurcation (Catalini Framework)

This is the most important analytical step. Catalini argues that proprietary data (K_IP)
bifurcates into two fundamentally different categories:

**Execution-Grade K_IP (Lowers cA — Teaches Agents What to Do)**

This is data that improves the quality of automated execution: finished outputs, training
examples, user behavior logs, feature usage data. It's the substrate for domain adaptation.

Characteristics:
- Tells the model the "right answer" for standard cases
- Consists of artifacts: completed transactions, finished documents, resolved tickets
- Creates immediate efficiency gains when used for training
- **Structurally vulnerable:** As general-purpose models ingest vast datasets and improve,
  they approximate the standard "what" of most domains. The marginal value of proprietary
  execution data erodes as frontier models improve.

Assessment questions:
- Could a frontier model achieve 80%+ of this data's value from public training data alone?
- Is the data teaching standard patterns (vulnerable) or rare edge cases (more defensible)?
- How quickly is the "general knowledge" frontier advancing in this domain?
- Is the company's execution-grade data genuinely unique, or just earlier?

**Verification-Grade K_IP (Lowers cH — Teaches Systems What to Reject)**

This is data that improves the quality of verification and oversight: failure logs, near-miss
records, rejection reasons, disputed outcomes, edge-case resolutions, audit trails,
outcome archives.

Characteristics:
- Tells the system what NOT to do — the negative space of expertise
- Consists of traces: why a senior engineer blocked a deployment, how a fraud case was
  resolved, what went wrong in a past incident
- Contains institutional priors and empirical history that general models cannot infer
- **Structurally durable:** This data is idiosyncratic, invisible in public data, and
  requires massive scale of operations to discover. Competitors may replicate the capability
  to generate output but will lack the ground truth to trust it.

Assessment questions:
- Does this data capture what went wrong, not just what went right?
- Is it generated from high-stakes, long-feedback-loop domains where failures are rare and expensive?
- Does the data require operational context to interpret (not just raw numbers)?
- Would a competitor need to experience the same failures to build a comparable dataset?

**Produce a K_IP Bifurcation Assessment:** For each major data asset, classify it as
execution-grade, verification-grade, or mixed. Estimate the overall split.

### Step 5: Verification Infrastructure Assessment

Catalini argues that verification infrastructure is not merely a compliance function but
a primary production technology — increasingly a company's most defensible moat.

**5.1 Does the company treat verification as a production input?**
- Is there a dedicated function for data quality, model validation, or outcome monitoring?
- Does the company invest in observability (tools that compress agent behavior into
  verifiable signals)?
- Is the verification stack proprietary or built on commodity tools?

**5.2 Does the company have a verification flywheel?**
- Does each failure/edge case improve the verification system?
- Is there a feedback loop from outcomes back to the verification criteria?
- Does the cost of verification fall with scale (precedent library effect)?

**5.3 Is the company positioned for Liability-as-a-Service?**
- Does the company absorb tail risk for its outputs (warranties, SLAs with teeth)?
- Could the company credibly indemnify agentic outcomes?
- Is the revenue model shifting toward outcome-based or risk-based pricing?
- Does the company have the balance sheet to absorb liability?

**5.4 Insurance as the product boundary**
- Does the company have real-time observability into its own system behavior?
- Could it price risk dynamically based on verification confidence (sv)?
- Is there a path from "selling software" to "selling guaranteed outcomes"?

### Step 6: Agentic Vulnerability Scoring

Score each dimension 1–5 (1 = minimal vulnerability, 5 = critical exposure):

**6.1 General Model Convergence Risk**
- How quickly are frontier models approaching the quality of this company's data-trained
  outputs?
- Is the company's data advantage measured in years of lead or months?
- Are there benchmark results showing open/public models closing the gap?
- Is the domain one where more compute + public data substitutes for proprietary data?

**6.2 Data Replication via Synthetic Generation**
- Could agents generate synthetic training data that approximates the proprietary dataset?
- Is the data capturing objective patterns (replicable) or institutional context (not)?
- Are there academic or open-source efforts to create public alternatives?

**6.3 Wrapper Agent / Disintermediation Risk**
- Could agents query this data source alongside competitors and synthesize?
- If the data is accessible via API, does a meta-layer that aggregates multiple sources
  reduce the premium for any single source?
- Is the company's pricing power in exclusive access or in integration depth?

**6.4 Freshness Erosion Risk**
- Could real-time agents collect comparable data going forward, even if they lack history?
- Is the company's advantage primarily in the stock of historical data (defensible against
  forward collection) or the flow of current data (contestable)?
- Are there emerging sensor networks, satellite imagery, or IoT data streams that could
  provide alternative coverage?

**6.5 Value Migration to Verification**
- As execution-quality data commoditizes, is this company positioned in the verification
  layer?
- Does the company own the ground truth required to validate agentic outputs in its domain?
- Is the company building the infrastructure to be the "certifier" rather than just the
  "data provider"?

Score 6.5 inversely: 1 = company is strongly positioned in verification (moat strengthens),
5 = company is purely an execution-data provider (moat erodes).

**Composite Agentic Vulnerability Score** = average of 6.1–6.5

Interpretation:
- 1.0–1.5: Low vulnerability — data moat is primarily verification-grade and compounds
- 1.5–2.5: Moderate — meaningful verification-grade assets but significant execution-grade exposure
- 2.5–3.5: High — data moat is primarily execution-grade and facing convergence
- 3.5–5.0: Critical — data advantage is actively being commoditized by frontier models

### Step 7: Data Moat Durability Tier Placement

| Tier | Data Type | Durability | Examples |
|---|---|---|---|
| 1 (Most Fragile) | Behavioral / preference data | General models learn preferences from public data; individual behavioral data depreciates quickly | Ad targeting data, content recommendation signals |
| 2 | Standard domain training data | Frontier models converge on standard patterns; proprietary training data loses marginal value | Generic NLP training data, standard image recognition |
| 3 | Structured operational data | Valuable for optimization but replicable by competitors at scale given time and capital | Logistics optimization data, standard financial data |
| 4 | Real-world outcome data | Captures ground truth that models cannot generate synthetically; requires operational scale to produce | Clinical trial outcomes, insurance claims data, long-horizon investment returns |
| 5 | Failure and edge-case data (K_IP^ver) | The negative space of expertise; idiosyncratic, invisible in public data, requires scale of operations and time to accumulate | Fraud adjudication histories, safety incident logs, near-miss databases, audit trails |
| 6 (Most Defensible) | Regulatory / legal ground truth | Data that IS the regulatory record; irreplaceable, non-replicable, carries legal authority | SEC filing history, patent prosecution records, FDA submission archives, court records |

### Step 8: Market Pricing Gap Analysis

**8.1 What the market prices as the data moat:**
How does the sell-side describe the data advantage? Is the pitch "data flywheel"
(execution-grade, potentially vulnerable) or "irreplaceable ground truth"
(verification-grade, durable)?

**8.2 What the framework says:**
Based on the K_IP bifurcation in Step 4, what % of the data advantage is execution-grade
vs. verification-grade? If the market prices a "data moat" but the data is primarily
execution-grade, the moat duration is overestimated.

**8.3 The convergence timeline:**
For the execution-grade portion, how quickly are frontier models closing the gap?
This determines the time horizon of the vulnerability.

**8.4 Consensus risk vs. actual risk:**
The sell-side typically frames data risk as "can a competitor collect enough data?"
Catalini's framework says the real risks are:
- Frontier model convergence making proprietary execution data less marginal
- Synthetic data generation approximating real-world patterns
- Agents aggregating across data sources, reducing any single provider's premium
- The company failing to build verification-grade assets before execution-grade erodes

**8.5 The "data provider to certifier" transition:**
Is the company evolving from selling data access (commodity, execution-grade) to selling
verified outcomes (differentiated, verification-grade)? This is the single most important
strategic signal for data companies.

**8.6 Gap classification:**
- Overpriced flywheel: Market prices execution-grade data as if it's verification-grade
- Fairly priced: Market correctly identifies the durable data layer
- Underappreciated ground truth: Company has deep verification-grade assets the market undervalues
- Transition story: Company is moving from data provider to certifier/underwriter — market hasn't priced the transformation

**8.7 Investment implication and monitoring:**
- Position sizing and conviction level
- Time horizon of the agentic risk
- Key signals: Is the company investing in verification infrastructure? Is pricing shifting
  toward outcomes? Are frontier models measurably closing the gap in benchmark performance?

### Step 9: Monitoring Framework

**9.1 Quantitative Signals**
- Revenue per data unit trend (is the data commanding more or less per unit?)
- Customer concentration in data products (are large customers building alternatives?)
- R&D allocation: % going to data collection/improvement vs. verification/outcome quality
- Benchmark performance gap vs. models trained on public data only

**9.2 Leading Indicators of Data Moat Erosion**
- Frontier model benchmarks approaching the company's proprietary model performance
- Emergence of open-source or synthetic alternatives to the proprietary dataset
- Customers building in-house data capabilities that reduce dependence
- Pricing pressure from customers who see the data as less differentiated
- API usage patterns suggesting wrapper agents are aggregating across providers

**9.3 Leading Indicators of Data Moat Strengthening**
- Company investing in verification infrastructure and outcome monitoring
- Revenue model shifting from data access to outcome guarantees / liability
- Verification-grade data growing as a % of total data assets
- Customers willing to pay premium for verified/certified outputs vs. raw data
- Building or acquiring insurance/warranty capabilities

**9.4 Thesis Kill Conditions**
- Frontier model achieves parity with the company's proprietary model on key benchmarks
- Major customer builds in-house alternative using public data + fine-tuning
- Pricing power erodes: average revenue per data unit declines for 3+ quarters
- Company fails to develop verification-grade assets within the convergence window

---

## Output Format

Produce a Word document (.docx) with the following structure:

1. **Executive Summary Table** — Company, tier, scores, K_IP bifurcation ratio, market gap
2. **Business Model Overview** — Step 1
3. **Data Asset Inventory** — Step 2, the full asset map
4. **Classical Data Moat Assessment** — Step 3, five dimensions scored
5. **K_IP Bifurcation Analysis** — Step 4, the critical execution vs. verification decomposition
6. **Verification Infrastructure Assessment** — Step 5, liability-as-a-service positioning
7. **Agentic Vulnerability Assessment** — Step 6, five dimensions scored
8. **Data Moat Durability Tier** — Step 7, with full spectrum and justification
9. **Composite Scorecard** — Classical + agentic scores, bifurcation ratio, combined matrix
10. **Market Pricing Gap Analysis** — Step 8, the investment insight
11. **Monitoring Framework** — Step 9, signals and kill conditions
12. **Appendix: Key Framework Definitions**

### Formatting and Tone

- Same formatting as sibling skills (navy/blue color scheme, US Letter, docx skill mechanics)
- The K_IP Bifurcation Analysis should be visually prominent — use contrasting shading
  for execution-grade (orange/red) vs. verification-grade (green/teal) data assets
- Direct, specific, investment-focused. Avoid generic "data is the new oil" platitudes.
- Quantify where possible: "proprietary dataset of X records spanning Y years" not "large dataset"


### Language Rules — No Academic Notation in Output

**All output documents must use plain English, not Catalini's academic notation.** The
reference files use notation internally, but the reader never sees it. The full translation
table is in the orchestrator skill (`catalini-moat-screen`). Key rules:

- Never write K_IP, cA, cH, Δm, sv, La, Snm, Tnm, XA, τ, tfb, mA, mH, or κcorr
- Instead write: "proprietary data," "cost to automate," "cost to verify," "the measurability
  gap," "the verifiable share," "agentic labor," "accumulated expertise," "verification work,"
  "hidden risk / unverified output," "alignment," "feedback latency," "what AI can automate,"
  "what humans can verify," "correlated blind spots"
- Distinguish "verification-grade data" (failure logs, edge cases, dispute histories) from
  "execution-grade data" (training data, behavioral logs) — but in words, not notation
- The analysis should read like an investment memo, not a research paper
- If a term requires a footnote to understand, rewrite it


---

## Scoring Summary

**Classical Data Moat Score (1–5)**
Average of: Flywheel strength, exclusivity, data gravity, freshness, monetization.

**Agentic Vulnerability Score (1–5)**
Average of: Model convergence, synthetic replication, wrapper disintermediation,
freshness erosion, value migration (inverted). Lower = more defensible.

**K_IP Bifurcation Ratio** = Execution-Grade % / Verification-Grade %
- >80% execution-grade: Data moat is primarily a training advantage — high vulnerability
- 50–80% execution-grade: Mixed — some durable assets but significant convergence exposure
- <50% execution-grade: Data moat is primarily verification/ground truth — low vulnerability

**Combined Assessment Matrix:**

| | Low Agentic Vulnerability (1–2) | High Agentic Vulnerability (3–5) |
|---|---|---|
| **Strong Classical Data Moat (4–5)** | Fortress: Deep, durable ground truth. Verification-grade data compounding. Highest conviction. | Contested: Strong data today but frontier models are converging. The flywheel is real but depreciating. Assess convergence timeline carefully. |
| **Weak Classical Data Moat (1–3)** | Niche: Modest data advantage but positioned in verification. May be undervalued if market doesn't see the quality distinction. | Vulnerable: Thin data advantage getting thinner. Generic training data with no verification-grade assets. Avoid or short. |

---

## Common Pitfalls

- **Don't conflate data volume with data moat.** Having a lot of data is not a moat if the
  data is replicable, depreciating, or losing marginal value as models improve. The question
  is not "how much data" but "what kind of data and can others get it."

- **Don't assume the data flywheel is still spinning.** Many data flywheels exhibit
  diminishing returns — the marginal value of the 10 billionth search query is much less
  than the 10 millionth. Ask whether the flywheel is still on the steep part of the curve.

- **Don't ignore the convergence timeline.** Execution-grade data advantages can be durable
  over 2–3 year horizons even if they're structurally vulnerable over 5–10 years. The
  investment question is whether the market is pricing a 10-year moat on a 3-year asset.

- **Don't miss the "data provider to certifier" transition.** The most important strategic
  signal for data companies is whether they're investing in verification infrastructure.
  Bloomberg evolving from data terminal to verified financial intelligence is a different
  business than Bloomberg-as-a-data-pipe.

- **Don't treat all domains equally.** Data advantages in domains with long feedback loops,
  rare failures, and high stakes (healthcare outcomes, financial risk, safety incidents)
  are structurally more durable than data advantages in domains with fast feedback and
  abundant signals (ad targeting, content recommendation).

---

## Interaction with Other Moat Skills

This skill analyzes data and ground-truth moats specifically. Many companies also have
network effect moats (evaluate with `network-moat-skill`), system-of-record lock-in
(evaluate with `system-of-record-skill`), talent moats, or non-measurable moats.

Data moats often interact with other moat types:
- **Network + Data:** More users generate more data, which improves the product. Evaluate
  the network effect with the network skill; evaluate the data advantage here.
- **SoR + Data:** The system of record contains proprietary data. The switching cost locks
  in the data; the data quality drives the value. Evaluate lock-in with the SoR skill;
  evaluate data defensibility here.
- **Verification infrastructure + Data:** The company's verification-grade data IS the
  verification infrastructure. These are deeply intertwined and both assessed here.

Flag where other moat types are present but defer scoring to the specialized skill.
