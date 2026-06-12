#!/usr/bin/env python3
"""
Virginia DEQ Data Center Air Permit Scraper
============================================
Scrapes the VA DEQ "Issued Air Permits for Data Centers" page,
downloads permit PDFs, extracts equipment tables, and outputs
structured data for Capacity Ledger integration.

Setup (Mac Mini):
    pip install requests beautifulsoup4 pdfplumber pandas openpyxl

Usage:
    python scrape_deq_permits.py                    # Full run: scrape + download + parse
    python scrape_deq_permits.py --scrape-only      # Just get the permit list
    python scrape_deq_permits.py --parse-only       # Parse already-downloaded PDFs
    python scrape_deq_permits.py --check-new        # Check for new permits (cron mode)

Output:
    ./data/permit_index.csv          - Master list of all permits
    ./data/pdfs/                     - Downloaded permit PDFs
    ./data/equipment_extract.csv     - Parsed equipment from PDFs
    ./data/equipment_extract.xlsx    - Same, formatted for Excel
    ./data/changelog.txt             - New permits detected (for cron alerts)
"""

import argparse
import csv
import hashlib
import json
import logging
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
BASE_URL = "https://www.deq.virginia.gov"
PERMITS_PAGE = f"{BASE_URL}/news-info/shortcuts/permits/air/issued-air-permits-for-data-centers"
DATA_DIR = Path("./data")
PDF_DIR = DATA_DIR / "pdfs"
INDEX_FILE = DATA_DIR / "permit_index.csv"
EQUIPMENT_CSV = DATA_DIR / "equipment_extract.csv"
EQUIPMENT_XLSX = DATA_DIR / "equipment_extract.xlsx"
CHANGELOG = DATA_DIR / "changelog.txt"
STATE_FILE = DATA_DIR / ".last_run.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) EquityVault-Research/1.0"
}

