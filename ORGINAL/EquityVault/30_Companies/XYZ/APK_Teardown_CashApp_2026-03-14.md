# Cash App APK Teardown
**Date:** 2026-03-14  
**Version:** 5.42.1 (versionCode: 5421002)  
**Source:** Pixel device, full base.apk (108MB) + splits  
**Tools:** apktool 3.0.1, jadx 1.5.5  
**Analyst:** Vince / EquityVault

---

## Executive Summary

This teardown surfaces **five investment-relevant signal clusters** in the current Cash App binary. The most significant: a full stablecoin product (send + deposit + URI routing) exists in compiled, routable code that is not live in the current public app. Credit score is also deeper than marketed — full proto definitions under `squareup.lending` namespace suggest internal infrastructure well beyond a thin Experian wrapper. Moneybot (AI chat) is in active experimentation with navigation changes. International remittances infrastructure is built out with country-selection sync values and dedicated routers. And Square seller-side tooling (C4B, Tap to Pay) is present in the consumer binary with a gated `WorkApplet` and active eligibility state management.

---

## Section 1: Feature Flags & Experiment Infrastructure

**Flag system:** LaunchDarkly (primary) + Amplitude Experiments (A/B layer)  
**Total LaunchDarkly flags identified:** 170+  
**Total Amplitude experiments identified:** 100+

### Key Observations
- `RealFeatureFlagManager` is the central flag manager, backed by local SQLite (`featureFlagQueries`) with a flow-based update architecture — flags are streamed in real time, not polled. This is sophisticated infrastructure.
- Flags are evaluated via `peekCurrentValue()` — meaning most gated features are **compiled into the binary** and toggled server-side. Nothing below is speculative; it exists in bytecode.
- `experimental_features` JSON field is parsed from server responses, suggesting a secondary dynamic experiment layer beyond LaunchDarkly.

---

## Section 2: Lending / Credit Expansion — 🔴 HIGH SIGNAL

### 2a. Borrow (Personal Loans)
**Status: SHIPPED but actively expanding**

Full UI stack present:
- `ViewBorrowLanding`, `ViewBorrowApplet`, `ViewBorrowAmountPicker`, `ViewBorrowRepay`, `ViewBorrowRepayCustomAmount`, `ViewBorrowLimitHub`, `ViewBorrowLimitHubBulletinInfo`, `ViewBorrowBenefitsLeaflet`, `ViewBorrowCreditLimit`
- `BorrowLimitHubViewModel` with `IncreaseLimitActionsSection` — **increase-limit flow exists in code**, not publicly advertised
- `BorrowEntryPointVerboseLogging` LaunchDarkly flag — suggests active monitoring of entry point conversion
- `BorrowMultiStepLoadingKt` — multi-step loading states suggest a more complex underwriting or approval flow than simple instant loans

Database schema additions found:
```
loan table: bnpl_data (BLOB), lending_product (TEXT)
loanTransaction table: lending_product (TEXT)
payment table: lending_loan_token (TEXT)
```
The `lending_product` column on both `loan` and `loanTransaction` tables — alongside `bnpl_data` as a separate BLOB — strongly implies the lending stack supports **multiple product types** (not just the current "Borrow" personal loan), with BNPL as a distinct tracked product.

### 2b. BNPL / Afterpay Integration
**Status: LIVE (Afterpay applet) + UNGATED EXPANSION infrastructure**

- Full `AfterpayApplet` with `PaymentCalendar`, `HeroBalanceSection`, `PrepurchaseToggleSection`, `AfterpayCardSection`, `StandaloneCreditSectionHeader`
- `ViewDocumentAfterpayMonthlyStatement` and `ViewDocumentAfterpayStatements` — full statement document generation
- `AfterpayStatementDocuments` Amplitude experiment — still testing statement UX
- `AfterpayAppletV3OptimizationExperiment` — version 3 optimization in experiment, suggesting V3 is not yet fully rolled out
- `AfterpayEmbeddedViews` LaunchDarkly flag — embedded view variant is gated, not default
- `DeprecatedViewPrepurchaseAfterpayApplet` — old prepurchase flow being deprecated, replacement active
- Proto namespace: `bnpl_data` stored as BLOB in loan table — Afterpay transaction data is being persisted in the unified lending data model alongside Borrow loans. **Convergence of the two products at the data layer is confirmed.**

