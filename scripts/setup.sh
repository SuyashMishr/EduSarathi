#!/bin/bash

# EduSarathi Setup Script

echo "🚀 Setting up EduSarathi..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
fi

echo "📦 Installing Node.js dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

echo "📦 Installing AI service dependencies..."
cd ai && pip3 install -r requirements.txt && cd ..

echo "📁 Creating necessary directories..."
mkdir -p logs uploads data/answer_images models

echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your API keys."
else
    echo "✅ .env file already exists."
fi

echo "🧠 Downloading AI models..."
cd ai
python3 -c "
import spacy
try:
    spacy.load('en_core_web_sm')
    print('✅ Spacy model already installed')
except OSError:
    print('📥 Downloading spacy model...')
    spacy.cli.download('en_core_web_sm')
"
cd ..

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your API keys"
echo "2. Start MongoDB: mongod"
echo "3. Start the application: npm run dev-all"
echo ""
echo "Or use Docker:"
echo "docker-compose up -d"