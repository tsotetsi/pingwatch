# Define application data as stored in the database.
from pydantic import BaseModel, ConfigDict


class PingResponseModel(BaseModel):
    """ Service Response model data."""
    status: str
    timestamp: str
    server_time: float
    message: str

    model_config = ConfigDict(extra="forbid")