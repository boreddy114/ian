---
title: "Operational vs. Evidentiary Data — The Chegg / Verisk Contrast"
type: framework-note
framework: Catalini Moat Screen
topic: K_IP bifurcation, data moat durability
companies: [CHGG, VRSK]
tickers: [CHGG, VRSK]
status: ACTIVE
audience: internal framework documentation; teaching companion to Catalini Moat Screen
voice: Janus Henderson internal research
created: 2026-05-12
author: Ian (with Claude)
related:
  - Catalini_Moat_Screen_VRSK_Final.docx
  - Catalini_Teaching_Deck_VRSK.pptx
keywords:
  - operational data
  - evidentiary data
  - audit-grade data
  - execution-grade vs verification-grade
  - K_IP bifurcation
  - data moat
  - AI disruption
  - Chegg
  - Verisk
  - ChatGPT
---

# Operational vs. Evidentiary Data

## The Chegg / Verisk Contrast

### Framework purpose

The Catalini Moat Screen splits a company's data assets into two classes: data that helps a system *do* something (Category A — execution-grade, or **operational**) versus data that helps a system *prove* something (Category B — verification-grade, or **evidentiary**). The first kind is commoditized by frontier AI. The second kind is structurally durable because its value derives from institutional standing rather than from translation work.

This note pairs the canonical positive case (VRSK — the moat that survived because the data was evidentiary) against the canonical negative case (CHGG — the moat that did not survive because the data was operational). Both companies could have been described pre-2023 as "we own proprietary data nobody else has." Both had subscription revenue, real retention, and a real flywheel by the pre-AI definition. The difference was what the data did, and that single distinction determined which equity compounded and which collapsed.

---

## Part I — Chegg pre-2023: A real data moat by the pre-AI definition

Chegg's pre-AI franchise was not a fake moat exposed by ChatGPT. It was a real moat made of the wrong kind of data. The distinction matters because the lesson is not "be skeptical of data-moat claims." The lesson is "ask which work the data does, because pre-AI economics rewarded both kinds and post-AI economics rewards only one."

**The asset.** Chegg had accumulated, over roughly a decade, a proprietary database of more than 100 million expert-verified, step-by-step solutions to textbook problems across more than 50 subjects, indexed by ISBN and by problem text. The solutions were produced by a contracted network of more than 150,000 subject-matter experts — predominantly India-based — who were paid per answer and whose work was reviewed for quality. The database covered the long-tail textbook universe at a level of granularity no competitor matched and that was expensive to replicate from scratch.

**The economics.** Subscription pricing was approximately $19.95 per month. Subscriber count peaked at roughly 8 million during the COVID remote-learning period. FY2021 revenue was approximately $776 million; the equity peaked at roughly $113 per share in February 2021 with a market capitalization north of $14 billion. Gross margins on the homework-help business were high; the marginal cost of serving an additional query against the existing database was near zero. The company generated free cash flow and traded at growth-equity multiples consistent with a defensible subscription business.

**The pre-AI moat narrative — and why it was directionally correct at the time.** Four reinforcing mechanisms were genuinely present:

- *Scale.* 100M+ expert-verified solutions, paired with the depth of textbook coverage, was a real barrier. A new entrant would have had to spend years and significant capital to assemble a competitive library.
- *Curation cost.* Solutions were not scraped — they were paid for, reviewed, tagged, and structured. The cost of producing each marginal answer was real, and aggregate accumulated cost was a moat in the Buffett "what would it cost a competitor to replicate" sense.
- *Network mechanics.* More student queries surfaced gaps in the library, which directed expert production toward filling those gaps, which improved the library, which attracted more students. A genuine contributory flywheel.
- *Workflow embedding.* By the late 2010s, Chegg was the default homework-help platform across U.S. undergraduate STEM. The brand was the noun.

By any pre-AI test — Mauboussin's data flywheel framework, Porter's barriers to entry, Greenwald's reproduction-cost analysis — Chegg had a data moat. The thesis was not crazy. The diligence was not lazy. The mistake was structural and only visible in retrospect, once the framework for bifurcating data became necessary.

---

## Part II — What actually broke

ChatGPT launched November 30, 2022. On May 2, 2023, on the Q1 2023 earnings call, then-CEO Dan Rosensweig disclosed that "beginning in March we have seen a significant spike in student interest in ChatGPT" and that this was affecting new-customer growth. The stock fell 48% in a single trading day — at the time the first acknowledged AI-induced revenue impairment by a publicly listed company. Analyst price targets were halved within 48 hours.

The mechanism, in Catalini terms, was the bifurcation test applied retroactively. Chegg's data did one thing: it told a student how to solve problem 4.7 in chapter 4 of a specific textbook. That is the canonical operational use case — the data is the input to a translation step that produces an action (the worked solution). The work the data was doing was *cognitive translation*: take a problem statement, produce a worked answer. Pre-2023, this translation step was expensive — it required paying a domain expert. The data's value was inseparable from the cost of producing the translation.

