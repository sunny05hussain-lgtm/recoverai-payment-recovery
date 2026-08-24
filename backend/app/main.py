import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.analytics import router as analytics_router
from backend.app.recovery import router as recovery_router
from backend.app.routes import router as payments_router


app = FastAPI(
    title="RecoverAI API",
    description="Payment failure recovery backend",
    version="0.1.0",
)

frontend_origin = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:3000",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        frontend_origin,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "project": "RecoverAI",
        "message": "Payment recovery API is running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "recoverai-backend",
    }


app.include_router(payments_router)
app.include_router(recovery_router)
app.include_router(analytics_router)