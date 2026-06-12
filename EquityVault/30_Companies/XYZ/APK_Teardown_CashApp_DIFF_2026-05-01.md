# Cash App APK Version Diff Report
## v5.42.1 (2026-03-14) → v5.45.0 (2026-05-01)
### Build: 5421002 → 5450008 | 48 days elapsed
### Analyst: Vince / EquityVault

---

## Executive Summary

Three versions in 48 days. The diff reveals **six investment-relevant changes**, three of which represent meaningful escalations from the March teardown. The stablecoin product has expanded from Solana-only to **multi-chain (Solana, Ethereum, Arbitrum, Polygon)** with a new withdrawal/send flow — this is no longer MVP infrastructure, it's a multi-network product approaching launch readiness. ETFs have been added to the investing product line (strings changed from "Buy stocks" to "Buy ETFs and stocks"). And three entirely new packages appeared: `aiedge` (on-device ML for title generation), `moneystreaming` (real-time money flow visualization), and `score` (Cash Credit Score promoted from proto definitions to a full standalone package with home screen, applet tile, recommendations, and FAQ).

---

## 🔴 HIGH SIGNAL — Changes Since Last Teardown

### 1. Stablecoin: Solana-Only → Multi-Chain + Send/Withdrawal Flow

**This is the biggest delta in the diff.** In March, stablecoin was Solana-only with deposit capability. Now:

**Old (v5.42.1):**
- "To receive US Dollar Coin (USDC)... you'll need a wallet that uses the Solana Payment Network"
- "Select network" (singular, Solana implied)
- "Accept and continue" / "Receive USDC, spend in USD—instantly"

**New (v5.45.0):**
- **"Choose a network—Solana, Ethereum, Arbitrum, or Polygon"** — 4 chains supported
- "Select **payment** network" (network selection is now a real choice, not nominal)
- "Deposit stablecoins. Spend dollars. Instantly." (broader than USDC-specific)
- **NEW: Full withdrawal/send onboarding flow:**
  - "Send stablecoins. We'll handle the rest."
  - "Choose a network... then pay with your Cash App balance or linked debit card."
  - "We convert your dollars to USDC 1:1 when you send."
- **NEW: Cross-coin warning disclaimer:**
  - "Please confirm with the recipient what coin they'd prefer to receive payment with. Selecting the wrong coin may result in unrecoverable funds."

**Investment read:** This is a *massive* expansion in 48 days. The product has gone from "receive USDC on Solana" to "send and receive stablecoins across 4 major networks, funded from your Cash balance or debit card, with 1:1 USD conversion." The cross-coin warning suggests they may support USDT in addition to USDC (or are preparing to). The withdrawal flow — converting Cash balance → USDC at 1:1 and sending on-chain — means Cash App is becoming a **stablecoin on/off ramp**. This competes directly with Coinbase and could be a significant fee revenue stream.

**Confidence: ⭐⭐⭐⭐⭐** — production copy, multiple flows, multi-chain. Launch is imminent or already in limited rollout.

---

### 2. ETFs Added to Investing

**Old:** "Buy stocks" / "Buy stocks in your favorite companies..."
**New:** "Buy **ETFs and** stocks" / "Buy **ETFs and** stocks in your favorite companies..."

**Investment read:** Cash App is adding ETFs to its investing product. This is a meaningful product expansion — ETFs dramatically broaden the investable universe (index funds, sector exposure, bonds) beyond single stocks. It also makes Cash App a more credible alternative to Robinhood/Fidelity for less sophisticated investors who want diversified exposure. Likely follows regulatory/licensing work for ETF distribution.

**Confidence: ⭐⭐⭐⭐** — string change is definitive; ETFs are coming.

---

### 3. Cash Credit Score: Promoted to Standalone Package

In March, Credit Score existed only as proto definitions and a client route. Now:

