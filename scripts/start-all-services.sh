#!/bin/bash

# Start All EduSarathi Services
# This script starts the backend, frontend, and AI service

echo "🚀 Starting EduSarathi - Complete Educational Platform"
echo "=================================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Function to start a service in background
start_service() {
    local service_name=$1
    local command=$2
    local port=$3
    
    echo "🔧 Starting $service_name on port $port..."
    
    if check_port $port; then
        eval "$command" &
        local pid=$!
        echo "✅ $service_name started (PID: $pid)"
        echo $pid > "/tmp/edusarathi_${service_name,,}_pid"
    else
        echo "❌ Cannot start $service_name - port $port is busy"
    fi
}

# Navigate to project root
cd "$(dirname "$0")/.." || exit 1

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration"
fi

# Load .env and require OPENROUTER_API_KEY
if [ -f ".env" ]; then
    set -a
    # shellcheck disable=SC1091
    . .env
    set +a
fi

if [ -z "${OPENROUTER_API_KEY:-}" ]; then
    echo "❌ OPENROUTER_API_KEY is not set."
    echo "   Set it in .env or export it in your shell, then re-run this script."
    exit 1
fi

# Start MongoDB (if not running)
echo "🗄️  Checking MongoDB..."
if ! pgrep mongod > /dev/null; then
    echo "🔧 Starting MongoDB..."
    brew services start mongodb/brew/mongodb-community 2>/dev/null || echo "⚠️  Please start MongoDB manually"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Install AI service dependencies
echo "📦 Installing AI service dependencies..."
cd ai
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

# Set environment variables for AI service
export ENVIRONMENT="development"

# Start services
echo ""
echo "🎯 Starting all services..."
echo "=========================="

# Start AI Service (Port 8001)
start_service "AI-Service" "cd ai && source venv/bin/activate && python api_service.py" 8001

# Wait a moment for AI service to start
sleep 3

# Start Backend Service (Port 5000)
start_service "Backend-Service" "cd backend && npm start" 5000

# Wait a moment for backend to start
sleep 3

# Start Frontend Service (Port 3000)
start_service "Frontend-Service" "cd frontend && npm start" 3000

echo ""
echo "🎉 EduSarathi Services Started Successfully!"
echo "============================================"
echo "🌐 Frontend:     http://localhost:3000"
echo "🔧 Backend API:  http://localhost:5000"
echo "🤖 AI Service:   http://localhost:8001"
echo "📚 AI API Docs:  http://localhost:8001/docs"
echo ""
echo "📊 Features Available:"
echo "  ✅ NCERT-aligned content generation"
echo "  ✅ Quiz generation via OpenRouter"
echo "  ✅ Curriculum planning"
echo "  ✅ Intelligent grading system"
echo "  ✅ Multi-language support"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-all-services.sh"
echo "📝 Logs are available in the respective service directories"
echo ""
echo "Press Ctrl+C to stop monitoring (services will continue running)"

# Monitor services
while true; do
    sleep 30
    echo "⏰ $(date): Services running..."
done