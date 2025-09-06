# 🎓 EduSarathi - AI-Powered Educational Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.103+-009688.svg)](https://fastapi.tiangolo.com/)

EduSarathi is an intelligent educational companion that leverages OpenRouter-hosted AI models to create comprehensive educational content. Built with React, Node.js, Python FastAPI, and MongoDB, it provides end-to-end educational content generation from curricula to assessments.

## ✨ Core Features

### 🎯 **Content Generation**
- 📚 **Smart Curriculum Creation** - AI-generated curricula tailored to specific subjects and grades
- ❓ **Advanced Quiz Generation** - Multiple question types (MCQ, short answer, essay) with auto-grading
- 📝 **Intelligent Assessment** - Upload and grade answer sheets with detailed feedback
- 🎨 **Dynamic Slide Generation** - Create presentation slides with structured content
- 🧠 **Visual Mind Maps** - Generate hierarchical mind maps for complex topics
- 📅 **Comprehensive Lecture Planning** - Structured lesson plans with activities and timelines

### 🚀 **Advanced Capabilities**
- 🌐 **Multi-language Support** - Content generation in multiple languages
- 📖 **NCERT Integration** - Optimized for Class 11 Physics with extracted content
- 🔄 **Real-time Processing** - Fast content generation with multiple AI models
- 📊 **Analytics Dashboard** - Track learning progress and performance metrics
- 🔒 **Secure Authentication** - JWT-based user management and data protection

## 🏗️ Architecture Overview

EduSarathi follows a modern microservices architecture with dedicated services for different responsibilities:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service   │
│   React.js      │◄──►│   Node.js       │◄──►│   FastAPI       │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │    MongoDB      │              │
         │              │   Database      │              │
         │              └─────────────────┘              │
         │                                                │
         └────────────────┐         ┌─────────────────────┘
                          ▼         ▼
                   ┌─────────────────┐
                   │  OpenRouter API │
                   │  (8 AI Models)  │
                   └─────────────────┘
```

### 🤖 **AI Model Optimization**

EduSarathi uses specialized AI models for different educational tasks:

| Module | AI Model | Purpose | Performance |
|--------|----------|---------|-------------|
| 📝 Quiz Generation | `deepseek/deepseek-chat-v3.1:free` | Advanced reasoning for varied question types | ⭐⭐⭐⭐⭐ |
| 📚 Curriculum | `meta-llama/llama-3.2-3b-instruct:free` | Structured educational content planning | ⭐⭐⭐⭐⭐ |
| 📊 Assessment | `google/gemma-2-9b-it:free` | Detailed grading and feedback | ⭐⭐⭐⭐⭐ |
| 🎨 Slides | `deepseek/deepseek-chat-v3.1:free` | Creative presentation design | ⭐⭐⭐⭐ |
| 🧠 Mind Maps | `meta-llama/llama-3.2-3b-instruct:free` | Hierarchical concept organization | ⭐⭐⭐⭐ |
| 📅 Lecture Plans | `google/gemma-2-9b-it:free` | Comprehensive lesson structuring | ⭐⭐⭐⭐⭐ |

## 🚀 Quick Start Guide

### 📋 **Prerequisites**
Ensure you have the following installed on your system:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v16.0+ | [nodejs.org](https://nodejs.org/) |
| **Python** | v3.8+ | [python.org](https://www.python.org/) |
| **MongoDB** | v5.0+ | [mongodb.com](https://www.mongodb.com/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### ⚡ **One-Click Setup** (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/SuyashMishr/EduSarathi.git
cd EduSarathi

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your OpenRouter API key and MongoDB URI

# 3. Start everything with one command
./start-all-services.sh
```

### 🎯 **What the Script Does**
- ✅ **Checks Dependencies** - Verifies Node.js, Python, and MongoDB
- ✅ **Installs Packages** - Both npm and pip dependencies automatically
- ✅ **Starts MongoDB** - Launches local MongoDB if needed
- ✅ **Starts AI Service** - FastAPI server on port 8001
- ✅ **Starts Backend** - Express.js API on port 5001
- ✅ **Starts Frontend** - React development server on port 3000
- ✅ **Health Checks** - Verifies all services are running correctly

