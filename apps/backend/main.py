from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import predict, verify, auth, source, analytics
from app.core.logger import logger

app = FastAPI(
    title="NeuralTruth — Fake News Detection API",
    description=(
        "Production-grade REST API for real-time fake news detection, "
        "source credibility scoring, and claim verification using BERT transformers."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Prediction",     "description": "Analyze articles and URLs for fake news"},
        {"name": "Verification",   "description": "Fact-check claims via trusted sources"},
        {"name": "Source",         "description": "Domain credibility scoring engine"},
        {"name": "Analytics",      "description": "Platform statistics and usage data"},
        {"name": "Authentication", "description": "JWT-based user auth (register / login)"},
    ]
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc} | path={request.url.path}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,      prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(predict.router,   prefix="/api/v1",      tags=["Prediction"])
app.include_router(verify.router,    prefix="/api/v1",      tags=["Verification"])
app.include_router(source.router,    prefix="/api/v1",      tags=["Source"])
app.include_router(analytics.router, prefix="/api/v1",      tags=["Analytics"])

# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "NeuralTruth API is running", "version": "1.0.0", "docs": "/docs"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
