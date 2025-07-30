#!/bin/bash

# Stop All EduSarathi Services
# This script stops all running EduSarathi services

echo "🛑 Stopping EduSarathi Services..."
echo "================================="

# Function to stop service by PID file
stop_service_by_pid() {
    local service_name=$1
    local pid_file="/tmp/edusarathi_${service_name,,}_pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "🔧 Stopping $service_name (PID: $pid)..."
            kill "$pid"
            rm "$pid_file"
            echo "✅ $service_name stopped"
        else
            echo "⚠️  $service_name was not running"
            rm "$pid_file"
        fi
    else
        echo "⚠️  No PID file found for $service_name"
    fi
}

# Function to stop service by port
stop_service_by_port() {
    local service_name=$1
    local port=$2
    
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔧 Stopping $service_name on port $port (PID: $pid)..."
        kill "$pid"
        echo "✅ $service_name stopped"
    else
        echo "⚠️  No service running on port $port"
    fi
}

# Stop services by PID files first
stop_service_by_pid "Frontend-Service"
stop_service_by_pid "Backend-Service"
stop_service_by_pid "Gemini-AI-Service"

# Stop services by ports as backup
echo ""
echo "🔍 Checking for remaining services on ports..."
stop_service_by_port "Frontend" 3000
stop_service_by_port "Backend" 5000
stop_service_by_port "Gemini-AI" 8001

# Stop any remaining Node.js processes related to the project
echo ""
echo "🧹 Cleaning up remaining processes..."

# Kill any remaining npm/node processes in project directory
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
pkill -f "node.*$PROJECT_DIR" 2>/dev/null && echo "✅ Stopped remaining Node.js processes"

# Kill any remaining Python processes for the AI service
pkill -f "python.*api_service.py" 2>/dev/null && echo "✅ Stopped remaining Python AI service processes"

# Clean up temporary files
rm -f /tmp/edusarathi_*_pid 2>/dev/null

echo ""
echo "🎉 All EduSarathi services have been stopped!"
echo "============================================="
echo ""
echo "📝 To restart services, run: ./scripts/start-all-services.sh"