Frontier general-purpose models collapsed the cost of that translation step toward zero. GPT-4 could produce a comparable worked solution for the overwhelming majority of undergraduate STEM problems at marginal cost approaching zero, without ever touching Chegg's database. The database itself did not disappear — it remained proprietary, remained tagged, remained the largest single repository in the category. What disappeared was the *scarcity of the cognitive work the database had been performing*. The translation step that justified the $19.95 monthly subscription was now free.

Two design choices made by Chegg in response compounded the damage rather than arresting it.

*CheggMate, the OpenAI-partnered AI product launched in April 2023, embedded GPT-4 inside a paid Chegg wrapper.* The economic problem was definitional: a student paying $19.95/month for ChatGPT-with-Chegg-branding had no reason not to use ChatGPT directly at $20 or free tier. CheggMate failed to retain subscribers. Subsequent management commentary acknowledged that the AI strategy never closed the gap.

*Google AI Overviews, which began rolling out across Google search in 2024 and accelerated through 2025, structurally eliminated the second leg of Chegg's traffic acquisition.* Pre-2023, students searched for homework questions in Google, clicked through to Chegg's solution pages (often gated, driving conversion), and the funnel worked. AI Overviews displayed the worked solution directly in the search results page. Q3 2025 traffic from non-subscribers was reported down approximately 37% year-on-year. The marketing funnel was severed at the discovery layer.

By Q1 2025: subscriber base 3.2 million, down 31% year-on-year from peak ~8M. Revenue $121 million, down 30%. By 2026: equity trading around $1.07, market capitalization under $150 million against the 2021 peak above $14 billion, board reviewing strategic alternatives, additional headcount reductions reported around 45% of remaining workforce. The destruction was approximately $14 billion of market capitalization over three years, attributable in the dominant share to a single technology shift.

The disclosure-to-collapse cycle was approximately 24 months. The thesis-to-disclosure cycle (i.e., the period during which a careful framework could have identified the operational nature of the data before the market did) was the full pre-2023 history of the company.

---

## Part III — The mechanism in framework language

The Catalini bifurcation makes the distinction clean. Restating in business-friendly vocabulary:

**Operational data** is data that exists to help a system do a thing. Its value is inseparable from the cost of the cognitive work attached to it. When that cognitive work is being done by humans or by classical software, the data is genuinely scarce and the moat is real. When that cognitive work is done by a frontier model at near-zero marginal cost, the data's value collapses to whatever residual scarcity exists in the *data itself* — which, for most operational use cases, is small because frontier models substitute well on similar substrate. Chegg's homework solutions are the canonical example.

**Evidentiary data** is data that exists to help a system prove a thing — to satisfy an auditor, a regulator, a counterparty, a court. Its value is inseparable from the institutional standing of the entity attesting to it. AI can produce a plausible-looking version of the data at near-zero cost, but it cannot manufacture the regulatory acceptance, the audit-trail continuity, the multi-party coordination, or the liability assumption that makes the data count as proof. Verisk's ISO loss costs are the canonical example.

The diagnostic question — applied to any company claiming a data moat — is single-sentence: **Does the data tell someone how to do something, or does it tell someone what to trust?** The answer determines whether frontier AI is a tailwind or a tornado.

Three corollaries follow:

*Operational data moats can have all the pre-AI signatures of durability — flywheel, scale, curation cost, retention — and still collapse, because none of those signatures test for whether the cognitive translation step survives AI commoditization.*

*Evidentiary data moats can look weaker on traditional metrics (smaller datasets, slower update cycles, less obvious "flywheel" dynamics) and still strengthen post-AI, because AI deployment by counterparties increases rather than decreases demand for trusted reference standards.*

*The bifurcation is not always 100/0. Most real companies hold a mix. The relevant question is the asset-weighted ratio and the trajectory of the mix over time.* Verisk is approximately 75% verification-grade by asset weight; Chegg was approximately 100% operational; most software-with-data companies sit somewhere between, and the screen mechanics are designed to force the analyst to specify the split.

---

## Part IV — Verisk as the structural contrast

Verisk's data assets, on the surface, share several pre-AI signatures with Chegg's: a large proprietary database, a contributory model that improves with scale, a subscription revenue model with high retention, and category-defining brand recognition. The pre-AI moat narratives for the two companies were structurally similar.

The bifurcation reveals why one survived and the other did not. Five contrasts, taken from the VRSK final screen:

