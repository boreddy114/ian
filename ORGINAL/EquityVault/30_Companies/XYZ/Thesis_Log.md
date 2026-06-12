# XYZ (Block) — Thesis Log

---

## 2026-05-01 — APK Diff: Cash App v5.42.1 → v5.45.0 (48-Day Delta)

**Source:** Cash App APK v5.45.0 (build 5450008), pulled from device via ADB, diffed against v5.42.1 baseline from March 14 teardown
**Trigger:** Periodic APK monitoring cycle — 3 minor versions shipped in 48 days
**Related files:** `APK_Teardown_CashApp_DIFF_2026-05-01.md`, `20_Library/APK Work/cashapp-teardown/v5.45.0/`

### High-Signal Findings

**1. Stablecoin: Solana-Only → Multi-Chain Product (🔴 Major Escalation)**

The stablecoin product expanded materially in 48 days:
- **Networks:** Solana-only → Solana, Ethereum, Arbitrum, Polygon (4 chains)
- **Flows:** Deposit-only → Full send/withdrawal flow added. Users can now send USDC on-chain funded from Cash balance or linked debit card. "We convert your dollars to USDC 1:1 when you send."
- **Branding:** Shifted from USDC-specific ("Receive USDC, spend in USD") to generic stablecoin language ("Deposit stablecoins. Spend dollars. Instantly.") — likely preparing for multi-token support (USDT)
- **Safety:** New cross-coin disclaimer ("Selecting the wrong coin may result in unrecoverable funds") confirms multiple coin types are supported or imminent
- **Assessment:** Cash App is becoming a stablecoin on/off ramp. Inbound: receive stablecoins on any major chain → instant USD in Cash balance. Outbound: send USD from Cash balance as USDC on-chain. Competes with Coinbase as the bridge between on-chain and real-world spending. Revenue model likely a spread/fee on conversions. Multi-chain support positions as universal gateway regardless of counterparty chain.
- **Strategic context:** Combined with the existing remittances infrastructure (country selection, region routing from March teardown), stablecoins on Solana (~400ms settlement, near-zero fees) create a low-cost international money transfer rail. The US→Latin America remittance corridor is the obvious first target given the Spanish localization experiments.

**2. ETFs Added to Investing (🔴 New Product Line)**

Strings changed from "Buy stocks" → "Buy ETFs and stocks" across discovery and welcome screens. Cash App investing expands from single stocks to diversified products. Broadens TAM to users who want index fund exposure without picking individual names. Competitive positioning shifts closer to Robinhood/Fidelity.

**3. Cash Credit Score: Proto Definitions → Full Standalone Package (🔴 Major Escalation)**

In March, Credit Score existed only as proto types under `squareup.lending` namespace. Now promoted to a full `com/squareup/cash/score/` package with:
- Dedicated home screen (`ScoreHomeScreen`)
- Applet tile for Cash App home (`ScoreAppletTilePresenter` with Installed/Uninstalled/Loading/Failure states)
- Recommendation overlays and FAQ sections
- Gamified score locks: "Increase your score to unlock {label}"
- Same applet architecture as Borrow, Afterpay, Savings

**Assessment:** Credit Score is the top-of-funnel for lending. Show users their score → give improvement recommendations → funnel into Borrow when eligible. The gamification layer (score locks that unlock) is a retention/engagement mechanism. This is the product that connects the credit-led growth story to a user engagement story — if users are actively monitoring and improving their score in Cash App, they're stickier regardless of whether they borrow.

### Medium-Signal Findings

**4. AI Edge: On-Device ML (New Package)**
`com/squareup/cash/aiedge/` — ML Kit–based on-device title generation. Confirms Block's layered AI strategy: on-device ML for lightweight tasks (transaction categorization, auto-suggest), proprietary models for Moneybot conversational AI. No external LLM APIs in binary — consistent with March finding.

**5. Moneybot Goes Multimodal**
New camera and photo attachment strings. Users can send images to Moneybot. Combined with `aiedge` ML Kit, enables receipt scanning, check deposit via photo, bill capture. Transforms Moneybot from text-only to visual AI assistant.

**6. Money Streaming: New Visualization Package**
`com/squareup/cash/moneystreaming/` — chart view models with point annotations and range filter chips. Real-time cash flow visualization. Could be spending insights evolution or something more novel (programmable money streams?).

