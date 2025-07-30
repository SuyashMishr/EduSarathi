# 🎓 EduSarathi - AI-Powered Educational Platform

**EduSarathi** is an intelligent educational companion that leverages Google's Gemini AI to create curricula, quizzes, assessments, and learning materials. Currently optimized for **Physics Class 11** with NCERT content extraction.

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
./start-all-services.sh
```

This will automatically:
- ✅ Start MongoDB (if not running)
- ✅ Launch AI Service (Port 8001)
- ✅ Launch Backend API (Port 5001)
- ✅ Launch Frontend (Port 3000)

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **AI Service**: http://localhost:8001

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Query** for state management

### AI Services
- **Python** with FastAPI
- **Google Gemini AI** for content generation
- **PyPDF2** for PDF text extraction
- **NCERT Content** extracted and structured

## Project Structure

```
EduSarathi/
├── backend/                 # Node.js Backend
├── frontend/               # React Frontend
├── ai/                     # Python AI Services
├── notebooks/              # Jupyter Notebooks
├── models/                 # AI Models
├── data/                   # Datasets
└── docker-compose.yml      # Docker configuration
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd EduSarathi
```

2. **Install dependencies**
```bash
# Install Node.js dependencies
npm run install-all

# Install Python dependencies
pip install -r requirements.txt
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the services**

**Option 1: Using npm scripts**
```bash
# Start both frontend and backend
npm run dev-all

# Or start individually
npm run backend    # Backend on port 5000
npm run frontend   # Frontend on port 3000
```

**Option 2: Using Docker**
```bash
docker-compose up -d
```

5. **Start AI Service**
```bash
cd ai
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
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

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### AI Service Development
```bash
cd ai
uvicorn main:app --reload
```

## Testing

```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai && python -m pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support, email support@edusarathi.com or create an issue in the repository.# EduSarathi
