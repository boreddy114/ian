# IC Presentation: Competitive Moats in the AI Era — Handoff README

**For:** Ian (APM / Equity Research Analyst, Janus Henderson)
**Audience:** Janus Henderson IC — PMs and analysts
**Length:** 30 minutes
**Status as of this handoff:** Deck v1 built and shipped (13 slides). Slide 1 is a placeholder for Ian to fill. New chat needed to continue (this chat hit upload limit).

---

## WHAT WE'RE TRYING TO ACHIEVE

A 30-minute IC talk arguing that the market is repricing competitive moats in the AI era — and that the standard moat framework (Mauboussin / Porter / Shapiro-Varian) is necessary but no longer sufficient. Catalini's recent MIT paper bifurcates classical moats into agentic-vulnerable vs. agentic-durable categories, and the talk uses ICE as a worked example because one company contains both sides of that bifurcation.

**The core argument arc:**
1. The market has been repricing software multiples even as EPS held — that's a CAP / fade-rate story, not an EPS story (cold open).
2. Mauboussin's empirical work on fade rates gives us the analytical vocabulary.
3. Three classical moat sources (network effects, system of record, data/ground truth) need to be reexamined.
4. We walk **network effects** end-to-end as the worked framework — Catalini splits them into three types, only two of which are durable.
5. Apply to ICE: five businesses, three durable, two vulnerable — the diagnostic transfers to any name in coverage.
6. The closer: "the framework tells you when the market is worried about the wrong moat."

**Audience feedback that shaped the design:**
Prior versions of this material were too jargon-heavy. The decision rule for this deck: business-friendly language as the primary label, with the Catalini technical term in parentheses. Example: "Buyable thickness *(execution-grade network effects)*."

---

## FINAL DECK STRUCTURE (13 slides)

| # | Title | Notes |
|---|-------|-------|
| 1 | Adobe: fundamentals held. The market changed its mind. | **PLACEHOLDER** — Ian is building. Ian has a chart format using return decomposition: stock price in white, earnings in blue, multiple in red — shows multiple collapsing while earnings rise. Decision: **use Adobe, not ICE** (ICE is the worked example later in the deck; using it on slide 1 collapses the structure). |
| 2 | When the market changes its mind about how long a moat lasts, the multiple moves. | CAP / fade-rate framing. Inverted-U on left, Mauboussin Exhibit 11 fade-rate table on right (IT/software at 0.20 bolded), mechanical-link callout at bottom. **No PVGO.** We explicitly rejected PVGO because aggregate S&P PVGO is currently HIGH (~50%) — the talk argues software is being repriced DOWN; the PVGO frame would muddy that. Fade-rate frame is internally consistent. |
| 3 | Three moats to rethink — and three references to anchor us. | Three columns: Network Effects / System of Record / Data. Each column has a pre-AI title card (Shapiro-Varian or Mauboussin) and a post-AI title card (Catalini). Title cards are stylized — Ian will look for real book/paper covers. |
| 4 | Network effects (pre-AI): demand-side scale, lock-in, winner-take-most. | Four canonical ideas on left, positive-feedback chart (Winner vs Loser) on right. Mauboussin 2004 reference. |
| 5 | Catalini's reframe: networks aren't one thing. There are three types. | Three side-by-side cards: Buyable Thickness (VULNERABLE/yellow), Trusted Adjudication (DURABLE/green), Shared Belief (DURABLE/green). |
| 6 | Type 1: "Buyable thickness" — when scale is the moat, AI agents are the threat. | Deep dive on the vulnerable category. Three attack vectors (synthetic supply, portable inventory, meta-aggregator demand). Archetype callout: traditional SaaS / marketplaces. |
| 7 | Types 2 & 3: When the network's value isn't in its size, it survives the agents. | Side-by-side deep dive on the two durable categories. CDS clearinghouses, ratings, NYSE listings, Brent, Bitcoin, MSCI. |
| 8 | Worked example: ICE — five businesses, five moats (pre-AI view). | Five-branch tree, all navy (uncolored). Right column: revenue % and evidence for each business. |
| 9 | Same company, post-Catalini: three durable, two vulnerable. | Same tree, branches now colored green/yellow. Catalini contribution callout. Bottom navy bar: "one company contains both sides of the framework." |
| 10 | The diagnostic questions — usable on any name in your coverage. | Five diagnostic questions in a table (transferable to any company). |
| 11 | The result: ICE's branches sit on opposite ends of the Catalini spectrum. | Same tree + vuln%/durable% bubbles + tier placements with pressure-tested evidence: Energy Benchmarks (5/95, Tier 6 Shared Belief), NYSE Listings (10/90, Tier 6), CDS Clearing (15/85, Tier 5 Trusted Adjudication), Mortgage SoR (55/45, Tier 3 Buyable Thickness), Prediction Markets (70/30, Tier 1-2). |
| 12 | What changes Monday morning. | Three takeaways: (1) run the three-type test on every network moat; (2) use the concerns-map prompt; (3) ask management a different set of questions. |
| 13 | The closer. | Dark navy slide. "The framework doesn't just score moats. It tells you when the market is worried about the wrong one." ICE proof point: consensus worries about FIDS evaluated pricing commoditization (durable); actual erosion is in mortgage wrapper-agent disintermediation and prediction-market B2C bypass (vulnerable). |