### 2c. Cash Credit Score
**Status: BUILT, PARTIALLY GATED — this is NEW**

This is the most surprising finding in the lending section. A full credit score product exists under the `squareup.lending` proto namespace:

Proto types found:
- `CashCreditScoreEntryPointData` (InstalledState, UninstalledState, Action, Subtitle)
- `CashCreditScoreHomeData` (Graphic.Card, InfoSection, ScoreSummary, ScoreSummaryOverlayData, Visualization.ScoreLock, RecommendationOverlayData, TitleBar, DisclaimerSection)
- `ViewCashAppScore` client route with deep link: `launchCashAppScore`
- `cash_credit_score_summary` and `cash_credit_score_sync_data` in URL parameters

**Investment read:** This is not a thin credit monitoring widget. The proto structure — with `ScoreLock`, `RecommendationOverlayData`, `Visualization` types — suggests a full credit score home screen with score improvement recommendations. The `InstalledState` / `UninstalledState` pattern is the same applet architecture used for Borrow, Afterpay, and Savings. **Cash is building a credit score product as a first-class applet**, likely to serve as both a standalone product and a top-of-funnel for Borrow credit line increases.

---

## Section 3: Banking / Savings — 🟡 MEDIUM-HIGH SIGNAL

### 3a. Savings Multiple Goals
**Status: GATED — `SavingsAppletMultipleGoals` LaunchDarkly flag**

`ViewSavingsGoal` and `ViewDependentSavingsGoal` routes are present, but `SavingsAppletMultipleGoals` is a distinct feature flag — current app appears to support one goal; multi-goal is built and gated.

### 3b. Cash Green / Banking Tier
**Status: ACTIVELY EXPERIMENTING**

- `BankingCashGreenRelease` Amplitude experiment
- `BankingPackagingRelease2cLaunch` Amplitude experiment — "2c" suggests third iteration of packaging test
- `AmplitudeExperiments$CashGreenPdsaExplainerHalfSheet` — PDSA (Product Disclosure Statement) experiment, half-sheet variant
- `RefreshCashGreenSyncValues` called in multiple presenters — real-time benefit state management
- `GreenHubAdditionsCta` LaunchDarkly flag — new CTAs being tested on the Green Hub
- `GreenBenefitsV1.Benefit.BorrowBenefit` — Borrow is a listed benefit in the Green (premium banking) tier

### 3c. Overdraft
**Status: LIVE with active experimentation**

- `MobileBankingEvergreenOverdraft` Amplitude experiment — "evergreen" naming suggests this is an ongoing conversion optimization test
- `MobileBankingEvergreenProgressBar` — progress bar variant for overdraft upsell
- `ViewOverdraftCoverage` deep link: `/dl/view/overdraft-coverage/` and `/launch/overdraft-coverage/`
- `OverdraftStatus.PermanentlyDisabled` state — some users being permanently locked out, suggesting risk-tiering
- `overdraftlyService.computeOverdraftSyncValues` — dedicated microservice for overdraft state

### 3d. Round-Ups (Investing)
- Deep links for round-ups onboarding, confirmation, failed, skipped flows — full funnel instrumented
- Bitcoin round-ups enrollment separate from stock round-ups — both active

---

## Section 4: Stablecoin — 🔴 HIGH SIGNAL (Unreleased)

**Status: BUILT, NOT LIVE — fully gated**

This is the single biggest unreleased feature in the binary.

Client routes found:
- `ViewStablecoin` — main stablecoin home/applet
- `ViewStablecoinReceive` — receive flow
- `ViewStablecoinUri` — URI handler (stablecoin payment links)
- `StablecoinRouter` — dedicated router class, same architecture as Bitcoin/Investing routers

