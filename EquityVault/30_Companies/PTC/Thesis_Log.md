# PTC — Thesis Log

---

## 2026-04-23 — Catalini Moat Screen: CONTESTED, Fortress-Leaning

**Source:** PTC Catalini Moat Screen.docx, PTC_Pressure_Test_Phase1.docx

### Framework Assessment

| Moat | Classical | Agentic Vuln. | Weight |
|---|---|---|---|
| System of Record (Windchill/Codebeamer) | 4.0 | 2.7 | 3x (PRIMARY) |
| Non-Measurable (Creo CAD) | 2.6 | 2.8 | 2x (SECONDARY) |
| Ground Truth (Data) | 1.5 | N/A | EXCLUDED (avoids SoR double-count) |
| **COMPOSITE (weighted)** | **3.44** | **2.74** | **CONTESTED, Fortress-leaning** |

Plots at Classical 3.44 / Agentic Vulnerability 2.74 — just inside CONTESTED with borderline proximity to FORTRESS on both axes.

### SoR Switching Cost Bifurcation: ~45% Category A / ~55% Category B

| Category A — Automatable (~45%) | Category B — Durable (~55%) |
|---|---|
| Schema mapping & BOM migration (STEP interchange) | Regulatory audit trail re-certification (FDA, EASA) — 18–36 month cycles |
| Integration rewiring (API mappings to SAP/Oracle) | Multi-party supplier ecosystem renegotiation (OEM→Tier 1→Tier 2) |
| Workflow translation (OIR to Teamcenter equivalents) | Institutional engineering logic (undocumented approval routing) |
| User retraining (Creo-to-NX via AI tutors) | Contractual system references (DoD Supplier Performance Plans) |
| Report/dashboard recreation | Aerospace 50-yr data retention mandates |
| CAD file translation (STEP, JT, feature-tree bridging) | |

**Critical insight: vertical heterogeneity.** MedTech/A&D/safety-critical automotive: ~30% Cat A / 70% Cat B (Tier 4 Fortress individually). Industrials/Electronics: ~60/40 (Tier 3 Contested). Management does NOT disclose revenue by vertical — the blended 45/55 is estimated.

### Divestiture Analysis — Moat-Positive

Kepware + ThingWorx ($160M ARR, -1% growth) divested to TPG for $725M (Mar 16, 2026). This was PTC's weakest Catalini link — IoT connectivity is Tier 2–3 with high agentic vulnerability. Removing it:
- Sharpened composite Classical from ~3.3 to 3.44
- Concentrated capital on higher-moat PLM/CAD/ALM/SLM core
- Sell-side has not yet priced the moat-quality re-rating

### Creo Non-Measurable Moat: Thin, In the AI Kill Zone

Creo scores 2.6 Classical / 2.8 Agentic Vulnerability. **Fails the Fork Test** — SolidWorks forked the paradigm and captured mid-market; Onshape, Fusion 360, and AI-native entrants (Zoo.dev, Adam) demonstrate forkability. Tier 1.5–2 placement = most exposed to Catalini cA→0 dynamic (functional-premium moats compress first as execution costs collapse). Creo's standalone moat is thin without the Windchill PLM anchor.

### Data Moat: Does Not Exist at PTC-Corporate Level

PTC does NOT own customer data — engineering BOMs, ECO histories, and regulatory traceability data belong to customers. PTC owns **proprietary IP** (parametric kernel, Windchill schema) + **distribution** across 30K+ customers. Management's "product data foundation" positioning is the SoR moat restated in AI-era language, not a separate data moat. Excluded from composite to avoid double-counting.

### Moat Chain Reinforcement

```
Creo (CAD) → produces geometry → Windchill (PLM SoR) → holds BOM/audit trail
                                        ↓
                               Codebeamer (ALM) → links SW requirements
                                        ↓
                               Regulatory Compliance (FDA, FAA, ISO 26262)
                                        ↓
                               Supplier Ecosystem reads from Windchill
```

If Creo erodes, Windchill acts as brake. If Windchill erodes, Creo's standalone moat is thin (Tier 1.5–2). The chain is the moat, not any individual product.

### Pressure Test — Phase 1 Complete, Phase 2 Pending

Six claims queued for AlphaSense validation:
1. 45/55 bifurcation ratio (linchpin for CONTESTED vs. FORTRESS placement)
2. Wrapper-agent disintermediation is the most underappreciated risk (Score 3.5)
3. SaaS transition is moat-accretive, not moat-dilutive
4. Customers consolidating on PTC stack vs. layering point solutions
5. MedTech/A&D is individually Tier 4 Fortress
6. Partner ecosystem health (blind spot from moat screen)

### Investment Translation

Edge magnitude: modest (~5–10% valuation premium). The real asymmetry is in the **downside case** — ~55% durable Category B and Tier 4 regulatory anchor provide meaningful relative protection vs. generic enterprise SaaS in broad AI-disruption scenario. Conviction: moderate. Time horizon: 3–5 years for wrapper agents; 5–10 years for migration automation; 10+ years for regulatory core erosion.
