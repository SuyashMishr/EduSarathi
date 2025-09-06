#!/bin/bash

# EduSarathi - Start All Services Script
# This script starts all required services for the EduSarathi platform

echo "🚀 Starting EduSarathi Platform..."
echo "=================================="

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not running. Starting MongoDB..."
    if command -v brew >/dev/null 2>&1; then
      brew services start mongodb-community@7.0 || true
    else
      echo "ℹ️ Please start MongoDB manually if required."
    fi
    sleep 3
else
    echo "✅ MongoDB is already running"
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Ensure Python venv for AI service
if [ ! -d "ai/venv" ]; then
  echo "🐍 Creating Python venv for AI service..."
  python3 -m venv ai/venv
fi
source ai/venv/bin/activate
pip install --upgrade pip >/dev/null 2>&1
pip install -r ai/requirements.txt >/dev/null 2>&1
deactivate

# Start AI Service (Python FastAPI)
echo ""
echo "🤖 Starting AI Service (Port 8001)..."
if check_port 8001; then
    cd ai
    source venv/bin/activate
    python api_service.py &
    AI_PID=$!
    echo "✅ AI Service started (PID: $AI_PID)"
    cd ..
else
    echo "🔄 AI Service already running on port 8001"
fi

# Wait a moment for AI service to start
sleep 3

# Start Backend Service (Node.js Express)
echo ""
echo "🔧 Starting Backend Service (Port 5001)..."
if check_port 5001; then
    cd backend
    npm install >/dev/null 2>&1
    npm start &
    BACKEND_PID=$!
    echo "✅ Backend Service started (PID: $BACKEND_PID)"
    cd ..
else
    echo "🔄 Backend Service already running on port 5001"
fi

# Wait a moment for backend to start
sleep 3

# Start Frontend Service (React)
echo ""
echo "🎨 Starting Frontend Service (Port 3000)..."
if check_port 3000; then
    cd frontend
    npm install >/dev/null 2>&1
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend Service started (PID: $FRONTEND_PID)"
    cd ..
else
    echo "🔄 Frontend Service already running on port 3000"
fi

echo ""
echo "🎉 EduSarathi Platform Started Successfully!"
echo "=================================="
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:5001"
echo "🤖 AI Service: http://localhost:8001"
echo ""
echo "💡 Ensure OPENROUTER_API_KEY is set in your environment or .env file."
echo "📖 For more info, check: README.md"

# Keep script running to show logs
echo ""
echo "📊 Services are running. Press Ctrl+C to stop monitoring..."
wait