**New package:** `com/squareup/cash/score/` with full architecture:
- `ScoreHomeScreen` — dedicated home screen
- `ScoreHomePresenter` with factory
- `ScoreAppletTilePresenter` — applet tile (shows on main Cash App home)
- `ScoreHomeViewModel` (Loading, Loaded states)
- `ScoreAppletTileViewModel` (Installed, Uninstalled, Loading, Failure states)
- `ScoreHomeSheet` with `ScoreSummarySheet` and `RecommendationSheet`
- `ScoreHomeViewEvent` with Action sources: `Callout`, `RecommendationOverlay`
- `ProfileAvatarViewModel` — personalized score display
- FAQ section visibility tracking

**New strings:**
- "Credit Score" (offline entry point title)
- Score visualization with fill percentage and score lock descriptions
- "Increase your score to unlock {label}" — gamified progression

**Investment read:** Credit Score has graduated from infrastructure to a **first-class applet** with its own home screen, recommendation overlays, and a gamification layer (score locks that unlock as score improves). The "installed/uninstalled" applet tile pattern means it will appear on the Cash App home screen alongside Borrow, Savings, and Afterpay. This is the top-of-funnel for lending — show users their score, give them recommendations to improve it, and funnel them into Borrow when eligible.

**Confidence: ⭐⭐⭐⭐** — full package with view models, presenters, screens. Nearing launch.

---

## 🟠 MEDIUM-HIGH SIGNAL

### 4. AI Edge: On-Device ML Title Generation

**Entirely new package:** `com/squareup/cash/aiedge/`
- `MLKitTitleGenerator` — generates titles using Google ML Kit on-device
- `TitleGenerator` interface (abstraction for title generation)
- `isAvailable`, `prepareModel`, `generateTitle` methods
- `AmbiguousDescriptionException` — handles unclear inputs

**Investment read:** Cash App is running ML Kit models locally on the device to auto-generate transaction titles or descriptions. This is likely for the P2P payment flow (auto-suggesting payment notes) or for categorization/insights. The "edge" naming is deliberate — this runs on-device, not server-side, meaning it works offline and avoids API costs. Combined with the existing Moneybot infrastructure, Cash is building a layered AI strategy: on-device ML for lightweight tasks, proprietary models for the conversational AI.

### 5. Moneybot: Image Attachments Added

**New strings:**
- `moneybot_attachment_camera` — "Camera"
- `moneybot_attachment_photo` — "Photo"
- `moneybot_remove_attachment_content_description` — "Remove attachment"
- `moneybot_home_loading` — "Gathering your information"
- `floating_chat_send_attachment_button_content_description` — "Attach image"

**Investment read:** Moneybot can now accept **photo/camera attachments**. This transforms it from text-only chat to **multimodal AI**. Users can snap a receipt, a check, a bill, or a product and ask Moneybot about it. Combined with the `aiedge` ML Kit integration, the AI stack is deepening across both on-device and conversational layers.

### 6. Money Streaming: New Visualization Package

**Entirely new package:** `com/squareup/cash/moneystreaming/`
- `MoneyStreamingChartViewModel` with `PointAnnotation` and `RangeFilterChip`
- `RealMoneyStreamingChartPresenter`
- Test fixtures present (actively being developed)

**Investment read:** "Money streaming" with charts, point annotations, and range filters suggests a **real-time money flow visualization** — think a live chart of your cash flow over time. This could be the spending insights evolution, or a new way to visualize recurring income/expenses. The "streaming" naming is notable — could this relate to real-time payment streams (programmable money)?

---

## 🟡 MEDIUM SIGNAL

### 7. Fidesmo NFC Provisioning — NEW SDK

**New third-party SDK:** Fidesmo (fidesmo.com) — NFC secure element provisioning
- `FidesmoProvisioningPresenter` and `FidesmoProvisioningScreen`
- `RealFidesmoClient`
- Core classes: `EligibilityResponse`, `Card`, `InstanceElement`, `RequiredField`

