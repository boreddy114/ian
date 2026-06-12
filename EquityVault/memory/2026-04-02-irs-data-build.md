# Session: 2026-04-02 23:35:57 UTC

- **Session Key**: agent:main:main
- **Session ID**: 1ad1d750-7545-4dcf-b5ef-d8c96f0f208b
- **Source**: webchat

## Conversation Summary

assistant: Good — all TY2022 tables confirmed. One thing to check: the Table 3.3 on the Pub 1304 page is actually "Tax Liability, Tax Credits, and Tax Payments" — not the preparation method table your spec calls for. The preparation method data is published separately. Let me find that, plus the Data Book examination table.
assistant: OK here's where I'm at. I've confirmed access to irs.gov and mapped the direct XLS download URLs. Here's the situation:

**Found and ready (all TY2022):**
- **Table 1.2**: `22in12ms.xls` — AGI, exemptions, deductions by income/marital status ✅
- **Table 1.4**: `22in14ar.xls` — Sources of income, adjustments, tax items by AGI ✅ (the key table)
- **Table 2.1**: `22in21id.xls` — Returns with itemized deductions ✅
- **Data Book Table 17**: `24dbs03t17ex.xlsx` — Examination coverage, TY2013–2021 ✅

**Issue — Table 3.3 is not what the spec expects:**
Pub 1304 Table 3.3 is actually "Tax Liability, Tax Credits, and Tax Payments" — *not* the preparation method breakdown (self-prepared vs. paid preparer). The filing/preparation type data is published separately by IRS, likely under e-file statistics or a different SOI release. Let me track that down before proceeding.

**My plan:**
1. Locate the correct preparation method data source
2. Spawn a coding agent to download all XLS files, parse them with Python/openpyxl, clean the data, build the 8-tab workbook, and drop it in `30_Companies/INTU/3P_Research/`

Give me a minute to find that preparation method table, then I'll kick off the build.
assistant: Good — I've now mapped the full data landscape. Here's my assessment before I kick off the build:

**Key finding on Table 3.3:** Your spec references "Table 3.3 — Individual returns by filing and preparation type." The actual Pub 1304 Table 3.3 is "Tax Liability, Tax Credits, and Tax Payments" — **not** preparation method data. The self-prepared vs. paid preparer split lives in the IRS Data Book Table 4 (e-filed returns: "Online" = self-prepared, "Practitioner filed" = practitioner-prepared) and Table 2 (total returns by type, which captures paper). These are fiscal year data (FY2024), not tax year — I'll flag this mismatch per your instructions.

**Plan:** I'll spawn a coding agent to:
1. Download all 5 XLS/XLSX files from irs.gov
2. Parse each with openpyxl, clean merged cells/formatting
3. Build the 8-tab workbook per spec
4. Drop it in `30_Companies/INTU/3P_Research/`

Let me kick that off now.
assistant: Let me write the build script directly — this is data munging work that I can handle in Python without needing a coding agent.
assistant: The data is in columns, not rows — the AGI brackets are rows. Let me see the column headers to find Schedule C, D, E, etc.
assistant: Now I have the full column map. Let me extract the key values and check Table 3.3 for foreign tax credit and NIIT.
assistant: Row 8 in Table 3.3 contains column numbers, not data. The data must start at a different row.
assistant: Row 9 is the data row. Let me get all the key values now.
assistant: Excellent data. Now let me check the Data Book Table 17 for audit rates and the prep method data, then build the final workbook.
assistant: Good — Table 17 has TY2022 and TY2021 data side by side. Let me check how many years it covers and get the preparation method data from Table 4.
assistant: Now I have all the data. Let me also get the Data Book Table 2 for total returns (including paper) to calculate the non-e-filed returns.
assistant: Now I have everything. Let me build the final workbook.
assistant: Done. The workbook is at `30_Companies/INTU/3P_Research/IRS_SOI_Tier_Analysis_TY2022.xlsx` — 8 tabs, ~147KB.

Here's the executive summary of what's in there and what to be aware of:

**Key Numbers (TY2022, 161.3M total returns):**

| Tier | Estimate (MAX method) | % of Total |
|---|---|---|
| **Tier 3 — Genuinely Complex** | 11.3M | 7.0% |
| **Tier 2 — Moderately Complex** | 30.4M | 18.8% |
| **Tier 1 — Simple Filers** | 119.6M | 74.1% |

Largest Tier 3 indicator: Foreign tax credit (11.3M) — though many are mutual fund investors claiming trivial amounts, so this likely overstates true complexity.

Largest Tier 2 indicator: Schedule C (30.4M self-employment returns).

**Flags you'll want to review:**

1. **Pub 1304 Table 3.3 is NOT the preparation method table** — it's tax liability/credits. I sourced prep method from Data Book Table 4 (FY2024), creating a year mismatch with the TY2022 income tables.

2. **No deduplication possible** — the SOI tables report each schedule independently. A return with both K-1 and Schedule D appears in both counts. I used MAX (largest single indicator) as lower bound and flagged it.

3. **Audit rates** — Table 17 uses Total Positive Income brackets, not AGI, and doesn't cross-tab by schedule presence. Couldn't produce the exact "No Sch C, income < $200K" splits the spec requested.

4. **K-1 vs. rental Schedule E** — good news: Table 1.4 *does* report Partnership and S-corp separately from rental income. Flagged but not a problem.

All flags are documented in the Data Dictionary tab (Tab 8).
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-control-ui",
  "id": "openclaw-control-ui"
}
```

[Wed 2026-03-25 21:11 MDT] perfect
assistant: 🔍 Good stuff. It's a clean foundation — when you're ready to layer the analytical interpretation on top, the tier overlap issue is going to be the most interesting puzzle. The FTC number at 11.3M is doing a lot of work in Tier 3 and probably needs to be haircut significantly for the INTU thesis. But that's for the next step.
