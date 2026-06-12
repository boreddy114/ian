# Block Neighborhoods on Cash App — Developer Documentation & Economics Research Note

**Date:** March 2026 | **Analyst:** EquityVault | **Status:** Working Note — Not for Distribution

---

## 1. What Neighborhoods Actually Is (From Primary Sources)

Neighborhoods on Cash App is a closed-loop local commerce network connecting Square merchants with Cash App consumers. Launched at Square Releases on October 8, 2025 by Brian Grassadonia (Block's Ecosystem Lead, who built both Square and Cash App). Currently available to **select Square food and beverage sellers** in the United States — not yet generally available to all merchant categories.

**Core product surfaces:**
- Branded merchant storefronts accessible on the open web and inside Cash App
- Online ordering with pickup and delivery fulfillment
- Follower relationships (consumers follow merchants)
- Direct marketing campaigns from merchants to followers
- Network-wide Local Cash rewards (10% of subtotal, redeemable at any participating merchant)
- QR code check-in at the register for in-store Local Cash redemption
- 1% payment processing fee on all in-app orders (vs. standard 2.6% + $0.10)

**Source:** squareup.com/us/en/press/neighborhoods-by-cash-app; squareup.com/us/en/neighborhoods

---

## 2. The Economics: What the 1% Rate Actually Costs (and Who Pays for What)

### 2a. Processing Fee: 1% on Neighborhoods Orders

The 1% fee applies to "orders placed in Cash App by your followers." Standard Square card-present processing is approximately 2.6% + $0.10. The savings for merchants on Neighborhoods orders is substantial: ~60% lower processing costs.

**Critical question: How does Block make 1% work?**

Standard card-not-present interchange is 1.5–2.0%. At 1% merchant discount rate, Block is below interchange on most external card transactions. The 1% is economic only when the consumer pays via:

1. **Cash App balance** — $0 interchange. The ~$300B in annual Cash App inflows represents stored balances that fund purchases at zero network cost. The 1% is nearly pure margin.
2. **Cash App Card (Visa debit)** — "On-us" transaction where Block is both issuer and acquirer. Interchange is internal.
3. **USDC stablecoin** — Near-zero settlement cost on Solana. From the APK teardown: USDC deposited into Cash App is instantly converted to USD. A stablecoin-funded Neighborhoods transaction would be highly profitable at 1%.

**Block's strategic incentive:** Migrate Neighborhoods transactions onto its own rails (balance, Cash App Card, stablecoin) and away from external Visa/Mastercard cards. The entire Neighborhoods product design encourages this: a Cash App user ordering ahead in the app is far more likely to pay from their balance or Card than to use an external card.

### 2b. Local Cash Rewards: 10% Funded by the Merchant (With Critical Protections)

**How rewards work:**
- Customers earn 10% of order subtotal in Local Cash on every eligible order
- Local Cash is redeemable at **any** participating Neighborhoods business — not just where it was earned
- Merchants pay only when Local Cash is redeemed at their business
- **Merchants never pay more than the amount of Local Cash earned at their business in a given month** (the "cap")

**Source:** squareup.com/us/en/neighborhoods; squareup.com/help/us/en/article/8605

### 2c. The Subsidy Period: Block Funded Everything Until January 20, 2026

**This is the most investment-relevant detail from the legal terms.**

From the Neighborhoods Seller Terms: *"Notwithstanding the foregoing, Sellers are not responsible for funding the costs of honoring Local Cash redemptions on transactions prior to January 20, 2026."*

This means Block subsidized 100% of Local Cash redemptions during the initial launch period (October 2025 – January 20, 2026). The subsidy is called a "Neighborhoods Subsidy" in the terms. Merchants were notified in advance of the transition to self-funding.

**Investment read:** Block invested heavily in bootstrapping the network. By funding all rewards during the first ~3.5 months, Block ensured that:
- Consumers experienced the full value of Local Cash immediately (no delayed gratification)
- Merchants experienced the benefit of increased foot traffic without bearing the cost
- The network could accumulate Local Cash balances across the system before merchants began self-funding

This is classic marketplace subsidization: burn cash to build liquidity on both sides, then transition to self-sustaining economics. The January 20 cutover date means we are now ~2 months into the merchant-funded phase. **The first critical data point will be Q1 2026 earnings commentary on whether merchant opt-out rates changed after the subsidy ended.**

### 2d. Winback Campaign: Automatic and Merchant-Funded

From the transition documentation: On the cutover date, a "winback marketing campaign" is **automatically** sent to the merchant's customers with a coupon for a free item. The merchant covers the cost of these coupons when redeemed. Merchants can manage or pause campaigns in Square Dashboard.

**Investment read:** Block is auto-enrolling merchants into marketing spend. The default is campaign-on, not campaign-off. Merchants who don't actively manage their Dashboard will be spending on customer acquisition by default. This is aggressive — and consistent with the opt-out design philosophy we've seen throughout the product.

### 2e. Fully Loaded Merchant Economics: Worked Example

**Assumptions:** A coffee shop doing $50,000/month total. 10% ($5,000) flows through Neighborhoods.

| Component | Standard Square | Neighborhoods |
|-----------|----------------|---------------|
| Processing fee | ~$130 (2.6%) | $50 (1%) |
| Reward funding | $0 | Up to $500 (10% of subtotal) |
| **Gross cost** | **~$130** | **Up to $550** |

**Adjustments to the $500 reward liability:**
- Not all Local Cash will be redeemed (typical loyalty redemption rates: 60-70%)
- Not all redeemed Local Cash will be redeemed at the originating merchant (it's network-wide)
- Merchant also receives redemptions from customers who earned Local Cash elsewhere (incremental traffic)

**Estimated net cost (steady state):** $500 × 65% redemption × 50% at originating merchant = ~$162.50 in actual reward cost. Plus $50 processing = **~$212.50 fully loaded, or ~4.25% effective rate.**

**Comparison (PICKUP orders only — Neighborhoods does not include delivery logistics):**
| Channel | Effective Rate | Delivery Included? | Customer Acquisition? | Owns Customer Data? |
|---------|---------------|-------------------|----------------------|-------------------|
| Standard Square | 2.6% | No | No | Merchant owns |
| Neighborhoods | ~4.25% fully loaded | No | Yes (discovery, rewards, marketing) | Merchant owns |
| DoorDash Pickup | 6–15% commission | No | Yes (marketplace) | DoorDash owns |
| DoorDash Delivery | 15–30% commission | Yes (driver network) | Yes (marketplace) | DoorDash owns |
| Merchant's own app | Dev cost + maintenance | No | Expensive to build | Merchant owns |

**Critical distinction:** DoorDash's 15–30% rate includes the entire delivery logistics operation — the driver network, routing, insurance, customer support. Neighborhoods does not include delivery. Square's support documentation is explicit: "delivery fees are managed directly by courier services." For delivery orders, a Neighborhoods merchant pays ~4.25% plus third-party courier fees, which could bring the total to 30–50%+ on a small ticket. **Neighborhoods is a pickup-first, in-store-first product that competes with DoorDash on pickup economics but not on delivery logistics.** The two are likely complements, not substitutes, for delivery: merchants use DoorDash for delivery demand and Neighborhoods for pickup, in-store loyalty, and direct customer relationships.

**The pitch to merchants:** For pickup and in-store, get DoorDash-like customer acquisition at a fraction of the cost and keep the customer relationship. For delivery, continue using DoorDash/Uber Eats alongside Neighborhoods.

---

## 3. The Loyalty API Infrastructure: What Underpins Neighborhoods

### 3a. Legacy Loyalty API (Pre-Neighborhoods)

The Square Loyalty API is a mature, well-documented system that handles:
- **Program management** (read-only via API; creation/modification via Dashboard only)
- **Accrual rules** — four types: SPEND (amount-based), VISIT (frequency), ITEM_VARIATION (specific products), CATEGORY (product categories)
- **Reward tiers** — four discount types: entire sale (amount or %), specific categories, specific items, free items
- **Loyalty accounts** — tied to buyer phone numbers, one program per seller
- **Points accumulation** — automatic when integrated with Orders API, or manual via AccumulateLoyaltyPoints
- **Reward redemption** — automatic when integrated with Orders API, or manual
- **Promotions** — time-limited campaigns offering bonus points
- **Webhooks** — events for account creation/update/deletion, program creation/update

**Key limitation:** The Loyalty API is seller-specific. Each seller has one loyalty program. There is no cross-merchant functionality in the public API. Loyalty points earned at Merchant A cannot be redeemed at Merchant B through the Loyalty API.

### 3b. The Local Cash Layer: Not Exposed via Public API

Local Cash — the cross-merchant, network-wide reward currency — is **not part of the public Loyalty API**. It operates on a separate, proprietary infrastructure:

- Local Cash is earned on "Eligible Neighborhoods Transactions" (in-store at Square POS or online through the merchant's Online Ordering Profile on Cash App)
- Local Cash is redeemed via QR code check-in on the buyer-facing display
- Local Cash balances are managed in Cash App, not in the merchant's Square Dashboard
- The merchant Dashboard shows earned and redeemed Local Cash, but cannot modify the reward rate or rules

**Investment read:** Block deliberately kept Local Cash off the public API. This means:
1. Third-party developers cannot build competing reward networks on Square's infrastructure
2. Block maintains complete control over the economics (the 10% rate, the cap, the subsidy)
3. Local Cash is a closed system that only works within the Block ecosystem
4. If Block ever opens the Local Cash API to developers, it would signal a platform play (watch the developer changelog for this)

### 3c. The Transition from Loyalty to Neighborhoods

The support documentation (article 8599) details how existing Square Loyalty subscribers transition to Neighborhoods:

1. Square Product Specialist contacts the merchant
2. Loyalty points are converted to Local Cash at a calculated conversion rate
3. Customers receive automated SMS: Cash App users get notification to claim; non-users get download link
4. Winback campaign auto-launches with free item coupon
5. Old loyalty program deactivates; Neighborhoods activates

**Investment read:** This transition mechanism is a Cash App user acquisition engine. Every Square Loyalty subscriber who transitions to Neighborhoods triggers SMS notifications to their entire customer base — including customers who don't have Cash App. Those customers receive a download link. This means every merchant transition is a paid user acquisition campaign for Cash App, funded by the merchant's existing customer data.

---

## 4. Adoption: Current State and Rollout Mechanics

### 4a. Current Eligibility

From squareup.com/us/en/neighborhoods: *"Neighborhoods on Cash App is currently available to select Square food and beverage sellers in the United States."*

This is intentionally narrow. F&B is the beachhead vertical because:
- Highest frequency of repeat purchases (daily coffee, weekly takeout)
- QSR is already Block's fastest-growing Square vertical (GPV growth accelerated to 17% in Q3 2025)
- Menu/ordering infrastructure already exists in Square for Restaurants
- Local commerce behavior is strongest in F&B (people eat near where they live/work)

The eligibility requirements include: completed online ordering profile and onboarding/approval process.

### 4b. The Opt-Out Switch

Block switched Neighborhoods from opt-in to opt-out for eligible merchants. This means:
- Every eligible Square F&B merchant is enrolled by default
- Merchants must actively opt out to not participate
- The screensaver on Square POS displays Cash App branding by default (confirmed in APK teardown)
- The tip screen can render in Cash App style by default

**This is the network effects ignition point.** Supply-side density (number of merchants visible in Neighborhoods) jumped overnight. Consumer-side value (number of places to earn/redeem Local Cash) increased proportionally.

### 4c. Adoption Metrics to Monitor

**Leading indicators (not yet publicly disclosed):**
1. Number of merchants visible on the Neighborhoods tab in Cash App (spot-checkable by opening the app in different cities)
2. Cash App Card actives — growth attributable to Neighborhoods discovery at POS
3. Local Cash outstanding — total earned minus total redeemed
4. Local Cash circulation velocity — how quickly earned Local Cash gets redeemed
5. Merchant opt-out rate post-subsidy (after January 20, 2026)

**Lagging indicators (likely disclosed in earnings):**
1. Cash App order volume at Square merchants
2. Follower counts (aggregate)
3. Neighborhoods contribution to Seller GPV growth
4. Any commentary on the 1% processing rate's impact on Seller take rate

---

## 5. Competitive Landscape

### 5a. DoorDash: The Most Dangerous Potential Competitor

DoorDash has the structural assets to attempt a Neighborhoods-like product: ~37M U.S. monthly actives, 18–20M DashPass subscribers conditioned to pay for commerce memberships, a massive restaurant network far larger than Square's F&B base, and brand recognition as the place consumers go to find food. Guest (in-restaurant QR ordering) and Dine Out (extending DashPass benefits to dine-in) show DoorDash is thinking beyond delivery into in-restaurant commerce.

**Why DoorDash hasn't built this and structurally can't replicate it easily:**

**DoorDash doesn't own the POS.** When a Cash App user checks in at a Square register, the consumer reward, payment, tip, and receipt all flow through a single system Block controls on both sides. The 520-file `cashapplocal` integration exists because Block owns both apps. DoorDash's Guest must integrate with whatever POS the restaurant uses — Toast, Square, Clover, Aloha — each with different APIs, capabilities, and willingness to cooperate. Every integration is a negotiation with a third-party POS provider that has reasons not to cooperate (they're all building their own consumer products).

**DoorDash doesn't have a payment instrument.** Cash App has ~25M cards in the market and ~$300B in annual inflows. Block captures full payment economics on Neighborhoods transactions. DoorDash has no payment card, no stored balance, no payment rails. Every DoorDash transaction runs through Visa/Mastercard or a linked bank account. DoorDash cannot offer a 1% processing rate because it isn't a payment processor. It would need to partner with Stripe or another processor, sharing economics and losing control of the payment layer. This is the key reason the 1% rate is defensible — it requires owning the rails and the wallet.

**DoorDash's incentive structure conflicts with a Neighborhoods model.** DoorDash monetizes through delivery commissions. A Neighborhoods-like product driving pickup and in-store ordering cannibalizes DoorDash's core delivery revenue. Every DashPass subscriber who orders pickup through a hypothetical DoorDash Neighborhoods instead of ordering delivery costs DoorDash the delivery fee and the commission differential. Block doesn't have this conflict — it makes money on payment processing regardless of fulfillment channel, plus consumer-side monetization (Card interchange, Borrow, Afterpay) that DoorDash can't access.

**DoorDash doesn't have a cross-merchant stored-value currency that works at the physical register.** DashPass waives delivery fees. DoorDash credits are single-merchant or platform-wide and don't work at the POS. Building a physical-world stored-value currency requires owning the POS (which DoorDash doesn't) or building a separate payment network (multi-year, multi-billion-dollar investment).

**Where DoorDash is dangerous despite all of this:** DoorDash's consumer intent match is much stronger. Users open DoorDash specifically to find food. Cash App users are conditioned to think of it as a payment and P2P app. If DoorDash launches a serious Dine Out program with DashPass benefits for in-restaurant dining (e.g., 5% back on dine-in for subscribers) and achieves decent POS integrations via Guest, the consumer experience could be competitive even without Local Cash mechanics. The risk is that DoorDash captures the "discover local food" use case through superior demand generation before Neighborhoods builds sufficient density.

**Most likely competitive outcome:** Coexistence. Merchants use DoorDash for delivery demand and Neighborhoods for pickup, in-store loyalty, and direct customer relationships. The two products serve different occasions and fulfill different needs. The risk scenario — DoorDash succeeding with Guest/Dine Out in capturing in-restaurant commerce without owning the POS — is worth monitoring but structurally disadvantaged by the payment economics.

### 5b. Toast (Local by Toast): Direct Architectural Competitor

Toast owns the restaurant POS and is building a consumer-facing ordering marketplace (Local by Toast). This is the most architecturally similar competitor — Toast controls the merchant checkout experience, has deep menu and order management integration, and is building consumer-facing discovery.

**Toast's disadvantages vs. Neighborhoods:**
- No consumer wallet or payment card (~57M Cash App users vs. zero consumer app install base)
- No stored-value currency for cross-merchant rewards
- ~120K restaurant locations vs. Square's 4M total merchants
- No non-F&B verticals (can't expand to retail, beauty, services)

**Toast's advantage:** Deep restaurant-specific POS features and a pure-play restaurant focus that may resonate with high-volume restaurants that want restaurant-grade tools over a generalist POS.

### 5c. SpotOn (GoTo Place): Smaller, Similar Concept

SpotOn is building GoTo Place, a local ordering marketplace. Similar concept to Neighborhoods but without the consumer network, payment instrument, or cross-merchant rewards. Not a material competitive threat at current scale.

### 5d. Competitive Summary

| Competitor | POS Ownership | Consumer Wallet | Payment Rails | Cross-Merchant Rewards | Delivery Fleet |
|-----------|--------------|----------------|--------------|----------------------|---------------|
| **Block** | Yes (Square) | Yes (57M MAU) | Yes (1% rate) | Yes (Local Cash) | No |
| **DoorDash** | No | No | No | No | Yes |
| **Toast** | Yes (restaurants) | No | No | No | No |
| **SpotOn** | Yes (restaurants) | No | No | No | No |

Block's structural moat is the only company that owns POS + consumer wallet + payment rails + cross-merchant rewards simultaneously. The competitive risk is that DoorDash's demand generation and delivery logistics are powerful enough to win the consumer discovery use case without needing the other three.

---

## 6. Key Findings from the Legal Terms

Three details from the Neighborhoods Seller Terms that are not in any public-facing materials:

**6a. Block reserves the right to adjust Local Cash economics.** The terms give Block "sole discretion over the terms and policies relating to the provision and availability of Local Cash Rewards." The 10% rate is not contractual — Block can change it.

**6b. The subsidy math is explicit.** "Neighborhoods Subsidies are subject to our rights in the Square Payment Terms, including but not limited to Section 14 ('Reserve for Holding Funds') and Section 16 ('Our Set-off Rights; Security Interest')." Block can offset Local Cash subsidy costs against the merchant's payment settlement. This is aggressive: Block can withhold funds from a merchant's settlement to cover Local Cash obligations.

**6c. Enrollment Bonuses are excluded from the cap.** If Block offers a sign-up bonus in Local Cash (e.g., "$5 Local Cash for your first order at a new Neighborhoods business"), that bonus is not counted against the merchant's monthly cap. Block funds enrollment bonuses separately. This means Block can drive aggressive consumer acquisition through bonuses without increasing the merchant's cost.

---

## 7. Research Process: Ongoing Monitoring

### Quarterly Checks:

1. **Square Developer API Changelog** (developer.squareup.com/docs/changelog/connect)
   - Watch for: Any new endpoints referencing Local Cash, Neighborhoods, or cross-merchant loyalty
   - Signal: If Local Cash appears in the public API, it means Block is building a platform play

2. **Square Support Center** (squareup.com/help)
   - Watch for: New articles about Neighborhoods features, eligibility expansion to retail/beauty/services
   - Signal: Category expansion = TAM expansion for the closed-loop network

3. **Neighborhoods Landing Page** (squareup.com/us/en/neighborhoods)
   - Watch for: Changes to eligibility language, pricing changes, new feature announcements
   - Signal: "Currently available to select food and beverage sellers" changing to include other categories

4. **Neighborhoods Seller Terms** (squareup.com/us/en/legal/general/neighborhoods-on-cash-app-terms)
   - Watch for: Changes to the 10% reward rate, the monthly cap, the subsidy structure
   - Signal: Rate changes would indicate Block is tuning the economics based on early data

5. **Cash App APK** (quarterly teardown by Vince)
   - Watch for: Changes to Local Cash flags, Neighborhoods notification channel activity, new feature flags
   - Signal: Feature flags moving from Amplitude experiment to LaunchDarkly production = imminent launch

6. **Earnings Calls**
   - Watch for: Any mention of Neighborhoods metrics (followers, Local Cash, Cash App order volume at Square merchants, merchant opt-out rates)
   - Signal: Quantitative disclosure = Block is confident the metrics look good

### Specific Data Points to Request from IR:

1. What percentage of Square F&B merchants are currently participating in Neighborhoods?
2. Has the merchant opt-out rate changed since the subsidy ended on January 20?
3. What percentage of Neighborhoods transactions are funded by Cash App balance vs. external card?
4. When will Neighborhoods expand beyond F&B to other verticals?
5. Is there a timeline for opening the Local Cash system to the public developer API?

---

## 8. Summary Assessment

Neighborhoods is the most strategically important product Block has launched since Cash App Pay. The 1% processing rate is a loss leader on external card transactions but highly profitable on Cash App balance and Card transactions, creating a powerful incentive for Block to migrate commerce onto its own rails. The Local Cash reward system creates network effects at the local level that no competitor can replicate because no competitor owns both the merchant POS and the consumer wallet. The opt-out switch and the subsidy period (Block funding all rewards through January 20, 2026) represent aggressive marketplace-building investment that should have generated significant early adoption data that will be visible in Q1 2026 earnings.

The key risk is that the national overlap math (low merchant share × low card penetration) limits the addressable geography to specific neighborhoods where both Cash App and Square are dense. The key opportunity is that in those neighborhoods, the closed-loop economics are compelling for both merchants (~4.25% fully loaded vs. 15-30% on DoorDash) and consumers (10% back on every order, spendable anywhere in the network). If Block can demonstrate that dense neighborhoods generate meaningfully higher GPV and engagement than non-dense areas, the strategy becomes a resource allocation question (invest in the right neighborhoods) rather than a viability question.

The transition from F&B to other verticals (retail, beauty, services) is the next major expansion milestone. The infrastructure is already built — the APK teardown shows Local Cash, loyalty, ordering, and delivery capabilities that are not F&B-specific. The limitation is operational (merchant onboarding and support), not technical.
