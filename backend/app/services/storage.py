import os
import uuid
from pathlib import Path
from typing import Optional
from app.core.config import get_settings

settings = get_settings()

class StorageService:
    """Service for managing file storage"""
    
    @staticmethod
    def save_upload(file_content: bytes, filename: str) -> str:
        """Save uploaded file and return path"""
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Generate unique filename
        file_ext = Path(filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
        
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        return file_path
    
    @staticmethod
    def get_output_path(job_id: str) -> str:
        """Get output path for a job"""
        os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
        return os.path.join(settings.OUTPUT_DIR, f"{job_id}_output.mp4")
    
    @staticmethod
    def cleanup_file(file_path: str) -> bool:
        """Delete a file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception as e:
            print(f"Error cleaning up file: {e}")
            return False
    
    @staticmethod
    def get_file_size(file_path: str) -> int:
        """Get file size in bytes"""
        if os.path.exists(file_path):
            return os.path.getsize(file_path)
        return 0