### 🌐 **Access Your Application**
- **Frontend**: http://localhost:3000 - Main user interface
- **Backend API**: http://localhost:5001 - REST API endpoints
- **AI Service**: http://localhost:8001 - AI processing service
- **API Docs**: http://localhost:8001/docs - Interactive API documentation

## 🛠️ Technology Stack

### 🖥️ **Frontend**
```javascript
React.js 18+          // Modern component-based UI
Tailwind CSS          // Utility-first styling
Axios                // HTTP client for API calls
React Router         // Client-side routing
React Hooks          // State management
Responsive Design    // Mobile-first approach
```

### ⚙️ **Backend**
```javascript
Node.js              // JavaScript runtime
Express.js           // Web application framework
MongoDB + Mongoose   // Database and ODM
JWT Authentication   // Secure token-based auth
Multer              // File upload handling
CORS                // Cross-origin resource sharing
Rate Limiting       // API protection
Helmet              // Security middleware
Winston             // Logging system
```

### 🤖 **AI Services**
```python
FastAPI             # Modern async Python web framework
OpenRouter API      # Access to 8 specialized AI models
PyPDF2             # PDF text extraction
Transformers       # NLP model support
Pandas + NumPy     # Data processing
Pydantic           # Data validation
Uvicorn            # ASGI server
```

### 🗄️ **Database & Storage**
```
MongoDB            # NoSQL document database
GridFS             # File storage for large documents
Redis (Optional)   # Caching and session storage
```

### 🔧 **DevOps & Tools**
```bash
npm/yarn           # Package management
pip/conda          # Python package management
Nodemon            # Development auto-restart
Concurrently       # Run multiple commands
Git                # Version control
ESLint/Prettier    # Code formatting
```

## 📁 Project Structure

```
EduSarathi/
├── 🖥️  frontend/                    # React.js Frontend Application
│   ├── public/                     # Static assets and HTML template
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # Main application pages
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Helper functions
│   │   └── styles/                 # Tailwind CSS configurations
│   ├── package.json               # Frontend dependencies
│   └── tailwind.config.js          # Tailwind configuration
│
├── ⚙️  backend/                     # Node.js Backend API
│   ├── controllers/               # Route controllers
│   │   ├── curriculumController.js    # Curriculum generation logic
│   │   ├── quizController.js          # Quiz management
│   │   ├── gradingController.js       # Answer assessment
│   │   ├── slideController.js         # Slide generation
│   │   ├── mindmapController.js       # Mind map creation
│   │   └── lecturePlanController.js   # Lecture planning
│   ├── models/                    # MongoDB data models
│   │   ├── User.js                    # User authentication
│   │   ├── Quiz.js                    # Quiz structure
│   │   ├── Curriculum.js              # Curriculum data
│   │   └── AnswerSheet.js             # Assessment results
│   ├── routes/                    # API route definitions
│   ├── utils/                     # Utility functions
│   │   ├── db.js                      # Database connection
│   │   ├── logger.js                  # Logging configuration
│   │   └── multerConfig.js            # File upload settings
│   ├── middleware/                # Express middleware
│   └── server.js                  # Main server entry point
│
├── 🤖 ai/                          # Python AI Services
│   ├── api_service.py             # FastAPI main application
│   ├── config.py                  # AI service configuration
│   ├── openrouter_service.py      # OpenRouter API integration
│   ├── enhanced_quiz_generator.py # Advanced quiz creation
│   ├── enhanced_curriculum_generator.py # Curriculum AI
│   ├── enhanced_slide_generator.py # Slide generation AI
│   ├── enhanced_mindmap_generator.py # Mind map AI
│   ├── enhanced_lecture_plan_generator.py # Lecture planning
│   ├── enhanced_answer_assessment.py # Grading AI
│   ├── pdf_extractor.py           # PDF content extraction
│   ├── language_context.py        # Multi-language support
│   ├── utils.py                   # AI utility functions
│   └── requirements.txt           # Python dependencies
│
├── 📚 data/                        # Educational Content Database
│   ├── Class_11th/               # Grade 11 materials
│   │   ├── CBSE_Curriculum/          # Official curriculum docs
│   │   ├── English_books/            # Subject textbooks
│   │   │   ├── Physics/              # Physics textbooks
│   │   │   ├── Chemistry/            # Chemistry materials
│   │   │   └── Mathematics/          # Math resources
│   │   └── Hindi_books/              # Hindi language materials
│   └── ncert/                     # NCERT extracted content
│
├── 🔧 scripts/                     # Build and Deployment
│   ├── start-all-services.sh         # Complete startup script
│   ├── stop-all-services.sh          # Service shutdown
│   ├── setup.sh                      # Initial setup script
│   └── generate-demo-data.js         # Sample data generation
│
├── 🧪 Testing/                     # Test Suite
│   ├── test_api_models.py             # AI model validation
│   ├── test_all_modules.py            # Module integration tests
│   └── test_content_generation.py    # Content generation tests
│
├── 📄 Configuration Files
│   ├── .env.example                   # Environment template
│   ├── package.json                   # Project metadata
│   ├── requirements.txt               # Python dependencies
│   ├── AI_MODEL_CONFIGURATION.md     # AI model setup guide
│   └── README.md                      # This documentation
│
└── 🚀 start-all-services.sh          # One-click startup script
```

