#!/bin/bash

# Start Gemini AI Service
# This script starts the Gemini AI service for EduSarathi

echo "🚀 Starting EduSarathi Gemini AI Service..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Navigate to AI directory
cd "$(dirname "$0")/../ai" || exit 1

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade requirements
echo "📚 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="AIzaSyB1_kmBdinFeeFAKAgjUpDsjYko_pSOOGs"
export GOOGLE_AI_API_KEY="AIzaSyB1_kmBdinFeeFAKAgjUpDsjYko_pSOOGs"
export ENVIRONMENT="development"

# Check if NCERT data exists
if [ ! -d "../data/ncert" ]; then
    echo "⚠️  NCERT data directory not found. Creating sample data..."
    mkdir -p ../data/ncert
fi

# Start the Gemini AI service
echo "🎯 Starting Gemini AI Service on port 8001..."
echo "📊 NCERT-aligned educational content generation ready!"
echo "🔗 Service will be available at: http://localhost:8001"
echo "📖 API documentation: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop the service"
echo "=========================="

python api_service.py