---

## KEY DESIGN DECISIONS — STRUCTURE

- **Language rule:** Business term as the primary label, Catalini technical term parenthetically. e.g. "Buyable thickness *(execution-grade network effects)*."
- **Worked example is ICE on network effects.** ICE contains both Cat A (vulnerable) AND Cat B (durable) networks — pedagogically powerful because one company shows both sides.
- **Cold open is Adobe.** Per Ian's chart format (stock returns decomposed into earnings × multiple), Adobe is the textbook case where the multiple did all the work. Save ICE for slides 8-11; revealing it on slide 1 collapses the talk's structure.
- **Slide 2 framing:** CAP definition + Mauboussin fade-rate table (Exhibit 11) + the mechanical link from fade → terminal value → multiple. NOT PVGO (aggregate S&P PVGO is up, which contradicts the software-repricing thesis if used at this level of abstraction).
- **Three category slides** for the Catalini reframe (slides 5, 6, 7), not one dense slide. The bifurcation IS the conceptual punch.
- **Concerns map** is a takeaway artifact (slide 12), NOT a cold open. Stays in service of the framework.

---

## KEY DESIGN DECISIONS — VISUAL

Match the existing Catalini Teaching Deck visual language exactly:

- **Layout:** `LAYOUT_WIDE` (13.3" × 7.5")
- **Palette:**
  - NAVY `1E2761` (primary)
  - NAVY_DARK `152049`
  - ORANGE `D67D2E` (accent — square in title block)
  - GREEN `9CBF7A` (durable badges, durable branches)
  - YELLOW `F2C94C` (vulnerable badges, vulnerable branches)
  - BG_PANEL `F4F4F2` (light panel backgrounds)
- **Font:** Calibri throughout (title 22pt bold, subtitle 12pt italic muted, body 10-11pt)
- **Title block:** Orange square accent + navy title + muted italic subtitle (single-line titles only; 22pt fits cleanly)
- **Footer:** "For internal use only." (left, italic muted) + "Janus Henderson INVESTORS" (right, with INVESTORS bold) + page number (far right)
- **Branch text on navy fills:** WHITE. Branch text on green/yellow fills: NAVY_DARK. Critical detail — earlier version had navy-on-navy invisible labels.

---

## REFERENCES (papers and books used in the talk)

### Mauboussin (primary references)

