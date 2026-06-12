# DASH Thesis Log

---

## Entry 1 — March 13, 2026
### APK Teardown v15.221.7 (May 2025): Extended Rescan — New Stripe SDK Findings

**Context:** Second pass on the May 2025 decompile (baseline: `decompiled/2026-03-09/`). Prior session documented Armada Terminal SDK (44 files), NFC tap-to-verify UI, and dine-in voucher infrastructure. This rescan uncovered three additional SDKs that were not previously cataloged.

---

### Finding 1: COTS SDK — 73 files (`com.stripe.cots`)

**What it is:** Stripe COTS = "Contactless on the Smartphone." This is Stripe's product that turns an Android phone itself into a card-present payment terminal via NFC — no external hardware required.

**Key classes found:**
- `ContactlessPaymentActivity.java` + `ContactlessPaymentFragment.java` — full production UI for accepting card-present payments
- `CotsCollectPaymentMethodRequest` — accepts `amount`, `currency`, `readerProfile`, `transactionDataObjects`, `uxConfig`
- `CotsCollectPinRequest` — PIN entry on phone (required for chip+PIN compliance)
- `CotsActivateReaderRequest` / `CotsDiscoverReaderRequest` / `CotsConnectReaderRequest` — reader lifecycle management
- `activity_simulated_contactless_payment.xml` — developer test harness with a literal "Tap to Simulate Payment" button
- `SimulatedContactlessPaymentActivity.java` — test/staging payment simulation
- `CotsService.java` (AIDL) — runs as a separate inter-process service, required for PCI DSS compliance on mobile
- `PreFlightChecks.java` — hardware compatibility verification before activating payment acceptance
- `NfcAntennaLogger.java` — logs NFC antenna position data (used to optimize "tap here / tap above / tap below" UI)

**Layout files:**
- `activity_contactless_payment.xml` — hosts `ContactlessPaymentFragment`, full-screen payment acceptance UI
- `contactless_payment_fragment_tap_zone_container.xml` — animated tap target zone
- `contactless_payment_fragment_above/below/top/bottom.xml` — directional tap guidance based on device NFC antenna position
- `bottom_sheet_contactless_edu_modal.xml` — customer education on how to tap
- `contactless_payment_total_container.xml` — transaction total display during payment

**COTS strings in strings.xml:**
```
cots_tap_here / cots_tap_above / cots_tap_below / cots_tap_behind
cots_reading: "Hold card"
cots_loading: "Processing"
cots_success: "Remove card"
cots_declined: "Card declined\nPlease use another card"
cots_pin_prompt: "Enter PIN"
cots_simulate_tap: "Tap to Simulate Payment"  ← developer test harness
cots_reader_not_active
cots_card_not_supported
cots_irrecoverable_error / cots_recoverable_error
cots_total: "Total"
```

**Significance:** This is not a consumer feature. COTS is a merchant-facing product. A phone running COTS becomes the card reader. The presence of a full simulator + AIDL service + PIN entry + all payment state UIs indicates this was actively built and tested, not scaffolded. Combined with the tap-to-verify NFC flow (which shares the same hardware), this is DoorDash's hardware-light POS path: **the Dasher's phone or a merchant-provided phone becomes the terminal.**

---

### Finding 2: Stripe Offline Mode SDK — 172 files (`com.stripe.offlinemode`)

**What it is:** Stripe's offline payment processing capability. Transactions are authorized locally and forwarded to Stripe's servers when connectivity is restored.

**Key classes:**
- `OfflineReaderSetup.java`
- `DefaultOfflineEventHandler.java`
- `DefaultOfflineForwardingManager.java` — manages the queue of offline transactions
- `DefaultOfflineForwardingService.java` — background service for forwarding
- `OfflineForwardingApiClient.java` / `DefaultOfflineForwardingApiClient.java`
- `DefaultOfflineForwardingDelayCalculator.java` — backoff logic for retry
- `OfflineCredentialsProvider.java` — auth token management during offline operation
- `OfflineRestService.java`
- `HaltForwardingException.java`

