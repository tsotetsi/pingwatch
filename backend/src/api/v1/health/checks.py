from typing import Dict, Tuple

import asyncio


async def check_database_health() -> bool:
    """Simulate a database health check."""
    await asyncio.sleep(0.1)  # Simulate network delay.
    return True  # Replace with actual health check logic.

async def check_redis_health() -> bool:
    """Simulate a Redis health check."""
    await asyncio.sleep(0.1)  # Simulate network delay.
    return True  # Replace with actual health check logic.

async def check_ping_service_health() -> bool:
    """Simulate a ping service health check."""
    await asyncio.sleep(0.1)  # Simulate network delay.
    return True  # Replace with actual health check logic.

async def perform_health_checks() -> Dict[str, Tuple[str, bool]]:
    """Perform all health checks concurrently and return their statuses."""
    checks = {
        "Database": check_database_health,
        "Redis": check_redis_health,
        "Ping Service": check_ping_service_health
    }

    results = await asyncio.gather(*(check() for check in checks.values()), return_exceptions=True)

    health_status = {}
    for (name, _), result in zip(checks.items(), results):
        if isinstance(result, Exception):
            health_status[name] = (str(result), False)
        else:
            health_status[name] = ("Healthy" if result else "Unhealthy", result)

    return health_status