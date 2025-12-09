from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.job import UploadResponse, JobStatusResponse
from app.services.job import JobService
from app.services.storage import StorageService
from app.services.interpolator import RIFEInterpolator
from app.models.job import JobStatus
import asyncio

router = APIRouter(prefix="/api", tags=["processing"])
interpolator = RIFEInterpolator()

def process_video(job_id: str, input_path: str, output_path: str, db: Session):
    """Background task to process video"""
    try:
        JobService.update_job_status(db, job_id, JobStatus.PROCESSING, 0)
        
        success, error = interpolator.interpolate_frames(input_path, output_path)
        
        if success:
            # In production, upload to S3/R2 and get URL
            output_url = f"/api/download/{job_id}"
            JobService.update_job_status(
                db, job_id, JobStatus.COMPLETED, 100, output_url=output_url
            )
        else:
            JobService.update_job_status(
                db, job_id, JobStatus.FAILED, error=error
            )
    except Exception as e:
        JobService.update_job_status(db, job_id, JobStatus.FAILED, error=str(e))

@router.post("/upload", response_model=UploadResponse)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """Upload video for processing"""
    try:
        # Read file
        content = await file.read()
        
        # Check size
        from app.core.config import get_settings
        settings = get_settings()
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
        
        # Save file
        input_path = StorageService.save_upload(content, file.filename)
        
        # Create job
        job = JobService.create_job(db, file.filename, input_path)
        
        # Queue processing
        output_path = StorageService.get_output_path(job.id)
        if background_tasks:
            background_tasks.add_task(process_video, job.id, input_path, output_path, db)
        
        return UploadResponse(
            job_id=job.id,
            status=job.status.value,
            created_at=job.created_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_status(job_id: str, db: Session = Depends(get_db)):
    """Get processing status"""
    job = JobService.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatusResponse(
        job_id=job.id,
        status=job.status.value,
        progress=job.progress,
        output_url=job.output_url,
        error=job.error
    )

@router.get("/download/{job_id}")
async def download_video(job_id: str, db: Session = Depends(get_db)):
    """Download processed video"""
    job = JobService.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != JobStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Video not ready for download")
    
    output_path = StorageService.get_output_path(job_id)
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Output file not found")
    
    return FileResponse(output_path, media_type='video/mp4', filename=f"optimized_{job.filename}")

import os
from fastapi.responses import FileResponse