**7. Work Applet: Timecard Management Expansion**
C4B Work Applet expanded from simple clock-in/out to full time-and-attendance: regular hours, overtime, paid/unpaid breaks, cash tips, shift notes, scheduled vs. actual shift time, edit capability. Moving toward lightweight payroll/workforce management. Positions Cash App as Homebase/When I Work competitor bundled free inside the payment app.

**8. Families: Sponsor Resources Hub + U13 Celebration**
Dedicated parental control hub with features & limits, merchant restrictions, allowance setup. Privacy-first managed account profiles. Under-13 celebration UI with Konfetti animation library. Card issuance for managed accounts: "{0}'s first card—with limits." Multi-year product build continuing on track.

**9. Neighborhoods: Commerce Platform Depth Confirmed**
The string diff was minor (footer copy change, map clustering), but reviewing the full Neighborhoods string set revealed the product is far deeper than previously documented. Full ordering system with menus, customization, cart management, checkout, loyalty/rewards, coupons, delivery with courier tracking, curbside pickup with vehicle identification, scheduled orders, gift cards, and "Local Cash" merchant credit. This is a complete commerce platform — Cash App's equivalent of Uber Eats/DoorDash embedded inside the consumer wallet.

Delivery network is most likely merchant-fulfilled (pickup/curbside primary) with white-label logistics partnerships for actual delivery (DoorDash Drive or similar — invisible to consumer, just dispatches a courier). Square Online already operates this model. The consumer never sees a third-party brand.

**10. Fidesmo NFC SDK (New)**
NFC secure element provisioning SDK added. Enables mobile payment card provisioning — potentially Cash Card tap-to-pay directly from phone without physical card, or enhanced digital wallet provisioning.

**11. Overdraft: Promoted to Home Screen**
Overdraft balance now displayed on home screen with active upselling ("Turn on free overdraft coverage"). Full turn-off confirmation with repayment warning. Suggests overdraft is becoming a meaningful engagement/retention feature.

### Notable Absence

**Cash Mobile promotion removed.** The "Cash Mobile — Best coverage for $35/mo" promoted applet tile strings were deleted. Phone Plans package still exists with new sync values, so the product isn't dead — but it's being de-emphasized or reworked. Worth watching.

### Thesis Tracker Impact

| Tracker | Signal | Direction |
|---|---|---|
| Credit-adjusted GP growth | Credit Score as full product + Borrow unchanged | Neutral — score product could improve credit quality over time but near-term growth still credit-led |
| Neighborhoods density | Commerce platform deeper than expected; rebranding tightened | Mildly positive — infrastructure is real; execution/adoption still unproven |
| Borrow loss rates | No changes to Borrow in this diff | No update |
| **New signal** | Stablecoin multi-chain launch readiness | Potential non-credit revenue source if conversion fees materialize at scale |
| **New signal** | ETFs expand investing TAM | Incremental revenue diversification |

### Open Questions Updated
- Stablecoin: when does it go live publicly? Fee structure? USDT support confirmed?
- ETFs: which ETFs? Commission structure? Fractional ETF shares?
- Credit Score: launch timeline? Does it feed into Borrow credit line decisions?
- Money Streaming: what is this actually? Spending insights v2 or programmable money?
- Cash Mobile: paused, restructured, or just server-driven now?
- Neighborhoods delivery: confirmed DoorDash Drive or alternative logistics partner?

---

## 2026-04-03 — IC Memo: The Upside-Down Bank

**Rating:** Neutral
**Thesis:** Block's headline GP growth is 100% credit-led and halves when loan losses are properly burdened. The technology platform (agentic commerce stack, Goose orchestration, closed-loop Neighborhoods) is genuinely differentiated but has not yet produced a non-credit growth source. The stock works on the AI narrative and accelerating EBIT; it breaks when the market re-describes it as a subprime lender.
**Tracker:**
1. Credit-adjusted GP growth rate (reported ~30% vs. adjusted ~15% in 2025)
2. Neighborhoods density and engagement post-subsidy (Q1 2026 first clean quarter)
3. Borrow loss rates through macro slowdown (sub-585 FICO, untested)

