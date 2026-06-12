#!/usr/bin/env python3
"""
Block Job Posting Tracker
==========================
Pulls job postings directly from Block's Greenhouse ATS board.
Designed to run weekly for thesis tracking.

DATA SOURCE:
    https://boards-api.greenhouse.io/v1/boards/block/jobs

USAGE:
    python job_scraper.py              # Scrape Block
    python job_scraper.py --dry-run    # Test categorization
    python job_scraper.py --compare    # Scrape comparables (via JobSpy fallback)

OUTPUT:
    30_Companies/XYZ/
    - xyz_jobs_raw_YYYY-MM-DD.csv       (full raw scrape)
    - xyz_jobs_summary_YYYY-MM-DD.csv   (categorized summary)
    - xyz_jobs_skills_YYYY-MM-DD.csv    (skill/tech mention counts)
"""

import csv
import json
import os
import sys
import urllib.request
from datetime import datetime
from collections import Counter


# ============================================================
# CONFIGURATION
# ============================================================

TARGET_COMPANY = "Block"
TICKER = "XYZ"

# Greenhouse board slug - Block uses "block"
GREENHOUSE_BOARD = "block"
GREENHOUSE_API = f"https://boards-api.greenhouse.io/v1/boards/{GREENHOUSE_BOARD}/jobs"

# Comparables (for --compare mode using JobSpy)
COMPARABLES = ["Shopify", "Toast", "PayPal"]

# EquityVault output path
VAULT_BASE = os.path.expanduser(
    "~/Library/Mobile Documents/com~apple~CloudDocs/Agents/EquityVault"
)
OUTPUT_DIR = os.path.join(VAULT_BASE, f"30_Companies/{TICKER}")

# Fallback
if not os.path.exists(VAULT_BASE):
    OUTPUT_DIR = os.path.expanduser("~/job_tracker")

os.makedirs(OUTPUT_DIR, exist_ok=True)


# ============================================================
# CATEGORY MAPPING
# ============================================================

CATEGORY_KEYWORDS = {
    "AI / ML Engineering": [
        "machine learning", "ml engineer", "ai engineer", "deep learning",
        "nlp", "natural language", "computer vision", "llm", "large language",
        "generative ai", "gen ai", "neural network", "reinforcement learning",
        "ml platform", "ml infrastructure", "ai platform", "ai/ml",
        "foundation model", "model training", "fine-tuning", "rlhf",
        "prompt engineer", "ai safety", "alignment",
    ],
    "Research / Applied Science": [
        "research scientist", "research engineer", "applied scientist",
        "principal scientist", "staff scientist", "phd", "publications",
        "arxiv", "research lead",
    ],
    "Hardware / ASIC / Chip Design": [
        "asic", "fpga", "firmware", "physical design", "verification engineer",
        "analog", "mixed signal", "chip", "silicon", "rtl", "verilog",
        "embedded", "hardware engineer",
    ],
    "Blockchain / Crypto": [
        "blockchain", "bitcoin", "crypto", "web3", "protocol engineer",
        "smart contract", "wallet", "defi",
    ],
    "Traditional Software Engineering": [
        "software engineer", "backend engineer", "frontend engineer",
        "full stack", "fullstack", "web developer", "mobile engineer",
        "ios engineer", "android engineer", "software developer",
        "application engineer",
    ],
    "Data Science / Analytics": [
        "data scientist", "data analyst", "analytics engineer",
        "business intelligence", "bi engineer", "data engineer",
        "data warehouse", "etl", "dbt", "analytics",
    ],
    "Infrastructure / DevOps / SRE": [
        "devops", "sre", "site reliability", "infrastructure engineer",
        "platform engineer", "cloud engineer", "kubernetes", "docker",
        "ci/cd", "systems engineer", "network engineer", "security engineer",
    ],
    "Product Management": [
        "product manager", "product lead", "product director",
        "technical product manager", "group product manager",
    ],
    "Design / UX": [
        "product designer", "ux designer", "ui designer", "design lead",
        "user experience", "visual designer", "interaction designer",
    ],
    "Sales / GTM / Marketing": [
        "account executive", "sales engineer", "sales representative",
        "business development", "marketing manager", "growth",
        "demand generation", "content marketing", "brand", "partnerships",
        "sales manager", "revenue", "go-to-market", "gtm",
    ],
    "Customer Success / Support": [
        "customer success", "customer support", "solutions engineer",
        "solutions architect", "technical account", "implementation",
        "onboarding", "support engineer",
    ],
    "G&A (Finance, Legal, HR, Ops)": [
        "finance", "accounting", "controller", "fp&a", "legal", "counsel",
        "compliance", "human resources", "recruiter", "talent acquisition",
        "people operations", "office manager", "executive assistant",
        "facilities", "procurement",
    ],
}