**"Competitive Advantage Period: The Neglected Value Driver"** — Michael J. Mauboussin & Dan Callahan, Consilient Observer, Morgan Stanley Counterpoint Global, **April 14, 2026**.
- Source of the CAP framing on slide 2.
- Key citations to remember:
  - "Competitive Advantage Period (CAP) = amount of time a company can earn returns above the cost of capital."
  - Exhibit 11: empirical fade rates by sector. Average 0.21. Range 0.10 (Consumer Staples) to 0.30 (Utilities). **IT / Software = 0.20.**
  - "Going from a 3 to a 5 percent growth rate doubles the terminal value."
  - Terminal value is typically 70%+ of corporate value in DCFs with 10-year explicit horizons.
  - Most companies in growth or maturity stage will have market-implied CAP in the 5-20 year range.

**"Exploring Network Economics"** — Michael J. Mauboussin, 2004 (Mauboussin's canonical piece on network effects pre-AI).
- Source for slide 4 (Network effects pre-AI canonical view).
- Four ideas pulled: demand-side scale, winner-take-most (Arthur's Law), lock-in & switching costs, critical mass / tipping.

**"Measuring the Moat"** — Mauboussin & Callahan, latest version October 15, 2024.
- General moat framework reference; cited as the canonical "score the moat" piece in slide 3.

### Catalini (the agentic vulnerability framework)

**"Some Simple Economics of AGI"** — Christian Catalini, Hui, Wu, MIT, **February 2026**.
- Source of the three-type network bifurcation (slides 5, 6, 7).
- Key concepts to remember:
  - Execution-grade vs. verification-grade networks
  - Coordination equilibria as a third category (path-dependent legitimacy)
  - "Trust gets cheaper as the platform's library of prior outcomes grows" (verification-grade flywheel)
  - K_IP framework (bifurcation of intellectual property knowledge)
  - The measurability gap and verification premium

### Shapiro & Varian

**"Information Rules: A Strategic Guide to the Network Economy"** — Carl Shapiro & Hal R. Varian, Harvard Business School Press, **1999**.
- Cited on slide 3 as the canonical pre-AI reference for network effects and switching costs (alongside Mauboussin 2004).

### Ian's own prior work (referenced as inputs)

- **Catalini_Moat_Screen_ICE_Final.docx** — completed full moat screen on ICE. Tier placements and percentages flow from this document.
- **Catalini_Teaching_Deck_ICE-2.pptx** — the earlier 4-slide ICE teaching deck. Visual reference for the new deck's design language. Slides 8-11 of the new deck adapt content from this.
- **ICE_Concerns_Map_May2026.docx** — most recent concerns map on ICE. Source of the punchline on slide 13 (consensus worries about FIDS pricing; actual erosion is in mortgage wrapper-agent + B2C).
- **Catalini_Moat_Screen_ICE_Final.docx** quote driving slide 13: "the market is pricing the wrong AI risk: consensus concern focuses on FIDS evaluated pricing commoditization, where structural defenses are robust, while actual moat erosion is concentrated in mortgage wrapper-agent disintermediation and prediction-market B2C bypass."

---

## ICE WORKED EXAMPLE — REVENUE / TIER MAP

| Business | % Rev | Tier | Vuln% / Dur% | Category |
|----------|-------|------|--------------|----------|
| Energy Benchmarks (Brent / TTF / JKM) | ~30% | Tier 6 — Shared Belief | 5 / 95 | DURABLE (green) |
| NYSE Listings | ~10% | Tier 6 — Shared Belief | 10 / 90 | DURABLE (green) |
| CDS Clearing + Other Clearing | ~15% | Tier 5 — Trusted Adjudication | 15 / 85 | DURABLE (green) |
| Mortgage SoR (Encompass + MSP) | ~21% | Tier 3 — Buyable Thickness | 55 / 45 | VULNERABLE (yellow) |
| Prediction Markets + Frontier B2C | <2% | Tier 1-2 — Buyable Thickness | 70 / 30 | VULNERABLE (yellow) |

**Key proof points** (pressure-tested):
- PennyMac → Vesta migration is the first top-tier proof point for mortgage SoR disintermediation.
- Bakkt failed; Bitcoin futures fell flat — ICE structurally disadvantaged in B2C. Coinbase owns FCM+DCM; Robinhood building DCM/DCO.
- $2B Polymarket investment is *defensive* — partnership in lieu of competing.
- Brent and TTF are essentially impossible to displace (15+ years of competitor failures, including CME).
- ICE Clear Credit is FSOC-designated systemically important; $81.2B in margin & guaranty funds.
- ICE Aurora embeds AI INSIDE the regulated SoR rather than letting AI disintermediate it.

---

## WHAT HAS BEEN BUILT

- **Final deliverable:** `Competitive_Moats_AI_Era.pptx` — 13 slides, ~512KB, shipped to /mnt/user-data/outputs/ in the prior chat.
- All slides except slide 1 (Adobe placeholder) are complete.
- Visual style fully matches the existing Catalini_Teaching_Deck_ICE-2.pptx.
- Build script: pptxgenjs-based Node.js script.
- All visual issues from QA cycle fixed: title wrap/overlap, missing branch labels, page number wrap (10/11/12/13), chart series labels, content overflow.

---

## OPEN ITEMS FOR NEW CHAT

1. **Slide 1 (Adobe).** Ian is building. Chart format: return decomposition with stock price in white, earnings in blue, multiple in red. Decision already made: use Adobe, not ICE. Adobe is the cleaner phenomenon (the multiple did all the work; EPS held), and ICE needs to remain unrevealed until slide 8.

2. **Slide 2 CAP curve.** Currently rendered via a smoothed line chart with axes hidden. If Ian wants Mauboussin's actual Exhibit 1 image inserted instead, that slot is swappable.

3. **Slide 3 book/paper covers.** Currently stylized title cards (navy/orange boxes with the publication title in white). When Ian sources real cover images, the slots are 1.0" × 1.4" each.

4. **Slide 12 references "concerns-map prompt shared in the appendix"** — but the deck has no appendix slide. Decision needed: add appendix with the actual prompt text, OR change wording to "circulated separately."

5. **Slide 12 point 3 references "a v1 list of management questions"** that hasn't been built yet. Decision needed: commit on the slide, or soften the framing.

---

## USER PREFERENCES TO CARRY OVER

- Research before answering; flag uncertainty using discrete labels (high/moderate/low/unknown).
- Investment-grade rigor on everything.
- No validation/praise preambles. No "great question," no "you're absolutely right."
- Lead with the strongest counterargument when Ian holds a position; steelman the other side first.
- Don't anchor on Ian's numbers — generate independently then compare.
- Don't capitulate without new evidence or a superior argument.
- Disclaimers are fine when load-bearing (source quality, sample size, framework limits). Skip reflexive boilerplate.

---

## DESIGN TOKENS — for rebuilding the deck if needed

```javascript
// Layout
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

// Colors
const NAVY = "1E2761";
const NAVY_DARK = "152049";
const ORANGE = "D67D2E";
const GREEN = "9CBF7A";      // durable
const YELLOW = "F2C94C";     // vulnerable
const GREY_LINE = "B8B8B8";
const TEXT_DARK = "2C2C2C";
const TEXT_MUTED = "5A5A5A";
const BG_PANEL = "F4F4F2";
const BG_WHITE = "FFFFFF";

// Fonts
const FONT_TITLE = "Calibri";
const FONT_BODY = "Calibri";

// Sizes
// Title: 22pt bold (fits on one line at this width — keep titles short)
// Subtitle: 12pt italic muted
// Body: 10-11pt
// Section labels (uppercase, charSpacing 2-3): 9-10pt bold ORANGE
```

---

End of handoff. Carry this into the new chat and we can pick up from any of the open items.
