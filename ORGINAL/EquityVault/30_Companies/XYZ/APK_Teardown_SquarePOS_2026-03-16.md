# Square Point of Sale APK Teardown
**Date:** March 16, 2026  
**App:** Square Point of Sale (com.squareup)  
**Version:** 6.98 (build 69800009)  
**Target SDK:** 35 (Android 15)  
**Min SDK:** 28 (Android 9)  
**APK size:** ~192MB (XAPK)  
**Analyst:** Vince / EquityVault  

---

## TL;DR for IC

Square POS v6.98 reveals a merchant software stack that is **far deeper and more integrated with Cash App than is commonly appreciated**. The app contains a complete Cash App Local payment surface embedded within the POS (tips, rewards, screensavers, cashback), a nascent "Square One" subscription tier, aggressive offline-mode investment, AI-adjacent features (OCR, Misnap/Veriff ID verification), and hardware integrations spanning 3 printer brands + Zebra barcode scanners. The Square-to-Cash App integration is not cosmetic — it's deeply wired into the checkout flow at the payment, tip, and rewards layers. This is a moat.

---

## 1. App Version & Build

- **Version:** 6.98 / build code 69800009
- Multi-variant APK (XAPK): base (139MB) + arm64 native libs (40MB) + en locale (8.7MB) + mdpi drawables (3.5MB)
- Built with Kotlin/Compose, targeting Android 15
- Uses Dagger/Anvil for dependency injection at scale — this is a large, modular codebase

---

## 2. Product Surfaces Identified

The `com/squareup` package tree maps directly to product areas. By file count, the largest modules are:

| Module | Files | What It Is |
|--------|-------|------------|
| `ui` | 6,504 | Core UI framework/components |
| `protos` | 4,883 | Server API definitions (protobuf) |
| `appointments` | 3,550 | Appointments/booking product |
| `balance` | 2,732 | Square Banking / balance management |
| `sdk` | 2,170 | Reader SDK (hardware abstraction) |
| `crm` | 1,950 | Customer relationship management |
| `checkoutflow` | 1,940 | Core checkout/payment flow |
| `retail` | 1,758 | Retail-specific features |
| `checkout` | 1,284 | Secondary checkout module |
| `cdx` | 1,241 | Unknown internal platform |
| `invoicing` | 1,082 | Invoices product |
| `payment` | 1,082 | Payment processing |
| `messages` | 967 | Comms/messaging |
| `cardreader` | 929 | Card reader hardware |
| `cashapplocal` | 520 | **Cash App Local payment integration** |
| `capital` | ~200 | Square Capital / loans |

**Key product verticals present:**
- Retail POS (standard, orders, tickets, split orders)
- Restaurants (RST module, KDS, course management, open orders, tabbed order manager)
- Appointments
- Invoices
- eCommerce / Online Orders
- Team Management / Payroll-adjacent (staff, shifts, timecards, wages, tax forms)
- Square Banking (balance, debit card, check deposit, instant deposit, banking)
- Square Capital / Flex Loans
- Gift Cards
- Loyalty
- Square Marketing (SMS marketing, referrals)
- Square KDS (Kitchen Display System — `rst/kds`)
- Square Appointments (`appointments`)

---

## 3. Cash App Integration — Deeper Than Disclosed

This is the most analytically significant finding. The `cashapplocal` package (520 files) reveals Cash App is not just a payment button — it's a **full checkout integration layer** with:

