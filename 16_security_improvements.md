# Security Improvements & Threat Monitoring

NeuralTruth implements production-grade security measures to prevent abuse and ensure platform integrity.

## 1. Authentication & Authorization
- **JWT Implementation:** All sensitive endpoints require a Bearer token issued by `/api/v1/auth/login`. Tokens are signed using HS256 and expire after a configurable duration.
- **Password Hashing:** Implemented using `passlib` with `bcrypt`. Raw passwords are never stored.

## 2. Platform Protections
- **CORS Policies:** Configured in FastAPI to restrict origin requests to verified frontend domains in production.
- **Rate Limiting:** (Designed for Redis integration) to prevent abuse of the `/predict` API by bots scraping the service.

## 3. Threat Monitoring
- The system includes a live **Admin Dashboard** (`/admin`) that monitors:
  - **Suspicious Domain Flags:** Tracking domains that repeatedly score poorly on the Trust Index.
  - **Traffic Anomalies:** Monitoring API usage spikes that could indicate a coordinated misinformation attack or DDoS attempt.
