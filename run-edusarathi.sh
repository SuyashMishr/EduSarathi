#!/bin/bash

echo "🚀 Starting EduSarathi - Complete Educational Platform"
echo "=================================================="

# Function to check if a port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to start a service
start_service() {
    local service_name=$1
    local port=$2
    local command=$3
    
    echo "🔧 Starting $service_name on port $port..."
    
    if check_port $port; then
        echo "⚠️  Port $port is already in use - service may already be running"
    else
        eval "$command" &
        local pid=$!
        echo "✅ $service_name started (PID: $pid)"
        sleep 2
    fi
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "python.*api_service" 2>/dev/null || true
sleep 3

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if ! pgrep mongod > /dev/null; then
    echo "⚠️  MongoDB not running. Please start MongoDB first"
    echo "   Run: brew services start mongodb/brew/mongodb-community"
    exit 1
fi

# Start AI Service
start_service "AI-Service" 8001 "cd ai && source venv/bin/activate && export GEMINI_API_KEY='AIzaSyBag4p-exEulPp3znM2A7MegvH3_FhCxxY' && export GOOGLE_AI_API_KEY='AIzaSyBag4p-exEulPp3znM2A7MegvH3_FhCxxY' && python api_service.py"

sleep 8

# Start Backend
start_service "Backend-Service" 5001 "cd backend && npm start"

sleep 5

# Start Frontend
start_service "Frontend-Service" 3000 "cd frontend && npm start"

sleep 5

echo ""
echo "🎉 EduSarathi Started Successfully!"
echo "=================================="
echo "🌐 Frontend:     http://localhost:3000"
echo "🔧 Backend API:  http://localhost:5001"
echo "🤖 Gemini AI:    http://localhost:8001"
echo "📚 AI API Docs:  http://localhost:8001/docs"
echo ""

# Test services
echo "🔍 Testing services..."
sleep 5

if check_port 3000; then
    echo "✅ Frontend - Running on port 3000"
else
    echo "❌ Frontend - Not responding"
fi

if check_port 5001; then
    echo "✅ Backend - Running on port 5001"
else
    echo "❌ Backend - Not responding"
fi

if check_port 8001; then
    echo "✅ AI Service - Running on port 8001"
else
    echo "❌ AI Service - Not responding"
fi

echo ""
echo "📊 Features Available:"
echo "  ✅ NCERT-aligned content generation"
echo "  ✅ Quiz generation with Gemini AI"
echo "  ✅ Curriculum planning"
echo "  ✅ Intelligent grading system"
echo "  ✅ Multi-language support"
echo ""
echo "🔄 Services are running continuously..."
echo "🛑 To stop all services, press Ctrl+C or run: pkill -f 'node.*server.js' && pkill -f 'react-scripts' && pkill -f 'python.*api_service'"

# Monitor services continuously
while true; do
    sleep 30
    echo "⏰ $(date): Monitoring services..."
    
    if check_port 3000; then
        echo "✅ Frontend - Running"
    else
        echo "❌ Frontend - Stopped, restarting..."
        cd frontend && npm start &
        cd ..
    fi
    
    if check_port 5001; then
        echo "✅ Backend - Running"
    else
        echo "❌ Backend - Stopped, restarting..."
        cd backend && npm start &
        cd ..
    fi
    
    if check_port 8001; then
        echo "✅ AI Service - Running"
    else
        echo "❌ AI Service - Stopped, restarting..."
        cd ai && source venv/bin/activate && python api_service.py &
        cd ..
    fi
    
    echo "---"
done
