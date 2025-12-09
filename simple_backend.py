#!/usr/bin/env python3
"""
Simple mock backend for testing the SaaS InfiniteFlow AI project
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="InfiniteFlow AI", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock routes
@app.get("/health")
async def health():
    return {"status": "ok", "service": "backend"}

@app.get("/docs")
async def docs():
    return {"message": "API documentation"}

@app.post("/upload")
async def upload(file: str = None):
    return {"job_id": "job_123", "status": "queued"}

@app.get("/job/{job_id}")
async def get_job(job_id: str):
    return {"job_id": job_id, "status": "processing", "progress": 45}

@app.get("/")
async def root():
    return {"message": "InfiniteFlow AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