**Significance:** Consumer payment apps do not need offline payment forwarding. This is a restaurant POS requirement — kitchens lose internet, connectivity is spotty, you cannot stop taking payments because Stripe's servers are unreachable. This SDK is **only meaningful in a merchant/POS context**. Its presence in the consumer app makes no sense unless the consumer app is also the POS.

---

### Finding 3: BBPos Hardware SDK — 431 files (`com.stripe.bbpos`)

**What it is:** Full device management SDK for BBPos physical card readers (the hardware that Stripe Terminal uses — BBPOS manufactures the Chipper 2X BT, WisePad 3, and WisePOS E readers).

**Scale context:** 431 files vs. 44 files for the Armada proto layer. This is the entire hardware integration stack.

**Key functionality implied by package structure:**
- Device discovery and pairing (Bluetooth/USB/local)
- Firmware management and OTA updates (consistent with `DownloadBBPosResourceRequest` in Armada layer)
- EMV transaction processing
- BBPOSConfig management (`firmware_version`, `config_version` in `DownloadMobilePosConfigRequest`)

**Significance:** You don't ship 431 files of hardware SDK into a consumer ordering app unless that app is expected to connect to physical card readers. Either (a) DoorDash SmartScale devices run BBPos readers, (b) the tablet/kiosk product uses them, or (c) both.

---

### Finding 4: Mastercard Terminal SDK — 67 files (`com.mastercard.terminalsdk`)

**What it is:** Mastercard's independent terminal certification SDK, separate from Stripe's stack.

**Significance:** EMV certification (the industry standard for chip card acceptance) requires Mastercard and Visa to independently certify the payment flow. The presence of Mastercard's own Terminal SDK alongside Stripe's stack suggests DoorDash is pursuing or has pursued **Level 2/Level 3 EMV certification** as a payment processor, not just piggybacking on Stripe's certification. This is the infrastructure work required to become a payments platform, not just a payments customer.

---

### Architectural Summary: The Full Stripe Stack

| Component | Files | Role |
|---|---|---|
| BBPos Hardware SDK | 431 | Physical card reader device management |
| Stripe Offline Mode | 172 | Offline payment queuing + forwarding |
| COTS (phone-as-terminal) | 73 | Phone NFC = card reader, no hardware needed |
| Armada (Terminal proto) | 44 | Terminal API layer (config, auth, IoT device mgmt) |
| Mastercard Terminal SDK | 67 | Independent EMV certification layer |
| **Total** | **787** | |

787 files of payment terminal infrastructure in a consumer ordering app. This is not incidental SDK inclusion.

---

### Two Distinct POS Deployment Architectures

The code supports two parallel approaches:

**Hardware-light (COTS path):**
- Consumer phone OR dedicated merchant phone = terminal
- NFC tap-to-pay directly on device
- No external card reader hardware
- Lower merchant adoption friction
- Consistent with "DoorDash phone-as-terminal" theory

**Hardware-heavy (Terminal SDK / BBPos path):**
- Physical BBPos card reader connected via Bluetooth/USB
- `CreateCardReaderTokenRequest` with `on_behalf_of` field (Stripe Connect)
- `DownloadMobilePosConfigRequest` managing firmware versions
- Full AIDL service infrastructure
- Consistent with SmartScale hardware on restaurant counters

**Most likely:** Both are being built. Hardware-light for fast merchant onboarding; hardware-heavy for established merchants who want a dedicated terminal.

---

### The `on_behalf_of` Field (Payment Economics)

`CreateCardReaderTokenRequest` contains:
- `device_info` — identifies the specific device
- `on_behalf_of` — **the merchant's Stripe Connect account ID**
- `merchant_display_name` — shown on cardholder receipts

This is the Stripe Connect platform architecture. DoorDash is the **platform** (takes platform fees). The restaurant is the **connected account** (receives net proceeds). DoorDash controls the payment flow, sets the take rate, and passes through to merchants. This is the economic structure of the commission-for-payments trade: DoorDash charges ~1% on the gross payment volume rather than the 25-30% delivery commission.

