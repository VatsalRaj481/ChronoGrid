from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import drivers, races, telemetry, standings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Defense-in-depth safeguard against Brotli decompression vulnerabilities (CVE-2026-111497 / Node2Shell)
# Rejects incoming request bodies with Content-Encoding: br with HTTP 415
@app.middleware("http")
async def reject_brotli_request_bodies(request: Request, call_next):
    content_encoding = request.headers.get("content-encoding", "").lower()
    if "br" in content_encoding:
        return JSONResponse(
            status_code=415,
            content={
                "error": "Unsupported Media Type",
                "message": "Brotli request decompression (Content-Encoding: br) is rejected as defense-in-depth (CVE-2026-111497 safeguard)."
            }
        )
    return await call_next(request)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(drivers.router, prefix=settings.API_V1_STR)
app.include_router(races.router, prefix=settings.API_V1_STR)
app.include_router(telemetry.router, prefix=settings.API_V1_STR)
app.include_router(standings.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "healthy"}