View models and views:
- `SendStablecoinModel` + `SendStablecoinViewKt.SendStablecoinView` — full send UI
- `StablecoinDepositViewModel$Loaded` + `SendStablecoinViewKt.StablecoinDepositView` — full deposit UI (called twice, suggesting two deposit entry points)
- `StablecoinDepositOptionsViewModel` — options screen for deposit method selection
- `stablecoinDepositCopyView` — copy/text management for deposit screen
- `stablecoinTradeView` — trade flow view

Feature flags:
- `BitcoinStablecoin` LaunchDarkly flag — master kill switch
- `BitcoinBtcxStablecoin` LaunchDarkly flag — BTCX-specific variant
- `BitcoinBlockStablecoin` LaunchDarkly flag — can block stablecoin for specific users
- `AmplitudeExperiments$BitcoinStablecoinMvp` — MVP experiment, not yet in general test

**Investment read:** The BTCX denomination and "block" flag suggest this is likely a USD-pegged stablecoin (possibly using a wrapped BTC or an in-house stablecoin product). The send + deposit + URI architecture mirrors the Bitcoin implementation exactly — Cash is treating stablecoin as a parallel rail to BTC, not an experimental curiosity. Given `BitcoinStablecoinMvp` is still in Amplitude experiments (not LaunchDarkly production flag), this is **pre-general-availability**. The infrastructure readiness implies a 2026 launch is plausible.

---

## Section 5: Square Seller Convergence in Consumer App — 🟡 MEDIUM SIGNAL

### 5a. Work Applet (C4B — Cash for Business)
**Status: GATED via `LaunchDarklyFeatureFlags$WorkApplet`**

- `WorkApplet` router exists in consumer binary — not just Square app
- `C4bEligibilityState` with 20+ tracked eligibility dimensions — deeply granular seller eligibility management embedded in consumer app
- `C4BOnboardingFlowParameters.EntryPoint.ENTRY_POINT_PROFILE` — business account onboarding can be triggered from the consumer profile
- `startBusinessAccountOnboardingFlow()` callable from consumer profile context — cross-sell is architected, not speculative

### 5b. Tap to Pay
**Status: LIVE (limited) — active expansion experiments**

- `MobileC4bTapToPay` Amplitude experiment — C4B-specific TTP test
- `TapToPayAmountMax` and `TapToPayAmountMin` LaunchDarkly flags — transaction limits actively being tuned
- `TapToPayDatadogRumTracking` flag — performance monitoring being instrumented, suggesting scale-up in progress
- `ViewTapToPayActivation` and `ViewTapToPayActivationWithToken` routes — two onboarding paths

### 5c. Listing / Marketplace
**Status: GATED**
- `ViewListingCreate` client route present — peer-to-peer marketplace listing creation flow exists in binary
- `ViewListing` (deprecated) also present — replaced by new listing create flow
- `ViewShopDynamicScreen`, `ViewShopDynamicScreenSearch`, `ViewShopSearchFilters` — robust shopping infrastructure

### 5d. Bills / Bill Pay
**Status: BUILT, GATED**

- `BillsApplet` full applet with `FullApplet` and `HalfApplet` variants
- `ViewBills` and `ViewBillsSearch` deep-link routes
- `BillsConfig` proto with `ClientRoute` configuration — server-driven bill pay navigation
- `has_linked_bills` parameter in ViewBills deeplink — linked bill account state tracked

---

## Section 6: International / Remittances — 🟡 MEDIUM SIGNAL

**Status: INFRASTRUCTURE BUILT, EXPANSION GATING ACTIVE**

