#!/usr/bin/env python3
"""
DC Permit Signal Monitor
=========================
Monitors state air permit databases for new data center permits.
Designed for buy-side equity research — turns permit filings into
investment signals.

THREE SIGNALS:
  1. NEW PERMIT ALERT    → Someone just committed capital
  2. EQUIPMENT VENDOR    → Who's buying from whom (CAT, CMI, Bloom, GE Vernova)
  3. GEOGRAPHIC FRONTIER → New county = expansion beyond existing footprint

States covered:
  - Virginia DEQ (live)
  - Texas TCEQ (planned)

Usage:
  python3 dc_permit_monitor.py              # First run — builds baseline
  python3 dc_permit_monitor.py --check      # Daily check for new permits (cron mode)
  python3 dc_permit_monitor.py --report     # Print current signal summary
  python3 dc_permit_monitor.py --full-parse # Download + parse all new permit PDFs

Setup (cron — runs 7am daily):
  crontab -e
  0 7 * * * cd /path/to/deq_scraper && python3 dc_permit_monitor.py --check >> data/cron.log 2>&1
"""

import argparse
import csv
import json
import logging
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
DATA_DIR = Path("./data")
PDF_DIR = DATA_DIR / "pdfs"
BASELINE_FILE = DATA_DIR / "baseline.json"
SIGNALS_FILE = DATA_DIR / "signals.csv"
SIGNAL_LOG = DATA_DIR / "signal_log.txt"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) EquityVault-Research/1.0"
}
REQUEST_DELAY = 1.5

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# OWNER CLASSIFICATION
# ---------------------------------------------------------------------------
OWNER_MAP = {
    # Hyperscalers
    "Amazon": "AWS", "VADATA": "AWS", "IAD-": "AWS", "DCA-": "AWS",
    "Microsoft": "Microsoft", "Google": "Google", "Meta": "Meta",
    # Major Colos
    "Equinix": "Equinix", "Digital Realty": "Digital Realty",
    "Digital Loudoun": "Digital Realty", "Digital Western": "Digital Realty",
    "QTS": "QTS", "CyrusOne": "CyrusOne", "Vantage": "Vantage",
    "CoreSite": "CoreSite", "STACK": "STACK Infrastructure",
    "Aligned": "Aligned", "Compass": "Compass", "CloudHQ": "CloudHQ",
    "Cloud HQ": "CloudHQ", "Iron Mountain": "Iron Mountain",
    "Yondr": "Yondr", "NTT": "NTT", "Cologix": "Cologix",
    "H5 Data": "H5 Data Centers", "Sentinel": "Sentinel",
    # Enterprise
    "Capital One": "Capital One", "Visa": "Visa", "Bank of America": "BofA",
    "Freddie Mac": "Freddie Mac",
    # Defense/Gov
    "Northrop": "Northrop Grumman", "SAIC": "SAIC", "Aerospace Data": "NRO",
}

# Equipment manufacturers we care about (investable names)
EQUIPMENT_TICKERS = {
    "Caterpillar": "CAT",
    "Cummins": "CMI",
    "Bloom": "BE",
    "GE Vernova": "GEV",
    "MTU": "MTU (Rolls-Royce)",
    "Kohler": "Kohler (Private)",
    "Generac": "GNRC",
    "Mitsubishi": "Mitsubishi",
}


def classify_owner(site_name: str) -> str:
    """Map a site name to a standardized owner."""
    for keyword, owner in OWNER_MAP.items():
        if keyword.lower() in site_name.lower():
            return owner
    return "Other"


# ---------------------------------------------------------------------------
# VIRGINIA DEQ SCRAPER
# ---------------------------------------------------------------------------
VA_DEQ_URL = "https://www.deq.virginia.gov/news-info/shortcuts/permits/air/issued-air-permits-for-data-centers"