**What is Fidesmo?** A platform for provisioning applets onto NFC-capable secure elements (SIM cards, secure chips). This is used for **mobile payment card provisioning** — writing payment credentials to the NFC chip so your phone can do contactless payments.

**Investment read:** Cash App may be building or enhancing its **tap-to-pay consumer capability** (not just merchant Tap to Pay, but using your phone as a payment card). Combined with the existing Cash Card infrastructure, this could enable NFC payments directly from the Cash App without needing a physical card. Or it could be related to Cash Card provisioning to digital wallets (Google Wallet).

### 8. Netcetera 3DS2 — New 3DS Provider

Replaced or supplemented existing 3DS authentication with **Netcetera 3DS SDK** (major European 3DS provider). Suggests enhanced card payment security or preparation for international markets requiring 3DS2 (EU PSD2 compliance).

### 9. Work Applet: Timecard Detail Expansion

**New strings (11 total):** Full timecard detail view with:
- Regular hours, overtime hours
- Paid breaks, unpaid breaks
- Cash tips
- Scheduled shift vs. actual shift time
- Shift notes
- Edit capability

**Investment read:** The C4B (Cash for Business) Work Applet is evolving from simple clock-in/out to **full time-and-attendance management** with overtime tracking, break categorization, and cash tip recording. This is payroll infrastructure — positions Cash App as a lightweight payroll/workforce management tool for small businesses.

### 10. Families / Managed Accounts: Sponsor Resources Hub

**New strings:**
- "Resources for sponsors" (renamed from generic "Resources")
- Dedicated sponsor resources screen with sections for:
  - Features and limits
  - Merchant restrictions
  - Set up allowances
- Account-aware switching: "Signed in as {name}" / "Switched to managed account"
- Managed account profile privacy: profile "only viewable to people who search for their exact $cashtag"
- `u13_celebration_button_text` — under-13 celebration UI (Konfetti library)
- `promoted_card_subtitle_managed` — "{0}'s first card—with limits"

**Investment read:** Families is maturing with a dedicated parental control hub, privacy-first managed account profiles, and card issuance for managed accounts with built-in limits. The under-13 celebration + Konfetti animation library = onboarding celebration for young users. Cash App is aggressively building the teen/family banking product.

### 11. Neighborhoods Rebranding

- Footer changed from "Thank you for shopping local with Cash App" → "Neighborhoods on Cash App"
- Removed check-in unlinking flow
- Added map clustering: "{0} businesses in this location"
- Added result count display and banner dismiss

**Investment read:** "Neighborhoods" is being promoted as a named product within Cash App. The shift from "shopping local" to a branded "Neighborhoods" feature suggests this is becoming a more prominent part of the app — local merchant discovery and Cash App commerce convergence.

### 12. Nearby Pay: UX Overhaul

Significant rewrite of nearby payment strings:
- Removed old "Found X people" / "Searching..." language
- Added Bluetooth and Location permission flows with explicit privacy messaging: "Your location is not shared with anyone"
- New states: "Getting ready...", "Pay or get paid by people nearby"
- Added "Information" button

**Investment read:** Nearby Pay is getting a UX refresh with better permission handling and privacy messaging, suggesting it's being prepared for wider rollout or increased prominence.

### 13. Overdraft: Turn-Off Confirmation + Balance Display

**New:**
- Overdraft balance displayed on home screen: "{0} overdraft balance" / "{0} overdraft balance due"
- Upsell string: "Turn on free overdraft coverage"
- Full turn-off confirmation dialog with repayment warning
- Removed: "Free overdraft coverage disabled" static text

**Investment read:** Overdraft is moving from a background feature to a more prominent home-screen element with active upselling ("Turn on free overdraft coverage") and more thoughtful off-boarding (confirmation with repayment notice). This suggests overdraft adoption metrics are important enough to warrant prominent placement.

### 14. Card Studio Expansion