SKILL_KEYWORDS = {
    "LLM / Large Language Models": ["llm", "large language model", "gpt", "claude", "gemini", "chatgpt"],
    "Agentic / AI Agents": ["agentic", "ai agent", "agent framework", "tool use", "function calling"],
    "RAG / Retrieval Augmented": ["rag", "retrieval augmented", "vector database", "embedding"],
    "PyTorch / TensorFlow": ["pytorch", "tensorflow", "jax", "keras"],
    "Transformer / Attention": ["transformer", "attention mechanism", "self-attention"],
    "CUDA / GPU Programming": ["cuda", "gpu programming", "triton", "tensorrt"],
    "Bitcoin / Lightning": ["bitcoin", "lightning network", "btc", "satoshi"],
    "Rust / Go / C++": ["rust", " go ", "golang", "c++", "cpp"],
    "Kubernetes / Docker": ["kubernetes", "k8s", "docker", "container"],
    "React / TypeScript": ["react", "typescript", "nextjs", "next.js", "vue"],
    "Swift / Kotlin": ["swift", "kotlin", "ios", "android"],
    "MLOps / Model Serving": ["mlops", "model serving", "inference", "vllm", "triton inference"],
    "Data Pipeline / ETL": ["data pipeline", "etl", "airflow", "spark", "kafka", "dbt"],
    "Python": ["python"],
}


def categorize_role(title: str, description: str = "") -> str:
    """Classify a job posting into investment-relevant categories."""
    text = f"{title} {description}".lower()

    # Priority order: AI/ML > Research > Hardware > Blockchain > rest
    priority_cats = [
        "AI / ML Engineering",
        "Research / Applied Science", 
        "Hardware / ASIC / Chip Design",
        "Blockchain / Crypto",
    ]
    
    for category in priority_cats:
        for kw in CATEGORY_KEYWORDS[category]:
            if kw in text:
                return category

    for category, keywords in CATEGORY_KEYWORDS.items():
        if category in priority_cats:
            continue
        for kw in keywords:
            if kw in text:
                return category

    return "Other / Unclassified"


def count_skill_mentions(descriptions: list[str]) -> dict:
    """Count how many job postings mention each tracked skill."""
    counts = {}
    for skill, keywords in SKILL_KEYWORDS.items():
        count = 0
        for desc in descriptions:
            desc_lower = desc.lower()
            if any(kw in desc_lower for kw in keywords):
                count += 1
        counts[skill] = count
    return counts


def fetch_greenhouse_jobs(board: str) -> list[dict]:
    """Fetch jobs from Greenhouse API."""
    url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true"
    
    print(f"Fetching from Greenhouse: {board}")
    print("=" * 50)
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"  Error fetching: {e}")
        return []
    
    total = data.get("meta", {}).get("total", 0)
    print(f"  Found {total} open positions")
    
    if total == 0:
        print("  ⚠️  HIRING FREEZE - No open positions")
        return []
    
    jobs = []
    for job in data.get("jobs", []):
        job_id = job.get("id", "")
        title = job.get("title", "")
        
        # Get full job details for description
        description = ""
        content = job.get("content", "")
        if content:
            # Strip HTML tags roughly
            import re
            description = re.sub(r'<[^>]+>', ' ', content)
            description = ' '.join(description.split())  # Normalize whitespace
        
        location = job.get("location", {}).get("name", "")
        departments = job.get("departments", [])
        dept_name = departments[0].get("name", "") if departments else ""
        
        jobs.append({
            "date_scraped": datetime.now().strftime("%Y-%m-%d"),
            "company": TARGET_COMPANY,
            "job_id": str(job_id),
            "title": title,
            "department": dept_name,
            "location": location,
            "job_url": f"https://boards.greenhouse.io/{board}/jobs/{job_id}",
            "source": "greenhouse",
            "description": description[:500],
            "full_description": description,
            "category": categorize_role(title, description),
        })
    
    return jobs


def generate_summary(jobs: list[dict], company: str) -> dict:
    """Generate category summary."""
    cats = Counter(j["category"] for j in jobs if j["company"] == company)
    return dict(cats)


