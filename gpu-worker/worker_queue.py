import os
import json
import redis
import logging
from rife_worker import RIFEWorker
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WorkerQueue:
    """Redis-based task queue for GPU workers"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379", 
                 model_path: Optional[str] = None):
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.rife_worker = RIFEWorker(model_path)
        self.queue_name = "video_processing_queue"
        self.in_progress = "video_processing_in_progress"
    
    def start_worker(self):
        """Start listening for jobs"""
        logger.info("Starting GPU worker...")
        while True:
            try:
                # Get job from queue (blocking)
                job_data = self.redis_client.blpop(self.queue_name, timeout=10)
                
                if job_data:
                    _, job_json = job_data
                    job = json.loads(job_json)
                    self.process_job(job)
                else:
                    logger.debug("No jobs in queue, waiting...")
            
            except Exception as e:
                logger.error(f"Error in worker loop: {e}")
                continue
    
    def process_job(self, job: dict):
        """Process a single job"""
        job_id = job['job_id']
        input_path = job['input_path']
        output_path = job['output_path']
        
        try:
            logger.info(f"Processing job {job_id}")
            
            # Mark as in progress
            self.redis_client.hset(f"job:{job_id}", "status", "processing")
            
            # Process video
            def progress_callback(progress: int):
                self.redis_client.hset(f"job:{job_id}", "progress", progress)
                logger.info(f"Job {job_id}: {progress}%")
            
            success = self.rife_worker.process_video(
                input_path, 
                output_path,
                multiplier=2,
                progress_callback=progress_callback
            )
            
            if success:
                self.redis_client.hset(f"job:{job_id}", "status", "completed")
                self.redis_client.hset(f"job:{job_id}", "output_path", output_path)
                logger.info(f"Job {job_id} completed successfully")
            else:
                self.redis_client.hset(f"job:{job_id}", "status", "failed")
                logger.error(f"Job {job_id} failed")
        
        except Exception as e:
            logger.error(f"Error processing job {job_id}: {e}")
            self.redis_client.hset(f"job:{job_id}", "status", "failed")
            self.redis_client.hset(f"job:{job_id}", "error", str(e))

def main():
    """Entry point for GPU worker"""
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    model_path = os.getenv("RIFE_MODEL_PATH", "./models/rife")
    
    worker = WorkerQueue(redis_url, model_path)
    worker.start_worker()

if __name__ == "__main__":
    main()