### `CashAppLocalSettings` interface exposes:
- `canShowCashLocal()` — whether Cash App Local payment is available
- `canShowCashAppLocalCheckIn()` — loyalty/rewards check-in at POS
- `canShowCashAppLocalCheckInPostCharge` — post-charge check-in flow
- `canShowCashAppLocalRewardsOnReceipt` — Cash App rewards shown on receipts
- `shouldShowCashAppLocalAuthUI()` — biometric/auth screen during Cash App payment
- `shouldShowCashAppLocalTipUI()` — Cash App-branded tip prompt (replacing Square's default)
- `shouldUseCashAppStyleTipKeypad` — Cash App visual style for tipping
- `shouldShowCashAppLocalCashBack()` — cashback display post-auth
- `shouldShowCashAppLocalScreensaver()` — idle screen shows Cash App branding
- `isQuickClaimRewardsEnabled()` — fast rewards claim at checkout
- `shouldUseClientGeneratedClaimQrCode` / `shouldUseClientGeneratedFollowQrCode` — QR flows for loyalty

### What This Means:
Cash App Local isn't just "tap to pay at Square merchants." It's a complete checkout experience overlay: **the merchant's tip screen, receipt, rewards, idle screensaver, and post-charge flows can all be Cash App branded/powered**. This creates a flywheel — Cash App users get rewards at Square merchants, Square merchants get higher loyalty/repeat customers. Neither Stripe nor Toast has an equivalent consumer wallet integration at this depth.

### `CashAppLocalAuthVisibility` encodes the post-auth tip state:
- `ShouldShow` data class carries `tipAmount`, `tenderedAmount`, and `postAuthDiscountedAmount`  
- This means Cash App discounts applied via the app (Boosts, cashback) are visible to the merchant at POS — closing the loop between consumer rewards and merchant economics

---

## 4. Square One — New Subscription Tier (Unreleased/Beta)

Package `squareone/` contains:
- `SquareOneEligibilityProvider` — gates access
- `RealSquareOneFreeTrialSubscriptionCreator` — free trial onboarding
- `SquareOneEnrollmentConfig` / `SquareOneEnrollmentEnabled` — rollout flags
- `AccountCreationSub2Enabled` — suggests this is "Subscription Tier 2"
- `IsSquareOneMerchantCrashMetadataProvider` — even crash reporting is segmented by tier
- `LocationCapUsageDetails` / `PricingInfo` — usage-based pricing model signals

**Interpretation:** Square One appears to be a new subscription offering aimed at higher-volume or multi-location merchants, likely positioned between the free tier and Plus/Premium. The `SquareOneFreeTrialConstantsKt` and upsell infrastructure (fullscreen, modal, pill UI) suggest active go-to-market development. This could be a meaningful ARPU lever in 2H26.

### Upsell Infrastructure in `squareone/upsellui/`:
- `EnableUnifiedPill` — persistent upsell pill in navigation
- `EnableUnifiedUpsellFullscreen` — full-screen conversion push
- `EnableReviewPlanUpsellAssetsApi` — server-driven upsell content
- `ComparePlansDismissed` — tracks when merchants dismiss the plans comparison

---

## 5. Offline Mode (Store & Forward) — Competitive Moat Signal

Package `storeandforward/` contains:
- `OfflineModeAlert` + `OfflineModeAlertGatekeeper`
- `OfflineModeButtonState` / `OfflineModeButtonDataProvider`
- `OfflineModeExpirationTimeManager` — manages how long offline transactions are held
- `OfflineModePushNotification` — notifies when back online
- `storeandforwardquickenable` — fast-enable from settings
- `storeandforwardsettings` — per-location config

Square's offline mode (store-and-forward) lets merchants keep taking payments with no connectivity. The infrastructure here is mature and configurable — this is a legitimate moat in restaurant/retail vs. Toast (which has had offline issues) and Stripe Terminal.

---

## 6. Hardware Integrations

Reflects Square's full hardware portfolio and third-party ecosystem:

### Square Hardware:
- `cardreader` / `cardreadernative` / `cardreaders` — full reader SDK
- `cashdrawer` / `cashdrawermanager` / `cashdrawershiftmanager` — cash drawer mgmt
- `printer` / `printers` / `print` / `printqueue` — receipt printing
- `barcode` / `barcodescanner` / `scales` / `connectedscales` — retail peripherals

### Third-Party Hardware SDKs:
- **Star Micronics** (`starmicronics/`) — receipt printers (Star TSP, mPOP)
- **Epson** (`epson/`) — receipt printers 
- **Zebra** (`zebra/`) — barcode scanners/label printers
- `felhr` — USB serial (likely for legacy peripherals)

### Interesting:
- `nfcutils` — NFC for contactless
- `btscan` / `blecoroutines` — Bluetooth reader scanning
- `usb` — USB peripheral support
- `headset` — audio jack reader support (legacy but still present)

---

## 7. AI/ML Adjacent Features

No direct LLM integration found, but several ML-enabled features are present:

- **Mitek Systems** (`miteksystems/misnap/`) — ID document scanning and OCR. Used for identity verification (KYC) in account creation and possibly for check deposit. Mitek is enterprise-grade doc capture ML.
- **Veriff** (`veriff/`) — identity verification SDK (liveness detection, ID verification). This is notable — Veriff is a premium IDV vendor. Suggests Square is investing in KYC quality, likely tied to banking product compliance.
- `ocr` package — optical character recognition (possibly for check deposit or item scanning)
- `autowrite` — likely auto-complete for item descriptions
- `autosku` / `autocreate` — auto-generate SKUs/catalog items
- `itemize` — smart itemization (could be AI-driven from receipts)
- `visualbrowse` — visual catalog browsing (image-based search)
- `imageediting` / `imagelibrary` — item photo management with editing

**Interpretation:** Square is using AI primarily for input quality improvement (ID scans, check deposits, catalog creation) rather than customer-facing AI. This is practical and defensible — getting merchants onboarded faster with accurate data is a real moat vs. manual entry workflows.

---

## 8. Capital / Lending

Package `capital/flexloan/`:
- `CapitalFlexLoanWorkflow` — new "flex loan" product (not traditional lump-sum loans)
- `CapitalFlexPlanType` / `CapitalFlexPlanStatus` — multiple plan types
- `CapitalFlexLoanSectionAccess` — gating based on merchant eligibility
- `BankingLoanHomeWorkflow` — integrated into the banking home screen
- `CapitalRetrievePlanResponse` — server-side plan data

**Flex loans** are a departure from Square Capital's traditional merchant cash advance model. This appears to be a revolving credit facility — merchants can draw and repay flexibly. If this rolls out broadly in 2026, it could be a meaningful GMV multiplier (merchants with access to capital process more volume).

---

## 9. Third-Party SDKs of Note

| SDK | Vendor | Purpose |
|-----|--------|---------|
| Veriff | Veriff OÜ | ID verification / KYC |
| MiSnap | Mitek Systems | Document OCR / check deposit |
| Bugsnag | Bugsnag | Crash reporting |
| Datadog | Datadog | APM / observability |
| Appsflyer | Appsflyer | Attribution / marketing analytics |
| OneTrust | OneTrust | Privacy consent management |
| Pusher | Pusher/Cloudinary | Real-time websocket events |
| Twilio | Twilio | SMS/Conversations |
| Coil | Coil | Image loading |
| Evernote (Slate) | Evernote | Rich text editing (likely for invoices/notes) |

---

## 10. API / Service Architecture

The `protos` package (4,883 files) exposes the entire server API surface via protobuf definitions. Notable services:

- `MerchantConfigService` — per-merchant feature configuration
- `BlockStableService` — stablecoin (Bitcoin) handling
- `BlockUserJourneysService` — consumer journey orchestration (interesting naming — Block-level)
- `CashAppPayMerchantRenderData` — Cash App Pay branded checkout data
- `SquareWebPaymentMethodDetail` — web/ecom payment method
- `AfterpayMerchantSheet` — Afterpay BNPL integration at POS
- `MerchantBlockingClientService` — merchant-level blocking/compliance

**Deep link scheme:** `squareup://` and `squareup.com` — used internally for navigation between the POS, banking, and sub-apps.

---

## 11. Notable Architecture Signals

### SuperPOS / SPOS
Two separate app variants detected:
- `SposReleaseApp` (SPOS = Square POS, likely the standard consumer-facing variant)
- `superpos/` with `SuperPosUiFeatureFlagsCache` — suggests a "Super POS" configuration, possibly for high-volume/enterprise or Square for Restaurants

### AppEngine / Multi-App Architecture
`AppEngine` + `AppEngineSelection` manages routing between different Square app modes. The `DeepLinkActivity` uses `AppEngineSelection` to route to the correct sub-app based on the merchant's configuration. This is how Square runs Retail, Restaurants, and Appointments as distinct experiences within one APK.

### Feature Flags Infrastructure
Package `featureflags/` + `experiments/` + `enabledflags/` — sophisticated server-driven feature flag system. Combined with `gatekeeper` package, Square appears to use a LaunchDarkly-equivalent internal system for controlled rollouts. This matters for thesis because it means new products (Square One, Flex Capital) can be ramped carefully without big-bang launches.

---

## 12. Thesis Implications

### Bull Case Reinforced:
1. **Cash App Local integration depth** is a genuine and growing moat. The checkout layer integration (tips, auth UI, rewards, screensaver) means Cash App card usage at Square merchants creates compounding network effects. As Cash App card penetration grows (~25M+ actives), every Square merchant that enables Cash App Local becomes a distribution node for the ecosystem.

2. **Square One** subscription tier signals ARPU expansion intent. Block has historically undermonetized the merchant base relative to its software capabilities. A new mid-tier subscription with usage-based pricing could be a meaningful '26-'27 revenue driver.

3. **Flex Capital** is a product evolution that could expand the lending TAM. Traditional MCA is lumpy; revolving flex credit is stickier and more predictable for both parties.

4. **Offline mode maturity** + **hardware breadth** (3 printer brands, Zebra, NFC, BLE, USB) suggests Square's moat in physical retail is real and not easily replicated. Toast doesn't have this hardware ecosystem depth.

5. **AI investment is practical, not hype** — OCR, document scanning, auto-catalog creation. These reduce merchant onboarding friction, improving retention and lowering CAC.

### Risks Visible:
- **Complexity risk:** 334K+ class files suggests the codebase is enormous. The multi-variant architecture (Retail/RST/Appointments/SPOS) creates maintenance overhead and may slow feature velocity post-RIF.
- **Twilio dependency:** SMS marketing and communications run through Twilio — ongoing external vendor cost/risk.
- **Capital risk:** Flex loans require robust underwriting and credit risk management. If Square is extending credit more aggressively, watch for NPL commentary in upcoming earnings.

---

## Artifacts Generated
- `square_pos_strings.txt` — 24,641 lines of string resources
- `square_pos_classes.txt` — 334,417 class names
- `square_pos_flags_experiments.txt` — 103 flag-related strings
- `square_pos_permissions.txt` — full AndroidManifest
- `decompiled/` — full apktool output (smali + resources)
- `jadx-output/` — Java source decompilation (in progress)

---

*Teardown by Vince / EquityVault — March 16, 2026*