**Changes from prior work:** Formalized the existing Neutral into a full IC memo. Integrated APK teardown findings (Moneybot, Weaver, Fillr, MRI attestation, Goose), IR call insights (Amrita on data moat, Claude Code as RIF catalyst), and credit analysis (perpetual recycler, FCF swing, Utah ILC mechanics). Added Neighborhoods as the primary upgrade catalyst.
**Active file:** `IC_Memo.md`

---

## 2026-03-24 — Cash App Taxes: APK-Sourced Capability Assessment

**Source:** Cash App APK v5.42.1 teardown (strings, routes, flags files) — `CashApp_strings.txt`, `CashApp_routes.txt`, `CashApp_flags_experiments.txt`
**Trigger:** Ian question on Cash App tax filing capabilities — AI, partner, and filing scope

### Finding

Cash App Taxes is a WebView-delivered, proprietary, in-house tax filing product. Key determinations from the binary:

**Architecture: WebView wrapper, not native**
Routes `ViewTaxesWebApp`, `ViewTaxesWebAppRoot`, `ViewTaxesHub` confirm the entire tax prep experience is a web app loaded inside a WebView shell. The native layer is only chrome: toolbar, navigation, permission dialogs, camera access for W-2 capture. The tax engine runs server-side (web) — the app is a delivery mechanism, not an engine.

**AI: None**
No ML model references, inference flags, or language model integrations exist in the taxes namespace. The `MlSuggestionsSyncValue` experiment is P2P-only. Moneybot infrastructure and the taxes stack have zero intersection. Rules-based Q&A interview flow confirmed by absence of any AI signals.

**Partner: None — fully in-house**
Strings confirm: *"Tax preparation services provided by Cash App Taxes, Inc."* — legally distinct entity, holds its own IRS EFIN. Product was acquired from Credit Karma Tax (divested as DOJ condition of Intuit/Credit Karma deal, Nov 2020). Proprietary engine, no licensed third-party tax software. Confirmed by `enable_tes_based_taxes_entry_point` flag — "TES" = Tax Engine Service, their own backend.

**Filing: Full e-file — prep AND submission**
Cash App Taxes is an authorized IRS e-file provider. Routes include document generation (`ViewDocumentAllBtcTaxForms`, `ViewDocumentStockTaxFormList`, etc.), PDF export (`tax_web_default_pdf_filename`), and camera W-2 import. Transmits directly to IRS — no paper, no third-party transmitter.

**Closed-loop BTC import advantage**
String: *"Automatically import your Cash App bitcoin transactions in one step when filing with Cash App Taxes."* (`bitcoin_taxes_tof_body`) — no competitor can replicate this for Cash App users. Structural integration advantage.

### Active Flags Worth Watching

| Flag | Signal |
|---|---|
| `business_accounts_profile_tax_experience` | Separate tax UX for business accounts — self-employed/gig worker expansion in development |
| `enable_tes_based_taxes_entry_point` | TES backend migration of entry point — backend modernization in progress |
| `show_uninstalled_taxes_first` | Acquisition funnel test — showing Taxes before onboarding |
| `show-money-tab-tax-banner` | Seasonal cross-sell from Money tab |
| `taxes_applet_tile_data` | Server-driven home tile — A/B testing entry point |

The `business_accounts_profile_tax_experience` flag is the most investment-relevant signal. A differentiated tax experience for Cash for Business users would serve the Schedule C / 1099-NEC self-employed segment — higher complexity, higher engagement, direct funnel into Borrow and banking products.

### Strategic Read
The tax product is a customer acquisition and direct deposit funnel mechanism, not a standalone monetization play. A user who files through Cash App Taxes is highly likely to direct their refund into Cash App balance — deepening the financial relationship. The engine has no moat from a technology standpoint (no AI, no differentiated filing capability vs. FreeTaxUSA), but the bitcoin import integration and the C4B tax expansion represent meaningful differentiation for the specific user segments Cash App targets.

### Related Files
- `APK_Teardown_CashApp_2026-03-14.md`
- `CashApp_strings.txt`, `CashApp_routes.txt`, `CashApp_flags_experiments.txt`

---

## 2026-03-17 — Stripe/PayPal Strategic Rationale: Block Architecture as Framework

