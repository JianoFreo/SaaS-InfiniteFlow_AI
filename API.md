# InfiniteFlow AI API Documentation

## Overview

RESTful API for video frame interpolation using AI. Built with FastAPI and Python.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, no authentication is required. In production, implement JWT or API keys.

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### Upload Video

**POST** `/api/upload`

Upload a video file for processing.

**Parameters:**
- `file` (multipart/form-data, required): Video file (MP4, AVI, MOV, etc.)

**Request Example:**
```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@video.mp4"
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "created_at": "2024-12-09T10:30:00"
}
```

**Status Codes:**
- `200`: Video uploaded successfully
- `413`: File too large (max 5GB)
- `500`: Server error

### Get Job Status

**GET** `/api/status/{job_id}`

Get the current status of a processing job.

**Parameters:**
- `job_id` (path, required): Job ID from upload response

**Request Example:**
```bash
curl http://localhost:8000/api/status/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 45,
  "output_url": null,
  "error": null
}
```

**Status Values:**
- `pending`: Job queued, waiting to start
- `processing`: Video is being interpolated
- `completed`: Processing finished successfully
- `failed`: Processing failed

**Status Codes:**
- `200`: Success
- `404`: Job not found

### Download Video

**GET** `/api/download/{job_id}`

Download the processed video.

**Parameters:**
- `job_id` (path, required): Job ID from upload response

**Request Example:**
```bash
curl -O http://localhost:8000/api/download/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
- Binary MP4 file

**Status Codes:**
- `200`: File downloaded
- `400`: Video not ready
- `404`: Job or file not found

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400`: Bad request (video not ready, invalid parameters)
- `404`: Resource not found (job ID doesn't exist)
- `413`: Payload too large (file exceeds limit)
- `500`: Internal server error

## Rate Limiting

Not implemented in MVP. Add in production:
- 10 uploads per minute per IP
- 100 status checks per minute per IP

## Examples

### Python

```python
import requests
import time

# Upload video
files = {'file': open('video.mp4', 'rb')}
response = requests.post('http://localhost:8000/api/upload', files=files)
job_id = response.json()['job_id']

# Poll for completion
while True:
    status = requests.get(f'http://localhost:8000/api/status/{job_id}').json()
    print(f"Status: {status['status']}, Progress: {status['progress']}%")
    
    if status['status'] == 'completed':
        # Download file
        video = requests.get(f'http://localhost:8000/api/download/{job_id}')
        with open('output.mp4', 'wb') as f:
            f.write(video.content)
        break
    elif status['status'] == 'failed':
        print(f"Error: {status['error']}")
        break
    
    time.sleep(2)
```

### JavaScript

```javascript
async function uploadAndProcess() {
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  
  // Upload
  const uploadRes = await fetch('http://localhost:8000/api/upload', {
    method: 'POST',
    body: formData
  });
  const { job_id } = await uploadRes.json();
  
  // Poll status
  let completed = false;
  while (!completed) {
    const statusRes = await fetch(`http://localhost:8000/api/status/${job_id}`);
    const status = await statusRes.json();
    
    console.log(`Progress: ${status.progress}%`);
    
    if (status.status === 'completed') {
      // Download
      const downloadRes = await fetch(`http://localhost:8000/api/download/${job_id}`);
      const blob = await downloadRes.blob();
      downloadFile(blob, 'output.mp4');
      completed = true;
    } else if (status.status === 'failed') {
      console.error(status.error);
      completed = true;
    }
    
    await new Promise(r => setTimeout(r, 2000));
  }
}
```

### cURL

```bash
# Upload
JOB_ID=$(curl -s -F "file=@video.mp4" http://localhost:8000/api/upload | jq -r '.job_id')

# Check status
curl http://localhost:8000/api/status/$JOB_ID | jq .

# Download when complete
curl -O http://localhost:8000/api/download/$JOB_ID
```

## Response Time Expectations

- Upload: < 10 seconds (depends on file size)
- Processing: 
  - 1 minute video: 1-3 minutes
  - 5 minute video: 5-15 minutes
  - 10+ minute video: 15+ minutes
  - *Times vary based on GPU availability and video resolution*
- Download: < 5 seconds

## Data Limits

- Maximum file size: 5 GB
- Maximum processing queue: 100 jobs
- File retention: 24 hours (after which files are deleted)

## Webhooks (Future)

Coming soon:
```
POST /webhooks/processing-complete
```

## API Versioning

Current version: v1 (implicit)

Future: `/api/v2/upload`

## Support

For issues or questions:
- GitHub Issues: https://github.com/JianoFreo/SaaS-InfiniteFlow_AI/issues
- Documentation: http://localhost:8000/docs (Swagger UI)
- ReDoc: http://localhost:8000/redoc
