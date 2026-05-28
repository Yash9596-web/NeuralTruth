# NeuralTruth — AI Fake News Detection Platform

[![Live Preview](https://img.shields.io/badge/Live%20Preview-Cloudflare%20Workers-00d4ff?style=for-the-badge&logo=cloudflare&logoColor=white)](https://neuraltruth-frontend.uniquetechytofficial.workers.dev/)

A production-grade, end-to-end platform for detecting fake news, scoring source credibility, and verifying claims using fine-tuned BERT transformer models.

## 🌟 Features
- **Real-Time Analysis**: Sub-200ms inference using PyTorch-optimized DistilRoBERTa.
- **Source Credibility Engine**: Domain WHOIS analysis, HTTPS verification, and static blacklist cross-referencing.
- **Claim Verification**: Web-search based semantic matching using `sentence-transformers`.
- **Browser Extension**: Manifest V3 Chrome extension for on-page fake news highlighting.
- **Admin Analytics Dashboard**: Real-time monitoring of API usage, model accuracy, and threat feeds.

## 🏗️ Architecture

```mermaid
graph TD
    User([User / Browser Extension]) -->|HTTPS| Frontend[Next.js Frontend]
    User -->|HTTPS| API[FastAPI Backend]
    
    Frontend --> API
    
    subgraph Backend [Backend Infrastructure]
        API --> Redis[(Redis Cache)]
        API --> Postgres[(PostgreSQL DB)]
        
        API --> ML[Inference Engine]
        API --> WebScraper[Scraping Service]
        API --> FactCheck[Claim Verification]
    end
    
    subgraph AI Models
        ML --> DistilRoBERTa[Quantized DistilRoBERTa]
        FactCheck --> SentTransformers[Sentence Transformers]
    end
    
    subgraph External APIs
        WebScraper --> Internet((Public Web))
        FactCheck --> BraveSearch((Brave Search API))
        API --> WHOIS((WHOIS DB))
    end
```

## 🚀 Installation & Deployment

NeuralTruth is fully containerized with Docker.

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend dev)
- Python 3.10+ (for local backend dev)

### Quickstart (Production via Docker)
1. Clone the repository
2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your WEB_SEARCH_API_KEY
```
3. Boot the cluster:
```bash
docker-compose up --build -d
```
- Frontend will be available at `http://localhost:3000`
- API Docs will be available at `http://localhost:8000/docs`

### Manual Development Setup

**1. Backend (FastAPI)**
```bash
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**2. Frontend (Next.js)**
```bash
cd apps/frontend
npm install
npm run dev
```

**3. Model Training (Optional)**
```bash
cd models
python train.py
python optimize.py
```

## 🔐 Environment Configuration
Create a `.env` file in the root with:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neuraltruth
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_super_secret_jwt_key
WEB_SEARCH_API_KEY=your_brave_search_api_key
```

## 🧪 Testing & Load Benchmarks
```bash
cd apps/backend && pytest tests/
python scripts/load_test.py
```
*Current benchmark: 0.18s avg latency under 50 concurrent req/sec.*

## 📦 CI/CD

This repository includes a GitHub Actions pipeline (`.github/workflows/deploy-cloudflare.yml`) configured for automated testing and deployment to Cloudflare Workers. Every commit pushed to the `main` branch automatically builds and deploys the latest version to the live preview: https://neuraltruth-frontend.uniquetechytofficial.workers.dev/
