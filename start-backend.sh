#!/bin/bash

echo "🔧 Starting Backend on Port 5001"
echo "================================"

cd "$(dirname "$0")/backend" || exit 1

# Set environment variables explicitly
export PORT=5001
export NODE_ENV=development
export MONGODB_URI=mongodb://localhost:27017/edusarathi
export GEMINI_API_KEY=AIzaSyB1_kmBdinFeeFAKAgjUpDsjYko_pSOOGs
export JWT_SECRET=edusarathi_super_secret_key_2024_development_only

# Kill any existing process on port 5001
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

sleep 2

# Start the backend
echo "Starting backend server..."
npm start