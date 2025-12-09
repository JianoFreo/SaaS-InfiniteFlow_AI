# InfiniteFlow AI Deployment Guide

## Architecture Diagrams

### Development Architecture
```
User Browser          Developer Machine
     |                      |
     +------Next.js------+  |
                         |  |
                    :3000|  |
                         |  |
                    FastAPI|
                      :8000|
                         |  |
                    PostgreSQL
                    Redis
                    GPU Worker (optional)
```

### Production Architecture
```
CDN/Vercel              AWS/GCP/DigitalOcean
   |                            |
   +---Frontend (Next.js)--------+
                                 |
                          Load Balancer
                                 |
                     +-----+-----+-----+
                     |     |     |     |
                  API-1  API-2  API-3  API-4
                     |     |     |     |
                     +-----+-----+-----+
                          |
                    RDS PostgreSQL
                          |
        +-----+-----+-----+
        |     |     |     |
     ElastiCache (Redis)
        |     |     |     |
     +--+--+--+--+--+--+
     |GPU|GPU|GPU|GPU|
     |W1 |W2 |W3 |W4 |
     +--+--+--+--+--+
        |
    S3/R2 Storage
```

## Deployment Options

### Option 1: Docker Compose (Single Server)

**Best for:** MVP, testing, small deployments

```bash
# Clone repo
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# Start services
docker-compose -f docker/docker-compose.yml up -d

# Check status
docker-compose -f docker/docker-compose.yml ps
```

### Option 2: Kubernetes (Scalable)

**Best for:** High availability, auto-scaling

```bash
# Install kubectl & helm
# kubectl apply -f k8s/namespace.yaml
# kubectl apply -f k8s/postgres-pvc.yaml
# helm install infiniteflow ./helm-chart

# Scale workers
kubectl scale deployment gpu-worker --replicas=4
```

### Option 3: Cloud-Specific (Recommended)

#### Vercel (Frontend)
```bash
# Connect GitHub repo
# Set NEXT_PUBLIC_API_URL environment variable
# Auto-deploys on push to main
```

#### AWS Deployment

```bash
# 1. RDS Database
aws rds create-db-instance \
  --db-instance-identifier infiniteflow-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password

# 2. ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id infiniteflow-redis \
  --cache-node-type cache.t3.micro \
  --engine redis

# 3. ECR Repositories
aws ecr create-repository --repository-name infiniteflow-backend
aws ecr create-repository --repository-name infiniteflow-gpu-worker

# 4. ECS Cluster
aws ecs create-cluster --cluster-name infiniteflow

# 5. Load Balancer
aws elbv2 create-load-balancer \
  --name infiniteflow-alb \
  --subnets subnet-xxxxx subnet-yyyyy
```

#### Google Cloud Deployment

```bash
# 1. CloudSQL
gcloud sql instances create infiniteflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro

# 2. Memorystore Redis
gcloud redis instances create infiniteflow-redis \
  --size=1 --region=us-central1

# 3. Cloud Run (Frontend)
gcloud run deploy infiniteflow-frontend \
  --source . \
  --memory 512Mi

# 4. GKE (Backend & Workers)
gcloud container clusters create infiniteflow \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --gpu=1
```

### Option 4: RunPod (GPU Workers Only)

**Best for:** Cheap GPU compute

```bash
# 1. Create RunPod account
# https://www.runpod.io

# 2. Create custom pod with Docker image
# Image: your-docker-registry/infiniteflow-gpu-worker
# GPU: RTX A100 (or your choice)
# Network: Enable ingress

# 3. Set environment variables
# REDIS_URL=your-redis-url
# DATABASE_URL=your-db-url

# 4. Expose port 6000 for status monitoring
```

### Option 5: DigitalOcean App Platform

```bash
# 1. Create app.yaml
cat > app.yaml <<EOF
name: infiniteflow
services:
- name: backend
  github:
    repo: JianoFreo/SaaS-InfiniteFlow_AI
    branch: main
  build_command: pip install -r requirements.txt
  run_command: "cd backend && uvicorn app.main:app --host 0.0.0.0"
  envs:
  - key: DATABASE_URL
    value: ${db.connection_string}
  - key: REDIS_URL
    value: ${redis.connection_string}
  http_port: 8000
  
- name: frontend
  github:
    repo: JianoFreo/SaaS-InfiniteFlow_AI
    branch: main
  build_command: cd frontend && npm install && npm run build
  run_command: "cd frontend && npm start"
  http_port: 3000

databases:
- name: postgres-db
  engine: PG
  version: "15"
  
- name: redis-cache
  engine: REDIS
  version: "7"
EOF

# 2. Deploy
doctl apps create --spec app.yaml
```