def save_results(jobs: list[dict], company: str, ticker: str):
    """Save raw data and summaries."""
    today = datetime.now().strftime("%Y-%m-%d")
    total = len(jobs)

    # 1. Raw CSV
    raw_path = os.path.join(OUTPUT_DIR, f"{ticker.lower()}_jobs_raw_{today}.csv")
    if jobs:
        fieldnames = [k for k in jobs[0].keys() if k != "full_description"]
        with open(raw_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for job in jobs:
                row = {k: v for k, v in job.items() if k != "full_description"}
                writer.writerow(row)
        print(f"  Raw data saved: {raw_path}")
    else:
        # Write empty file to record the check
        with open(raw_path, "w", newline="", encoding="utf-8") as f:
            f.write("date_scraped,company,job_id,title,department,location,job_url,source,description,category\n")
            f.write(f"{today},{company},,,HIRING_FREEZE,,,greenhouse,,\n")
        print(f"  Hiring freeze recorded: {raw_path}")

    # 2. Summary CSV
    summary = generate_summary(jobs, company)
    summary_path = os.path.join(OUTPUT_DIR, f"{ticker.lower()}_jobs_summary_{today}.csv")
    with open(summary_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Category", "Count", "% of Total"])
        for cat in CATEGORY_KEYWORDS.keys():
            count = summary.get(cat, 0)
            pct = f"{count/total:.1%}" if total > 0 else "0.0%"
            writer.writerow([cat, count, pct])
        other = summary.get("Other / Unclassified", 0)
        pct = f"{other/total:.1%}" if total > 0 else "0.0%"
        writer.writerow(["Other / Unclassified", other, pct])
        writer.writerow(["TOTAL", total, "100.0%"])
    print(f"  Summary saved: {summary_path}")

    # 3. Skill mentions CSV
    descriptions = [j["full_description"] for j in jobs if j["company"] == company]
    skill_counts = count_skill_mentions(descriptions)
    skills_path = os.path.join(OUTPUT_DIR, f"{ticker.lower()}_jobs_skills_{today}.csv")
    with open(skills_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Skill / Technology", "Mentions", "% of Postings"])
        for skill, count in sorted(skill_counts.items(), key=lambda x: -x[1]):
            pct = f"{count/len(descriptions):.1%}" if descriptions else "0.0%"
            writer.writerow([skill, count, pct])
    print(f"  Skills saved: {skills_path}")

    # 4. Print summary
    print("\n" + "=" * 60)
    print(f"DASHBOARD SUMMARY — {company} — {today}")
    print("=" * 60)
    
    if total == 0:
        print("\n  ⚠️  HIRING FREEZE - 0 OPEN POSITIONS\n")
        print("  This is a significant thesis signal.")
        print("  Check back weekly to detect when hiring resumes.")
    else:
        print(f"{'Category':<40} {'Count':>6} {'%':>8}")
        print("-" * 56)
        for cat in list(CATEGORY_KEYWORDS.keys()) + ["Other / Unclassified"]:
            count = summary.get(cat, 0)
            pct = f"{count/total:.1%}" if total > 0 else "-"
            if count > 0:
                print(f"  {cat:<38} {count:>6} {pct:>8}")
        print("-" * 56)
        print(f"  {'TOTAL':<38} {total:>6} {'100.0%':>8}")

        ai_count = summary.get("AI / ML Engineering", 0) + summary.get("Research / Applied Science", 0)
        hw_count = summary.get("Hardware / ASIC / Chip Design", 0)
        trad_swe = summary.get("Traditional Software Engineering", 0)
        
        print(f"\n  AI/ML+Research: {ai_count} ({ai_count/total:.1%})" if total > 0 else "")
        print(f"  Hardware/ASIC: {hw_count} ({hw_count/total:.1%})" if total > 0 else "")
        if trad_swe > 0:
            print(f"  AI:SWE Ratio: {ai_count/trad_swe:.1f}x")

        print("\n  TOP SKILL MENTIONS:")
        for skill, count in sorted(skill_counts.items(), key=lambda x: -x[1])[:8]:
            if count > 0:
                print(f"    {skill:<35} {count:>4}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Block Job Posting Tracker")
    parser.add_argument("--dry-run", action="store_true", help="Test categorization")
    parser.add_argument("--compare", action="store_true", help="Also scrape comparables")
    args = parser.parse_args()

    if args.dry_run:
        test_titles = [
            "Senior Machine Learning Engineer",
            "Staff Software Engineer, Backend",
            "ASIC Design Engineer",
            "Blockchain Protocol Engineer",
            "VP of Sales, Enterprise",
            "AI Research Scientist",
            "Product Manager, AI Platform",
            "Physical Design Engineer",
            "DevOps Engineer",
            "Staff Engineer, LLM Systems",
            "Bitcoin Core Developer",
            "Customer Success Manager",
        ]
        print("DRY RUN — Category Classification Test:")
        print("=" * 60)
        for title in test_titles:
            cat = categorize_role(title)
            print(f"  {title:<45} → {cat}")
        return

    # Fetch from Greenhouse
    jobs = fetch_greenhouse_jobs(GREENHOUSE_BOARD)
    save_results(jobs, TARGET_COMPANY, TICKER)

    # Comparables (requires JobSpy + python 3.10+)
    if args.compare:
        print("\n" + "=" * 60)
        print("COMPARABLES (via JobSpy)")
        print("=" * 60)
        try:
            from jobspy import scrape_jobs
            for comp in COMPARABLES:
                print(f"\nScraping {comp}...")
                comp_jobs = scrape_jobs(
                    site_name=["linkedin", "indeed"],
                    search_term=f'"{comp}"',
                    results_wanted=50,
                    hours_old=168,
                    country_indeed="USA",
                )
                print(f"  Found {len(comp_jobs)} postings")
        except ImportError:
            print("  JobSpy not available. Install with: pip install python-jobspy")
            print("  (Requires Python 3.10+)")


if __name__ == "__main__":
    main()
