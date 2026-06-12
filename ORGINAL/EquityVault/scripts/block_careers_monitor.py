#!/usr/bin/env python3
"""
Block Careers Monitor
=====================
Checks https://block.xyz/careers/jobs daily.
Logs job count + date. Alerts when jobs appear.
"""

import os
import json
import requests
from datetime import datetime

# Paths
VAULT_BASE = os.path.expanduser(
    "~/Library/Mobile Documents/com~apple~CloudDocs/Agents/EquityVault"
)
LOG_FILE = os.path.join(VAULT_BASE, "30_Companies/XYZ/careers_monitor_log.json")
OUTPUT_DIR = os.path.join(VAULT_BASE, "30_Companies/XYZ")

# URLs to check
CAREERS_URLS = [
    "https://block.xyz/careers",
    "https://block.xyz/careers/jobs",
    "https://www.block.xyz/careers",
    "https://jobs.block.xyz",
    # Greenhouse API endpoints
    "https://boards-api.greenhouse.io/v1/boards/block/jobs",
    "https://boards-api.greenhouse.io/v1/boards/squareup/jobs",
    "https://boards-api.greenhouse.io/v1/boards/blockinc/jobs",
]


def load_log():
    """Load existing log or create new one."""
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return {"checks": []}


def save_log(log):
    """Save log to file."""
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2)


def check_url(url):
    """Check a URL and return status + job count if parseable."""
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        })
        status = resp.status_code
        job_count = None
        
        # Try to parse Greenhouse JSON
        if "greenhouse" in url and status == 200:
            try:
                data = resp.json()
                job_count = data.get("meta", {}).get("total", len(data.get("jobs", [])))
            except:
                pass
        
        # Check for job listings in HTML
        elif status == 200:
            content = resp.text.lower()
            # Look for signs of job listings
            if any(x in content for x in ["job-listing", "career-listing", "open-positions", "job-card"]):
                job_count = content.count("job-") + content.count("position")
        
        return {"status": status, "job_count": job_count, "accessible": status == 200}
    except Exception as e:
        return {"status": None, "job_count": None, "accessible": False, "error": str(e)}


def main():
    log = load_log()
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    print(f"=== Block Careers Monitor — {now} ===\n")
    
    results = {}
    any_jobs = False
    
    for url in CAREERS_URLS:
        result = check_url(url)
        results[url] = result
        
        status_str = f"HTTP {result['status']}" if result['status'] else "ERROR"
        job_str = f"{result['job_count']} jobs" if result['job_count'] else "N/A"
        
        print(f"  {url}")
        print(f"    Status: {status_str} | Jobs: {job_str}")
        
        if result.get("job_count") and result["job_count"] > 0:
            any_jobs = True
    
    # Log this check
    entry = {
        "timestamp": now,
        "results": results,
        "any_jobs_found": any_jobs
    }
    log["checks"].append(entry)
    
    # Keep last 90 days of checks
    log["checks"] = log["checks"][-90:]
    save_log(log)
    
    print(f"\n  Log saved: {LOG_FILE}")
    
    # Alert logic
    if any_jobs:
        print("\n" + "=" * 60)
        print("🚨 ALERT: JOBS DETECTED — RUN FULL SCRAPE")
        print("=" * 60)
        return 1  # Exit code 1 = jobs found, trigger alert
    else:
        print("\n  No jobs found. Will check again tomorrow.")
        return 0


if __name__ == "__main__":
    exit(main())