### 🔑 **Key Directories Explained**

| Directory | Purpose | Technologies |
|-----------|---------|--------------|
| `/frontend` | User interface and client-side logic | React, Tailwind CSS, Axios |
| `/backend` | REST API and business logic | Node.js, Express, MongoDB |
| `/ai` | AI processing and model integration | Python, FastAPI, OpenRouter |
| `/data` | Educational content and datasets | PDF files, extracted text |
| `/scripts` | Automation and deployment tools | Bash scripts, Node.js |

## ⚙️ Installation & Configuration

### 🚀 **Automated Setup** (Recommended)

```bash
# Clone and setup in one go
git clone https://github.com/SuyashMishr/EduSarathi.git
cd EduSarathi
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 🔧 **Manual Setup**

#### 1. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

**Required Environment Variables:**
```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/edusarathi
MONGODB_URI_CLOUD=mongodb+srv://username:password@cluster.mongodb.net/

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_YOUR_SITE_URL=http://localhost:3000
OPENROUTER_YOUR_APP_NAME=EduSarathi

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Service Configuration
PORT=5001
AI_SERVICE_PORT=8001
FRONTEND_PORT=3000

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

#### 2. **Install Dependencies**

**Node.js Dependencies:**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Or use the convenience script
npm run install-all
```

**Python Dependencies:**
```bash
# Create virtual environment (recommended)
cd ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt

# Or install minimal dependencies
pip install -r requirements_simple.txt
```

#### 3. **Database Setup**

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

**MongoDB Atlas (Cloud):**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Add to `.env` file as `MONGODB_URI_CLOUD`

#### 4. **OpenRouter API Setup**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Create account and get API key
3. Add credits for extended usage (optional)
4. Add API key to `.env` file

### 🧪 **Validation & Testing**

```bash
# Test AI models and API connectivity
python test_api_models.py

# Test all educational modules
python test_all_modules.py

# Test content generation end-to-end
python test_content_generation.py

# Verify all services are working
./start-all-services.sh
```

## 🔌 API Documentation

### 📚 **Curriculum Management**

#### Generate Curriculum
```http
POST /api/curriculum/generate
Content-Type: application/json

{
  "subject": "Physics",
  "grade": "11",
  "topics": ["Motion", "Forces", "Energy"],
  "duration": "3 months",
  "difficulty": "intermediate",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "curriculum": {
    "id": "curr_123456",
    "title": "Physics Grade 11 Curriculum",
    "modules": [...],
    "timeline": {...},
    "learning_objectives": [...]
  }
}
```

#### Retrieve Curriculum
```http
GET /api/curriculum/:id
Authorization: Bearer <jwt_token>
```

### ❓ **Quiz Management**

#### Generate Quiz
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "topic": "Laws of Motion",
  "difficulty": "medium",
  "questionCount": 10,
  "questionTypes": ["mcq", "short_answer", "essay"],
  "duration": 30,
  "grade": "11"
}
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_789012",
    "title": "Laws of Motion Quiz",
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "question": "What is Newton's first law?",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "points": 2
      }
    ],
    "total_points": 20,
    "duration": 30
  }
}
```

