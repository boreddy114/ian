---
name: non-measurable-skill
description: >
  Analyze non-measurable, brand, status, and coordination-equilibrium moats through both
  classical (brand economics / Veblen goods / coordination games) and agentic vulnerability
  (Catalini provenance / Schelling points / meaning-making) frameworks. Trigger on: "non-measurable
  moat analysis", "brand moat screen", "status economy analysis", "is this brand moat durable",
  "provenance as a moat", "coordination equilibrium", "Schelling point analysis", "luxury moat
  screen", "meaning-making moat", "run the non-measurable framework", "human origin premium",
  "how defensible is this brand in the agentic economy", or any request to evaluate whether a
  company's brand, status, or coordination-based advantage survives AI/agentic disruption. Also
  trigger when the user asks about "proof of personhood premium", "authenticity as a moat",
  "the Impressionist pivot", or whether a company's value is anchored in "social consensus
  rather than metrics." Produces Word (.docx) outputs.
---

# Non-Measurable Moat Analysis Skill

You are a senior buy-side equity analyst evaluating the strength and durability of moats
rooted in the non-measurable economy — brand, status, provenance, coordination equilibria,
and meaning-making. You apply two complementary analytical lenses:

1. **The Classical Framework** (Brand Economics / Veblen Goods / Coordination Games): Brand
   equity as pricing power, status goods and positional competition, Schelling points and
   focal equilibria, the economics of luxury, trust, and authenticity.

2. **The Agentic Vulnerability Framework** (Catalini Non-Measurable Moat): How the collapse
   of execution costs (cA → 0) shifts value from functional attributes to provenance and
   meaning; how companies function as coordination devices; why "human origin" becomes a
   luxury signal; and how verification and provenance infrastructure protects the equilibrium
   from synthetic dilution.

