# Virginia DEQ Data Center Air Permit Scraper

## What This Does

Systematically scrapes the Virginia DEQ's data center air permit registry,
downloads all permit PDFs, and extracts structured equipment data including:

- Generator make/model (Caterpillar, Cummins, etc.)
- Rated capacity (kWe, bhp)
- Manufacture year
- Fuel type and throughput limits
- NOx annual emission limits
- Operating hour restrictions
- Emission tier (Tier II vs Tier IV)

This feeds into the Capacity Ledger as a physical validation layer for
behind-the-meter data center power infrastructure.

## Architecture

```
DEQ Website (HTML table + PDF links)
        │
        ▼
scrape_deq_permits.py
        │
        ├── Step 1: Scrape permit index → permit_index.csv
        ├── Step 2: Download PDFs      → data/pdfs/*.pdf
        ├── Step 3: Parse equipment     → equipment_extract.csv / .xlsx
        └── Step 4: Change detection    → changelog.txt (for cron)
        
notify_new_permits.py (cron wrapper)
        │
        └── Runs --check-new daily, sends macOS notification
```

Vince/Claude is NOT in the scraping loop (saves Opus tokens).
Use Vince for analysis AFTER extraction — e.g., "summarize the equipment
changes in the last 30 days" or "which new permits suggest BTM primary power."

## Setup on Mac Mini

```bash
# 1. Clone/copy to your preferred location
mkdir -p ~/EquityVault/50_Research_Notes/deq_scraper
cp -r ./* ~/EquityVault/50_Research_Notes/deq_scraper/

# 2. Install dependencies
pip install requests beautifulsoup4 pdfplumber pandas openpyxl

# 3. Test with a small batch first
cd ~/EquityVault/50_Research_Notes/deq_scraper
python scrape_deq_permits.py --limit 5

# 4. Full run (downloads ~170 PDFs, takes ~5-10 min with rate limiting)
python scrape_deq_permits.py

# 5. Set up daily cron job (mirrors your Block job posting monitor pattern)
crontab -e
# Add this line (runs at 7:00 AM daily):
# 0 7 * * * cd ~/EquityVault/50_Research_Notes/deq_scraper && /usr/bin/python3 notify_new_permits.py >> ./data/cron.log 2>&1
```

## Usage

```bash
# Full run: scrape index + download all PDFs + parse equipment
python scrape_deq_permits.py

# Just update the permit index (no downloads)
python scrape_deq_permits.py --scrape-only

# Re-parse already downloaded PDFs (after improving parser)
python scrape_deq_permits.py --parse-only

# Check for new permits (cron mode)
python scrape_deq_permits.py --check-new

# Force re-download all PDFs
python scrape_deq_permits.py --force-download

# Test with limited batch
python scrape_deq_permits.py --limit 10
```

## Output Files

| File | Description |
|------|-------------|
| `data/permit_index.csv` | Master list: site name, reg#, date, type, county, PDF URL |
| `data/pdfs/*.pdf` | Cached permit PDFs (named `{reg_no}_{date}.pdf`) |
| `data/equipment_extract.csv` | Parsed equipment: manufacturer, model, capacity, fuel, emissions |
| `data/equipment_extract.xlsx` | Same data, formatted for Excel |
| `data/changelog.txt` | Append-only log of newly detected permits |
| `data/.last_run.json` | State file for change detection |
| `data/cron.log` | Cron job output log |

## Extending to Other States

The same approach works for other state DEP/DEQ databases. The PDF parsing
logic is reusable — only the scraping step changes per state:

| State | Agency | Database | Notes |
|-------|--------|----------|-------|
| Virginia | DEQ | Centralized DC permit page | ← This scraper |
| Pennsylvania | DEP | eFACTS system | Relevant for Susquehanna/Talen |
| Texas | TCEQ | STEERS database | Large BTM buildout |
| Georgia | EPD | GEOS database | Growing DC market |
| Oregon | DEQ | Air quality permits | Meta Prineville etc. |

Each would need a state-specific scraper module but can share the PDF parser.

## Parser Limitations

The regex-based parser handles ~80% of permits well. Known limitations:

1. **Inconsistent PDF formatting**: Some older permits have OCR artifacts or
   non-standard layouts. These show as `PARSE_FAILED` in the output.

2. **Unit counts**: The parser extracts equipment models but counting exact
   units from reference number ranges is imperfect. Cross-check with the
   permit text for precise counts.

3. **Natural gas / fuel cell equipment**: The parser defaults to "diesel"
   and overrides when it detects gas/fuel cell keywords. This works for VA
   (overwhelmingly diesel) but may need adjustment for other states.

4. **Multi-permit facilities**: Some facilities have multiple permits over
   time. The scraper captures each permit as a separate row. Deduplication
   by reg_no is needed for facility-level aggregation.

For permits that fail parsing, you can route the PDF text through Vince
with a prompt like: "Extract the complete equipment list from this permit
including manufacturer, model, kW rating, bhp, and unit count."

## Integration with Capacity Ledger

The equipment_extract.csv maps to the Capacity Ledger as follows:

- `reg_no` → Links to specific facility in 30_Companies/{TICKER}/
- `county` → Geographic validation layer
- `kw_rating` × `unit_count` → Total backup/BTM generation capacity (MW)
- `max_nox_tpy` → Proxy for generation intensity (Title V threshold = major source)
- `manufacture_year` → Build-out timeline / capex acceleration signal
- `emission_tier` → Tier II vs IV indicates cost structure and regulatory risk
- New permits in `changelog.txt` → Leading indicator of construction activity
