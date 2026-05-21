"""
NeuralTruth - Source Credibility Scoring Engine
File: apps/backend/app/services/source_analysis.py
"""
import re
import socket
import ssl
from datetime import datetime, timezone
from typing import Optional

try:
    import whois
    WHOIS_AVAILABLE = True
except ImportError:
    WHOIS_AVAILABLE = False

import tldextract

# ── Static Blacklist / Whitelist ──────────────────────────────────────────────
BLACKLISTED_DOMAINS = {
    "infowars.com", "naturalnews.com", "beforeitsnews.com",
    "worldnewsdailyreport.com", "yournewswire.com", "activistpost.com",
    "thenewstalker.com", "empirenews.net", "abcnews.com.co",
    "newslo.com", "nationalreport.net", "theonion.com",
}

WHITELISTED_DOMAINS = {
    "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk",
    "nytimes.com", "theguardian.com", "wsj.com", "bloomberg.com",
    "who.int", "cdc.gov", "nih.gov", "snopes.com", "factcheck.org",
    "politifact.com", "wikipedia.org", "britannica.com",
}

# ── Domain extraction ─────────────────────────────────────────────────────────
def extract_domain(url_or_domain: str) -> str:
    ext = tldextract.extract(url_or_domain)
    if ext.domain and ext.suffix:
        return f"{ext.domain}.{ext.suffix}"
    return url_or_domain.lower().strip()


# ── Individual scoring factors ────────────────────────────────────────────────
def check_https(domain: str) -> bool:
    """Verify that the domain has a valid SSL certificate."""
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.create_connection((domain, 443), timeout=4), server_hostname=domain):
            return True
    except Exception:
        return False


def get_domain_age_years(domain: str) -> Optional[float]:
    """Fetch domain registration age in years via WHOIS."""
    if not WHOIS_AVAILABLE:
        return None
    try:
        w = whois.whois(domain)
        created = w.creation_date
        if isinstance(created, list):
            created = created[0]
        if created:
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            age = (datetime.now(timezone.utc) - created).days / 365.25
            return round(age, 1)
    except Exception:
        pass
    return None


def get_bias_label(score: int) -> str:
    if score >= 80:
        return "Neutral"
    if score >= 60:
        return "Moderate"
    if score >= 40:
        return "Slight Bias"
    return "High Bias"


def get_risk_label(score: int) -> str:
    if score >= 75:
        return "LOW"
    if score >= 45:
        return "MEDIUM"
    return "HIGH"


# ── Main scoring engine ───────────────────────────────────────────────────────
def score_domain(url_or_domain: str) -> dict:
    """
    Score a news domain across multiple dimensions.
    Returns the output JSON matching the specified format:
    { "source": "...", "trust_score": 72, "bias": "Moderate", "risk": "Medium" }
    """
    domain = extract_domain(url_or_domain)
    score  = 50   # start neutral

    detail = {}

    # 1. Blacklist check (−40 points)
    if domain in BLACKLISTED_DOMAINS:
        score -= 40
        detail["blacklist"] = "FLAGGED"
    else:
        detail["blacklist"] = "Clean"

    # 2. Whitelist boost (+30 points)
    if domain in WHITELISTED_DOMAINS:
        score += 30
        detail["whitelist"] = "Trusted source"
    else:
        detail["whitelist"] = "Unknown"

    # 3. HTTPS check (+10 points)
    has_https = check_https(domain)
    if has_https:
        score += 10
        detail["https"] = "Yes"
    else:
        score -= 10
        detail["https"] = "No"

    # 4. Domain age (+10 points for >5y, −10 for <1y)
    age = get_domain_age_years(domain)
    if age is not None:
        if age > 5:
            score += 10
            detail["domain_age"] = f"{age}y — Established"
        elif age < 1:
            score -= 10
            detail["domain_age"] = f"{age}y — Very new (high risk)"
        else:
            detail["domain_age"] = f"{age}y — Moderate"
    else:
        detail["domain_age"] = "Unknown"

    # Clamp score to 0–100
    score = max(0, min(100, score))

    return {
        "source":      domain,
        "trust_score": score,
        "bias":        get_bias_label(score),
        "risk":        get_risk_label(score),
        "details":     detail,
    }