- `GetRemittancesFlowScreen` with region parameter — dedicated remittance flow by region
- `RemittanceViewedRequest.ViewedType` (NUX_CONTINUED, NUX_DISMISSED) — onboarding funnel instrumented
- `InternationalPaymentsCountrySelectionSyncValue` with `DestinationCountryInfo` and `SupportedDestinationCountry` — server-driven country availability
- `InternationalPaymentsCountryNotificationSyncValue` — notifications when new countries unlock
- `crossBorderAvailableRegions` vs `remittancesAvailableRegions` — two distinct international payment product types tracked separately
- `AmplitudeExperiments$MobileRemittancesGlobeConfig` — globe UI configuration test
- `AmplitudeExperiments$LocalizationLanguageSpanish` — Spanish language experiment (US Hispanic market signal)
- `InputInternationalDb` with `IdType` — international ID document collection infrastructure

**Investment read:** Cross-border and remittances are tracked as distinct product lines with separate region availability sets. Spanish localization experiment + remittances infrastructure = structured push into the US Hispanic/Latin America corridor, which is the highest-volume remittance market.

---

## Section 7: AI / Moneybot — 🟡 MEDIUM SIGNAL

**Status: LIVE (basic) — significant expansion in experiment**

- `ViewMoneybotChat` client route — dedicated chat screen
- `MobileMoneybot Chat` Amplitude experiment — full chat interface being A/B tested
- `ClientMoneybotNav` Amplitude experiment — navigation to/from Moneybot being tested
- `ClientNavigationLiquidGlass` Amplitude experiment — new nav paradigm test ("liquid glass" suggests fluid, context-aware nav)
- `MoneybotLoadingDelayMilliseconds`, `MoneybotInterfaceSpaces`, `MoneybotCachedSessionIdTimeoutSeconds` — all LaunchDarkly flags suggesting active session management tuning
- `core_tab_moneybot` string resource with an alt navigation icon — Moneybot has a dedicated tab icon
- `ViewSupportChatFromMoneybot` route — support escalation path from Moneybot chat
- `ClientSupportAutomationChatBotTypingBubble`, `ClientSupportAutomationConnectedSupportHome` — AI support automation experiments
- `MlSuggestionsSyncValue` Amplitude experiment — ML-powered suggestions are sync-value driven (server-side, personalized)
- `AmplitudeExperiments$MobileOsP2pRecipientMlSearchAndroid` — ML recipient search in P2P send flow

**Note:** No external LLM API references found (OpenAI, Anthropic, etc.). Moneybot appears to be a proprietary model or hosted behind Cash's own infrastructure layer — consistent with Block's general approach of building internal AI vs. API-consuming.

---

## Section 8: Third-Party SDK Integrations

| SDK | Evidence | Investment Signal |
|-----|----------|-------------------|
| **Stripe** | Full `stripe.android` payment UI (CardMultilineWidget, StripeEditText, 3DS flows) | Deep Stripe dependency for card linking/3DS — `InstrumentLinkTransferFundsStripeEnabled` flag suggests Stripe is the default instrument link path |
| **Plaid** | `PLAID_LOGO_BLACK_BG_VALUE` SDK asset constant, bank linking flows | Standard; confirms Plaid for ACH bank linking |
| **Persona** (withpersona.com) | `com.withpersona.sdk2` — selfie workflow, inquiry UI, liveness detection | KYC/identity verification vendor — `SelfieWorkflow`, `UiWorkflow` suggest full identity check capability beyond basic onboarding |
| **Braze** | `BrazeSdkSetup` Amplitude experiment | Push notification + CRM layer — being tested for setup optimization |
| **LaunchDarkly** | 170+ production flags | Primary feature gate infrastructure |
| **Amplitude** | 100+ experiments | A/B testing layer |
| **Datadog** | `TapToPayDatadogRumTracking`, `EnableMobileObservabilityAndroid` | Performance monitoring |
| **Bugsnag** | Referenced in `RealFeatureFlagManager` | Crash reporting |
| **Lottie** | `LottieFeatureFlags` | Animation library |

---

## Section 9: Other Notable Signals

