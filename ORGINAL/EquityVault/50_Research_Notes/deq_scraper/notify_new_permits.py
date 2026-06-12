#!/usr/bin/env python3
"""
Cron job setup for DEQ permit monitoring.
Checks for new permits daily and sends a macOS notification if found.

Setup:
    1. Make executable:    chmod +x notify_new_permits.py
    2. Test it:            python notify_new_permits.py
    3. Add to crontab:     crontab -e
       Add line:           0 7 * * * cd /path/to/deq_scraper && /usr/bin/python3 notify_new_permits.py >> ./data/cron.log 2>&1

This mirrors the pattern you already have for the Block job posting monitor.
"""

import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
SCRAPER = SCRIPT_DIR / "scrape_deq_permits.py"
DATA_DIR = SCRIPT_DIR / "data"
CHANGELOG = DATA_DIR / "changelog.txt"
LOG_FILE = DATA_DIR / "cron.log"


def send_macos_notification(title: str, message: str):
    """Send a macOS notification via osascript."""
    script = f'display notification "{message}" with title "{title}"'
    try:
        subprocess.run(["osascript", "-e", script], check=True, timeout=10)
    except Exception:
        pass  # Non-fatal if notification fails


def main():
    print(f"\n[{datetime.now().isoformat()}] Running DEQ permit check...")

    # Run the scraper in check-new mode
    result = subprocess.run(
        [sys.executable, str(SCRAPER), "--check-new"],
        capture_output=True,
        text=True,
        cwd=str(SCRIPT_DIR),
        timeout=300,
    )

    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    # Check if ALERT was triggered
    if "ALERT:" in result.stdout:
        # Extract the count
        import re
        match = re.search(r"ALERT: (\d+) new permits", result.stdout)
        count = match.group(1) if match else "?"

        send_macos_notification(
            "DEQ Permit Alert",
            f"{count} new data center air permits detected in Virginia."
        )
        print(f"Notification sent: {count} new permits.")
    else:
        print("No new permits.")


if __name__ == "__main__":
    main()