#### Submit Quiz Answers
```http
POST /api/quiz/:id/submit
Content-Type: application/json

{
  "answers": {
    "q1": "A",
    "q2": "Newton's second law states...",
    "q3": "B"
  },
  "time_taken": 25
}
```

### 📝 **Answer Assessment**

#### Upload Answer Sheet
```http
POST /api/grading/upload
Content-Type: multipart/form-data

file: <answer_sheet.pdf>
quiz_id: quiz_789012
```

#### Grade Answers
```http
POST /api/grading/grade
Content-Type: application/json

{
  "quiz_id": "quiz_789012",
  "answers": {...},
  "rubric": {
    "mcq_weight": 0.4,
    "short_answer_weight": 0.4,
    "essay_weight": 0.2
  }
}
```

### 🎨 **Slide Generation**

#### Generate Slides
```http
POST /api/slides/generate
Content-Type: application/json

{
  "topic": "Photosynthesis",
  "slide_count": 8,
  "style": "educational",
  "include_images": true,
  "difficulty": "high_school"
}
```

### 🧠 **Mind Map Creation**

#### Generate Mind Map
```http
POST /api/mindmap/generate
Content-Type: application/json

{
  "topic": "Cell Structure",
  "depth": 3,
  "max_branches": 5,
  "include_descriptions": true,
  "visual_style": "hierarchical"
}
```

### 📅 **Lecture Planning**

#### Generate Lecture Plan
```http
POST /api/lecture-plan/generate
Content-Type: application/json

{
  "topic": "Electromagnetic Induction",
  "duration": 60,
  "grade": "12",
  "learning_objectives": [...],
  "activities": ["demonstration", "group_work", "discussion"]
}
```

### 🔒 **Authentication**

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Teacher Name",
  "email": "teacher@school.edu",
  "password": "securePassword123",
  "role": "teacher",
  "institution": "Sample School"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "teacher@school.edu",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "Teacher Name",
    "email": "teacher@school.edu",
    "role": "teacher"
  }
}
```

### 📊 **Error Handling**

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "topic",
      "reason": "Topic is required"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input data
- `AUTH_ERROR` - Authentication failed
- `RATE_LIMIT_ERROR` - Too many requests
- `AI_SERVICE_ERROR` - AI processing failed
- `DATABASE_ERROR` - Database operation failed

## 🎯 Development Guide

### 🏃‍♂️ **Running in Development Mode**

#### Frontend Development
```bash
cd frontend
npm start
# Runs React development server with hot reload
# Available at: http://localhost:3000
# Features: Live reload, error overlay, debugging tools
```

#### Backend Development
```bash
cd backend
npm run dev
# Uses nodemon for automatic server restart
# Available at: http://localhost:5001
# Features: Auto-restart on file changes, detailed logging
```

#### AI Service Development
```bash
cd ai
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Start FastAPI with auto-reload
uvicorn api_service:app --reload --port 8001
# Available at: http://localhost:8001
# API docs at: http://localhost:8001/docs
```

#### Concurrent Development
```bash
# Run all services simultaneously
npm run dev-all
# This starts both frontend and backend with live reload
```

### 🧪 **Testing Framework**

#### Run Comprehensive Test Suite
```bash
# Test AI model connectivity and performance
cd ai
python test_api_models.py

# Test all educational modules
python test_all_modules.py

# Test content generation workflows
python test_content_generation.py

# Frontend unit tests
cd frontend && npm test

# Backend integration tests
cd backend && npm test

# Run end-to-end tests
npm run test:e2e
```

#### Test Coverage Analysis
```bash
# Generate coverage reports
cd backend
npm run test:coverage

cd frontend  
npm run test:coverage

cd ai
pytest --cov=. --cov-report=html
```

#### Performance Testing
```bash
# Load testing with Artillery
artillery run performance/load-test.yml

# Memory profiling
node --inspect backend/server.js