def scrape_virginia() -> list[dict]:
    """Scrape the VA DEQ data center permits page."""
    log.info("Scraping Virginia DEQ...")
    resp = requests.get(VA_DEQ_URL, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    table = soup.find("table")
    if not table:
        log.error("Could not find VA DEQ permit table.")
        return []

    permits = []
    for row in table.find_all("tr")[1:]:
        cells = row.find_all("td")
        if len(cells) < 6:
            continue

        reg_cell = cells[1]
        link = reg_cell.find("a")
        pdf_url = ""
        if link and link.get("href"):
            href = link["href"]
            base = "https://www.deq.virginia.gov"
            pdf_url = (base + href) if href.startswith("/") else href

        site_name = cells[0].get_text(strip=True)

        permits.append({
            "state": "VA",
            "site_name": site_name,
            "reg_no": reg_cell.get_text(strip=True),
            "permit_date": cells[2].get_text(strip=True),
            "program_type": cells[3].get_text(strip=True),
            "county": cells[4].get_text(strip=True),
            "owner": classify_owner(site_name),
            "pdf_url": pdf_url,
        })

    log.info(f"  Found {len(permits)} Virginia permits.")
    return permits


# ---------------------------------------------------------------------------
# TEXAS TCEQ SCRAPER (stub — to be built out)
# ---------------------------------------------------------------------------
def scrape_texas() -> list[dict]:
    """
    Placeholder for Texas TCEQ scraper.
    TCEQ uses the STEERS database — permits are searchable by SIC code.
    Data center SIC: 7374 (Computer Processing and Data Preparation)
    URL: https://www2.tceq.texas.gov/oce/eer/
    TODO: Build out when ready to add TX coverage.
    """
    log.info("Texas TCEQ scraper not yet implemented. Skipping.")
    return []


# ---------------------------------------------------------------------------
# SIGNAL DETECTION
# ---------------------------------------------------------------------------
def load_baseline() -> dict:
    """Load the baseline of known permits."""
    if not BASELINE_FILE.exists():
        return {"permits": {}, "counties": set(), "last_check": None}
    with open(BASELINE_FILE, "r") as f:
        data = json.load(f)
    data["counties"] = set(data.get("counties", []))
    return data


def save_baseline(permits: list[dict], counties: set):
    """Save current state as baseline for next comparison."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    baseline = {
        "last_check": datetime.now().isoformat(),
        "permit_count": len(permits),
        "permits": {f"{p['state']}_{p['reg_no']}_{p['permit_date']}": p for p in permits},
        "counties": sorted(counties),
    }
    with open(BASELINE_FILE, "w") as f:
        json.dump(baseline, f, indent=2)


def detect_signals(current: list[dict], baseline: dict) -> list[dict]:
    """
    Compare current permits against baseline.
    Returns list of signal dicts.
    """
    signals = []
    prev_keys = set(baseline.get("permits", {}).keys())
    prev_counties = baseline.get("counties", set())
    if isinstance(prev_counties, list):
        prev_counties = set(prev_counties)

    for p in current:
        key = f"{p['state']}_{p['reg_no']}_{p['permit_date']}"

        if key not in prev_keys:
            # --- SIGNAL 1: New permit ---
            signal = {
                "signal_date": datetime.now().strftime("%Y-%m-%d"),
                "signal_type": "NEW_PERMIT",
                "state": p["state"],
                "owner": p["owner"],
                "site_name": p["site_name"],
                "reg_no": p["reg_no"],
                "permit_date": p["permit_date"],
                "program_type": p["program_type"],
                "county": p["county"],
                "detail": "",
                "pdf_url": p.get("pdf_url", ""),
            }

            # --- SIGNAL 2: Check for Title V escalation ---
            if "Title V" in p.get("program_type", ""):
                signal["signal_type"] = "TITLE_V_ESCALATION"
                signal["detail"] = "Major source threshold crossed — significant generation capacity"

            # --- SIGNAL 3: New county (geographic frontier) ---
            county_key = f"{p['state']}_{p['county']}"
            if county_key not in prev_counties:
                frontier_signal = signal.copy()
                frontier_signal["signal_type"] = "NEW_GEOGRAPHY"
                frontier_signal["detail"] = f"First permit in {p['county']}, {p['state']} — expansion frontier"
                signals.append(frontier_signal)

            signals.append(signal)

    return signals


# ---------------------------------------------------------------------------
# PDF PARSING (new permits only)
# ---------------------------------------------------------------------------
def download_and_parse_permit(permit: dict) -> dict:
    """Download a single permit PDF and extract equipment info."""
    if not permit.get("pdf_url"):
        return {}

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{permit['state']}_{permit['reg_no']}_{permit['permit_date'].replace('/', '-')}.pdf"
    filepath = PDF_DIR / filename

    # Download if not cached
    if not filepath.exists():
        try:
            resp = requests.get(permit["pdf_url"], headers=HEADERS, timeout=60)
            resp.raise_for_status()
            filepath.write_bytes(resp.content)
            time.sleep(REQUEST_DELAY)
        except Exception as e:
            log.warning(f"  Could not download {permit['reg_no']}: {e}")
            return {}

    # Parse
    try:
        import pdfplumber
        with pdfplumber.open(str(filepath)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as e:
        log.warning(f"  Could not parse {permit['reg_no']}: {e}")
        return {}

    result = {
        "equipment_lines": [],   # list of dicts: {mfg, model, kw, bhp, count, year}
        "fuel_type": "diesel",
        "fuel_limit_gal": None,
        "nox_tpy": None,
        "max_hours_yr": None,
        "total_units": 0,
        "total_mw": 0.0,
    }

    # --- Extract individual equipment lines ---
    # Pattern: "(N) Manufacturer model XXXX ... N,NNN kWe/ekW ... N,NNN bhp"
    equip_pattern = re.compile(
        r"(?:(\w[\w\-]*)\s+)?\((\d+)\)\s+"
        r"(?P<mfg>Caterpillar|Cummins|MTU|Kohler|Generac|Bloom\s*Energy|GE\s*Vernova|Mitsubishi)\s+"
        r"(?:model\s+|Model\s+)?(?P<model>[\w\-]+)"
        r".*?(?P<bhp>[\d,]+)\s*bhp"
        r".*?(?P<kw>[\d,]+)\s*(?:kWe|ekW)",
        re.IGNORECASE | re.DOTALL,
    )
    seen_models = set()
    for m in equip_pattern.finditer(text):
        count = int(m.group(2))
        mfg = m.group("mfg").strip()
        model = m.group("model").strip()
        bhp = int(m.group("bhp").replace(",", ""))
        kw = int(m.group("kw").replace(",", ""))
        key = f"{mfg}|{model}|{kw}"
        if key not in seen_models:
            seen_models.add(key)
            result["equipment_lines"].append({
                "mfg": mfg, "model": model, "kw": kw, "bhp": bhp, "count": count,
            })

    # Fallback: simpler pattern for permits with different formatting
    if not result["equipment_lines"]:
        simple_pattern = re.compile(
            r"(?P<mfg>Caterpillar|Cummins|MTU|Kohler|Generac|Bloom\s*Energy|GE\s*Vernova|Mitsubishi)"
            r".*?(?:Model|model)\s+(?P<model>[\w\-]+)",
            re.IGNORECASE,
        )
        kw_pattern = re.compile(r"([\d,]+)\s*(?:kWe|ekW)", re.IGNORECASE)
        bhp_pattern = re.compile(r"([\d,]+)\s*bhp", re.IGNORECASE)
        count_pattern = re.compile(
            r"\((\d+)\)\s+(?:Caterpillar|Cummins|MTU|Kohler|Generac)",
            re.IGNORECASE,
        )

        kw_vals = [int(x.group(1).replace(",", "")) for x in kw_pattern.finditer(text)]
        bhp_vals = [int(x.group(1).replace(",", "")) for x in bhp_pattern.finditer(text)]
        counts = [int(x.group(1)) for x in count_pattern.finditer(text)]

        for i, m in enumerate(simple_pattern.finditer(text)):
            mfg = m.group("mfg").strip()
            model = m.group("model").strip()
            key = f"{mfg}|{model}"
            if key not in seen_models:
                seen_models.add(key)
                result["equipment_lines"].append({
                    "mfg": mfg,
                    "model": model,
                    "kw": kw_vals[i] if i < len(kw_vals) else None,
                    "bhp": bhp_vals[i] if i < len(bhp_vals) else None,
                    "count": counts[i] if i < len(counts) else None,
                })

    # --- Extract manufacture year ---
    year_pattern = re.compile(r"Manufacture\s+Date[:\s]*(\d{4}|TBD)", re.IGNORECASE)
    years = year_pattern.findall(text)
    if years:
        for i, eq in enumerate(result["equipment_lines"]):
            if i < len(years):
                eq["year"] = years[i]

    # --- Calculate totals ---
    total_units = 0
    total_kw = 0
    for eq in result["equipment_lines"]:
        c = eq.get("count") or 1
        k = eq.get("kw") or 0
        total_units += c
        total_kw += c * k
    result["total_units"] = total_units
    result["total_mw"] = round(total_kw / 1000, 1)

    # --- Fuel throughput limit ---
    fuel_pattern = re.compile(
        r"consume\s+no\s+more\s+than\s+([\d,]+)\s+gallons.*?per\s+year",
        re.IGNORECASE,
    )
    fuel_limits = [int(m.group(1).replace(",", "")) for m in fuel_pattern.finditer(text)]
    if fuel_limits:
        result["fuel_limit_gal"] = max(fuel_limits)

    # --- NOx annual limit ---
    nox_pattern = re.compile(r"Nitrogen\s+Oxides.*?([\d.]+)\s+ton", re.IGNORECASE)
    nox = [float(m.group(1)) for m in nox_pattern.finditer(text)]
    if nox:
        result["nox_tpy"] = max(nox)

    # --- Operating hours limit ---
    hours_pattern = re.compile(
        r"not\s+operate\s+more\s+than\s+(\d+)\s+hours\s+per\s+year",
        re.IGNORECASE,
    )
    hours = [int(m.group(1)) for m in hours_pattern.finditer(text)]
    if hours:
        result["max_hours_yr"] = max(hours)

    # --- Fuel type detection ---
    if re.search(r"natural\s+gas", text, re.IGNORECASE):
        result["fuel_type"] = "natural_gas"
    if re.search(r"fuel\s+cell|bloom\s+energy", text, re.IGNORECASE):
        result["fuel_type"] = "fuel_cell"
    if re.search(r"gas\s+turbine", text, re.IGNORECASE):
        result["fuel_type"] = "gas_turbine"

    return result


def enrich_signals_with_equipment(signals: list[dict]) -> list[dict]:
    """Download and parse PDFs for new permit signals to get equipment details."""
    for s in signals:
        if s["signal_type"] not in ("NEW_PERMIT", "TITLE_V_ESCALATION"):
            continue
        if not s.get("pdf_url"):
            continue

        log.info(f"  Parsing PDF for {s['reg_no']} ({s['owner']})...")
        equip = download_and_parse_permit(s)

        if equip.get("equipment_lines"):
            lines = equip["equipment_lines"]

            # Unique manufacturers and models
            mfgs = list(dict.fromkeys(eq["mfg"] for eq in lines))
            models = list(dict.fromkeys(eq["model"] for eq in lines))

            # Map to tickers
            tickers = []
            for mfg in mfgs:
                for name, ticker in EQUIPMENT_TICKERS.items():
                    if name.lower() in mfg.lower():
                        tickers.append(ticker)
                        break

            s["equipment_lines"] = lines
            s["equipment_mfg"] = ", ".join(mfgs)
            s["equipment_model"] = ", ".join(models)
            s["equipment_ticker"] = ", ".join(dict.fromkeys(tickers))
            s["total_units"] = equip.get("total_units", "")
            s["total_mw"] = equip.get("total_mw", "")
            s["max_kw"] = max((eq.get("kw") or 0 for eq in lines), default="")
            s["fuel_type"] = equip.get("fuel_type", "")
            s["fuel_limit_gal"] = equip.get("fuel_limit_gal", "")
            s["nox_tpy"] = equip.get("nox_tpy", "")
            s["max_hours_yr"] = equip.get("max_hours_yr", "")
        else:
            s["equipment_lines"] = []
            s["equipment_mfg"] = ""
            s["equipment_model"] = ""
            s["equipment_ticker"] = ""
            s["total_units"] = ""
            s["total_mw"] = ""
            s["max_kw"] = ""
            s["fuel_type"] = ""
            s["fuel_limit_gal"] = ""
            s["nox_tpy"] = ""
            s["max_hours_yr"] = ""

    return signals


# ---------------------------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------------------------
def save_signals(signals: list[dict]):
    """Append new signals to the signal log CSV and write rich detail log."""
    if not signals:
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "signal_date", "signal_type", "state", "owner", "site_name",
        "reg_no", "permit_date", "program_type", "county", "detail",
        "equipment_mfg", "equipment_model", "equipment_ticker",
        "total_units", "total_mw", "max_kw", "fuel_type",
        "fuel_limit_gal", "nox_tpy", "max_hours_yr", "pdf_url",
    ]

    file_exists = SIGNALS_FILE.exists()
    with open(SIGNALS_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        if not file_exists:
            writer.writeheader()
        for s in signals:
            row = {k: v for k, v in s.items() if k in fieldnames}
            writer.writerow(row)

    # Write rich human-readable log
    permit_signals = [s for s in signals if s["signal_type"] in ("NEW_PERMIT", "TITLE_V_ESCALATION")]
    geo_signals = [s for s in signals if s["signal_type"] == "NEW_GEOGRAPHY"]

    with open(SIGNAL_LOG, "a", encoding="utf-8") as f:
        f.write(f"\n{'='*75}\n")
        f.write(f"  SIGNAL ALERT — {datetime.now().strftime('%B %d, %Y  %I:%M %p')}\n")
        f.write(f"  {len(permit_signals)} new permits detected\n")
        f.write(f"{'='*75}\n")

        # Ticker summary at top
        all_tickers = {}
        for s in permit_signals:
            for eq in s.get("equipment_lines", []):
                mfg = eq.get("mfg", "")
                count = eq.get("count") or 1
                for name, ticker in EQUIPMENT_TICKERS.items():
                    if name.lower() in mfg.lower():
                        all_tickers.setdefault(ticker, {"name": name, "units": 0})
                        all_tickers[ticker]["units"] += count
                        break

        if all_tickers:
            f.write(f"\n  EQUIPMENT ORDER BOOK (this alert):\n")
            for ticker, info in sorted(all_tickers.items(), key=lambda x: -x[1]["units"]):
                f.write(f"    {ticker:<6} ({info['name']}): {info['units']} gensets ordered\n")

        total_mw_all = sum(s.get("total_mw") or 0 for s in permit_signals)
        if total_mw_all:
            f.write(f"\n  TOTAL CAPACITY THIS ALERT: ~{total_mw_all:.0f} MW\n")

        # Each permit detail
        for i, s in enumerate(permit_signals, 1):
            f.write(f"\n  {'─'*71}\n")
            f.write(f"  SIGNAL {i}: [{s['signal_type']}] {s['owner']} — {s['county']}\n")
            f.write(f"  {'─'*71}\n")
            f.write(f"    Site:      {s['site_name']}\n")
            f.write(f"    Reg#:      {s['reg_no']}\n")
            f.write(f"    Permit:    {s['permit_date']} | {s['program_type']}\n")

            if s.get("detail"):
                f.write(f"    Note:      {s['detail']}\n")

            lines = s.get("equipment_lines", [])
            if lines:
                f.write(f"\n    EQUIPMENT ORDERED:\n")
                f.write(f"    {'─'*67}\n")
                f.write(f"    {'Manufacturer':<14} {'Model':<16} {'kW each':>10} {'bhp each':>10} {'Count':>8}\n")
                f.write(f"    {'─'*67}\n")
                for eq in lines:
                    kw_str = f"{eq['kw']:,} kW" if eq.get("kw") else "?"
                    bhp_str = f"{eq['bhp']:,} hp" if eq.get("bhp") else "?"
                    count_str = f"{eq['count']} units" if eq.get("count") else "?"
                    f.write(f"    {eq['mfg']:<14} {eq['model']:<16} {kw_str:>10} {bhp_str:>10} {count_str:>8}\n")
                    if eq.get("year"):
                        f.write(f"    {'':14} Manufacture date: {eq['year']}\n")
                f.write(f"    {'─'*67}\n")

            if s.get("total_mw"):
                f.write(f"    Total backup capacity:  ~{s['total_mw']} MW\n")
            if s.get("total_units"):
                f.write(f"    Total gensets:           {s['total_units']}\n")
            if s.get("fuel_type"):
                fuel_display = {
                    "diesel": "ULSD diesel",
                    "natural_gas": "Natural gas",
                    "fuel_cell": "Fuel cell (non-combustion)",
                    "gas_turbine": "Gas turbine",
                }.get(s["fuel_type"], s["fuel_type"])
                f.write(f"    Fuel:                    {fuel_display}\n")
            if s.get("fuel_limit_gal"):
                f.write(f"    Fuel limit:              {s['fuel_limit_gal']:,} gal/yr\n")
            if s.get("nox_tpy"):
                f.write(f"    NOx limit:               {s['nox_tpy']} tpy\n")
            if s.get("max_hours_yr"):
                f.write(f"    Max hours:               {s['max_hours_yr']} hr/yr\n")

            # Ticker signal for this permit
            if s.get("equipment_ticker"):
                f.write(f"\n    TICKER SIGNAL: {s['equipment_ticker']}\n")
                for eq in lines:
                    mfg = eq.get("mfg", "")
                    count = eq.get("count") or "?"
                    for name, ticker in EQUIPMENT_TICKERS.items():
                        if name.lower() in mfg.lower():
                            f.write(f"      {ticker} ({name}): {count} gensets\n")
                            break

        # Geographic signals
        if geo_signals:
            f.write(f"\n  {'─'*71}\n")
            f.write(f"  GEOGRAPHIC EXPANSION SIGNALS\n")
            f.write(f"  {'─'*71}\n")
            for g in geo_signals:
                f.write(f"    🌍 {g['county']}, {g['state']}: {g['owner']}\n")
                f.write(f"       {g['site_name']}\n")
                if g.get("detail"):
                    f.write(f"       {g['detail']}\n")

        f.write(f"\n{'='*75}\n")


def format_notification(signals: list[dict]) -> str:
    """Format signals into a concise notification string."""
    if not signals:
        return ""

    new_permits = [s for s in signals if s["signal_type"] == "NEW_PERMIT"]
    title_v = [s for s in signals if s["signal_type"] == "TITLE_V_ESCALATION"]
    new_geo = [s for s in signals if s["signal_type"] == "NEW_GEOGRAPHY"]

    parts = []
    if new_permits:
        # Group by owner
        owners = {}
        for s in new_permits:
            owners.setdefault(s["owner"], 0)
            owners[s["owner"]] += 1
        owner_str = ", ".join(f"{o}({c})" for o, c in sorted(owners.items(), key=lambda x: -x[1]))
        parts.append(f"{len(new_permits)} new permits: {owner_str}")

    if title_v:
        names = [s["owner"] for s in title_v]
        parts.append(f"TITLE V: {', '.join(names)}")

    if new_geo:
        counties = [f"{s['county']}" for s in new_geo]
        parts.append(f"New counties: {', '.join(counties)}")

    # Equipment tickers
    tickers = set()
    for s in signals:
        if s.get("equipment_ticker"):
            tickers.update(s["equipment_ticker"].split(", "))
    if tickers:
        parts.append(f"Equipment: {', '.join(sorted(tickers))}")

    return " | ".join(parts)


def send_macos_notification(title: str, message: str):
    """Send macOS notification."""
    # Truncate message for notification display
    if len(message) > 200:
        message = message[:197] + "..."
    script = f'display notification "{message}" with title "{title}"'
    try:
        subprocess.run(["osascript", "-e", script], check=True, timeout=10)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# REPORT
# ---------------------------------------------------------------------------
def print_report():
    """Print a summary of all signals collected so far."""
    if not SIGNALS_FILE.exists():
        print("No signals yet. Run with --check first to build baseline.")
        return

    with open(SIGNALS_FILE, "r") as f:
        signals = list(csv.DictReader(f))

    if not signals:
        print("No signals recorded yet.")
        return

    print(f"\n{'='*70}")
    print(f"  DC PERMIT SIGNAL REPORT")
    print(f"  Signals recorded: {len(signals)}")
    print(f"{'='*70}\n")

    # By signal type
    types = {}
    for s in signals:
        types.setdefault(s["signal_type"], []).append(s)

    for stype, items in types.items():
        print(f"  {stype}: {len(items)}")

    # By owner
    print(f"\n  BY OWNER:")
    owners = {}
    for s in signals:
        if s["signal_type"] in ("NEW_PERMIT", "TITLE_V_ESCALATION"):
            owners.setdefault(s["owner"], 0)
            owners[s["owner"]] += 1
    for owner, count in sorted(owners.items(), key=lambda x: -x[1]):
        print(f"    {owner}: {count}")

    # Equipment vendor signals
    print(f"\n  EQUIPMENT VENDORS (order book proxy):")
    vendors = {}
    for s in signals:
        if s.get("equipment_mfg"):
            for mfg in s["equipment_mfg"].split(", "):
                vendors.setdefault(mfg, 0)
                vendors[mfg] += 1
    for vendor, count in sorted(vendors.items(), key=lambda x: -x[1]):
        ticker = ""
        for name, t in EQUIPMENT_TICKERS.items():
            if name.lower() in vendor.lower():
                ticker = f" ({t})"
                break
        print(f"    {vendor}{ticker}: {count} permits")

    # Geographic frontier
    print(f"\n  NEW GEOGRAPHIES:")
    geos = [s for s in signals if s["signal_type"] == "NEW_GEOGRAPHY"]
    for g in geos:
        print(f"    {g['county']}, {g['state']} — {g['owner']} — {g['signal_date']}")

    # Recent signals (last 30 days)
    print(f"\n  LAST 30 DAYS:")
    cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    recent = [s for s in signals if s["signal_date"] >= cutoff]
    if recent:
        for s in recent:
            equip = f" | {s.get('equipment_ticker', '')}" if s.get("equipment_ticker") else ""
            print(f"    [{s['signal_type']}] {s['owner']} — {s['county']}, {s['state']}{equip}")
    else:
        print("    None")

    print(f"\n  Full signal log: {SIGNAL_LOG}")
    print(f"  Signal data: {SIGNALS_FILE}\n")


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="DC Permit Signal Monitor")
    parser.add_argument("--check", action="store_true",
                        help="Check for new permits and fire signals (cron mode)")
    parser.add_argument("--report", action="store_true",
                        help="Print signal summary report")
    parser.add_argument("--full-parse", action="store_true",
                        help="Download and parse PDFs for all new signals")
    parser.add_argument("--no-notify", action="store_true",
                        help="Suppress macOS notification")
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if args.report:
        print_report()
        return

    # Scrape current permits
    all_permits = []
    all_permits.extend(scrape_virginia())
    all_permits.extend(scrape_texas())  # returns [] until implemented

    if not all_permits:
        log.error("No permits scraped. Check network connection.")
        sys.exit(1)

    # Load baseline
    baseline = load_baseline()
    all_counties = {f"{p['state']}_{p['county']}" for p in all_permits}

    if not baseline.get("permits"):
        # First run — save baseline, no signals to fire
        log.info("First run — saving baseline. No signals to compare against yet.")
        log.info(f"Baseline: {len(all_permits)} permits across {len(all_counties)} counties.")
        save_baseline(all_permits, all_counties)
        print(f"Baseline saved: {len(all_permits)} permits. Run --check tomorrow to detect changes.")
        return

    # Detect signals
    signals = detect_signals(all_permits, baseline)

    if not signals:
        log.info("No new signals detected.")
        save_baseline(all_permits, all_counties)
        return

    log.info(f"*** {len(signals)} SIGNALS DETECTED ***")

    # Parse PDFs for equipment details if requested or in check mode
    if args.full_parse or args.check:
        signals = enrich_signals_with_equipment(signals)

    # Save signals
    save_signals(signals)

    # Update baseline
    save_baseline(all_permits, all_counties)

    # Notification
    notif_text = format_notification(signals)
    log.info(f"Signal summary: {notif_text}")

    if not args.no_notify:
        send_macos_notification("DC Permit Signal", notif_text)
        log.info("macOS notification sent.")

    # Print to console too
    print(f"\n{'='*70}")
    print(f"  {len(signals)} SIGNALS DETECTED")
    print(f"{'='*70}")
    for s in signals:
        if s["signal_type"] == "NEW_GEOGRAPHY":
            print(f"  [NEW_GEOGRAPHY] {s['owner']} | {s['county']}, {s['state']}")
            if s.get("detail"):
                print(f"    {s['detail']}")
            continue

        equip_str = ""
        if s.get("equipment_ticker"):
            equip_str = f" → {s['equipment_ticker']}"

        mw_str = ""
        if s.get("total_mw"):
            mw_str = f" | ~{s['total_mw']} MW"

        units_str = ""
        if s.get("total_units"):
            units_str = f" | {s['total_units']} gensets"

        print(f"  [{s['signal_type']}] {s['owner']} | {s['county']}, {s['state']} | {s['permit_date']}{equip_str}{mw_str}{units_str}")

        for eq in s.get("equipment_lines", []):
            kw = f"{eq['kw']:,} kW" if eq.get("kw") else "?"
            ct = eq.get("count") or "?"
            print(f"    {eq['mfg']} {eq['model']}: {kw} x {ct}")

        if s.get("detail"):
            print(f"    {s['detail']}")

    print(f"\nFull details: {SIGNAL_LOG}\n")


if __name__ == "__main__":
    main()
