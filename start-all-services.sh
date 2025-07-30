#!/bin/bash

# EduSarathi - Start All Services Script
# This script starts all required services for the EduSarathi platform

echo "🚀 Starting EduSarathi Platform..."
echo "=================================="

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not running. Starting MongoDB..."
    brew services start mongodb-community@7.0
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
echo "📚 Available Features:"
echo "  • Physics Class 11 Quiz Generation"
echo "  • Curriculum Generation"
echo "  • Answer Assessment"
echo "  • Slide Generation"
echo "  • Mind Maps"
echo "  • Lecture Planning"
echo ""
echo "💡 To stop all services, run: ./stop-all-services.sh"
echo "📖 For more info, check: README.md"

# Keep script running to show logs
echo ""
echo "📊 Services are running. Press Ctrl+C to stop monitoring..."
wait
