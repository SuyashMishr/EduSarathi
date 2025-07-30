#!/bin/bash

# EduSarathi - Stop All Services Script
# This script stops all running services for the EduSarathi platform

echo "🛑 Stopping EduSarathi Platform..."
echo "=================================="

# Function to kill process on port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Checking for $service_name on port $port..."
    
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "⚠️  Stopping $service_name (PID: $pid)..."
        kill -9 $pid
        echo "✅ $service_name stopped"
    else
        echo "ℹ️  $service_name not running on port $port"
    fi
}

# Stop Frontend (React - Port 3000)
kill_port 3000 "Frontend Service"

# Stop Backend (Node.js - Port 5001)  
kill_port 5001 "Backend Service"

# Stop AI Service (Python FastAPI - Port 8001)
kill_port 8001 "AI Service"

# Stop any remaining node processes related to the project
echo ""
echo "🧹 Cleaning up remaining processes..."

# Kill any remaining npm/node processes that might be related
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

echo ""
echo "✅ All EduSarathi services have been stopped!"
echo "=================================="
echo ""
echo "💡 To start services again, run: ./start-all-services.sh"
echo "📖 For more info, check: README.md"
