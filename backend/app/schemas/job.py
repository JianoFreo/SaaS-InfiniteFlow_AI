from pydantic import BaseModel
from datetime import datetime

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    output_url: str | None = None
    error: str | None = None

class UploadResponse(BaseModel):
    job_id: str
    status: str
    created_at: datetime

class JobCreate(BaseModel):
    filename: str
    input_path: str