**Source:** Bloomberg/Reuters/PYMNTS reporting (Feb 24 2026) + Block APK teardown synthesis  
**Trigger:** Stripe rumored to be considering acquisition of all or parts of PayPal at ~$43B vs Stripe ~$159B valuation

### Finding

The Block two-sided closed loop provides the analytical framework for understanding exactly what Stripe lacks and why PayPal is the logical fill.

**Block's loop anatomy (from APK teardowns):**
1. Behavioral graph (CDP — proprietary, feeds Weaver recommendations)
2. Consumer identity + credential (Cash App account, 56M MAU history, biometrics)
3. Merchant-side integration (Cash App Local embedded in Square POS — tips, auth UI, rewards, screensaver layer)
4. Payment rail sovereignty (MRI attestation — no external trust chain dependency)

**Stripe's gap mapped against Block:**

| Block capability | Stripe today | What PayPal fills |
|---|---|---|
| CDP/behavioral graph | Transaction data only — no behavioral layer | Venmo social + commerce graph, 439M PayPal account history |
| Consumer identity/credential | Link (200M programmatic wallets, low consumer visibility) | PayPal/Venmo branded credential, biometric auth, passkeys at scale — 36% "checkout ready" |
| Merchant-side integration | Dominant (Stripe IS the merchant layer) | Braintree fills enterprise gap (Uber, Airbnb, GitHub) |
| Payment rail sovereignty | ACP — Stripe governs protocol but lacks consumer-side trust anchor | PayPal stored credentials + Venmo wallet = Stripe controls both sides of ACP trust chain |

**The core insight:** ACP without a consumer trust anchor is better merchant plumbing, not a closed loop. Block understood this architecture first and built it in-house (MRI attestation = self-sovereign trust chain). Stripe's answer appears to be acquisition. If Stripe acquires Venmo + PayPal checkout infrastructure, it can be the trust anchor on both sides of an agent-initiated transaction — which is the ACP endgame.

**Probable Stripe asset priority ("all or parts" language):**
- High: Venmo (100M+ accounts, behavioral flywheel — 40% week-over-week re-engagement), PayPal branded checkout, biometric/passkey auth layer
- Lower: Braintree (channel conflict risk), international business (complexity), credit/lending (unfamiliar risk book)
- Unlikely: Xoom, PayPal crypto wallet, any brand dilution plays

**Competitive implication for Block:**
- Stripe + Venmo = digital-first closed loop (agent commerce in browser/app)
- Block = physical-world closed loop (Cash App Local at Square POS)
- These are overlapping but not identical surfaces today
- Risk: if Venmo becomes the default ACP consumer credential for agent commerce, Cash App's TAM gets bounded to the physical world — smaller than Block's full vision
- Moat check: SquarePOS teardown confirms physical integration depth is real (520-file cashapplocal package, tip/auth/rewards/screensaver all Cash App-branded). Toast/Stripe have no equivalent physical consumer wallet integration.

### Open Questions
- Does Stripe close a full deal or carve-out (Venmo only)?
- Does PayPal management resist or facilitate?
- ACP merchant adoption velocity — Walmart, Etsy, Instacart confirmed; what's the Q1 2026 count?
- If Stripe/Venmo closes, does Block accelerate Cash App Pay merchant acquisition?

### Related Files
- `APK_Teardown_CashApp_2026-03-14.md`
- `APK_Teardown_SquarePOS_2026-03-16.md`
- Prior entries: 2026-03-14 Agentic Commerce Architecture; 2026-03-14 Agent Payment Protocol Positioning

---

## 2026-03-14 — APK Teardown: Agentic Commerce Architecture

**Source:** Cash App APK v5.42.1, full binary teardown (2026-03-14)  
**Trigger:** Binary analysis of com.squareup.cash pulled from connected Pixel device

### Finding
The Cash App binary contains a coherent, four-layer agentic commerce stack. This is not a collection of unrelated features — the components fit together into a plausible "AI-assisted checkout" architecture:

