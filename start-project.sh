#!/bin/bash

echo "🚀 Starting EduSarathi Project"
echo "=============================="

# Navigate to project root
cd "$(dirname "$0")" || exit 1

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

sleep 2

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if ! pgrep mongod > /dev/null; then
    echo "⚠️  MongoDB not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    exit 1
fi

# Install AI dependencies with fixed requirements
echo "📦 Setting up AI service..."
cd ai
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements_minimal.txt
cd ..

# Install backend dependencies
echo "📦 Setting up backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Install frontend dependencies
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Start services in background
echo "🎯 Starting services..."

# Start AI service
echo "🤖 Starting AI service on port 8001..."
cd ai
source venv/bin/activate
export GEMINI_API_KEY="AIzaSyB1_kmBdinFeeFAKAgjUpDsjYko_pSOOGs"
export GOOGLE_AI_API_KEY="AIzaSyB1_kmBdinFeeFAKAgjUpDsjYko_pSOOGs"
python api_service.py &
AI_PID=$!
cd ..

sleep 5

# Start backend
echo "🔧 Starting backend on port 5001..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 5

# Start frontend
echo "🌐 Starting frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 EduSarathi Started Successfully!"
echo "=================================="
echo "🌐 Frontend:     http://localhost:3000"
echo "🔧 Backend API:  http://localhost:5001"
echo "🤖 Gemini AI:    http://localhost:8001"
echo "📚 AI API Docs:  http://localhost:8001/docs"
echo ""
echo "Process IDs:"
echo "  AI Service: $AI_PID"
echo "  Backend: $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $AI_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait