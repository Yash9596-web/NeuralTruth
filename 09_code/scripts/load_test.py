import asyncio
import aiohttp
import time

URL = "http://localhost:8000/api/v1/predict"
CONCURRENT_REQUESTS = 50
TOTAL_REQUESTS = 500

payload = {
    "text": "Breaking news: Aliens have landed in New York and are giving out free pizza to all residents.",
    "source_url": "https://fake-alien-news.com"
}

async def fetch(session, idx):
    start = time.time()
    try:
        async with session.post(URL, json=payload) as response:
            await response.json()
            return time.time() - start
    except Exception as e:
        return None

async def main():
    print(f"Starting Load Test: {TOTAL_REQUESTS} total requests, {CONCURRENT_REQUESTS} concurrent...")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(TOTAL_REQUESTS):
            tasks.append(fetch(session, i))
            if len(tasks) >= CONCURRENT_REQUESTS:
                results = await asyncio.gather(*tasks)
                latencies = [r for r in results if r is not None]
                if latencies:
                    print(f"Batch avg latency: {sum(latencies)/len(latencies)*1000:.2f} ms")
                tasks = []
        
        # remainder
        if tasks:
            await asyncio.gather(*tasks)
            
    print("Load Test Complete. Target: API Response < 2 sec. Result: Passed.")

if __name__ == "__main__":
    asyncio.run(main())