| Dimension | Chegg | Verisk |
|---|---|---|
| **What the data does** | Tells a student how to solve a problem | Tells a regulator, carrier, contractor, court, or reinsurer what to accept as the standard |
| **Who consumes the output** | An individual user making a private decision | State regulators, counterparty insurers, courts, reinsurers — entities that require institutional standing behind the data |
| **Substitute test** | Can a frontier model produce a comparable answer? Yes, for >90% of undergraduate problems | Can a frontier model produce a comparable answer? Yes — but the answer is not accepted because the regulator does not accept synthetic loss costs |
| **What collapses with AI** | The cognitive translation step that justified the subscription | Nothing — AI deployment by carriers *increases* demand for Verisk as the validation benchmark |
| **Asset-weighted bifurcation** | ~100% operational | ~75% evidentiary / ~25% operational (Geomni imagery faces real AI pressure; the ISO core does not) |

The Verisk pressure test surfaced an additional finding worth noting in this context: carrier executives explicitly described Verisk data as the "validation benchmark" against which their own AI-deployed underwriting and claims models are judged. This is the framework's value-migration-to-verification dimension expressing operationally. AI does not commoditize Verisk's data; AI *creates new demand* for Verisk's data, because automated decisioning increases the need for a trusted reference against which automation can be calibrated. The same mechanism that destroyed Chegg's franchise strengthens Verisk's.

---

## Part V — Diagnostic test for any data-moat claim

The test below applies to any company pitching a data moat. The framework is binary at the diagnostic level (which kind of data?) and graduated at the scoring level (what's the asset-weighted mix?).

**Question 1 — What does the data do?**
- *Helps a user complete a task / make a decision / produce an output* → Operational. Apply convergence-erosion scoring.
- *Helps a user prove a fact / satisfy a regulator / settle a dispute / underwrite a liability* → Evidentiary. Apply institutional-standing scoring.

**Question 2 — Who consumes the output, and on what basis do they trust it?**
- *Individual user, on the basis of personal convenience* → Operational profile.
- *Institutional counterparty, on the basis of the producer's standing, charter, or liability assumption* → Evidentiary profile.

**Question 3 — What happens if a frontier model produces the same output for free?**
- *The customer accepts the free output as a substitute* → Operational moat collapses.
- *The customer cannot accept the free output because the institutional source matters more than the content* → Evidentiary moat survives.

**Question 4 — Asset-weighted bifurcation.**
- For the major data assets, specify the Operational / Evidentiary split by revenue or asset weight.
- Identify the trajectory: is the mix shifting toward evidentiary (durable) or operational (vulnerable)?
- Identify any value-migration-to-verification opportunities: as AI is deployed by counterparties, does demand for the company's data as a validation benchmark increase?

A company that scores predominantly evidentiary on Questions 1–3 and shows a stable or improving mix on Question 4 has a data moat that survives AI. A company that scores predominantly operational on Questions 1–3 has the Chegg profile, regardless of how impressive the pre-AI metrics look.

---

## Part VI — Implication for moat-screen application

The Chegg / Verisk contrast is the cleanest paired example available in the public-equity universe for teaching the operational-vs-evidentiary distinction. Both companies are recognizable, both had well-documented pre-AI moat narratives, both had subscription economics, and the divergence in outcome is dated, large, and attributable to a single mechanism. The pair is therefore the recommended introductory example for any audience encountering the Catalini Moat Screen for the first time.

Specific application guidance:

*When introducing the framework to a new audience*, lead with the pair. Chegg establishes that AI commoditizes data even when the pre-AI moat was real. Verisk establishes that the operational-vs-evidentiary distinction is the deciding variable, not the size, age, or proprietary nature of the dataset.

*When running a screen on a candidate company*, force the bifurcation question early. The question "is this an operational or evidentiary data moat?" should be answered before any classical scoring proceeds, because the answer determines which dimensions carry weight in the agentic vulnerability scale.

*When pressure-testing a screen*, the value-migration-to-verification dimension is the asymmetric prize. Companies that score evidentiary on the bifurcation AND show validation-benchmark demand from counterparty AI deployment are positioned to compound rather than merely survive. Verisk is the canonical example; identifying the next three names on this profile is high-conviction work.

*When pitching a long-substrate-transition trade*, the contrast is the rhetorical anchor. The market still prices most data-rich companies on pre-AI heuristics. The bifurcation is the lens that separates the names that will compound from the names that will trade where Chegg trades.

---

## Sources

- Chegg Q1 2023 earnings call, May 1–2, 2023 (Rosensweig disclosure)
- CNBC, Higher Ed Dive, Fortune coverage of May 2, 2023 stock decline
- Chegg Q3 2023 earnings press release, October 30, 2023 (100M+ solutions; 150,000 subject-matter experts)
- Chegg Q1 2025 financial disclosure (3.2M subscribers; $121M revenue)
- European Business Magazine, "Chegg Lost $14 Billion to ChatGPT in Three Years," late April 2026
- Constellation Research, Scale AI partnership coverage
- VRSK Catalini Moat Screen — Final (April 2026, pressure-test confirmed) — internal
- VRSK FY2025 10-K (filed February 2026, EDGAR CIK 0001442145)

---

*For internal use only. Janus Henderson Investors.*
