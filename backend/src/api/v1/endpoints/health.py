from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status

from src.schemas import PingResponseSchema
from src.api.v1.health.checks import (
    check_database_health,
    check_redis_health,
    check_ping_service_health,
    perform_health_checks
)


router = APIRouter()

@router.get(
    "/ping",
    response_model=PingResponseSchema,
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

@router.get(
    "/",
    status_code=status.HTTP_200_OK
)
async def application_health():
    """
    Light weight comprehensive health endpoint for checking
    custom services, like you own internal stack or
    connectivity monitoring.
    """
    return await perform_health_checks()

@router.get(
    "/ready",
    status_code=status.HTTP_200_OK
)
async def readiness_probe():
    """
    Readiness probe to indicate if the application is ready to
    handle requests. This can include checks like database connectivity.
    """
    # Implement actual readiness checks here.
    return {
        "status": "ready",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get(
    "/live",
    status_code=status.HTTP_200_OK
)
async def liveness_probe():
    """
    Liveness probe to indicate if the application is running.
    This can be a simple check to see if the application is alive.
    """
    # Implement actual liveness checks here.
    return {
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }