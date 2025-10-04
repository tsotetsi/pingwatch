from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from src.api.v1.watcher import watcher_router
from src.schemas import PingResponse


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
    watcher_router,
    prefix="/api/v1"
)