#!/bin/bash

# Setup script for InfiniteFlow AI development environment

set -e

echo " Setting up InfiniteFlow AI..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is required but not installed."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is required but not installed."
        exit 1
    fi
    
    echo "✅ Prerequisites OK"
}

# Setup backend
setup_backend() {
    echo ""
    echo "🔧 Setting up backend..."
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "✅ Virtual environment created"
    fi
    
    # Activate venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    echo "✅ Backend dependencies installed"
    
    # Setup environment
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo "⚠️  Created .env file - please configure database settings"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    echo ""
    echo "🎨 Setting up frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    echo "✅ Frontend dependencies installed"
    
    # Setup environment
    if [ ! -f ".env.local" ]; then
        cp .env.local.example .env.local
        echo "✅ Created .env.local file"
    fi
    
    cd ..
}

# Setup GPU worker
setup_gpu_worker() {
    echo ""
    echo "🎮 Setting up GPU worker..."
    cd gpu-worker
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "✅ Virtual environment created"
    fi
    
    # Activate venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    echo "✅ GPU worker dependencies installed"
    
    cd ..
}

# Main execution
check_prerequisites
setup_backend
setup_frontend
setup_gpu_worker

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure database in backend/.env"
echo "2. Run: docker-compose -f docker/docker-compose.yml up"
echo "   OR"
echo "3. Run backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. Run frontend: cd frontend && npm run dev"
echo ""