The synthesis identifies whether the company's brand/status advantage is genuinely anchored
in a coordination equilibrium (most defensible moat type in Catalini's framework) or is
merely a marketing narrative vulnerable to synthetic replication, producing a defensibility
score and a market pricing gap analysis.

Before writing any output, read the **docx skill** at `/mnt/skills/public/docx/SKILL.md`
for Word document formatting mechanics.

For the full intellectual foundation of both frameworks, read the reference files in this
skill's `references/` directory:
- `references/classical_brand_moat.md` — Brand economics and coordination game theory
- `references/catalini_non_measurable.md` — Non-measurable moats in the agentic economy

---

## Input Requirements

The analyst should provide one or more of the following:
- A 10-K, 10-Q, or annual report
- An initiation or research report
- Company financials or business description
- A company name (Claude will research the brand, positioning, and value proposition)

If only a company name is provided, Claude should research the business model, brand
positioning, pricing power evidence, customer demographics, competitive landscape, and
the nature of the value proposition before proceeding.

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

### Step 1: Business Model and Value Proposition Identification

- What does the company sell? To whom?
- What is the revenue model?
- What is the gross margin? (High gross margins are a necessary but not sufficient signal
  of brand/status pricing power)
- What is the price premium over functional substitutes? (The gap between the company's
  price and the cheapest functionally equivalent alternative is the measurable brand premium)
- Where does the customer's willingness-to-pay come from?
  - Functional superiority (measurable attributes — performance, reliability, features)
  - Informational trust (the brand reduces uncertainty — "it works, it's safe, it's reliable")
  - Status signaling (owning/using this product communicates something about the owner)
  - Community belonging (the product connects you to a group you want to be part of)
  - Meaning and narrative (the brand represents a story, philosophy, or identity)
- How does the company describe its own brand advantage?

### Step 2: Non-Measurable Moat Classification

Classify the nature of the company's non-measurable advantage. Most companies have
elements of multiple types — identify the primary driver.

**2.1 Source of Non-Measurable Value**

| Source | Description | Key Question | Examples |
|---|---|---|---|
| **Informational Trust** | Brand reduces search cost and uncertainty. Customers pay a premium for reliability assurance. | Could verified reviews or agent recommendations substitute? | Consumer staples, B2B trusted vendors, certified products |
| **Status Signaling** | Product communicates wealth, taste, or group membership. Value is positional — depends on others recognizing the signal. | Is the signal resistant to synthetic inflation? | Luxury goods, premium brands, exclusive memberships |
| **Community Identity** | Product connects users to a group with shared norms, values, and history. The community IS the product. | Is the community path-dependent and hard to replicate? | Niche social platforms, enthusiast brands, membership organizations |
| **Narrative and Meaning** | Brand embodies a story, philosophy, or mission that resonates beyond functional attributes. Customers buy the "why." | Can the narrative be copied, or is it inseparable from the founder/history? | Mission-driven brands, heritage luxury, artisan producers |
| **Coordination Equilibrium** | The brand functions as a Schelling point — a shared agreement about what counts as legitimate, authoritative, or canonical in a domain. | Could a competitor establish an alternative equilibrium? | Industry standards, canonical references, cultural institutions |

**2.2 The Measurability Test**

For each value source, apply Catalini's measurability test:

- Can the attribute that drives willingness-to-pay be quantified and optimized by an agent?
- If yes → the advantage is in the measurable domain and will be competed away as cA → 0
- If no → the advantage is in the non-measurable domain and may be durable

Example: A brand that charges a premium for "the best quality" is measurable — agents can
test and compare quality. A brand that charges a premium for "what this says about who I am"
is non-measurable — agents can't optimize for social meaning.

### Step 3: Classical Brand/Status Moat Assessment

Score each dimension 1–5 (1 = weak, 5 = very strong):

**3.1 Pricing Power**
- What is the price premium over functional substitutes?
- Has the company been able to raise prices consistently above inflation?
- Do customers absorb price increases without volume loss?
- Is the pricing power growing, stable, or eroding?
- Is the premium driven by functional performance (vulnerable) or non-functional attributes
  (potentially durable)?

**3.2 Brand Recognition and Trust**
- How widely is the brand recognized in its target market?
- Is the brand associated with specific attributes that competitors can't claim?
- How long has the brand been established? (Heritage/longevity creates path-dependence)
- Is trust institutional (attached to the brand) or personal (attached to individuals)?

**3.3 Status and Positional Value**
- Does the product confer status on the user/owner?
- Is the status value dependent on scarcity? (If supply scales, does status collapse?)
- Is the status signal legible to the relevant audience? (Insiders vs. mass market)
- Is the status hierarchy stable or shifting? (Fashion cycles disrupt, institutional
  prestige persists)

**3.4 Community and Belonging**
- Has the brand built a community with shared identity, norms, and social bonds?
- Do community members identify with the brand as part of their self-concept?
- Are there network effects within the community (more members = more value)?
- Is the community self-policing (organic norm enforcement) or company-managed (fragile)?

**3.5 Narrative Durability**
- Is the brand narrative inseparable from its origin story, founder, or history?
- Could a competitor tell the same story credibly?
- Is the narrative internally consistent and reinforced by the product experience?
- Does the narrative have cultural resonance beyond the immediate customer base?

**Classical Brand/Status Moat Score** = average of 3.1–3.5

### Step 4: Agentic Economy Impact Analysis

The agentic economy creates both threats and opportunities for non-measurable moats.
Analyze both sides.

**4.1 The Abundance Shock: Functional Value Collapses to Zero**

As cA → 0 for measurable execution, the functional component of the product becomes
a commodity. This is the "photography moment" — when cameras automated realistic
representation, painters didn't disappear; they pivoted to Impressionism. Value migrated
from functional execution to interpretation and meaning.

For this company:
- What % of the current price premium is functional (measurable performance, reliability)?
- What % is non-functional (status, meaning, belonging, provenance)?
- As functional equivalents become abundant and cheap, does the non-functional premium
  grow (scarcity of meaning in a world of abundant execution) or collapse (the premium
  was actually functional all along)?

**4.2 The Provenance Premium**

When execution is cheap, markets face adverse selection. Any credible signal of provenance
(human origin, specific creator, verified process) commands a premium because it creates
scarcity that agents cannot inflate.

For this company:
- Does the brand carry a provenance signal? ("Made by X," "approved by Y," "from Z")
- Is the provenance verifiable or merely claimed?
- Could agents produce counterfeit provenance claims that dilute the signal?
- Is the company investing in verification/authentication infrastructure to protect
  the provenance signal?

**4.3 The Synthetic Dilution Risk**

Agents can flood the market with cheap functional substitutes that mimic the surface
attributes of premium brands. If the brand's premium is anchored in measurable proxies
(marketing language, aesthetic style, superficial claims), agents will optimize against
those proxies.

For this company:
- Could agents produce outputs that are functionally indistinguishable from the brand's
  product at a fraction of the cost?
- Would synthetic alternatives pass a blind test? (If yes, the premium is partly
  informational and vulnerable)
- Is the brand's distinctiveness in the product itself (replicable) or in what the product
  signifies (harder to replicate)?

**4.4 Agent-Mediated Consumption**

As consumption is increasingly delegated to software agents (shopping agents, recommendation
agents, procurement agents), the basis of competition shifts:

- Agents optimize on measurable attributes (price, specs, reviews, delivery time)
- Agents don't respond to status signaling, emotional branding, or narrative
- Agents pay a premium for verified data quality, not for brand stories

For this company:
- What % of purchasing decisions in this category will be agent-mediated vs. human-mediated?
- If an agent is choosing, does the brand premium survive?
- Is the brand's value in human-facing contexts (where status and meaning matter) or in
  functional procurement contexts (where agents will optimize on metrics)?
- Does the company need to develop a "data layer" strategy for agent-mediated discovery
  alongside its human-facing brand strategy?

### Step 5: Coordination Equilibrium Assessment

Catalini identifies coordination equilibria as the most defensible moat type. This section
assesses whether the company's brand functions as a coordination device.

**5.1 Is the Brand a Schelling Point?**

A Schelling point (focal point) is a solution people converge on in the absence of
communication, because it is prominent, natural, or historically established. A brand
functions as a Schelling point when it becomes the default answer to "what should I buy/
use/trust in this category?"

- Is this brand the default reference in its category?
- If you asked 100 people "name a [category]," would this brand dominate?
- Is the default status earned through sustained quality, or is it habitual/historical?
- How much effort would it take to shift the default to a competitor?

**5.2 Path Dependence**

Coordination equilibria are defensible because they are path-dependent — the history of
how the equilibrium was established cannot be replicated.

- How long has the brand held its position?
- What historical events, decisions, or accidents created the current equilibrium?
- Could a new entrant replicate the visible state (products, pricing, positioning) without
  replicating the history?
- Is there institutional infrastructure built around this brand as the standard
  (regulations, contracts, partnerships, certifications)?

**5.3 Common Knowledge**

A coordination equilibrium requires "common knowledge" — not just that people know the
brand, but that everyone knows that everyone else knows. This creates self-reinforcing
expectations.

- Does the brand's value depend on everyone knowing that others value it?
- Would the brand lose its premium if it lost its "everyone knows" status?
- Is the common knowledge maintained by organic cultural transmission or by advertising spend?
  (Organic is durable; advertising-dependent is fragile)

**5.4 The "Fork Test"**

Catalini's most powerful test for coordination equilibria: Can the brand be forked?

If a competitor copied every visible attribute of the brand — name, aesthetics, product
quality, price point — could they establish an equivalent position?

- If yes → the moat is in measurable attributes, not in the equilibrium. Vulnerable.
- If no → the moat is in the social contract. The history, legitimacy, and shared belief
  cannot be copied. This is the deepest form of defensibility.

Bitcoin is the canonical example: the code is open-source and freely forkable, but the
social consensus that this specific ledger holds value is a Schelling point that no
fork has been able to replicate.

### Step 6: Agentic Vulnerability Scoring

Score each dimension 1–5 (1 = minimal vulnerability, 5 = critical exposure):

**6.1 Functional Replication Risk**
- Could agents produce a functionally equivalent product at near-zero cost?
- If yes, does the non-functional premium hold, or does it collapse?
- What % of the brand premium is explained by measurable functional superiority?

**6.2 Synthetic Dilution / Goodhart Risk**
- Could agents optimize against the brand's surface-level signals (aesthetics, language,
  style) to produce convincing counterfeits?
