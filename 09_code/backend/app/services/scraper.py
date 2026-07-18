"""
NeuralTruth - URL Scraping Service
File: apps/backend/app/services/scraper.py
"""
import httpx
from bs4 import BeautifulSoup


async def scrape_article_text(url: str, timeout: int = 10) -> str:
    """
    Async scrape article text from a public URL.
    Extracts <article> tags, then falls back to <p> tags.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove noisy tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    # Prefer <article> tag
    article = soup.find("article")
    if article:
        text = article.get_text(separator=" ", strip=True)
    else:
        paragraphs = soup.find_all("p")
        text = " ".join(p.get_text(strip=True) for p in paragraphs)

    return text[:8000]   # cap at 8K chars to keep inference fast
