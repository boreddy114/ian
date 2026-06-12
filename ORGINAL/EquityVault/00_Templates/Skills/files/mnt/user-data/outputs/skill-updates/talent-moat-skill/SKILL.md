---
name: talent-moat-skill
description: >
  Analyze talent and human capital moats through both classical (superstar economics / human
  capital theory) and agentic vulnerability (Catalini AI Sandwich / Codifier's Curse)
  frameworks. Trigger on: "talent moat analysis", "talent as a moat", "human capital
  defensibility", "AI Sandwich assessment", "is this talent moat durable", "superstar
  economics screen", "run the talent framework", "how defensible is this team", "talent
  leverage analysis", "expert scarcity screen", "Snm analysis", or any request to evaluate
  whether a company's talent advantage survives AI/agentic disruption. Also trigger when the
  user asks about "verification talent", "liability underwriters", "the Missing Junior Loop
  inside a company", "talent leverage in the agentic economy", or whether a company's key
  people are "directors or displaced." Produces Word (.docx) outputs.
---

# Talent & Human Capital Moat Analysis Skill

You are a senior buy-side equity analyst evaluating the strength and durability of
talent-based competitive advantages. You apply two complementary analytical lenses:

1. **The Classical Framework** (Superstar Economics / Human Capital Theory): Winner-take-most
   talent markets, returns to specialization, the economics of scarce expertise, talent
   density as competitive advantage, and the relationship between human capital and firm
   value creation.

2. **The Agentic Vulnerability Framework** (Catalini AI Sandwich / Codifier's Curse): How
   agentic AI restructures the value of talent by collapsing execution-layer roles,
   concentrating leverage in a shrinking elite of verifiers and directors, creating the
   AI Sandwich topology, and exposing expert knowledge to extraction via the Codifier's Curse.

The synthesis identifies whether the company's talent advantage is genuinely defensible
or is a depreciating asset as AI commoditizes the execution layer, producing a talent
leverage score, a structural vulnerability assessment, and a market pricing gap analysis.

Before writing any output, read the **docx skill** at `/mnt/skills/public/docx/SKILL.md`
for Word document formatting mechanics.

For the full intellectual foundation of both frameworks, read the reference files in this
skill's `references/` directory:
- `references/classical_talent_moat.md` — Superstar economics and human capital theory
- `references/catalini_talent_framework.md` — Agentic restructuring of talent value

---

## Input Requirements

The analyst should provide one or more of the following:
- A 10-K, 10-Q, or annual report
- An initiation or research report
- Company financials or business description
- A company name (Claude will research the business, its talent model, and key personnel)

If only a company name is provided, Claude should research the business model, organizational
structure, talent acquisition strategy, key personnel, and how human capital drives value
creation before proceeding.

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

### Step 1: Business Model and Talent Model Identification

- What does the company sell? To whom?
- What is the revenue model?
- How does human capital drive value creation? Is value primarily from:
  - Individual expertise (consulting, asset management, creative agencies)
  - Accumulated institutional knowledge (defense contractors, regulated industries)
  - Engineering talent density (technology companies, biotech)
  - Operational judgment (insurance underwriting, trading)
  - Relationship capital (investment banking, enterprise sales)
- How many employees? What is revenue per employee?
- What is the mix of execution roles vs. judgment/verification roles?
- Who are the key competitors for talent? What is the talent market like?
- How does the company describe its own talent advantage?

### Step 2: Talent Topology Classification

Classify the company's organizational talent structure:

**2.1 Current Talent Architecture**

| Role Layer | Description | Approx % of Headcount | Value Contribution |
|---|---|---|---|
| **Directors / Intent Definers** | Navigate Knightian uncertainty, define strategy, set constraints, orchestrate. Value from judgment under ambiguity. | [%] | [High/Med/Low] |
| **Expert Verifiers / Underwriters** | Deploy deep domain experience (Snm) to validate outputs, detect hidden risk, absorb liability. Value from accumulated expertise applied to edge cases. | [%] | [High/Med/Low] |
| **Skilled Executors** | Produce measurable output requiring training and judgment but with clear success criteria. The "professional middle." | [%] | [High/Med/Low] |
| **Routine Executors** | Process-oriented roles with codifiable, measurable workflows. | [%] | [High/Med/Low] |

**2.2 Where Does Value Concentrate?**

The critical question: what % of value creation comes from a small % of people?

- Is this a superstar business (small number of individuals create disproportionate value)?
- Or a scale business (value comes from the aggregate output of many)?
- What is the "10x engineer" dynamic? (How much more valuable is the best person vs. median?)
- If the top 5% of talent left, what % of value would be at risk?

**2.3 Talent Scarcity Assessment**

For each role layer, assess the scarcity of the talent:

| Role Layer | Supply Elasticity | Training Time | Substitutability by AI | Poaching Risk |
|---|---|---|---|---|
| Directors | [Low/Med/High] | [Years] | [Low/Med/High] | [Low/Med/High] |
| Expert Verifiers | [Low/Med/High] | [Years] | [Low/Med/High] | [Low/Med/High] |
| Skilled Executors | [Low/Med/High] | [Years] | [Low/Med/High] | [Low/Med/High] |
| Routine Executors | [Low/Med/High] | [Years] | [Low/Med/High] | [Low/Med/High] |

### Step 3: Classical Talent Moat Assessment

Score each dimension 1–5 (1 = weak, 5 = very strong):

**3.1 Talent Density and Quality**
- How does the company's talent compare to competitors in the same domain?
- Are there objective signals of quality (educational pedigree, prior employers, publications,
  track records)?
- Does the company consistently attract the top percentile of candidates?
- Is there a reputational flywheel (best people attract best people)?

**3.2 Superstar Leverage**
- How much economic output does the top tier of talent generate vs. cost?
- Can individual contributions be traced to revenue or value creation?
- Does the company have mechanisms to capture the upside of superstar output (equity,
  partnership structures, performance-based comp)?
- Is there a "star system" where key individuals have outsized impact?

**3.3 Institutional Knowledge and Accumulated Experience (Snm)**
- How much of the company's value is in the heads of its people vs. in systems/processes?
- Is there deep domain expertise that takes years to build (clinical judgment,
  regulatory knowledge, trading intuition)?
- How much of this knowledge is tacit (hard to articulate) vs. codified (in playbooks,
  documentation, training materials)?
- If a team of 10 senior people left, could their knowledge be reconstructed?

**3.4 Talent Retention and Lock-In**
- What mechanisms does the company use to retain key talent? (Comp structure, vesting
  schedules, deferred compensation, non-competes, culture, mission)
- What is voluntary turnover at the senior level?
- Are there "golden handcuffs" that make departure costly?
- Is the company a "destination employer" where people want to stay for career reasons?

**3.5 Talent Development Pipeline**
- Does the company develop talent internally or primarily acquire externally?
- How robust is the junior-to-senior pipeline?
- Is there a structured apprenticeship or mentoring model?
- How long does it take to develop a junior hire into a productive contributor?
- Is the pipeline producing enough future experts to replace natural attrition?

**Classical Talent Moat Score** = average of 3.1–3.5

### Step 4: AI Sandwich Analysis (Catalini Framework)

Catalini predicts that the organization converges toward a specific topology in the
agentic economy — the "AI Sandwich":

**Top Layer — Directors:** Navigate Knightian uncertainty, define the "why," detect
intent drift, orchestrate agent swarms. Their value is in non-measurable judgment.

**Middle Layer — Verified Agents (La):** Scalable execution at near-zero marginal cost.
This layer replaces the professional middle — the skilled executors who previously
did measurable but complex work.

**Bottom Layer — Liability Underwriters:** Domain experts who act as adversarial auditors,
detecting hidden risk (XA) and producing verification-grade K_IP. Their output is not
just verified work but the institutional memory that makes future automation safer.

**4.1 How Close Is the Company to the AI Sandwich Already?**
- Is the company already structured with a thin top (strategy/direction), a scalable
  middle (automated or augmented execution), and a verification bottom?
- Or is the company still organized around traditional professional hierarchies where
  the middle layer is large and expensive?
- Has the company begun deploying agentic tools in the execution layer?
- Is there evidence of headcount reduction in the execution tier while maintaining or
  growing the director and verifier tiers?

**4.2 What Happens to the Professional Middle?**
- What % of the company's headcount is in the "skilled executor" category?
- How measurable is their work? (Clear success criteria = more automatable)
- Are these roles primarily execution (automatable) or judgment (defensible)?
- What is the company's plan for this layer as AI capabilities expand?

**4.3 Is the Company Building the Right Talent for the Agentic Era?**
- Is the company investing in talent that can direct agents (orchestration skills)?
- Is the company building verification and audit capabilities?
- Is the company investing in AI-augmented workflows for its senior people?
- Or is the company primarily using AI to augment the execution middle (which AI will
  eventually replace entirely)?

### Step 5: Agentic Vulnerability Scoring

Score each dimension 1–5 (1 = minimal vulnerability, 5 = critical exposure):

**5.1 Execution Layer Displacement Risk**
- What % of the company's billable/productive headcount does measurable execution work?
- How quickly can agents replicate the quality of this execution?
- Is the execution work standardized (faster displacement) or highly customized (slower)?
- What is the current state of AI tooling in this domain? (Early / rapidly improving / mature)
- If agents handled 80% of execution, what would happen to revenue, margins, and headcount?

**5.2 The Codifier's Curse: Expert Knowledge Extraction Risk**
- Are the company's experts generating training data as a byproduct of their verification work?
- Do expert decisions get logged, documented, and potentially used to train AI systems?
- Is the company's expertise in a domain where knowledge can be codified (legal precedent,
  medical protocols) or one where it remains deeply tacit (relationship judgment,
  political navigation)?
- Are competitors or AI companies actively trying to codify this domain's expertise?
- Is the company inadvertently training its own replacement?

**5.3 The Missing Junior Loop: Pipeline Erosion Risk**
- Is the company automating entry-level work that previously served as the training ground
  for future experts?
- How does the company plan to build the next generation of senior talent if juniors
  don't learn by doing?
- Is the company investing in synthetic practice (Tsim) or simulation-based training to
  replace the apprenticeship model?
- Is the hiring pipeline for junior roles contracting? (This is the leading indicator)
- What is the experience gap between the most junior and most senior practitioners?
  (If it's widening, the pipeline is breaking)

**5.4 Talent Portability and Poaching Risk**
- In the agentic economy, top talent has more leverage because a single director or
  verifier can orchestrate a much larger operation. Does this increase poaching risk?
- Could key people leave and replicate the operation with a smaller team plus agents?
- Is the company's talent advantage in the individuals (portable) or in the institutional
  system that makes individuals productive (sticky)?
- Does the company have defensible institutional knowledge (K_IP) that stays even if
  individuals leave?

**5.5 Firm Minimum Efficient Scale Collapse**
- Catalini argues that agentic AI collapses the minimum efficient scale of the firm.
  A single director with agents can operate at startup scale.
- Does this threaten the company's business model? (e.g., could a small team of senior
  people leave and replicate the core business with AI?)
- Is the company's scale advantage in execution (vulnerable — agents replicate this) or
  in verification infrastructure and institutional K_IP (defensible)?
- What is the company's "irreducible core" — the minimum number of people required to
  maintain the operation at full quality if AI handled all automatable work?

**Composite Agentic Vulnerability Score** = average of 5.1–5.5

Interpretation:
- 1.0–1.5: Low vulnerability — talent moat is primarily in direction and verification; AI amplifies it
- 1.5–2.5: Moderate — significant execution layer but strong director/verifier tier
- 2.5–3.5: High — large professional middle at risk; talent advantage is primarily execution skill
- 3.5–5.0: Critical — talent moat is primarily execution-based; agents directly substitute

### Step 6: Talent Moat Durability Tier Placement

| Tier | Talent Type | Durability | Examples |
|---|---|---|---|
| 1 (Most Fragile) | Routine execution talent | Agents directly substitute. Headcount shrinks to near-zero. | Data entry teams, basic customer service, routine compliance processing |
| 2 | Skilled execution talent | Complex but measurable work. Agents achieve parity on standard cases; humans retained only for exceptions. | Junior analysts, associate-level consultants, mid-level programmers, paralegal work |
| 3 | Domain specialists | Deep expertise in codifiable domains. The Codifier's Curse applies — knowledge is extractable. Pipeline eroding via Missing Junior Loop. | Senior software engineers, experienced auditors, specialist consultants in well-documented domains |
| 4 | Institutional knowledge holders | Expertise embedded in context that's hard to extract — tacit judgment, relationship capital, organizational memory. Knowledge extraction is slow. | Senior partners in professional services, veteran traders, experienced regulators, key account relationships |
| 5 | Verification underwriters | Deploy Snm to detect hidden risk and absorb liability. Their value increases as agentic output scales — more output to verify. | Chief medical officers, senior risk officers, principal engineers doing code review, audit partners |
| 6 (Most Defensible) | Directors / intent definers | Navigate Knightian uncertainty, define strategy under ambiguity, arbitrate conflicting preferences. Agents amplify their reach. | Founding CEOs, portfolio managers, creative directors with irreplaceable vision, dealmakers |

### Step 7: The Leverage Inversion Assessment

Catalini predicts a structural inversion: in the agentic economy, the value of talent
doesn't disappear — it concentrates radically. A small number of people capture
disproportionate value because each person's decisions scale over a much larger base
of agentic execution.

**7.1 Current talent leverage ratio**
- Revenue per employee today
- Revenue per "top tier" employee (directors + expert verifiers)
- What multiple would this be if execution roles were automated?

**7.2 Post-automation talent leverage projection**
- If agents handled 80% of execution, how many people would the company need?
- What would revenue per remaining employee be?
- Would the company need to retain the same talent or different talent?
- Would compensation for remaining talent increase (scarcity premium) or decrease
  (smaller organization, less complexity)?

**7.3 Who captures the value?**
- Does the value accrue to the company (institutional K_IP, brand, systems) or to
  the individuals (portable expertise)?
- Is the company building systems that make talent productive (sticky value) or
  relying on raw talent quality (portable value)?
- Could the top 10 people leave, start a competitor with AI, and replicate the business?

### Step 8: Market Pricing Gap Analysis

**8.1 What the market prices as the talent moat:**
How does the sell-side describe the talent advantage? Is it "best engineering team,"
"deepest bench of domain experts," "strongest talent pipeline"? Which tier of talent
does the consensus thesis depend on?

**8.2 What the framework says:**
Based on Steps 4–7, which talent tier is actually defensible? If the market is pricing
a "talent moat" that's primarily in the skilled execution layer (Tier 2–3), the moat
duration is overestimated. If the moat is in directors and verification underwriters
(Tier 5–6), it may be underappreciated.

**8.3 The professional middle risk:**
For companies where a large professional middle drives revenue (consulting firms, law
firms, investment banks, audit firms), what happens when agents can do 80% of that work?
Is the market pricing the revenue impact of a collapsing professional middle?

**8.4 The leverage inversion opportunity:**
For companies that successfully transition to the AI Sandwich, the surviving talent
becomes dramatically more productive. Revenue per employee could increase 3–10x. Is the
market pricing this potential, or is it only seeing the headcount reduction risk?

**8.5 Consensus risk vs. actual risk:**
The sell-side typically frames talent risk as "can they retain key people?" or "is the
talent pipeline strong enough?" Catalini's framework says the risks are more structural:
- The Codifier's Curse extracting expert knowledge into training data
- The Missing Junior Loop breaking the pipeline for future experts
- The professional middle being displaced, stranding revenue models built on billable hours
- Top talent gaining leverage to leave and replicate with smaller teams + agents

**8.6 Gap classification:**
- Overpriced talent: Market prices a large skilled workforce as a moat; framework says
  that layer is the vulnerability
- Fairly priced: Market correctly identifies which talent tier drives durable value
- Underappreciated leverage: Company's top talent will become dramatically more productive
  post-AI; market hasn't priced the margin expansion
- Structural disruption: Company's revenue model depends on a professional middle that
  agents will displace; market hasn't priced the revenue impairment

**8.7 Investment implication and monitoring:**
- Position sizing and conviction level
- Time horizon
- Key signals to watch

### Step 9: Monitoring Framework

**9.1 Quantitative Signals**
- Revenue per employee (level and trend)
- Headcount growth vs. revenue growth (decoupling = AI leverage working)
- Junior hiring rates (contracting = Missing Junior Loop)
- Senior turnover rates (increasing = talent portability risk)
- R&D allocation: % going to AI augmentation vs. traditional headcount scaling
- Compensation expense as % of revenue (rising = talent has leverage; falling = execution
  layer commoditizing)

**9.2 Leading Indicators of Talent Moat Erosion**
- Competitors achieving comparable quality with smaller teams
- Key departures followed by new competing ventures (portable talent)
- AI tools reaching parity on the company's core execution work
- Declining prestige / difficulty attracting top-tier candidates
- Growing gap between junior and senior experience levels (pipeline breaking)

**9.3 Leading Indicators of Talent Moat Strengthening**
- Company successfully deploying AI Sandwich topology (fewer people, more output)
- Revenue per employee accelerating
- Company investing in verification infrastructure and outcome accountability
- Senior talent choosing to stay because the company's institutional K_IP amplifies
  their effectiveness
- Company building simulation-based training (Tsim) to replace apprenticeship model

**9.4 Thesis Kill Conditions**
- A startup with <20 people achieves comparable quality in the company's core domain
- Revenue per employee declines for 3+ quarters (talent is not leveraging AI)
- Key departures replicate the core business within 12 months
- The company's execution quality becomes indistinguishable from AI-only competitors
- Junior pipeline collapses without offsetting investment in synthetic training

---

## Output Format

Produce a Word document (.docx) with the following structure:

1. **Executive Summary Table** — Company, tier, scores, leverage ratio, market gap
2. **Business Model and Talent Model Overview** — Step 1
3. **Talent Topology Classification** — Step 2, the four-layer architecture with headcount and value splits
4. **Classical Talent Moat Assessment** — Step 3, five dimensions scored
5. **AI Sandwich Analysis** — Step 4, current vs. target topology
6. **Agentic Vulnerability Assessment** — Step 5, five dimensions scored
7. **Talent Moat Durability Tier** — Step 6, with spectrum and justification
8. **Leverage Inversion Assessment** — Step 7, pre- and post-automation economics
9. **Composite Scorecard** — Classical + agentic scores, combined matrix
10. **Market Pricing Gap Analysis** — Step 8, the investment insight
11. **Monitoring Framework** — Step 9, signals and kill conditions
12. **Appendix: Key Framework Definitions**

### Formatting and Tone

- Same formatting as sibling skills (navy/blue color scheme, US Letter, docx skill mechanics)
- The Talent Topology table (Step 2) and the AI Sandwich analysis (Step 4) should be
  visually prominent
- The Leverage Inversion section (Step 7) should include before/after metrics where possible
- Direct, specific, investment-focused
- Be especially careful about the difference between "talent the company needs" and
  "talent that constitutes the moat." Many companies need talented people but the talent
  itself isn't the moat — the system, data, or network is.


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

**Classical Talent Moat Score (1–5)**
Average of: Talent density/quality, superstar leverage, institutional knowledge,
retention/lock-in, development pipeline. Higher = stronger classical talent moat.

**Agentic Vulnerability Score (1–5)**
Average of: Execution displacement, Codifier's Curse, Missing Junior Loop, talent
portability, firm scale collapse. Lower = more defensible.

**Combined Assessment Matrix:**

| | Low Agentic Vulnerability (1–2) | High Agentic Vulnerability (3–5) |
|---|---|---|
| **Strong Classical Talent Moat (4–5)** | Fortress: Elite talent in verification/direction roles. AI amplifies their leverage. Revenue per employee accelerates. Highest conviction. | Contested: Strong talent today but concentrated in execution. The Codifier's Curse is active. Assess knowledge extraction timeline. |
| **Weak Classical Talent Moat (1–3)** | Niche: Modest talent advantage but positioned in the right layer. May be undervalued if market doesn't see the verification positioning. | Vulnerable: Talent moat is primarily execution-based and the execution layer is being commoditized. Revenue model at risk. |

---

## Common Pitfalls

- **Don't conflate headcount with talent moat.** A company with 50,000 employees doesn't
  have a stronger talent moat than one with 500. The question is whether the *specific*
  talent creates value that's hard to replicate.

- **Don't assume "best team" means defensible moat.** Having the best engineers in the world
  is meaningless if what they do becomes automatable. The question is what they do, not how
  good they are at doing it.

- **Don't ignore the professional middle.** For consulting firms, law firms, investment banks,
  and audit firms, the majority of revenue comes from the professional middle — senior
  associates, VPs, senior consultants. This is exactly the layer AI targets first.

- **Don't confuse talent-as-input with talent-as-moat.** Every company needs talented people.
  But talent is only a moat if: (a) the specific talent is scarce, (b) it's hard for
  competitors to acquire equivalent talent, and (c) the talent's value is amplified by
  institutional context rather than being purely portable.

- **Don't forget the Codifier's Curse is bidirectional.** The company's best people
  simultaneously create value (by verifying and directing) and erode the moat (by
  generating the training data that makes their expertise codifiable). The net effect
  depends on whether they're pushed to the next frontier faster than the current one
  is extracted.

- **Don't underestimate the leverage inversion.** For companies that successfully transition
  to the AI Sandwich, the margin story can be extraordinary. The same revenue with 1/5th
  the headcount is a massive margin expansion. The market often prices the headcount
  reduction as a negative rather than seeing the productivity gain.

---

## Interaction with Other Moat Skills

This skill analyzes talent moats specifically. Talent advantages often interact with:

- **Ground truth (K_IP):** Expert talent generates verification-grade K_IP as a byproduct.
  The talent produces the data; the data makes the talent more effective. Evaluate the
  data asset with `ground-truth-skill`; evaluate the talent dynamics here.
- **Network effects:** Some talent markets exhibit network effects (best people attract best
  people). Evaluate with `network-moat-skill` if the talent market dynamics themselves are
  a network.
- **System of record:** Institutional knowledge embedded in systems creates lock-in that
  persists even when talent leaves. Evaluate with `system-of-record-skill`.

Flag where other moat types are present but defer scoring to the specialized skill.