# Rate limit: be polite to state government servers
REQUEST_DELAY = 1.5  # seconds between PDF downloads

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# STEP 1: Scrape the permit index page
# ---------------------------------------------------------------------------
def scrape_permit_index() -> list[dict]:
    """
    Fetch the DEQ data center permits page and extract the table.
    Returns list of dicts with keys:
        site_name, reg_no, permit_date, program_type, county, regional_office, pdf_url
    """
    log.info("Fetching DEQ permits page...")
    resp = requests.get(PERMITS_PAGE, headers=HEADERS, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # The permit table is the main content table
    table = soup.find("table")
    if not table:
        log.error("Could not find permit table on page. Page structure may have changed.")
        sys.exit(1)

    rows = table.find_all("tr")
    permits = []

    for row in rows[1:]:  # skip header row
        cells = row.find_all("td")
        if len(cells) < 6:
            continue

        # The registration number cell contains a link to the PDF
        reg_cell = cells[1]
        link = reg_cell.find("a")
        pdf_url = ""
        if link and link.get("href"):
            href = link["href"]
            if href.startswith("/"):
                pdf_url = BASE_URL + href
            elif href.startswith("http"):
                pdf_url = href

        reg_no = reg_cell.get_text(strip=True)

        permit = {
            "site_name": cells[0].get_text(strip=True),
            "reg_no": reg_no,
            "permit_date": cells[2].get_text(strip=True),
            "program_type": cells[3].get_text(strip=True),
            "county": cells[4].get_text(strip=True),
            "regional_office": cells[5].get_text(strip=True),
            "pdf_url": pdf_url,
        }
        permits.append(permit)

    log.info(f"Found {len(permits)} permits on DEQ page.")
    return permits


def save_permit_index(permits: list[dict]):
    """Save the permit index to CSV."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames = ["site_name", "reg_no", "permit_date", "program_type",
                   "county", "regional_office", "pdf_url"]
    with open(INDEX_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(permits)
    log.info(f"Saved permit index to {INDEX_FILE}")


def load_permit_index() -> list[dict]:
    """Load previously saved permit index."""
    if not INDEX_FILE.exists():
        return []
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


# ---------------------------------------------------------------------------
# STEP 2: Download permit PDFs
# ---------------------------------------------------------------------------
def download_pdfs(permits: list[dict], force: bool = False):
    """Download permit PDFs that we don't already have."""
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    to_download = []
    for p in permits:
        if not p["pdf_url"]:
            continue
        filename = f"{p['reg_no']}_{p['permit_date'].replace('/', '-')}.pdf"
        filepath = PDF_DIR / filename
        p["_pdf_path"] = str(filepath)
        if not filepath.exists() or force:
            to_download.append((p, filepath))

    log.info(f"{len(to_download)} PDFs to download ({len(permits) - len(to_download)} already cached).")

    for i, (p, filepath) in enumerate(to_download):
        try:
            log.info(f"  [{i+1}/{len(to_download)}] Downloading {p['reg_no']} - {p['site_name'][:50]}...")
            resp = requests.get(p["pdf_url"], headers=HEADERS, timeout=60)
            resp.raise_for_status()
            filepath.write_bytes(resp.content)
            time.sleep(REQUEST_DELAY)
        except Exception as e:
            log.warning(f"  Failed to download {p['reg_no']}: {e}")


# ---------------------------------------------------------------------------
# STEP 3: Parse equipment from PDFs
# ---------------------------------------------------------------------------
def parse_equipment_from_pdf(pdf_path: str, permit_info: dict) -> list[dict]:
    """
    Extract equipment details from a permit PDF.
    Returns list of equipment records.
    """
    try:
        import pdfplumber
    except ImportError:
        log.error("pdfplumber not installed. Run: pip install pdfplumber")
        sys.exit(1)

    equipment = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as e:
        log.warning(f"  Could not read {pdf_path}: {e}")
        return []

    # --- Pattern 1: Structured equipment tables ---
    # Match lines like:
    #   "Caterpillar Standby Generator, Model 3516C ... 2,500 kWe/ 3,633 bhp"
    #   "Cummins Standby Generator, Model 2500DQKAN ... 2,500 kWe/ 3,640 bhp"
    #   "Caterpillar model 3516C-HD emergency diesel engine gen-sets ... 3,634 bhp 2,500 ekW"
    patterns = [
        # Pattern A: "Model XXXX" with kWe and bhp on nearby lines
        re.compile(
            r"(?P<manufacturer>Caterpillar|Cummins|MTU|Kohler|Generac|Mitsubishi|Rolls.?Royce)"
            r".*?(?:Model|model)\s+(?P<model>[\w\-]+)"
            r".*?(?:Manufacture\s+Date|Date):\s*(?P<year>\d{4}|TBD)?"
            r".*?(?P<kw>[\d,]+)\s*(?:kWe|ekW)"
            r".*?(?P<bhp>[\d,]+)\s*bhp",
            re.DOTALL | re.IGNORECASE,
        ),
        # Pattern B: simpler - "Caterpillar model XXXX emergency diesel" with bhp and ekW
        re.compile(
            r"(?P<manufacturer>Caterpillar|Cummins|MTU|Kohler|Generac)"
            r"\s+(?:model|Model)\s+(?P<model>[\w\-]+)"
            r".*?(?P<bhp>[\d,]+)\s*bhp"
            r".*?(?P<kw>[\d,]+)\s*(?:kWe|ekW)",
            re.DOTALL | re.IGNORECASE,
        ),
    ]

    seen_models = set()
    for pat in patterns:
        for m in pat.finditer(full_text):
            model_key = f"{m.group('manufacturer')}-{m.group('model')}"
            if model_key in seen_models:
                continue
            seen_models.add(model_key)

            equipment.append({
                "reg_no": permit_info.get("reg_no", ""),
                "site_name": permit_info.get("site_name", ""),
                "county": permit_info.get("county", ""),
                "permit_date": permit_info.get("permit_date", ""),
                "program_type": permit_info.get("program_type", ""),
                "manufacturer": m.group("manufacturer"),
                "model": m.group("model"),
                "manufacture_year": m.group("year") if m.groupdict().get("year") else "",
                "kw_rating": m.group("kw").replace(",", ""),
                "bhp_rating": m.group("bhp").replace(",", ""),
                "fuel_type": "diesel",  # overwhelmingly diesel; override if text says otherwise
            })

    # --- Count gen-sets from reference number ranges ---
    # Look for patterns like "Sixty-six (66)" or enumerated ref nos
    count_pattern = re.compile(
        r"(?:(\w+)\s+\((\d+)\)\s+)?"
        r"(?P<manufacturer>Caterpillar|Cummins)"
        r"\s+(?:model|Model)\s+(?P<model>[\w\-]+)"
        r"\s+emergency\s+diesel\s+engine\s+gen.sets?"
    , re.IGNORECASE)

    for m in count_pattern.finditer(full_text):
        count_str = m.group(2) if m.group(2) else ""
        model_key = f"{m.group('manufacturer')}-{m.group('model')}"
        # Update count on matching equipment record
        for eq in equipment:
            eq_key = f"{eq['manufacturer']}-{eq['model']}"
            if eq_key == model_key and count_str:
                eq["unit_count"] = count_str

    # --- Extract fuel throughput limits ---
    fuel_pattern = re.compile(
        r"consume\s+no\s+more\s+than\s+([\d,]+)\s+gallons.*?per\s+year",
        re.IGNORECASE,
    )
    fuel_limits = [int(m.group(1).replace(",", "")) for m in fuel_pattern.finditer(full_text)]
    total_fuel_limit = max(fuel_limits) if fuel_limits else None

    # --- Extract NOx annual limits ---
    nox_pattern = re.compile(
        r"Nitrogen\s+Oxides.*?(?P<tons>[\d.]+)\s+ton(?:s)?(?:/yr|per\s+year|\s+per\s+year)",
        re.IGNORECASE,
    )
    nox_limits = []
    for m in nox_pattern.finditer(full_text):
        try:
            nox_limits.append(float(m.group("tons")))
        except ValueError:
            pass

    # --- Extract operating hour limits ---
    hours_pattern = re.compile(
        r"not\s+operate\s+more\s+than\s+(\d+)\s+hours\s+per\s+year.*?(?:all\s+purposes|combined|MCRT)",
        re.IGNORECASE,
    )
    hour_limits = [int(m.group(1)) for m in hours_pattern.finditer(full_text)]

    # Add facility-level summary data to each equipment record
    for eq in equipment:
        eq["total_fuel_limit_gal_yr"] = total_fuel_limit or ""
        eq["max_nox_tpy"] = max(nox_limits) if nox_limits else ""
        eq["max_hours_yr"] = max(hour_limits) if hour_limits else ""

    # --- Detect fuel type (natural gas, fuel cell, etc.) ---
    if re.search(r"natural\s+gas|fuel\s+cell|turbine|bloom\s+energy", full_text, re.IGNORECASE):
        for eq in equipment:
            if re.search(r"natural\s+gas", full_text, re.IGNORECASE):
                eq["fuel_type"] = "natural_gas_or_dual"
            if re.search(r"fuel\s+cell", full_text, re.IGNORECASE):
                eq["fuel_type"] = "fuel_cell"

    # --- Detect Tier level ---
    tier_pattern = re.compile(r"Tier\s+(II?V?|[1-4]|2|4)", re.IGNORECASE)
    tiers = tier_pattern.findall(full_text)
    if tiers:
        for eq in equipment:
            eq["emission_tier"] = tiers[0]

    if not equipment:
        # Fallback: at minimum record that we processed this permit
        equipment.append({
            "reg_no": permit_info.get("reg_no", ""),
            "site_name": permit_info.get("site_name", ""),
            "county": permit_info.get("county", ""),
            "permit_date": permit_info.get("permit_date", ""),
            "program_type": permit_info.get("program_type", ""),
            "manufacturer": "PARSE_FAILED",
            "model": "",
            "manufacture_year": "",
            "kw_rating": "",
            "bhp_rating": "",
            "fuel_type": "",
            "total_fuel_limit_gal_yr": total_fuel_limit or "",
            "max_nox_tpy": max(nox_limits) if nox_limits else "",
            "max_hours_yr": max(hour_limits) if hour_limits else "",
        })

    return equipment


def parse_all_pdfs(permits: list[dict]) -> list[dict]:
    """Parse all downloaded PDFs and return consolidated equipment list."""
    all_equipment = []
    parsed = 0
    failed = 0

    for p in permits:
        # Find the PDF file
        filename = f"{p['reg_no']}_{p.get('permit_date', '').replace('/', '-')}.pdf"
        filepath = PDF_DIR / filename
        if not filepath.exists():
            continue

        log.info(f"  Parsing {p['reg_no']} - {p['site_name'][:50]}...")
        equip = parse_equipment_from_pdf(str(filepath), p)
        all_equipment.extend(equip)

        if equip and equip[0].get("manufacturer") != "PARSE_FAILED":
            parsed += 1
        else:
            failed += 1

    log.info(f"Parsed {parsed} permits successfully, {failed} failed/empty.")
    return all_equipment


def save_equipment(equipment: list[dict]):
    """Save parsed equipment to CSV and XLSX."""
    if not equipment:
        log.warning("No equipment data to save.")
        return

    import pandas as pd

    df = pd.DataFrame(equipment)

    # Sort by county, then site name
    df.sort_values(["county", "site_name", "reg_no"], inplace=True)

    df.to_csv(EQUIPMENT_CSV, index=False)
    log.info(f"Saved equipment CSV to {EQUIPMENT_CSV}")

    try:
        df.to_excel(EQUIPMENT_XLSX, index=False, sheet_name="Equipment")
        log.info(f"Saved equipment XLSX to {EQUIPMENT_XLSX}")
    except Exception as e:
        log.warning(f"Could not save XLSX: {e}")


# ---------------------------------------------------------------------------
# STEP 4: Change detection (for cron job)
# ---------------------------------------------------------------------------
def check_for_new_permits(current: list[dict]) -> list[dict]:
    """Compare current permits against last known state."""
    previous = load_permit_index()
    prev_keys = {(p["reg_no"], p["permit_date"]) for p in previous}
    curr_keys = {(p["reg_no"], p["permit_date"]) for p in current}

    new_keys = curr_keys - prev_keys
    new_permits = [p for p in current if (p["reg_no"], p["permit_date"]) in new_keys]

    if new_permits:
        log.info(f"*** {len(new_permits)} NEW PERMITS DETECTED ***")
        with open(CHANGELOG, "a", encoding="utf-8") as f:
            f.write(f"\n--- {datetime.now().isoformat()} ---\n")
            for p in new_permits:
                line = f"  NEW: {p['site_name']} | Reg#{p['reg_no']} | {p['permit_date']} | {p['county']}"
                log.info(line)
                f.write(line + "\n")
    else:
        log.info("No new permits since last run.")

    return new_permits


def save_state(permits: list[dict]):
    """Save run state for change detection."""
    state = {
        "last_run": datetime.now().isoformat(),
        "permit_count": len(permits),
        "checksum": hashlib.md5(
            json.dumps([(p["reg_no"], p["permit_date"]) for p in permits]).encode()
        ).hexdigest(),
    }
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Virginia DEQ Data Center Air Permit Scraper")
    parser.add_argument("--scrape-only", action="store_true", help="Only scrape the index, don't download/parse")
    parser.add_argument("--parse-only", action="store_true", help="Only parse already-downloaded PDFs")
    parser.add_argument("--check-new", action="store_true", help="Cron mode: check for new permits and alert")
    parser.add_argument("--force-download", action="store_true", help="Re-download all PDFs even if cached")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of PDFs to download (0=all)")
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if args.parse_only:
        permits = load_permit_index()
        if not permits:
            log.error("No permit index found. Run without --parse-only first.")
            sys.exit(1)
        log.info(f"Parsing {len(permits)} permits from index...")
        equipment = parse_all_pdfs(permits)
        save_equipment(equipment)
        return

    # Scrape the permit index
    permits = scrape_permit_index()
    save_permit_index(permits)

    if args.check_new:
        new = check_for_new_permits(permits)
        save_state(permits)
        # Update the index with current data
        save_permit_index(permits)
        if new:
            # Download and parse only new permits
            download_pdfs(new)
            equipment = parse_all_pdfs(new)
            if equipment:
                # Append to existing equipment file
                existing = []
                if EQUIPMENT_CSV.exists():
                    with open(EQUIPMENT_CSV, "r") as f:
                        existing = list(csv.DictReader(f))
                save_equipment(existing + equipment)
            print(f"ALERT: {len(new)} new permits detected. See {CHANGELOG}")
        return

    if args.scrape_only:
        log.info("Scrape-only mode. Done.")
        return

    # Full run: download + parse
    if args.limit:
        permits = permits[:args.limit]
        log.info(f"Limited to {args.limit} permits.")

    download_pdfs(permits, force=args.force_download)
    equipment = parse_all_pdfs(permits)
    save_equipment(equipment)
    save_state(permits)

    # Summary
    log.info("=" * 60)
    log.info(f"Total permits indexed: {len(permits)}")
    log.info(f"Equipment records extracted: {len(equipment)}")
    log.info(f"Output: {EQUIPMENT_CSV}")
    log.info(f"Output: {EQUIPMENT_XLSX}")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
