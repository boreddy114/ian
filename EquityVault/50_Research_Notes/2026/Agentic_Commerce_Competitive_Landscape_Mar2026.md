# Agentic Commerce: Competitive Landscape Memo
**EquityVault | March 2026**
**Coverage:** Block (XYZ), Shopify (SHOP), Stripe/PayPal (PYPL), Google (GOOGL)
**Sources:** XYZ APK teardowns (CashApp 3/14, SquarePOS 3/16), SHOP IC memos, PYPL Rickety Bridge memo, ACP/UCP/AP2 protocol analysis, Bloomberg Stripe/PayPal reporting (2/24/26)

---

## I. The Organizing Framework

Agentic commerce replaces the human as the reconciliation engine. When a user delegates a purchase to an AI agent, the agent cannot absorb ambiguity — it executes or it stops. Every inconsistency the human stack relied on consumers to forgive becomes a hard failure.

This forces a structural reorganization of where value is extracted in the commerce stack. Four control surfaces emerge:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — DISCOVERY                                        │
│  Who captures intent? Who surfaces the product?             │
│  → Google (Gemini/UCP), OpenAI (ChatGPT/ACP)               │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 — RECONCILIATION  ← the gating function           │
│  Can this order actually form? Inventory, price, tax,       │
│  fulfillment, merchant policy — deterministically valid?    │
│  → Shopify (2M+ merchants, normalized commerce state)       │
│  → Block (physical: Square POS + Cash App Local)           │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3 — CUSTODY / TRUST CHAIN                           │
│  Who holds the consumer credential? Who anchors trust?      │
│  → Stripe (merchant-side, ACP governance)                   │
│  → PayPal/Venmo (consumer-side credential, what             │
│    Stripe is trying to acquire)                             │
│  → Cash App (Block's consumer credential, 56M MAU)         │
│  → Google Pay (AP2 consumer-side)                          │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4 — RAILS / SETTLEMENT                              │
│  Who moves the money?                                        │
│  → V/MA (dominant), Stripe, stablecoin (Block's long play) │
└─────────────────────────────────────────────────────────────┘
```

**The critical insight:** The market is debating Layers 1 and 3. The durable value capture in an agentic world likely sits at Layer 2. Payments history is the governing precedent — trust/credential layers compress to commodity over time (Visa/Mastercard built rails that became regulated utilities). Reconciliation, by contrast, requires operational depth that is hard to replicate and becomes *more* valuable as transaction determinism becomes mandatory.

---

## II. The Protocol Race

Three standards are competing to govern agent-initiated transactions. None are converging. Every major player has picked a camp — or in Shopify's case, all of them.

### ACP — Agentic Commerce Protocol (OpenAI / Stripe)
**Architecture:** Agent-to-agent, autonomous execution. OpenAI governs access; Stripe is the embedded payment provider. Trust is formalized and monetized inside a governed scheme.
**Live merchants:** Etsy, Walmart, Instacart (confirmed Q1 2026)
**Limitation:** ACP v1 only works with Stripe-connected merchants — structural dependency on Stripe's merchant network
**Economic destiny:** Managed margins. Payment provider inside ACP earns a premium because trust is monetized. Stripe profits structurally from ACP adoption.

### UCP — Universal Commerce Protocol (Google / Retail)
**Architecture:** AI-powered discovery. Gemini surfaces products; merchant catalog data powers results; Google Pay collects. Shopify co-built this standard.
**Live merchants:** Shopify, Walmart, Target, Wayfair, Etsy
**Limitation:** Google sits *above* the payment step — capturing the consumer relationship and advertising economics, commoditizing whoever processes the payment
**Economic destiny:** Contestability. Payment processors face commodity pressure; Google captures discovery rent.

### AP2 — Agent Payments Protocol (Google / Ecosystem)
**Architecture:** Cryptographic, attested agent transactions. Integrity proven, intent opaque. Adyen is primarily aligned here through Google.
**Economic destiny:** Encasement. Payment provider becomes a passive hardware-like handoff, competing on reach rather than value — utility rail economics.

### Protocol Alignment by Player

| Player | ACP | UCP | AP2 | Own Protocol |
|--------|-----|-----|-----|--------------|
| **Shopify** | ✅ opted in | ✅ co-built | ✅ opted in | ❌ (doesn't need one) |
| **Block** | ❌ | ❌ | ❌ | ✅ MRI + Stablecoin URI |
| **Stripe** | ✅ co-builder | ❌ | ❌ | 🟡 ACP is Stripe-governed |
| **Google** | ❌ | ✅ builder | ✅ builder | ✅ AP2 |
| **PayPal** | 🟡 secondary processor | ❌ | ❌ | ❌ |

**The structural tell:** Shopify's protocol neutrality is not a hedge — it's the structural consequence of controlling the reconciliation layer above all three. Whichever protocol wins the traffic war, agents still need to validate the order against Shopify's commerce state before paying.

Block's protocol absence is equally deliberate. MRI attestation was built specifically to avoid ceding the trust chain to Google (AP2) or Stripe (ACP). The stablecoin URI architecture — an agent-callable URI resolved through MRI-attested infrastructure — is Block's bid for an open payment rail outside all three governed schemes.

---

## III. Player-by-Player Analysis

---

### A. Shopify — The Reconciliation Layer Monopolist

**Layer controlled:** 2 (Reconciliation) — primary; 3 (partial, Shopify Payments/Shop Pay)
**Moat type:** Operational data depth + switching cost
**Protocol posture:** Neutral (opted into all three)

#### What Shopify Actually Controls

Shopify is the system of record for merchant commerce state across 2M+ merchants:
- Inventory at the **variant level** — size, color, region, channel — updated in real time
- Pricing as a **dynamic function** — promotions, bundles, subscriptions, channel-specific rules
- Tax **computed jurisdictionally** for the specific delivery address
- Fulfillment reflecting **geographic constraints**, carrier availability, inventory routing
- Merchant policy, fraud logic, B2B terms, cross-border compliance, order history

This is not a codebase. It is a distributed operational record merchants have built their businesses on. When an AI agent attempts a transaction, it must validate this state before any wallet executes. Shopify is increasingly the entity that runs that validation for the largest share of e-commerce.

#### The Agentic Plan — Reconciliation Gravity Ahead of Revenue

The strategic move the market underappreciates: non-Shopify merchants can syndicate commerce state into Shopify's normalized catalog *without migrating their storefront*. Shopify gains reconciliation gravity on GMV that doesn't yet appear as Shopify revenue. Commerce state share will outrun reported GMV share. The market sees revenue; it doesn't yet see the catalog gravity preceding it.

#### Proof Points
- 15x increase in orders from AI search since January 2025 (small base, directionally significant)
- Positive net enterprise migration for second consecutive year (1,200 brand study)
- 16,000+ app ecosystem — more than next six e-commerce platforms combined
- Management confirmation: LLMs do not bypass Shopify's checkout logic — front-end interfaces change, back-end commerce infrastructure still runs through Shopify

#### Key Risk
Platform displacement: a dominant AI entrant (Google, OpenAI, Amazon) builds a commerce-native data layer that absorbs reconciliation above Shopify. Requires normalizing operational complexity for millions of merchants simultaneously. Assessed as low probability, high impact.

---

### B. Block — The Physical World Closed Loop

**Layer controlled:** 2 (physical reconciliation via Square POS) + 3 (Cash App consumer credential)
**Moat type:** Two-sided network + proprietary trust chain + behavioral data
**Protocol posture:** Sovereign (MRI + Stablecoin URI — no external dependency)

#### The Closed Loop Architecture (from APK teardowns)

Block has built a two-sided closed loop that is deeper than disclosed:

**Consumer side (Cash App):**
- Weaver: proprietary ML recommendation engine, background refresh, LaunchDarkly-gated experiments — proactive, not reactive
- Fillr: cart extraction + checkout autofill, Walmart named explicitly, `CommerceBrowserEditAutofill` flag
- CDP: in-house behavioral data platform — signal stays proprietary, feeds Weaver
- Draft Payments: human-in-the-loop staging — agent prepares, consumer approves
- Moneybot: function-calling agent with persistent memory, extended reasoning, generative native UI, `launch_flow` tool routing to any of 100+ app screens

**Merchant side (Square POS — from v6.98 teardown):**
- `cashapplocal` package (520 files): Cash App embedded in the physical checkout layer — tip screen, auth UI, post-auth receipt, rewards display, idle screensaver, cashback — all optionally Cash App-branded
- Cash App discounts visible to merchant at POS (`postAuthDiscountedAmount`) — closes the loop between consumer rewards and merchant economics
- `BlockStableService` + `BlockUserJourneysService` in proto layer — ecosystem-level services, not just Square POS features

**Trust chain (MRI — Block's self-sovereign AP2):**
- `SignedSerializedMRIContext` required in `CreatePaymentRequest`, `ValidateTapToPayPolicyRequest`, `PublishClientTrustSignalsRequest`
- Three-layer attestation: `SignedSerializedMRIContext` + `MRIContext` + `SigningData`
- MRI is injected into TapToPay presenter — device integrity is a precondition for payment, not a post-hoc check
- Architecturally identical to AP2's goal, but Block controls the attestation root — Google does not

**Rail sovereignty (Stablecoin URI):**
- `ViewBitcoinUri` (live), `ViewLightningUri` (live), `ViewStablecoinUri` (compiled, not live)
- Agent-callable URI resolved natively, no external protocol governance required
- `BlockStableService` exists on the Square POS proto layer — both sides of the stablecoin rail are present

#### What Block's Loop Looks Like When Assembled
> **Moneybot** (natural language intent) → **Weaver** (proactive recommendation) → **Fillr** (cart read + checkout autofill) → **CDP** (behavioral feedback) → **Draft Payment** (consumer approval) → **execution** (Cash App Pay or Cash App Local at Square POS)

#### The Physical Layer Moat
Cash App Local is not a payment button at Square merchants. It is a full checkout experience overlay — the merchant's tip screen, receipt, rewards, idle screensaver, and post-charge flows can all be Cash App-branded/powered. Cash App discounts are visible to the merchant at POS, closing the consumer-merchant economic loop. No equivalent exists at Toast, Stripe Terminal, or PayPal.

#### Key Gaps (visible from teardown)
- No proactive/outbound Moneybot — it responds but doesn't initiate ("your paycheck hit, move $200 to savings?" is not present yet)
- Cash App Pay merchant network: last disclosed ~25K, vs. Stripe's much larger merchant base
- `ViewStablecoinUri` compiled but not live — stablecoin rail exists in embryo, not in production
- Moneybot still behind two Amplitude experiments — GA timing unknown

#### Key Risk
If Stripe + PayPal/Venmo closes, Stripe builds a digital-world closed loop (Stripe merchant infrastructure + Venmo consumer credential + ACP governance) that competes directly with Block's architecture but in the digital commerce surface. Block's physical-world moat (Cash App Local at Square POS) remains intact, but the agentic commerce TAM gets partitioned — digital to Stripe/Venmo, physical to Block. That is a smaller addressable opportunity than Block's full vision.

---

### C. Stripe (+ PayPal/Venmo, pending) — The Merchant Layer Building a Consumer Credential

**Layer controlled:** 3 (merchant-side trust anchor, ACP governance) — trying to acquire Layer 3 (consumer-side)
**Moat type:** Developer network, ACP protocol governance, merchant penetration
**Protocol posture:** ACP co-builder and governing party

#### What Stripe Has
- Dominant merchant infrastructure: payments acceptance, billing, fraud, treasury, embedded finance
- $1.9T annual volume (2025), up 34% YoY — ~1.6% of global GDP
- Link: 200M programmatic wallets — powerful plumbing, low consumer brand visibility
- ACP co-builder: Stripe is the payment provider inside ACP. As ACP adoption grows, every governed agent transaction is a Stripe transaction.
- First-mover on the merchant side of agentic commerce protocol governance

#### What Stripe Doesn't Have (and Why PayPal)
ACP without a consumer-side trust anchor is better merchant plumbing, not a closed loop. The agent needs a credential to carry. Right now that credential is whoever the user's AI system trusts (OpenAI's wallet, a card on file, a third-party wallet). Stripe has no consumer brand.

**PayPal fills this gap precisely:**

| Block closed-loop component | Stripe equivalent today | PayPal/Venmo adds |
|---|---|---|
| Behavioral graph (CDP) | Transaction data — no behavioral layer | Venmo social graph + 439M PayPal account history |
| Consumer credential | Link (programmatic, low consumer visibility) | PayPal/Venmo branded credential, 100M+ Venmo MAU, biometric auth, passkeys — 36% "checkout ready" |
| Merchant-side integration | Dominant | Braintree: enterprise merchants (Uber, Airbnb, GitHub) Stripe doesn't have |
| Trust chain sovereignty | ACP-governed, Stripe controls | PayPal stored credentials + Venmo wallet = Stripe controls both sides of ACP |

**The key insight from Block's architecture:** MRI attestation exists because Block refuses to cede the trust chain to Google or Stripe. Stripe acquiring PayPal is Stripe attempting the same sovereign trust chain — control both consumer credential and merchant infrastructure — via acquisition rather than build.

#### "All or Parts" Asset Triage
- **High-confidence Stripe wants:** Venmo (100M accounts, behavioral flywheel — 40% week-over-week checkout re-engagement), PayPal branded checkout, passkey/biometric auth layer
- **Uncertain:** Braintree (internal channel conflict risk), PayPal international (complexity), credit/lending book (unfamiliar risk)
- **Probably not:** Xoom, PayPal crypto, any consumer brand dilution

#### If Deal Closes: The Digital Closed Loop
Stripe merchant infrastructure + Venmo consumer credential + ACP governance = a digital-first closed loop that mirrors Block's physical-world closed loop. Stripe owns the merchant layer (above); Venmo owns the consumer credential (below); ACP governs the protocol space in between. The structural analogy to Block is exact — same architecture, different surface (digital vs. physical).

#### Key Risk
Regulatory: a combined Stripe + PayPal/Venmo entity commands enormous share of digital payment infrastructure. Antitrust scrutiny is real. Integration complexity of a $40B+ acquisition into a private company is non-trivial.

---

### D. Google — The Discovery Layer with a Payments Ambition

**Layer controlled:** 1 (Discovery — Gemini), partial Layer 3 (Google Pay/AP2), co-owner of Layer 2 via UCP
**Moat type:** Consumer intent capture, search distribution, Android/Chrome ecosystem
**Protocol posture:** UCP builder + AP2 builder — two separate protocols for two separate surfaces

#### The Google Architecture Problem

Google is the only player running two separate protocols simultaneously:
- **UCP** (Universal Commerce Protocol): AI-powered product discovery — Gemini surfaces products, merchant catalog data powers results. Consumer relationship captured at discovery.
- **AP2** (Agent Payments Protocol): Cryptographic payment attestation — separate protocol, separate purpose, different economic destiny.

The UCP logic captures advertising rent at the discovery layer (Google above the payment step). The AP2 logic risks turning Google Pay into a utility rail — volume over value. These are structurally in tension with each other within Google's own strategy.

#### What Google Controls That Matters
- Gemini: the consumer intent surface with the largest existing search distribution base
- Android + Chrome: device-level access to where commerce decisions get made
- Google Pay: 450M+ users, stored credentials, device biometrics
- UCP: direct integration with Shopify, Walmart, Target, Wayfair, Etsy — real merchant catalog data flowing into Gemini

#### What Google Doesn't Have
- A merchant infrastructure layer (no Stripe equivalent — Google tried with Google Cloud commerce products without decisive success)
- A physical commerce closed loop (no POS network, no equivalent of Cash App Local or Square)
- Consumer behavioral data with commerce intent depth (search signals are broad; Venmo/Cash App behavioral signals are financial-specific)

#### Strategic Read
Google's winning scenario: Gemini becomes the default consumer intent surface for shopping, UCP routes merchant catalog data through Gemini, Google Pay collects the transaction, and Google captures both the discovery rent (advertising) and the payment processing spread. Google Pay becomes the consumer credential of agentic commerce by virtue of Android/Chrome distribution dominance.

Google's risk: if ACP merchant adoption (Stripe-gated) grows faster than UCP adoption, the consumer intent captured by ChatGPT + ACP routes around Google entirely. The protocol race between ACP and UCP is, at its core, a contest between OpenAI/Stripe and Google for the discovery + custody bundle.

---

## IV. Competitive Dynamics — The Three Key Contests

### Contest 1: ACP vs. UCP (Protocol War for Digital Commerce)
**Stakes:** Who governs agent-initiated digital commerce — OpenAI/Stripe or Google
**Current state:** ACP live (Etsy, Walmart, Instacart + Stripe-connected merchants); UCP live (Shopify, Walmart, Target, Wayfair, Etsy)
**Walmart and Etsy are on both.** That's the tell — major merchants are hedging, not committing.
**Watch:** ACP merchant count growth rate (currently Stripe-gated, limiting speed); UCP catalog query volume via Gemini

### Contest 2: Digital vs. Physical Closed Loop (Stripe+Venmo vs. Block)
**Stakes:** Who owns the agentic commerce credential in physical retail
**Current state:** Block's Cash App Local is deeply embedded in Square POS (520-file integration, not a payment button). Stripe has no physical POS consumer wallet equivalent.
**If Stripe+Venmo closes:** digital loop potentially competitive; physical loop is Block's by default unless Stripe builds or buys Square-equivalent hardware + merchant network (no evidence of intent)
**Watch:** Cash App Pay merchant count; Square One subscription launch; Stripe's post-acquisition integration roadmap

### Contest 3: Shopify's Reconciliation Gravity vs. AI Platform Displacement
**Stakes:** Does the reconciliation layer remain a Shopify moat or get absorbed by Google/OpenAI natively
**Current state:** Shopify co-built UCP with Google and opted into ACP — the protocols route *through* Shopify's commerce state, not around it. Agentic Plan extending reconciliation gravity to non-Shopify merchants.
**The Shopify bull case:** AI surface multiplication is *distribution*, not disruption — every new AI surface querying merchants needs Shopify's normalized commerce state
**Watch:** Agentic Plan merchant adoption; enterprise migration ratios; whether ACP or UCP attempts to build their own reconciliation layer (no evidence yet)

---

## V. Investment Implications

### Value Layer Durability (Long-Term)

Drawing on payments industry history (Theme 3 — Software Compression framework): trust/credential layers compress to commodity over time. Card networks became regulated utilities. The reconciliation layer — by contrast — requires operational depth that deepens with merchant complexity. This favors Shopify's structural position over the multi-year arc.

Near-term: the custody/trust layer (Stripe, Block) captures outsized value while standards are contested and trust is scarce. Once a standard wins, the trust layer commoditizes and Shopify's reconciliation monopoly extracts.

### Position Scorecard

| Player | Layer | Moat Durability | Agentic Upside | Key Risk |
|--------|-------|----------------|----------------|----------|
| **Shopify** | Reconciliation | High — operational data depth, switching cost compounds with agentic demands | High — every new AI surface is distribution | Platform displacement (low prob, high impact) |
| **Block** | Physical reconciliation + consumer credential | High (physical) — Cash App Local moat is real and deep per teardown | High — Moneybot + Weaver + stablecoin rail if GA | Stripe+Venmo closes; Cash App Pay merchant count too small |
| **Stripe+PayPal** | Merchant infra + consumer credential | Medium — ACP governance is real but protocols can be superseded | High if deal closes — digital closed loop | Antitrust; integration complexity; PayPal consumer engagement declining |
| **Google** | Discovery + AP2 rails | Medium — search distribution is durable but not commerce-specific | Medium — UCP real but payment layer commoditizes | ACP wins protocol war; Gemini loses to ChatGPT in commerce intent |

### Positioning Logic
- **Shopify (SHOP):** The quiet winner. Structural long. Reconciliation gravity expands ahead of reported revenue. Protocol neutrality is a consequence of owning the layer above the race, not a hedge. Buy.
- **Block (XYZ):** Physical world closed loop with digital optionality (Moneybot/stablecoin) not yet in earnings. The Stripe+Venmo scenario is the key watch — if it closes, re-evaluate TAM assumptions for the digital surface. Thesis intact at current penetration levels.
- **PayPal (PYPL):** Optionality on Stripe deal. Venmo is the crown jewel; the rest is drag. "Parts" scenario (Venmo carveout) may be more likely than full acquisition. Hold pending deal clarity.
- **Google (GOOGL):** Not a pure-play thesis here. UCP exposure is real but the payment processing economics are commodity-destined. The value capture is in advertising, not in agentic commerce payments infrastructure. Straddler (per Physical Tether framework).

---

## VI. The Open Questions That Drive the Thesis

1. **ACP merchant count:** How fast is Stripe expanding beyond the initial Stripe-connected merchant constraint? This is the leading indicator of whether ACP becomes the dominant protocol or stays niche.

2. **Stablecoin URI timeline:** `ViewStablecoinUri` compiled in Cash App; `BlockStableService` in Square POS protos. Both sides of the rail exist. What's the GA timeline — 2026 or 2027-2028?

3. **Moneybot GA:** Production-grade infrastructure (GenUI, function-calling, extended reasoning, streaming) behind two Amplitude experiments. When does it ship? What's the distribution trigger?

4. **Stripe+PayPal deal structure:** Full acquisition or Venmo carveout? The answer changes the Stripe competitive posture meaningfully (full deal = consumer brand management complexity; Venmo only = cleaner but still a large integration).

5. **Shopify Agentic Plan adoption:** The leading indicator for reconciliation gravity expansion. How many non-Shopify merchants are syndicating commerce state into Shopify's catalog? Not yet disclosed — watch for management commentary in Q1 2026 earnings.

6. **Cash App Pay merchant count:** Last disclosed ~25K. The physical closed loop's value compounds with merchant network density. Where is this number now and what's the trajectory?

---

*Memo by Vince / EquityVault — March 2026*
*Sources: XYZ APK teardowns (CashApp 3/14/26, SquarePOS 3/16/26), SHOP IC memos (Feb 2026), PYPL Rickety Bridge memo (March 2026), Bloomberg Stripe/PayPal reporting (2/24/26), PYMNTS competitive analysis, Mizuho research*