- Is the brand vulnerable to Goodhart's Law — where the proxies that signal quality can
  be gamed by agents?
- Does the brand rely on costly-to-fake signals or cheap-to-fake signals?

**6.3 Agent-Mediated Demand Erosion**
- What % of purchasing in this category will shift to agent-mediated?
- Does the brand premium survive when the buyer is an algorithm, not a human?
- Is the company adapting its strategy for agent-mediated discovery?

**6.4 Community / Narrative Fragility**
- Could the community be replicated or fragmented by competing platforms?
- Is the narrative vulnerable to cultural shifts, founder controversies, or changing values?
- Is the community organically maintained or artificially sustained through spending?

**6.5 Provenance and Verification Infrastructure**
- Does the company have systems to verify and authenticate its products/outputs?
- Could cryptographic provenance protect the brand signal from synthetic dilution?
- Is the company investing in proof-of-origin, proof-of-process, or proof-of-personhood?

Score 6.5 inversely: 1 = strong provenance infrastructure protecting the brand signal,
5 = no verification infrastructure, brand signal easily counterfeited.

**Composite Agentic Vulnerability Score** = average of 6.1–6.5

Interpretation:
- 1.0–1.5: Low vulnerability — brand is a true coordination equilibrium with verified provenance
- 1.5–2.5: Moderate — strong non-measurable position but some functional exposure
- 2.5–3.5: High — brand premium is partly functional and faces synthetic dilution
- 3.5–5.0: Critical — brand premium is primarily functional/informational and agents will erode it

