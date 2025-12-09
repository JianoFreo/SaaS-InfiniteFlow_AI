from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API
    API_TITLE: str = "InfiniteFlow AI API"
    API_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/infiniteflow"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Storage
    S3_BUCKET: str = "infiniteflow-videos"
    S3_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    
    # Upload
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024 * 1024  # 5GB
    UPLOAD_DIR: str = "/tmp/uploads"
    OUTPUT_DIR: str = "/tmp/output"
    
    # Processing
    ENABLE_GPU: bool = True
    RIFE_MODEL_PATH: str = "./models/rife"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
