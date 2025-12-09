import os
import uuid
from pathlib import Path
from typing import Optional
from sqlalchemy.orm import Session
from app.models.job import ProcessingJob, JobStatus
from app.schemas.job import JobCreate
from app.core.config import get_settings

settings = get_settings()

class JobService:
    """Service for managing processing jobs"""
    
    @staticmethod
    def create_job(db: Session, filename: str, input_path: str) -> ProcessingJob:
        """Create a new processing job"""
        job_id = str(uuid.uuid4())
        job = ProcessingJob(
            id=job_id,
            filename=filename,
            input_path=input_path,
            status=JobStatus.PENDING
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job
    
    @staticmethod
    def get_job(db: Session, job_id: str) -> Optional[ProcessingJob]:
        """Get a job by ID"""
        return db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    
    @staticmethod
    def update_job_status(db: Session, job_id: str, status: JobStatus, 
                         progress: int = 0, error: Optional[str] = None,
                         output_url: Optional[str] = None) -> ProcessingJob:
        """Update job status"""
        job = JobService.get_job(db, job_id)
        if job:
            job.status = status
            job.progress = progress
            if error:
                job.error = error
            if output_url:
                job.output_url = output_url
            db.commit()
            db.refresh(job)
        return job
    
    @staticmethod
    def delete_job(db: Session, job_id: str) -> bool:
        """Delete a job and its files"""
        job = JobService.get_job(db, job_id)
        if job:
            # Clean up files
            if job.input_path and os.path.exists(job.input_path):
                os.remove(job.input_path)
            if job.output_path and os.path.exists(job.output_path):
                os.remove(job.output_path)
            
            db.delete(job)
            db.commit()
            return True
        return False
