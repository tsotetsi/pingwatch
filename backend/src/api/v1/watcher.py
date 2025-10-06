from datetime import datetime, timezone
from fastapi import APIRouter, status

from src.schemas import PingResponseSchema


watcher_router = APIRouter(tags=["monitoring"])

@watcher_router.get(
    "/watcher/ping",
    response_description=PingResponseSchema,
    status_code=status.HTTP_200_OK
)
async def ping():
    """
    Lightweight ping endpoint for connectivity checks.
    Returns minimal data to reduce bandwidth usage.
    """
    current_time = datetime.now(timezone.utc)
    try:
        # NOTE: Keep it minimal.
        pass
    except Exception:
        raise
    except Exception as e:
        pass
    return {
        "status": status.HTTP_200_OK,
        "timestamp": current_time,
        "server_time": current_time.timestamp(),
        "message": "pong"
    }

@watcher_router.get(
    "/watcher/health",
    response_description=PingResponseSchema,
    status_code=status.HTTP_200_OK
)
async def health():
    """
    Light weight health endpoint for checking
    custom services, like you own internal stack or
    connectivity monitoring.
    """

    return {
        "status": status.HTTP_200_OK,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