## Environment Variables

### Backend
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/infiniteflow

# Redis
REDIS_URL=redis://host:6379

# Storage (S3/R2)
S3_BUCKET=my-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# GPU
ENABLE_GPU=True
RIFE_MODEL_PATH=/models/rife

# API
DEBUG=False
API_TITLE=InfiniteFlow AI
API_VERSION=0.1.0
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.infiniteflow.ai
```

## Monitoring & Logging

### Backend Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### GPU Worker Monitoring
```bash
# Watch GPU usage
watch -n 1 nvidia-smi

# Monitor job queue
redis-cli LLEN video_processing_queue
```

### Cloud Monitoring

**AWS CloudWatch:**
```bash
# View logs
aws logs tail /ecs/infiniteflow-backend --follow

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name infiniteflow-cpu-high \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --threshold 80
```

**Google Cloud Monitoring:**
```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Create dashboard
gcloud monitoring dashboards create --config-from-file=dashboard.json
```

## Scaling

### Horizontal Scaling

**Backend API:**
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 4
```

**GPU Workers:**
```bash
# Add more workers
docker run -d \
  -e REDIS_URL=redis://redis:6379 \
  infiniteflow-gpu-worker
```

### Vertical Scaling

- Increase API server resources (CPU/RAM)
- Use larger GPU instances (A100 vs V100)
- Increase batch size for processing

## Performance Optimization

### Frontend
```javascript
// Next.js Image Optimization
import Image from 'next/image'

// Code splitting
const UploadSection = dynamic(() => import('@/components/Upload'))

// ISR for static content
export const revalidate = 3600
```

### Backend
```python
# Caching
from functools import lru_cache

@lru_cache(maxsize=128)
def get_settings():
    return Settings()

# Connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40
)
```

### GPU Workers
- Batch process videos
- Use mixed precision (fp16)
- Increase batch size
- Pre-load models

## Backup & Disaster Recovery

### Database Backups
```bash
# PostgreSQL
pg_dump -h host -U user infiniteflow > backup.sql

# Restore
psql -h host -U user infiniteflow < backup.sql
```

### File Backups
```bash
# S3 versioning
aws s3api put-bucket-versioning \
  --bucket my-bucket \
  --versioning-configuration Status=Enabled

# Cross-region replication
aws s3api put-bucket-replication \
  --bucket my-bucket \
  --replication-configuration file://replication.json
```

## Security Checklist

- [ ] Use HTTPS/TLS everywhere
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Use managed services (AWS RDS, etc.)
- [ ] Regular security updates
- [ ] Monitor for attacks
- [ ] Implement backup strategy
- [ ] Add authentication/authorization

## Cost Estimation

### AWS (Monthly)
- RDS PostgreSQL (db.t3.micro): $20
- ElastiCache Redis (cache.t3.micro): $15
- ECS (2x t3.small): $40
- ALB: $20
- Data transfer: $5-20
- **Total: ~$100-150/month**

### RunPod (Monthly)
- RTX A100 GPU: $0.24/hour × 730 = ~$175
- **Total: ~$175/month** (24/7 usage)

### Google Cloud (Monthly)
- Cloud SQL: $20
- Memorystore: $15
- Cloud Run: $5-20
- GKE: $70 (cluster)
- Compute Engine: $30-50
- **Total: ~$140-180/month**

## Troubleshooting Deployments

### Container fails to start
```bash
docker logs container-name
# Check environment variables
# Verify port availability
```

### Database connection error
```bash
# Test connection
psql -h host -U user -d infiniteflow

# Check security groups
# Verify credentials
```

### GPU worker not processing
```bash
# Check Redis connection
redis-cli ping

# Monitor queue
redis-cli LLEN video_processing_queue

# Check worker logs
docker logs gpu-worker
```

## Further Reading

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Kubernetes on AWS](https://aws.amazon.com/eks/)
- [PyTorch Serving](https://pytorch.org/serve/)