### Families / Teen Banking
- `FamiliesFamilyAppletPhaseFBitcoin` and `FamiliesFamilyAppletPhaseFStocks` — "Phase F" (6th phase) of families rollout — Bitcoin and stocks access for teen accounts being gated
- `FamiliesSponsorDrivenBlockingPhase_2C`, `Phase_3`, `Phase_4` — multi-phase rollout of sponsor-driven controls
- `FamiliesTrustedSponsorSelectionPhase_2` — sponsor (parent) selection UX in phase 2
- `TeenQrCode` flag — teen-specific QR code feature
- Investment read: Families is a multi-year product build. Bitcoin + stocks for teens is next (Phase F). This is a significant TAM expansion — ~30M US teens.

### Paycheck / Direct Deposit
- `OctPaychecksOnDirectDepositSetup` flag — paycheck distribution ("Oct" likely = October experiment cohort still live in code)
- `ViewPaychecksHome` and `ViewPaychecksDistributionSummary` — full paycheck management UI
- `DirectDepositEditPaycheckAllocationScreen.EditPaycheckQuestion` — users can edit paycheck routing allocations (auto-allocate to savings/investing/spending)
- `MobileDirectDepositSetupManualFlow` — manual DD setup experiment (vs. automated/employer-connected)
- `EarningsApplet` Amplitude experiment — separate earnings/paycheck applet being A/B tested as standalone product

### Payment Personalization / Expressive Payments
- `P2pExpressivePayments` experiment + `ExpressivePaymentsDrafts` — social/expressive P2P flow in experiment
- `ExpressivePaymentsArcadeMigration` LaunchDarkly flag — migrating expressive payments to Arcade (their Compose-based design system)
- `MusicExpressionSender` experiment — music sharing as part of payment context

### Pay Links
- `PayLinksRecipient` flag + `MobilePayLinksSender` experiment — persistent payment links (like a Venmo handle link) in active experiment
- `MobilePayLinksAddRecipientAsPrimaryCta` — recipient-first payment link UX

### Pools (Group Payments)
- `P2pPools`, `P2pPoolsAppletUpdates`, `P2pPoolsContributionNotes` experiments — group savings/payment pools product expanding
- `PoolsIncludeCreditCardContributions` flag — adding credit card as contribution source for pools
- `PoolsContributeControl` flag — contribution permission controls

---

## Investment Framework Mapping

| Signal | Theme | Bull Case Add | Risk / Counter |
|--------|-------|---------------|----------------|
| Stablecoin (built, ungated) | Crypto/Payments | New payment rail, potential fee revenue, reduces BTC volatility dependency | Regulatory; timing unclear |
| Cash Credit Score applet | Lending | Top-of-funnel for Borrow expansion; engagement + monetization | Credit cycle risk; CFPB scrutiny |
| BNPL + Borrow data convergence | Lending | Product bundling, increased LTV per user | Afterpay integration complexity |
| C4B / Work Applet in consumer binary | Square convergence | Seller onboarding from consumer side; cross-sell TAM | Execution; consumer/seller UX conflict |
| International remittances infra | TAM | US Hispanic corridor is massive; low competition vs. legacy players | Compliance, FX risk |
| Families Phase F (Bitcoin/Stocks for teens) | TAM expansion | 30M US teen TAM; ARPU lift | Regulatory (minor accounts investing) |
| Moneybot expansion | Engagement/AI | Lower support costs; personalization layer | Model quality; trust |
| Cash Green tier experimentation ("2c") | Banking ARPU | Premium tier monetization; Borrow benefit bundling | Customer willingness to pay |

---

## What's NOT in the Binary (Notable Absences)

- **Options trading** — no references. Consistent with public statements.
- **Margin lending** — no references.
- **ETF/mutual fund** — no references. Equities-only investing.
- **External LLM APIs** (OpenAI, Anthropic, Google) — none. AI is proprietary/internal.
- **Venmo/Zelle integration** — no direct integration; competitive positioning maintained.
- **Wire transfer expansion beyond existing** — `WireTransfersDeactivatedState` flag present, `IncreasedWireTransferInLimits` flag present — wire is being managed carefully, not expanded aggressively.

---

*Source: APK teardown of com.squareup.cash v5.42.1, 2026-03-14. Compiled code signals are indicative of product direction; gated features may not launch. Not investment advice.*