---

### Additional Findings from Rescan

**Omnichannel loyalty:** `bottom_sheet_loyalty_omnichannel_linking.xml` — a UI for linking restaurant loyalty programs to DoorDash. This is the data layer underneath "Going Out" — when a consumer links their Chili's rewards to DoorDash, DoorDash gains visibility into all their in-store spend, not just delivery.

**Split bill infrastructure:** `view_order_details_split_bill_toggle.xml`, `view_order_details_split_bill_participant_header.xml` — full per-person receipt splitting UI. In the delivery context this is a group order feature; in a dine-in POS context this becomes tableside bill splitting.

**Dine-in voucher:** `DeliveryExperienceV1DineInVoucherDetails` fields: `voucherId`, `title`, `subtitle`, `voucherTitle`, `voucherSubtitle`, `voucherExpirationDateDisplayString`, `voucherImage` — a structured voucher object issued post-delivery, redeemable in-store. This is the mechanism connecting delivery → in-store → loyalty loop.

---

### Implication for Thesis

The original hypothesis was: DoorDash is building a POS to access in-store payment volume at ~1% take rate, justifying a commission reduction on delivery.

This rescan strengthens the thesis materially:
1. **The build is further along than previously understood.** 787 files of payment terminal code, a developer test harness, PIN entry, offline mode — this is not exploratory scaffolding.
2. **Two deployment paths are being built simultaneously**, suggesting DoorDash is serious about merchant segment coverage.
3. **The payment economics architecture is confirmed.** The `on_behalf_of` field is the structural proof that DoorDash is the platform operator in a Stripe Connect setup, not a pass-through.
4. **Offline mode is the tell.** No consumer app needs offline payment forwarding. Someone at DoorDash specifically decided to ship this SDK into the consumer APK. That decision reveals intent.

**Outstanding questions:**
- Is COTS deployed (live behind a feature flag) or pre-production?
- Which app — consumer or merchant — actually calls `CotsCollectPaymentMethod`?
- Does the merchant app contain the POS UI that ties all this together?
- What version is on the phone now vs. May 2025?

---

## Entry 2 — March 13, 2026
### APK Diff: 15.221.7 (May 2025 baseline) → 15.266.4 (current)

**Context:** Version comparison using shell diff scripts writing to `~/doordash_apk_monitor/reports/`. Prior session (Entry 1) cataloged the full Stripe terminal stack in the May 2025 baseline. This session answers: what changed?

---

### Finding 1: POS Terminal Stack — Continued Growth

All major terminal SDK components grew from baseline:

| Component | Baseline | Current | Δ |
|---|---|---|---|
| COTS (phone-as-terminal) | 73 | 86 | +18% |
| BBPos Hardware SDK | 431 | 458 | +6% |
| Stripe Offline Mode | 172 | 180 | +5% |
| Armada Terminal proto | 44 | 46 | +5% |
| Mastercard Terminal SDK | 67 | 66 | flat |
| **Stripe Terminal (main)** | **797** | **1,378** | **+73%** |

The +581 file jump in Stripe Terminal main is the headline. New classes include Link, CustomerSheet, Google Pay launchers, fraud detection infrastructure — this is a major integration expansion across the full Stripe payments surface, not maintenance. The terminal build is getting more deeply embedded with each version.

---

### Finding 2: 🆕 "Cantina" — Corporate Meal Manager (Brand New, 64 Files)

Zero files in baseline. 64 files in current. Fully-built product, not a stub.

**What it is:** DoorDash's managed corporate meal program. Employers set up an office meal program; employees plan meals for the week via a calendar interface, join group carts, and pick backup meals in case a primary order is canceled. A fully separate `CantinaActivity` is registered in the manifest.

**Key structural details:**
- `calendar_id` and `office_id` as nav arguments — multi-office, calendar-driven scheduling
- `CantinaBackupUserRole` enum: `UNKNOWN`, `ADMIN`, `PARTICIPANT` — admin/employee role separation
- `CantinaBackupMode` enum: `ADD`, `EDIT` — backup meal management
- `startCantinaPolling` — real-time order status polling
- Navigation graph: Meal Manager → Backup selection → Settings → Office location picker
- Full error/empty states, settings bottom sheet, intro education banner