**Layer 1 — Weaver (recommendation engine)**
First-party ML service at `squareup.cash.weaver.api`. Has its own `WeaverApi`, proto types (`GetRecommendationsRequest`, `RecommendationInput`, `RecommendationItem`, `RecommendationSet`), dedicated SQLite table (`weaverRecommendationsResponses`), and a background client route (`RefreshWeaverRecommendationsInBackground` → `/dl/background/weaver/refresh/`). Runs proactively without user initiation; results surface as Money Tab applet tiles. Two active experiments: `NativeMoneyAppletServerRecommendations` (LaunchDarkly) and `MoneyAppletServerRecommendationsV2` (Amplitude).

**Layer 2 — Fillr (checkout execution)**
Full Fillr SDK with cart extraction capabilities beyond standard autofill: `FillrCartInformationExtractionInterface.start()` reads cart contents from merchant web pages; `PopWidgetInterface.startMonitor()` monitors checkout fields in real time; `setCartInformationExtractionListener()` tracks cart state changes. Walmart explicitly managed via `CashFillWalmartShoppingAutofillDisabled` flag — named merchant integrations exist. `CommerceBrowserEditAutofill` LaunchDarkly flag gates the edit UX.

**Layer 3 — CDP (behavioral feedback loop)**
In-house customer data platform at `app.cash.cdp`. `CashCDP` + `CashCdpConfigProvider`, `analytics_message` table (UUID + payload), tunable via `CdpInteractivitySessionTimeout` and `CdpLibraryBatchSize` LaunchDarkly flags. Built in-house rather than on Segment/Amplitude — behavioral signal stays proprietary and feeds Weaver.

**Layer 4 — Draft Payments + Platform Pay (human-in-the-loop)**
`ViewDraftPayment` client route allows payments to be staged before execution — the "prepare but don't fire" state required for agentic transactions. `ExpressivePaymentsDrafts` Amplitude experiment testing the draft UX. `ClientP2pPlatformPay` and `ClientTransfersPlatformPay` experiments test payment initiation from third-party/platform contexts. `ViewPaymentPersonalizationSend` provides personalized send flow with recipient context.

### Full Flow (Assembled)
> **Moneybot** (natural language intent) → **Weaver** (proactive recommendation, background) → **Fillr** (cart reading + checkout autofill on merchant web) → **CDP** (behavioral feedback) → **Draft Payment** (user review + approval) → execution

### Investment Implication
Block is building the agent stack in-house. No external LLM API references (OpenAI, Anthropic, Google) anywhere in the binary — proprietary infrastructure end-to-end. The draft payment pattern is the structural tell: it implies an agent that prepares transactions for human review, not just a smarter UI. This is the correct architecture for agentic commerce with appropriate trust/safety guardrails.

If this executes, Cash App becomes the execution layer for AI-initiated commerce — a structural beneficiary of the agentic commerce theme (see `40_Themes/Software/`). Moat argument: 56M monthly actives × behavioral graph (CDP) × payment rails × Fillr checkout execution is hard to replicate. The closest analog is what Visa/MA represent to card-on-file — Cash App is positioning as the card-on-file for AI agents.

### Open Questions
- What's the merchant coverage of Fillr integration? Walmart is named — who else?
- Is Weaver cross-product (recommending Borrow, Afterpay, investing) or commerce-only?
- Timeline on Moneybot general availability — still in Amplitude experiment
- Draft payment UX: agent-initiated or user-initiated drafts?

### Related Files
- `APK_Teardown_CashApp_2026-03-14.md` — full teardown with all signal categories

---

## 2026-03-14 — Agent Payment Protocol Positioning (ACP / UCP / AP2)

**Source:** Cash App APK v5.42.1 binary analysis + protocol landscape mapping  
**Trigger:** Ian's question re: Block's alignment with emerging agent payment standards

### Finding
**Block is not coding to ACP, UCP, or AP2.** No protocol references exist anywhere in the binary — no OpenAI, Stripe ACP, Gemini, or Google AP2 identifiers. This is deliberate architecture, not omission.

### Block's Proprietary Equivalents

**MRI (Mobile Runtime Integrity) — Block's answer to AP2**
Block built their own cryptographic attestation layer rather than adopting Google's AP2/Encasement standard:
- `SignedSerializedMRIContext` is a required field in `CreatePaymentRequest`, `ProvisionKeysRequest`, `ValidateTapToPayPolicyRequest`, and `PublishClientTrustSignalsRequest`
- `SendSignedMRIContextRequest/Response` — dedicated endpoint publishes signed device context before payment execution
- `PublishClientTrustSignalsRequest` bundles `SignedSerializedMRIContext` + `MRIContext` + `SigningData` — three-layer attestation
- `MRIFactory` injected into TapToPay presenter — device integrity is a precondition for payment, not a post-hoc check