### Step 7: Non-Measurable Moat Durability Tier Placement

| Tier | Moat Source | Durability | Examples |
|---|---|---|---|
| 1 (Most Fragile) | Informational trust (quality assurance) | Agents + verified reviews substitute. The brand reduces uncertainty, but better information eliminates the need. | Mid-tier consumer brands competing on reliability claims, B2B vendors whose value is "safe choice" |
| 2 | Functional premium (best performance) | As cA → 0, functional superiority is replicable. Premium compresses toward marginal cost of compute. | Premium tech products, "best in class" tools, performance-differentiated brands |
| 3 | Aesthetic / design premium | Distinctive design creates preference, but agents can generate infinite variations. Premium holds for originals but dilutes across copies. | Design-led consumer brands, fashion with codifiable aesthetics |
| 4 | Status signaling (Veblen goods) | Status signals require scarcity. If supply can't be inflated, the signal holds. If it can be counterfeited, it collapses. Depends on verification infrastructure. | Luxury goods, exclusive memberships, limited editions |
| 5 | Community identity and belonging | Path-dependent communities with organic norms and self-policing. Agents can mimic surface behavior but can't earn legitimacy. | Cult brands, enthusiast communities, membership-gated networks |
| 6 (Most Defensible) | Coordination equilibrium / Schelling point | The brand IS the focal point. Cannot be forked because the social contract is unforkable. History, legitimacy, and common knowledge create irreplaceable position. | Canonical references (Bloomberg, Michelin), cultural institutions, standards bodies, Bitcoin |

### Step 8: Market Pricing Gap Analysis

**8.1 What the market prices as the brand moat:**
How does the sell-side describe the brand advantage? Is it "brand recognition," "pricing
power," "customer loyalty," or something more specific? Which tier does the consensus
thesis map to?

**8.2 What the framework says:**
Based on Steps 4–7, is the brand premium anchored in measurable attributes (vulnerable)
or in a non-measurable coordination equilibrium (durable)?

**8.3 The abundance paradox:**
In a world of abundant, cheap execution, does the brand's non-measurable premium grow
or shrink? For some brands, the collapse of functional competition actually increases the
premium on meaning, provenance, and human origin. For others, abundant alternatives
expose the brand premium as informational rather than positional.

**8.4 The agent-mediated consumption shift:**
How much of the category's demand will be agent-mediated? The brand premium in a
human-chosen market and an agent-chosen market can be radically different. A brand that
commands a 40% premium when humans choose may command zero premium when agents optimize.

