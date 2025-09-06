# 🎓 EduSarathi - AI-Powered Educational Companion

EduSarathi is an intelligent educational companion that leverages OpenRouter-hosted models to create curricula, quizzes, assessments, and learning materials. Currently optimized for Physics Class 11 with NCERT content extraction.

## ✨ Features

- 📚 **Curriculum Generation** - AI-powered curriculum creation tailored to educational needs
- ❓ **Quiz Generator** - Create engaging quizzes with multiple question types automatically
- 📝 **Answer Assessment** - Upload and grade answer sheets using advanced AI technology
- 🎨 **Slide Generator** - Generate beautiful presentation slides for lessons
- 🧠 **Mind Maps** - Create visual mind maps to enhance learning and understanding
- 📅 **Lecture Planner** - Plan comprehensive lectures with structured activities
- 🌐 **Multi-language Support** - Content generation in multiple languages

## 📖 Current Content - Physics Class 11 (NCERT)

The platform includes extracted content from NCERT Physics Class 11 textbook:

- ✅ **Motion in a Straight Line** - Position, displacement, velocity, acceleration
- ✅ **Motion in a Plane** - Vector addition, projectile motion, circular motion
- ✅ **Laws of Motion** - Newton's laws, friction, dynamics
- ✅ **Work, Energy and Power** - Work-energy theorem, conservation of energy
- ✅ **Systems of Particles and Rotational Motion** - Center of mass, rotational kinematics
- ✅ **Gravitation** - Universal law of gravitation, planetary motion
- ✅ **Units and Measurement** - Physical quantities, units, dimensions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduSarathi
```

### 2. Start All Services (Recommended)
```bash
# Make the script executable once
chmod +x start-all-services.sh

# Start all services
./start-all-services.sh
```

This will automatically:
- ✅ Check and start MongoDB (if needed)
- ✅ Launch AI Service (Port 8001)
- ✅ Launch Backend API (Port 5001)
- ✅ Launch Frontend (Port 3000)

### 3. Alternative: Start Services Individually

Backend
```bash
cd backend
npm start
# Runs on http://localhost:5001
```

Frontend
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

AI Service
```bash
cd ai
python api_service.py
# Runs on http://localhost:8001
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- AI Service: http://localhost:8001

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Responsive design** for all devices

### AI Services
- **Python** with FastAPI
- **OpenRouter models** for content generation
- **OpenRouter API** for AI model access
- **PyPDF2** for PDF text extraction
- **NCERT Content** extracted and structured

## 📁 Project Structure

```
EduSarathi/
├── backend/                 # Node.js Backend API
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
├── frontend/               # React Frontend
│   ├── public/             # Static files
│   └── src/                # React components
├── ai/                     # Python AI Services
│   ├── enhanced_*.py       # Enhanced AI modules
│   ├── api_service.py      # Main AI API service
│   ├── config.py           # Configuration
│   └── requirements.txt    # Python dependencies
├── data/                   # Educational datasets
├── models/                 # AI model configurations
├── scripts/                # Build and deployment scripts
└── start-all-services.sh   # Main startup script
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or cloud)

### 1. Clone Repository
```bash
git clone <repository-url>
cd EduSarathi
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration (MongoDB URI, API keys, etc.)
```

### 3. Install Dependencies
```bash
# Install Node.js dependencies for backend and frontend
npm run install-all

# Install Python AI service dependencies
pip install -r ai/requirements.txt
```

## API Endpoints

### Curriculum
- `POST /api/curriculum/generate` - Generate curriculum
- `GET /api/curriculum/:id` - Get curriculum by ID
- `PUT /api/curriculum/:id` - Update curriculum

### Quiz
- `POST /api/quiz/generate` - Generate quiz
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Grading
- `POST /api/grading/upload` - Upload answer sheet
- `POST /api/grading/grade` - Grade answers
- `GET /api/grading/results/:id` - Get grading results

### Slides
- `POST /api/slides/generate` - Generate slides
- `GET /api/slides/:id` - Get slides by ID

### Mind Maps
- `POST /api/mindmap/generate` - Generate mind map
- `GET /api/mindmap/:id` - Get mind map by ID

### Lecture Plans
- `POST /api/lecture-plan/generate` - Generate lecture plan
- `GET /api/lecture-plan/:id` - Get lecture plan by ID

## Usage Examples

### Generate Curriculum
```javascript
const response = await fetch('/api/curriculum/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Mathematics',
    grade: '10',
    topics: ['Algebra', 'Geometry'],
    duration: '3 months'
  })
});
```

### Generate Quiz
```javascript
const response = await fetch('/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'Linear Equations',
    difficulty: 'medium',
    questionCount: 10,
    questionTypes: ['mcq', 'short_answer']
  })
});
```

## 🎯 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Runs development server with hot reload
```

### AI Service Development
```bash
cd ai
python api_service.py  # Direct Python execution
```

## 📊 Available Scripts

### Root Level
- `npm start` - Start backend server
- `npm run dev` - Start backend with nodemon
- `npm run install-all` - Install all dependencies
- `npm run dev-all` - Start both frontend and backend concurrently

### Startup Scripts
- `./start-all-services.sh` - Complete platform startup
- `./start-project.sh` - Alternative startup script

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support & Troubleshooting

### Common Issues
- MongoDB Connection: Ensure MongoDB is running locally or check your MONGODB_URI
- AI Service: Verify your API keys are properly set in .env file
- Port Conflicts: Default ports are 3000 (frontend), 5001 (backend), 8001 (AI)

### Getting Help
- For support, email suyashmisharaa983@gmail.com or create an issue in the repository.
- Check the logs in your terminal for specific error messages
- Ensure all dependencies are properly installed

---

Made with ❤️ for education
For support, email support@edusarathi.com or create an issue in the repository.# EduSarathi
