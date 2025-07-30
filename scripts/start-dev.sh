#!/bin/bash

# Development startup script

echo "🚀 Starting EduSarathi in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run setup.sh first."
    exit 1
fi

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🍃 Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log
fi

# Start Redis if not running
if ! pgrep -x "redis-server" > /dev/null; then
    echo "🔴 Starting Redis..."
    redis-server --daemonize yes
fi

echo "🖥️  Starting backend server..."
npm run backend &
BACKEND_PID=$!

echo "⚛️  Starting frontend server..."
npm run frontend &
FRONTEND_PID=$!

echo "🧠 Starting AI service..."
cd ai
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
AI_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🧠 AI Service: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID $AI_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for all background processes
wait