Architecturally identical to AP2's goal (cryptographic, attested agent transactions) but fully self-contained. Block controls the attestation root; Google does not.

**Stablecoin URI — Block's answer to ACP's Stripe-gated payment token**
The binary contains a URI-addressable payment rail trilogy:
- `ViewBitcoinUri` (live)
- `ViewLightningUri` (live)
- `ViewStablecoinUri` (compiled, not live)

All three follow the same pattern: an agent can call a URI and the app resolves it natively, no external protocol governance required. This is Block's alternative to ACP's Stripe-connected merchant requirement — an open, agent-callable payment address with stablecoin as the value unit and MRI as the trust proof.

**Pay Links — Block's answer to ACP's governed payment token scheme**
Full `PaymentLinkRepository` with `CreatePaymentLinkResult`, `P2pCreatePaymentLinkFlowParameters`, `AdminCreatePaymentLinkResponse`. A shareable, self-hosted payment link standard with no Stripe/OpenAI in the trust chain.

**Weaver + Fillr — Block's answer to UCP's Google-above-the-payment-step model**
Rather than letting Google surface products and collect the consumer relationship, Weaver runs recommendations in-app (background refresh) and Fillr executes checkout directly. Google Pay is present in the binary only as a card provisioning pathway and funding source — explicitly kept downstream of the transaction, not above it.

### Protocol Comparison

| Protocol | Block's conflict | Block's in-binary answer |
|----------|-----------------|--------------------------|
| ACP (OpenAI/Stripe) | Cash App Pay competes with Stripe at the merchant layer — won't cede trust hierarchy | MRI attestation + Pay Links (no Stripe dependency) |
| UCP (Google/Retail) | Google above the payment step captures consumer relationship, commoditizes CAP | Weaver (in-app recommendations) + Fillr (cart execution) |
| AP2 (Google/Encasement) | Adopting AP2 means Google controls the attestation root | MRI is their AP2 — same cryptographic intent, proprietary root |

### Strategic Read
Block's positioning is consistent with Jack Dorsey's publicly stated view: open monetary protocols (Bitcoin → Lightning → stablecoin) should be the base layer, not governed schemes controlled by OpenAI or Google. The `ViewStablecoinUri` architecture — an agent-callable URI resolved through MRI-attested infrastructure — is the embryo of a payment rail for the agentic economy that operates outside ACP/UCP/AP2 entirely.

