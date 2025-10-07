# Define data structure(s) for API interaction(s).
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ComponentSchema(BaseModel):
    """Component schema data."""
    name: str
    status: str
    details: str | None = None

    model_config=ConfigDict(extra="forbid")

class HealthCheckResponseSchema(BaseModel):
    """Health Check Response schema data."""
    status: str
    timestamp: datetime
    components: list[ComponentSchema]

class PingResponseSchema(BaseModel):
    """Service Response schema data."""
    status: int
    timestamp: datetime
    server_time: float
    message: str

    model_config=ConfigDict(extra="forbid")


class PongResponseSchema(BaseModel):
    """Pong Response schema data."""
    # Could add other services here and,
    # response with latency/availability etc.
    status: str
    timestamp: datetime

    model_config=ConfigDict(extra="forbid")