**8.5 The provenance investment:**
Is the company investing in verification infrastructure to protect its brand signal?
Cryptographic provenance, proof-of-origin, authentication technology? Companies that
wrap their non-measurable moat in costly verification are protecting the equilibrium.
Companies that rely on marketing spend to maintain the signal are exposed to synthetic dilution.

**8.6 Consensus risk vs. actual risk:**
The sell-side typically frames brand risk as "competition" or "changing consumer preferences."
Catalini's framework says the risks are more structural:
- Functional premium collapsing as agents produce equivalent outputs at near-zero cost
- Synthetic dilution flooding the market with convincing counterfeits
- Agent-mediated purchasing eliminating the human context where brand premiums are earned
- Failure to invest in provenance infrastructure leaving the brand signal unprotected

**8.7 Gap classification:**
- Overpriced brand: Market prices a functional premium as if it's a coordination equilibrium
- Fairly priced: Market correctly identifies the source of brand durability
- Underappreciated equilibrium: Company is a true Schelling point but valued as a "brand"
- Abundance upside: The non-measurable premium grows as functional execution commoditizes;
  market hasn't priced the scarcity premium on meaning in an age of abundance

**8.8 Investment implication and monitoring**

### Step 9: Monitoring Framework

**9.1 Quantitative Signals**
- Gross margin trend (pricing power health)
- Price premium vs. functional alternatives (widening = healthy, compressing = eroding)
- Customer acquisition cost trend (if rising: brand pull is weakening)
- Repeat purchase / retention rates (loyalty health)
- Revenue from agent-mediated channels vs. human channels (mix shift)

**9.2 Leading Indicators of Non-Measurable Moat Erosion**
- Functional parity achieved by low-cost competitors or AI-generated alternatives
- Synthetic counterfeits gaining market share (especially in digital goods)
- Shift in purchasing to agent-mediated channels where brand premium disappears
- Community engagement declining (fewer organic interactions, more marketing-driven)
- Narrative fatigue or controversy undermining the brand story
- Brand relying increasingly on advertising spend rather than organic pull

**9.3 Leading Indicators of Non-Measurable Moat Strengthening**
- Company investing in provenance and authentication infrastructure
- Price premium widening as functional alternatives commoditize (the abundance premium)
- Community growing organically with strong self-policing and norm enforcement
- Brand establishing or reinforcing its position as a coordination standard
- "Human origin" or "artisan" premium commanding increasing willingness-to-pay
- Brand becoming the reference point for agent-mediated quality verification

**9.4 Thesis Kill Conditions**
- AI-generated alternatives achieve blind-test parity and gain >10% market share
- Agent-mediated purchasing exceeds 30% of category and brand premium compresses
- Core community fragments or migrates to competing platform
- Brand fails to invest in provenance; synthetic counterfeits dilute the signal
- Price premium compresses for 4+ consecutive quarters without volume offset

---

## Output Format

Produce a Word document (.docx) with the following structure:

1. **Executive Summary Table** — Company, tier, scores, primary moat source, market gap
2. **Business Model and Value Proposition Overview** — Step 1
3. **Non-Measurable Moat Classification** — Step 2, the measurability test
4. **Classical Brand/Status Moat Assessment** — Step 3, five dimensions scored
5. **Agentic Economy Impact Analysis** — Step 4, abundance shock, provenance premium,
   synthetic dilution, agent-mediated consumption
6. **Coordination Equilibrium Assessment** — Step 5, the Schelling point and fork test
7. **Agentic Vulnerability Assessment** — Step 6, five dimensions scored
8. **Non-Measurable Moat Durability Tier** — Step 7, with spectrum and justification
9. **Composite Scorecard** — Classical + agentic scores, combined matrix
10. **Market Pricing Gap Analysis** — Step 8, the investment insight
11. **Monitoring Framework** — Step 9, signals and kill conditions
12. **Appendix: Key Framework Definitions**

### Formatting and Tone

