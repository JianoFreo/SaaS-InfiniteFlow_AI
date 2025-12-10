#!/bin/bash
# Production-ready startup script

set -e

echo " Starting InfiniteFlow AI Production Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker/docker-compose.yml"
PROJECT_NAME="infiniteflow"

# Functions
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker found${NC}"
}

check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker Compose found${NC}"
}

validate_env_files() {
    echo ""
    echo -e "${BLUE}📋 Checking environment files...${NC}"
    
    if [ ! -f "backend/.env" ]; then
        echo -e "${YELLOW}⚠️  backend/.env not found, creating from example...${NC}"
        cp backend/.env.example backend/.env
    fi
    
    if [ ! -f "frontend/.env.local" ]; then
        echo -e "${YELLOW}⚠️  frontend/.env.local not found, creating from example...${NC}"
        cp frontend/.env.local.example frontend/.env.local
    fi
    
    echo -e "${GREEN}✅ Environment files ready${NC}"
}

start_services() {
    echo ""
    echo -e "${BLUE}🐳 Starting Docker containers...${NC}"
    
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d
    
    echo -e "${GREEN}✅ Services started${NC}"
}

wait_for_services() {
    echo ""
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    
    # Wait for PostgreSQL
    echo "  Waiting for PostgreSQL..."
    for i in {1..30}; do
        if docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec -T postgres pg_isready -U user &>/dev/null; then
            echo -e "    ${GREEN}✓ PostgreSQL is ready${NC}"
            break
        fi
        sleep 1
    done
    
    # Wait for Redis
    echo "  Waiting for Redis..."
    for i in {1..30}; do
        if docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec -T redis redis-cli ping &>/dev/null; then
            echo -e "    ${GREEN}✓ Redis is ready${NC}"
            break
        fi
        sleep 1
    done
    
    # Wait for Backend
    echo "  Waiting for Backend API..."
    for i in {1..30}; do
        if curl -s http://localhost:8000/health &>/dev/null; then
            echo -e "    ${GREEN}✓ Backend API is ready${NC}"
            break
        fi
        sleep 1
    done
    
    # Wait for Frontend
    echo "  Waiting for Frontend..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 &>/dev/null; then
            echo -e "    ${GREEN}✓ Frontend is ready${NC}"
            break
        fi
        sleep 1
    done
    
    echo -e "${GREEN}✅ All services are ready${NC}"
}

show_urls() {
    echo ""
    echo -e "${BLUE}📍 Service URLs:${NC}"
    echo ""
    echo -e "  ${GREEN}Frontend:${NC}        http://localhost:3000"
    echo -e "  ${GREEN}Backend API:${NC}     http://localhost:8000"
    echo -e "  ${GREEN}API Docs:${NC}       http://localhost:8000/docs"
    echo -e "  ${GREEN}ReDoc:${NC}          http://localhost:8000/redoc"
    echo -e "  ${GREEN}Database:${NC}       postgresql://user:password@localhost:5432/infiniteflow"
    echo -e "  ${GREEN}Redis:${NC}          redis://localhost:6379"
    echo ""
}

show_logs() {
    echo -e "${BLUE}📜 Showing logs (Ctrl+C to stop)...${NC}"
    echo ""
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f
}

# Main execution
main() {
    clear
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║     InfiniteFlow AI - Video Frame Interpolation        ║"
    echo "║                 Production Startup                     ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    
    check_docker
    check_docker_compose
    validate_env_files
    start_services
    wait_for_services
    show_urls
    
    # Ask to show logs
    echo -e "${BLUE}Would you like to see live logs? (y/n)${NC}"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        show_logs
    else
        echo ""
        echo -e "${GREEN}✅ InfiniteFlow AI is running!${NC}"
        echo ""
        echo "To view logs:"
        echo "  docker-compose -f $COMPOSE_FILE logs -f"
        echo ""
        echo "To stop services:"
        echo "  docker-compose -f $COMPOSE_FILE down"
        echo ""
    fi
}

# Run main function
main
