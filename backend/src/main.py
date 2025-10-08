from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.routers import api_router


tags_metadata = [ # For API documentation.
    {
        "name": "Connectivity Monitor",
        "description": "Operations related to Monitoring of Services."
    }
]

app = FastAPI(
    title="Connectivity Monitor API.",
    description="Connectivity Monitor API endpoints.",
    version="1.0.0",
    date=datetime.now(timezone.utc),
    openapi_tags=tags_metadata,
    contact={
    "name": "Thapelo Tsotetsi",
    "email": "thapelotsotetsi2030@gmail.com",
    "url": "https://tsotetsi.com/contact"
    },
    license_info={
    "name": "MIT",
    "url": "https://opensource.org/license/mit/"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api/v1"
)

@app.get("/", tags=["Connectivity Monitor"])
async def root():
    return {
        "message": "PingWatch Connectivity API",
    }

@app.get("/health", tags=["Connectivity Monitor"])
async def health():
    return {
        "message": "PingWatch Connectivity API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "healthy"
    }