### Key Risk
ACP and UCP already have merchant adoption (Walmart, Etsy, Instacart on ACP per Ian's notes; Shopify, Target, Wayfair on UCP). Block's URI/stablecoin rail is consumer-side infrastructure without a matching merchant network today. The binary can show what Block is building; it can't show whether merchants will meet them there. Merchant adoption velocity on Cash App Pay is the critical variable the APK teardown cannot answer.

### Open Questions
- Does Block participate in any ACP/UCP working groups? (Not visible in binary — needs IR/conference channel check)
- Is the stablecoin URI standard intended to be open (like Lightning's BOLT spec) or proprietary?
- Cash App Pay merchant count and growth rate — last disclosed figure was ~25K merchants; where is it now?

### Related Files
- `APK_Teardown_CashApp_2026-03-14.md` — full teardown
- Prior entry: 2026-03-14 Agentic Commerce Architecture

---

## 2026-03-14 — Moneybot Architecture Deep Dive

**Source:** Cash App APK v5.42.1, `com.squareup.cash.moneybot` package (50+ files)  
**Trigger:** Binary analysis of Moneybot-specific classes and string resources

### Finding
Moneybot is not a chatbot. It's a function-calling agent with persistent memory, extended reasoning, generative native UI, and the ability to trigger any action in the app. The infrastructure is production-grade despite being gated behind two Amplitude experiments.

### Architecture Components

**Function Calling — `launch_flow` tool**
`ExtensionConfig$Tool` preserves the full tool definition. The only registered tool is `launch_flow`, which takes a `client_route` parameter (free-form string), `header_text`, `description`, and `button_text`. The model generates the `client_route` value — meaning it can route to any of Cash App's 100+ screens (`ViewBorrow`, `ViewStablecoin`, `ViewSavingsGoal`, `ViewBills`, `ViewPayLink`, `ViewBorrowCreditLimit`, etc.) without hardcoded intent mappings. When called: app opens the screen, user completes the action, Moneybot receives a callback with the result. Tool-use + human-in-the-loop in a native app context.

**Persistent Memory**
`MemoryTooltip` + `MemoryTooltipData` — cross-session memory, not just context window. Model references remembered facts inline in chat; a tooltip surfaces to show the user when memory is being used. `RealMoneybotMemoryTooltipManager` handles dismiss state.

**Extended Reasoning**
`ThinkingTextKt` renders five thinking-state messages; string 5 is "Thinking longer for a better answer" — explicit extended reasoning mode distinct from standard response. Variable compute time, user-visible.

**Generative Native UI (GenUI)**
`RealGenUiManager$generateUi`, `ClientRenderableRendererKt` — model generates six native Compose UI types server-side:
- `ActionCard` (tap behavior, primary/secondary buttons)
- `ActivityList` (transaction history)
- `CellList` with `TappableCell`
- `InsightChart` (`LineGraph` + `VerticalStackedBarGraph`)
- `NavigationCard` (navigates to another screen)
- `Error` (structured error state)

Not markdown in a webview — structured data mapped to native Compose components. `GenUiPlaygroundScreen` is an internal tool for engineers to test generated layouts.

**System Preamble**
`MoneybotPreambleEditorPresenter/Screen` — live system prompt tunable server-side without an app update. `moneybot_system_preamble_override_indicator` is visible to engineers when a non-production preamble is active. Block iterates on model behavior through preamble, not binary releases.

**Token Usage + Model Name**
`TokenInfo(modelName, tokenLimit, tokenUsage)` — model name is user-visible in production (gated by `MoneybotShowDebugOptions` flag for now). Multiple models anticipated — `modelName` is a string field, not a hardcoded constant.

**Context-Aware Session Kickoff**
`ChatKickoffParams(initialMessages, sessionId, autoSend)` — sessions can be pre-populated with messages that fire automatically. Mechanism for "tap a transaction → Moneybot opens with context pre-loaded, auto-sends the question." Zero user input required to start a contextual session.

**Streaming**
`MoneybotStreamingError`, `RealChatManager$onFullResponse` — token-level streaming implemented. Response streams as it generates, not delivered as a block.

**Feature Flag State**
- `MobileMoneybotChat` (Amplitude) — full chat interface, not GA
- `ClientMoneybotNav` (Amplitude) — navigation integration, not GA
- `MoneybotCachedSessionIdTimeoutSeconds`, `MoneybotLoadingDelayMilliseconds` (LaunchDarkly) — operational tuning
- `MoneybotShowDebugOptions` (LaunchDarkly) — debug tools off in production

### Compounding Architecture Note
The `launch_flow` + `client_route` design means each new Cash App product (stablecoin, credit score, bills) is automatically accessible to Moneybot without incremental AI integration work. The agent's capability surface grows with the product surface automatically. This is a structurally compounding architecture.

### Critical Missing Capability
No proactive/outbound Moneybot evidence in binary. It responds to user queries and launches flows, but there's no trigger mechanism for Moneybot to initiate a session ("your paycheck hit — want me to move $200 to savings?"). The next evolution would combine Moneybot function-calling with Weaver's proactive background recommendation engine. That wiring is not present yet.

### Open Questions
- How many `client_route` values does the model actually know? Is the full route catalog in the system preamble?
- Is GenUI currently live for any users or fully gated?
- What triggers `autoSend: true` in `ChatKickoffParams` — which surfaces pre-populate Moneybot?
- Multi-model: what models are being evaluated? `TokenInfo.modelName` implies at least two.

### Related Files
- `APK_Teardown_CashApp_2026-03-14.md` — full teardown
- Prior entries: 2026-03-14 Agentic Commerce Architecture; 2026-03-14 Agent Payment Protocol Positioning