**Strings reveal the UX:**
- *"Join a cart and add items for the days you plan to visit the office"*
- *"Pick your backup meal once. If any order is canceled, we'll send it automatically."*
- *"Your office needs you to pick a backup meal to continue"*
- *"Plan your meals for the week"*

**Competitive context:** This is a direct attack on ezCater, Fooda, and managed corporate catering. The product is embedded in the consumer app — no separate enterprise app, no IT procurement required. Companies buy the program; employees use the DoorDash app they already have.

**Monetization angle:** Separate from the ~1% POS take rate thesis. Cantina likely operates as a corporate contract/SaaS layer (per-seat or per-meal fee), with DoorDash capturing both the program fee and the delivery margin on every meal.

---

### Finding 3: Business Profile / B2B Expense Stack — Maturing

Self-serve corporate layer (employee-managed, no IT required) with meaningful new surfaces:

- **SAP Concur integration** named explicitly — receipts auto-forwarded to Concur post-checkout. Other providers use `%1$s` placeholders, suggesting Expensify/others in the pipeline.
- **Expense code search** — new bottom sheet with searchable expense code list, required-code enforcement, error handling. A UX upgrade indicating enterprise accounts are actually using this.
- **Business Profile checkout entry point** — new `view_business_profile_payment_entry_point.xml` upsell surface ("Set up a business profile / Keep business expenses separate") appearing at checkout for unconverted users.
- **Personal vs. business order history filter** — orders now filterable by profile type.
- **Account switching** — multi-profile picker at checkout for users with both personal and business profiles.

**Two-tier corporate stack now visible:**

| Tier | Product | Buyer | Motion |
|---|---|---|---|
| Top-down | Cantina (Meal Manager) | Company / HR / Office admin | Managed program, configured by employer |
| Bottom-up | Business Profile | Individual employee | Self-serve, no IT required |

Both feed the same enterprise food spend TAM from different entry points. Together they represent a comprehensive corporate channel.

---

### Finding 4: Delivery Zone Toggle — Dasher / Robot / Drone (New UI)

`fragment_adjust_delivery_zone.xml` is new in this build. Three-way toggle at the consumer level: **Dasher Dropoff / Robot / Drone**. Users can select delivery mode and adjust drop-off zone per mode. Drone copy is specific: *"A drone can carry 1kg and has somewhat limited cargo space."*

Not directly relevant to POS/enterprise thesis, but signals that DoorDash's delivery abstraction is mode-agnostic at the consumer layer — the same infrastructure serves all three modalities.

---

### Finding 5: Auto-Checkout for Group Orders

New simplified auto-checkout bottom sheet: group order organizers set a deadline, DoorDash places the order automatically. Thorough string coverage (today/tomorrow/date-specific/time-specific variants). This almost certainly powers Cantina's weekly meal planning — office orders auto-place without requiring every employee to manually submit.

---

### Thesis Update

**POS thesis:** Intact and strengthening. Terminal stack is actively growing across every component. The 9-month version gap (May 2025 → March 2026) shows consistent investment, not a pause.

**New dimension:** The B2B/corporate stack (Cantina + Business Profile) is now large enough to warrant treatment as a separate thesis vector. DoorDash is building enterprise food spend infrastructure across two buyer motions simultaneously. This isn't a consumer feature — it's a corporate channel with distinct economics.

**Outstanding questions (updated):**
- Is COTS deployed live (feature-flagged) or still pre-production in 15.266.4?
- Which app (consumer vs. merchant) calls `CotsCollectPaymentMethod` in production?
- Is Cantina live in any market, or still pre-launch?
- What expense providers beyond SAP Concur are integrated (strings use `%1$s` placeholders)?
- Does the Dasher APK contain Cantina (restaurant-side admin) or is it consumer-only?