# API response time testing
cd ai && python benchmark_api.py
```

### 🔧 **Available Scripts**

#### Root Level Scripts
```bash
npm start              # Start backend server (production)
npm run dev            # Start backend with nodemon (development)
npm run frontend       # Start frontend development server
npm run backend        # Start backend development server
npm run install-all    # Install all dependencies (frontend + backend)
npm run dev-all        # Start both frontend and backend concurrently
npm run test           # Run full test suite
npm run build          # Build production bundles
npm run deploy         # Deploy to production environment
```

#### Frontend Scripts
```bash
cd frontend
npm start              # Development server with hot reload
npm run build          # Create production build
npm test               # Run Jest test suite
npm run test:watch     # Run tests in watch mode
npm run lint           # Check code style with ESLint
npm run lint:fix       # Auto-fix linting issues
```

#### Backend Scripts
```bash
cd backend
npm start              # Start production server
npm run dev            # Development with nodemon
npm test               # Run test suite
npm run test:watch     # Tests in watch mode
npm run migrate        # Run database migrations
npm run seed           # Seed database with sample data
```

#### AI Service Scripts
```bash
cd ai
python api_service.py          # Start FastAPI server
uvicorn api_service:app --reload   # Development with auto-reload
python -m pytest tests/       # Run Python tests
python test_models.py          # Test AI model integration
```

### 🛠️ **Debugging Tools**

#### VS Code Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug AI Service",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/ai/api_service.py",
      "console": "integratedTerminal"
    }
  ]
}
```

#### Browser DevTools
- **React DevTools** - Component inspection and state debugging
- **Network Tab** - API request monitoring
- **Console** - Error tracking and logging

#### Logging
```javascript
// Backend logging levels
const logger = require('./utils/logger');
logger.error('Error message');
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug message');
```

### 🔄 **Git Workflow**

#### Branch Strategy
```bash
main           # Production-ready code
develop        # Integration branch
feature/*      # Feature development
bugfix/*       # Bug fixes
hotfix/*       # Critical production fixes
```

#### Commit Conventions
```bash
git commit -m "feat: add quiz generation API"
git commit -m "fix: resolve MongoDB connection issue"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
git commit -m "refactor: optimize AI service performance"
git commit -m "test: add unit tests for quiz controller"
```

## � Deployment Guide

### 🐳 **Docker Deployment** (Recommended)

#### Build and Run with Docker Compose
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Individual Service Containers
```bash
# Frontend
docker build -t edusarathi-frontend ./frontend
docker run -p 3000:3000 edusarathi-frontend

# Backend
docker build -t edusarathi-backend ./backend
docker run -p 5001:5001 edusarathi-backend

# AI Service
docker build -t edusarathi-ai ./ai
docker run -p 8001:8001 edusarathi-ai
```

### ☁️ **Cloud Deployment**

#### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create applications
heroku create edusarathi-frontend
heroku create edusarathi-backend
heroku create edusarathi-ai

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri -a edusarathi-backend
heroku config:set OPENROUTER_API_KEY=your_api_key -a edusarathi-ai

# Deploy
git subtree push --prefix=frontend heroku main
git subtree push --prefix=backend heroku main
git subtree push --prefix=ai heroku main
```

#### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### 🌐 **Production Configuration**

#### Environment Variables for Production
```bash
# Backend Production (.env.production)
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/edusarathi-prod
JWT_SECRET=super-secure-production-secret
CORS_ORIGIN=https://edusarathi.com

# AI Service Production
OPENROUTER_API_KEY=prod_api_key
RATE_LIMIT_PER_MINUTE=100
LOG_LEVEL=info

# Frontend Production
REACT_APP_API_URL=https://api.edusarathi.com
REACT_APP_AI_SERVICE_URL=https://ai.edusarathi.com
REACT_APP_ENVIRONMENT=production
```

#### SSL/HTTPS Setup
```bash
# Using Certbot for Let's Encrypt
sudo certbot --nginx -d edusarathi.com -d www.edusarathi.com
```

#### Performance Optimizations
```bash
# Frontend build optimization
cd frontend
npm run build
npm install -g serve
serve -s build -l 3000

# Backend optimization
cd backend
npm run build
pm2 start server.js --name "edusarathi-backend"

# AI service optimization
cd ai
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api_service:app --bind 0.0.0.0:8001
```

### 📊 **Monitoring & Logging**

#### Application Monitoring
```bash
# PM2 process monitoring
pm2 start ecosystem.config.js
pm2 monitor