New strings: "Show $cashtag", "Start over", "Done" — suggesting expanded Cash Card customization with the ability to show/hide your $cashtag on the card design.

---

## Noise / Low-Signal Changes

- Kotlin/KotlinX library reorganization across DEX files (moved between smali_classes)
- Plaid SDK now has explicit string resources (was previously embedded)
- ExoPlayer references removed (video library cleanup)
- Material Design 3 component additions (time picker, slider, badge)
- Konfetti celebration animation library added (used for teen onboarding and other celebrations)
- Various copy tightening (punctuation, capitalization fixes)
- `shop_hub_*` and `shop_search_*` strings removed (Shop renamed/restructured)
- `progress_step_*` strings removed (payment flow UX simplification)
- Phone Plans promoted tile removed ("Cash Mobile $35/mo") — may indicate pause or restructure
- Stripe SDK reorganized but still present
- BouncyCastle crypto library added (likely for Fidesmo NFC)
- NimbusDS JOSE/JWT library added (token-based auth, likely for Fidesmo)

---

## Notable Absence: Cash Mobile

The `phone_plans_promoted_applet_tile_subtitle` ("Best coverage for $35/mo") and `phone_plans_promoted_applet_tile_title` ("Cash Mobile") strings were **removed**. However, `squareup/cash/phoneplans` package still exists and even has new sync values. This could mean:
- Cash Mobile promotion is being deprioritized on the home screen
- Pricing/branding is being reworked (the $35/mo was hardcoded)
- The feature is server-driven now (promotion managed remotely, not in strings)

---

## Diff Summary Table

| Feature | v5.42.1 Status | v5.45.0 Status | Delta |
|---------|---------------|----------------|-------|
| **Stablecoin** | Solana-only deposit, MVP experiment | **Multi-chain (4 networks), send + deposit, 1:1 USD conversion** | 🔴 Major escalation |
| **ETFs** | Not present | **"Buy ETFs and stocks"** | 🔴 New product line |
| **Credit Score** | Proto definitions only | **Full standalone package with home screen, applet tile, recommendations** | 🔴 Major escalation |
| **AI Edge** | Not present | **On-device ML Kit title generation** | 🟠 New capability |
| **Moneybot** | Text-only chat | **Camera/photo attachments (multimodal)** | 🟠 Meaningful expansion |
| **Money Streaming** | Not present | **Chart visualization with annotations and filters** | 🟠 New package |
| **Fidesmo NFC** | Not present | **NFC provisioning SDK integrated** | 🟡 New infrastructure |
| **Work Applet** | Clock-in/out | **Full timecard with overtime, breaks, tips** | 🟡 Meaningful expansion |
| **Families** | Phase F gating | **Sponsor resources hub, managed account privacy, U13 celebration** | 🟡 Steady build |
| **Overdraft** | Basic | **Home screen balance display, active upselling** | 🟡 Prominence increase |
| **Neighborhoods** | Local shopping | **Branded product, map clustering** | 🟡 Rebranding |
| **Cash Mobile** | Promoted $35/mo | **Promotion strings removed** | ⚠️ Watch |

---

## Watchlist for Next Version (v5.46+)

1. **Stablecoin launch** — multi-chain + send/receive is feature-complete. Watch for USDT support and fee structure.
2. **ETF rollout** — when does it appear in UI? Which ETFs? Commission structure?
3. **Credit Score visibility** — applet tile going live on home screen
4. **Moneybot multimodal** — what can you do with photo attachments? Receipt scanning? Check deposit?
5. **Cash Mobile** — killed, paused, or restructured?
6. **Fidesmo NFC** — consumer tap-to-pay or card provisioning?
7. **Money streaming** — what exactly is this? Spending insights v2 or something new?

---

*Source: APK diff of com.squareup.cash v5.42.1 → v5.45.0, 2026-05-01. Compiled code signals; gated features may not launch. Not investment advice.*