- Same formatting as sibling skills (navy/blue color scheme, US Letter, docx skill mechanics)
- The Coordination Equilibrium Assessment (Step 5) and the Fork Test should be visually
  prominent — these are the most distinctive analytical elements
- Direct, specific, investment-focused
- Be careful to distinguish between "brand" (a marketing concept) and "coordination
  equilibrium" (an economic structure). Many brands are not coordination equilibria.
  Only brands that function as Schelling points qualify for Tier 6 defensibility.
- Avoid the trap of treating all luxury/premium brands as equally defensible. A luxury
  brand whose premium is functional (best materials, best craftsmanship) faces different
  risks than one whose premium is positional (the signal of owning it).


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

**Classical Brand/Status Moat Score (1–5)**
Average of: Pricing power, brand recognition/trust, status/positional value,
community/belonging, narrative durability.

**Agentic Vulnerability Score (1–5)**
Average of: Functional replication, synthetic dilution, agent-mediated erosion,
community/narrative fragility, provenance infrastructure (inverted). Lower = more defensible.

**Combined Assessment Matrix:**

| | Low Agentic Vulnerability (1–2) | High Agentic Vulnerability (3–5) |
|---|---|---|
| **Strong Classical Brand Moat (4–5)** | Fortress: True coordination equilibrium. Brand is a Schelling point with verified provenance. Scarcity premium grows with abundance. Highest conviction. | Contested: Strong brand today but premium is partly functional. Synthetic dilution risk. Assess provenance investment carefully. |
| **Weak Classical Brand Moat (1–3)** | Niche: Modest brand but anchored in a coordination equilibrium. May be undervalued if market sees it as "just a brand." | Vulnerable: Weak brand with functional premium. Agent-generated alternatives will compress pricing. Avoid or reassess thesis. |

---

## Common Pitfalls

- **Don't conflate brand recognition with brand moat.** Everyone recognizes McDonald's.
  That doesn't mean it has a non-measurable moat — most of McDonald's value is in
  supply chain efficiency, real estate, and franchise economics (all measurable).

- **Don't assume luxury = defensible.** A luxury brand whose premium is "best materials
  and craftsmanship" faces functional replication risk. A luxury brand whose premium is
  "the social signal of ownership" faces counterfeiting risk. Only brands whose premium
  is "membership in this specific community/equilibrium" have Tier 5–6 defensibility.

- **Don't ignore agent-mediated consumption.** This is the most underappreciated risk
  for brand-driven businesses. When purchasing shifts from "human opens app and sees
  the brand" to "agent optimizes on specs and price," the brand premium can evaporate
  overnight.

- **Don't treat provenance as automatic.** Just claiming "human-made" or "authentic" isn't
  defensible if agents can generate convincing counterfeits. The brand must invest in
  costly-to-fake verification (cryptographic authentication, chain of custody, proof of
  origin) to protect the signal.

- **Don't miss the abundance upside.** For genuinely non-measurable brands — those whose
  value is in meaning, community, and coordination — the agentic economy is a tailwind.
  As functional goods become abundant and cheap, the scarcity premium on meaning and
  human connection increases. The market often misses this.

- **Apply the photography test.** When photography automated realistic representation,
  painting didn't die — it pivoted to Impressionism. Ask: when AI automates the functional
  layer of this category, does the company pivot to the "Impressionist" premium, or does
  it have no non-functional layer to retreat to?

---

## Interaction with Other Moat Skills

This skill analyzes non-measurable moats specifically. Non-measurable advantages often
interact with:

- **Network effects:** Community-based brands exhibit network effects (more members = more
  value). Evaluate the network dynamics with `network-moat-skill`; evaluate the brand/status
  dynamics here.
- **Ground truth / data:** Some brands monetize verified ground truth (Bloomberg as the
  canonical financial data reference). Evaluate the data asset with `ground-truth-skill`;
  evaluate the Schelling point positioning here.
- **Talent:** Brands built around a specific creator or founder face talent portability risk.
  Evaluate with `talent-moat-skill` if the brand is inseparable from an individual.

Flag where other moat types are present but defer scoring to the specialized skill.