# Log aggregation
pm2 logs --lines 100

# Performance monitoring
pm2 monit
```

#### Health Checks
```bash
# Backend health check
curl http://localhost:5001/api/health

# AI service health check
curl http://localhost:8001/health

# Frontend health check
curl http://localhost:3000
```

## 🤝 Contributing

### 📋 **Contributing Guidelines**

We welcome contributions to EduSarathi! Please follow these guidelines:

#### 🔄 **Development Workflow**
```bash
# 1. Fork the repository
git clone https://github.com/yourusername/edusarathi.git
cd edusarathi

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes and test thoroughly
npm run test:all

# 4. Commit with conventional commits
git commit -m "feat: add amazing new feature"

# 5. Push and create pull request
git push origin feature/amazing-feature
```

#### 📝 **Commit Message Convention**
```bash
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

#### 🧪 **Testing Requirements**
- All new features must include tests
- Maintain test coverage above 80%
- Run full test suite before submitting PR
- Include integration tests for API endpoints

#### 📖 **Code Standards**
- Follow ESLint rules for JavaScript/React
- Use Black formatter for Python code
- Write comprehensive JSDoc/docstring comments
- Follow REST API naming conventions

#### 🐛 **Bug Reports**
When reporting bugs, please include:
- Environment details (OS, Node.js version, Python version)
- Steps to reproduce
- Expected vs actual behavior
- Error logs and screenshots

#### 💡 **Feature Requests**
Before requesting features:
- Check existing issues
- Provide detailed use case
- Consider implementation complexity
- Discuss with maintainers

## 🆘 Support & Troubleshooting

### 🔧 **Common Issues & Solutions**

#### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh "mongodb://localhost:27017/edusarathi"
```

#### API Service Issues
```bash
# Check API key validity
cd ai && python test_api_models.py

# Verify environment variables
cat .env | grep OPENROUTER_API_KEY

# Test API connectivity
curl -X POST http://localhost:8001/health
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000  # Frontend
lsof -i :5001  # Backend  
lsof -i :8001  # AI Service

# Kill processes if needed
kill -9 $(lsof -t -i:3000)
```

#### Dependency Issues
```bash
# Clean install all dependencies
rm -rf node_modules package-lock.json
npm install

# Python dependency issues
cd ai
pip install -r requirements.txt --force-reinstall
```

### 📊 **Performance Optimization**

#### Frontend Optimization
```bash
# Bundle analysis
cd frontend
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Backend Optimization
```bash
# Memory profiling
node --inspect backend/server.js
# Open chrome://inspect

# Database query optimization
# Enable MongoDB profiler
db.setProfilingLevel(2)
```

### 🔍 **Debugging Tools**

#### Frontend Debugging
```bash
# React DevTools
# Install: https://chrome.google.com/webstore/detail/react-developer-tools

# Redux DevTools (if using Redux)
# Install: https://chrome.google.com/webstore/detail/redux-devtools
```

#### Backend Debugging
```bash
# Debug mode
DEBUG=* npm start

# API testing with Postman
# Collection available at: docs/postman-collection.json
```

#### AI Service Debugging
```bash
# Verbose logging
cd ai
export LOG_LEVEL=debug
python api_service.py

# Model testing
python test_api_models.py --verbose
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

### 📞 **Support & Contact**

#### 🔗 **Links**
- **Documentation**: [Full API Documentation](docs/api.md)
- **Issues**: [GitHub Issues](https://github.com/username/edusarathi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/edusarathi/discussions)

#### 📧 **Contact Information**
- **Email**: suyashmisharaa983@gmail.com
- **Support**: support@edusarathi.com
- **Discord**: [EduSarathi Community](https://discord.gg/edusarathi)

#### 🆘 **Getting Help**
1. Check the [FAQ](docs/faq.md)
2. Search existing [GitHub Issues](https://github.com/username/edusarathi/issues)
3. Join our [Discord Community](https://discord.gg/edusarathi)
4. Create a new issue with detailed information

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**🚀 Built with ❤️ for the future of education**

[⬆ Back to Top](#-edusarathi---comprehensive-ai-powered-educational-platform)

</div>
