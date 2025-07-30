"""
FastAPI service for AI-powered educational content generation using Gemini
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import logging
import json
from datetime import datetime

from gemini_service import GeminiService
from config import get_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="EduSarathi AI Service",
    description="NCERT-aligned educational content generation using Gemini AI",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini service
config = get_config()
gemini_service = GeminiService()

# Pydantic models for request/response
class QuizGenerationRequest(BaseModel):
    subject: str = Field(..., description="Subject name")
    topic: str = Field(..., description="Topic name")
    grade: int = Field(..., ge=1, le=12, description="Grade level (1-12)")
    questionCount: int = Field(10, ge=1, le=50, description="Number of questions")
    difficulty: str = Field("medium", description="Difficulty level")
    questionTypes: List[str] = Field(["mcq"], description="Types of questions")
    language: str = Field("en", description="Language code")

class CurriculumGenerationRequest(BaseModel):
    subject: str = Field(..., description="Subject name")
    grade: int = Field(..., ge=1, le=12, description="Grade level")
    duration: str = Field("1 semester", description="Duration of curriculum")
    focus_areas: Optional[List[str]] = Field(None, description="Specific focus areas")

class GradingRequest(BaseModel):
    question: str = Field(..., description="Question text")
    student_answer: str = Field(..., description="Student's answer")
    correct_answer: str = Field(..., description="Correct answer")
    subject: str = Field(..., description="Subject name")
    grade: int = Field(..., ge=1, le=12, description="Grade level")
    max_points: int = Field(5, ge=1, le=10, description="Maximum points")

class ContentGenerationRequest(BaseModel):
    type: str = Field(..., description="Content type (explanation, example, exercise)")
    subject: str = Field(..., description="Subject name")
    topic: str = Field(..., description="Topic name")
    grade: int = Field(..., ge=1, le=12, description="Grade level")
    additional_requirements: Optional[str] = Field(None, description="Additional requirements")

class LecturePlanGenerationRequest(BaseModel):
    subject: str = Field(..., description="Subject name")
    topic: str = Field(..., description="Topic name")
    grade: str = Field(..., description="Grade level")
    duration: int = Field(default=60, description="Duration in minutes")
    learningObjectives: List[str] = Field(default=[], description="Learning objectives")
    difficulty: str = Field(default="intermediate", description="Difficulty level")
    teachingStrategies: List[str] = Field(default=[], description="Teaching strategies")
    language: str = Field(default="en", description="Language for content")

class SlideGenerationRequest(BaseModel):
    subject: str = Field(..., description="Subject name")
    topic: str = Field(..., description="Topic name")
    grade: str = Field(..., description="Grade level")
    slideCount: int = Field(default=10, ge=3, le=20, description="Number of slides")
    theme: str = Field(default="default", description="Visual theme")
    template: str = Field(default="education", description="Template type")
    difficulty: str = Field(default="intermediate", description="Difficulty level")
    language: str = Field(default="en", description="Language for content")
    includeImages: bool = Field(default=False, description="Include image suggestions")

class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    sourceLanguage: str = Field("en", description="Source language code")
    targetLanguage: str = Field(..., description="Target language code")
    domain: str = Field("general", description="Domain for translation context")

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "EduSarathi AI", "version": "2.0.0"}

# Quiz generation endpoint
@app.post("/quiz/generate", response_model=APIResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate NCERT-aligned quiz using Gemini AI"""
    try:
        logger.info(f"Generating quiz for {request.subject} - {request.topic}")
        
        # Convert request to dict
        input_data = request.dict()
        
        # Generate quiz using Gemini service
        result = gemini_service.generate_quiz(input_data)
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Quiz generated successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Quiz generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in quiz generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Curriculum generation endpoint
@app.post("/curriculum/generate", response_model=APIResponse)
async def generate_curriculum(request: CurriculumGenerationRequest):
    """Generate NCERT-aligned curriculum using Gemini AI"""
    try:
        logger.info(f"Generating curriculum for {request.subject} Grade {request.grade}")
        
        input_data = request.dict()
        result = gemini_service.generate_curriculum(input_data)
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Curriculum generated successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Curriculum generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in curriculum generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Grading endpoint
@app.post("/grading/evaluate", response_model=APIResponse)
async def grade_answer(request: GradingRequest):
    """Grade student answer using Gemini AI"""
    try:
        logger.info(f"Grading answer for {request.subject}")
        
        input_data = request.dict()
        result = gemini_service.grade_answer(input_data)
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Answer graded successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Grading failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in grading: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Content generation endpoint
@app.post("/content/generate", response_model=APIResponse)
async def generate_content(request: ContentGenerationRequest):
    """Generate educational content using Gemini AI"""
    try:
        logger.info(f"Generating {request.type} content for {request.subject} - {request.topic}")
        
        input_data = request.dict()
        result = gemini_service.generate_content(input_data)
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Content generated successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Content generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in content generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lecture plan generation endpoint
@app.post("/lecture-plan/generate", response_model=APIResponse)
async def generate_lecture_plan(request: LecturePlanGenerationRequest):
    """Generate NCERT-aligned lecture plan using Gemini AI"""
    try:
        logger.info(f"Generating lecture plan for {request.subject} - {request.topic} (Grade {request.grade})")

        # Convert request to dict
        input_data = request.dict()

        # Generate lecture plan using Gemini service
        result = gemini_service.generate_lecture_plan(input_data)

        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Lecture plan generated successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Lecture plan generation failed: {result.get('error', 'Unknown error')}"
            )

    except Exception as e:
        logger.error(f"Error in lecture plan generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Slide generation endpoint
@app.post("/slides/generate", response_model=APIResponse)
async def generate_slides(request: SlideGenerationRequest):
    """Generate presentation slides using Gemini AI"""
    try:
        logger.info(f"Generating slides for {request.subject} - {request.topic} (Grade {request.grade})")

        # Convert request to dict
        input_data = request.dict()

        # Generate slides using Gemini service
        result = gemini_service.generate_slides(input_data)

        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Slides generated successfully"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Slide generation failed: {result.get('error', 'Unknown error')}"
            )

    except Exception as e:
        logger.error(f"Error in slide generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# NCERT data endpoints
@app.get("/ncert/subjects/{grade}")
async def get_subjects_by_grade(grade: int):
    """Get available subjects for a grade"""
    try:
        if 'curriculum_mapping' in gemini_service.ncert_data:
            mapping = gemini_service.ncert_data['curriculum_mapping']
            grade_subjects = mapping.get('grade_subject_mapping', {}).get(str(grade), [])
            
            return APIResponse(
                success=True,
                data={"grade": grade, "subjects": grade_subjects},
                message="Subjects retrieved successfully"
            )
        else:
            raise HTTPException(status_code=404, detail="NCERT data not found")
            
    except Exception as e:
        logger.error(f"Error getting subjects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ncert/chapters/{grade}/{subject}")
async def get_chapters(grade: int, subject: str):
    """Get chapters for a grade and subject"""
    try:
        grade_key = f'grade_{grade}'
        if (grade_key in gemini_service.ncert_data and 
            subject in gemini_service.ncert_data[grade_key]):
            
            subject_data = gemini_service.ncert_data[grade_key][subject]
            chapters = subject_data.get('chapters', {})
            
            return APIResponse(
                success=True,
                data=chapters,
                message="Chapters retrieved successfully"
            )
        else:
            raise HTTPException(
                status_code=404, 
                detail=f"Chapters not found for Grade {grade} {subject}"
            )
            
    except Exception as e:
        logger.error(f"Error getting chapters: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Batch processing endpoints
@app.post("/batch/quiz-generation")
async def batch_quiz_generation(
    requests: List[QuizGenerationRequest],
    background_tasks: BackgroundTasks
):
    """Generate multiple quizzes in batch"""
    try:
        batch_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Add background task for batch processing
        background_tasks.add_task(
            process_batch_quiz_generation,
            batch_id,
            [req.dict() for req in requests]
        )
        
        return APIResponse(
            success=True,
            data={"batch_id": batch_id, "status": "processing"},
            message="Batch quiz generation started"
        )
        
    except Exception as e:
        logger.error(f"Error in batch quiz generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_batch_quiz_generation(batch_id: str, requests: List[Dict]):
    """Process batch quiz generation in background"""
    try:
        results = []
        for i, request_data in enumerate(requests):
            logger.info(f"Processing batch {batch_id}, item {i+1}/{len(requests)}")
            result = gemini_service.generate_quiz(request_data)
            results.append({
                "index": i,
                "request": request_data,
                "result": result
            })
        
        # Save results (in production, save to database or file system)
        logger.info(f"Batch {batch_id} completed with {len(results)} items")
        
    except Exception as e:
        logger.error(f"Error in batch processing {batch_id}: {e}")

# Analytics and monitoring endpoints
@app.get("/analytics/usage")
async def get_usage_analytics():
    """Get usage analytics"""
    # In production, this would fetch from database
    return APIResponse(
        success=True,
        data={
            "total_requests": 0,
            "quiz_generations": 0,
            "curriculum_generations": 0,
            "grading_requests": 0,
            "content_generations": 0
        },
        message="Usage analytics retrieved"
    )

@app.get("/system/status")
async def get_system_status():
    """Get system status"""
    try:
        # Check Gemini service status
        test_input = {
            "subject": "mathematics",
            "topic": "test",
            "grade": 10,
            "questionCount": 1,
            "difficulty": "easy",
            "questionTypes": ["mcq"]
        }
        
        # Quick test (don't actually generate)
        ncert_context = gemini_service.get_ncert_context(10, "mathematics")
        
        return APIResponse(
            success=True,
            data={
                "gemini_service": "operational",
                "ncert_data_loaded": len(gemini_service.ncert_data) > 0,
                "models_initialized": len(gemini_service.models) > 0,
                "api_key_configured": bool(gemini_service.api_key)
            },
            message="System status retrieved"
        )
        
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        return APIResponse(
            success=False,
            error=str(e),
            message="System status check failed"
        )

# Translation endpoint using Gemini
@app.post("/translate/gemini", response_model=APIResponse)
async def translate_with_gemini(request: TranslationRequest):
    """Translate text using Gemini API for Hindi-English translation"""
    try:
        logger.info(f"Translating text from {request.sourceLanguage} to {request.targetLanguage}")

        # Create translation prompt
        source_lang_name = "English" if request.sourceLanguage.lower() in ["en", "english"] else "Hindi"
        target_lang_name = "Hindi" if request.targetLanguage.lower() in ["hi", "hindi"] else "English"

        prompt = f"""
You are an expert translator specializing in Hindi-English translation for educational content.

Translate the following text from {source_lang_name} to {target_lang_name}:

Text to translate: "{request.text}"

Requirements:
1. Maintain the original meaning and context
2. Use appropriate educational terminology
3. For technical terms, provide the most commonly used translation
4. Ensure the translation is natural and fluent
5. If translating to Hindi, use proper Devanagari script
6. For educational content, maintain formal tone

Provide only the translated text as output, without any additional explanation.
"""

        # Use content generation model for translation
        model = gemini_service.models.get('content_generation')
        if not model:
            raise ValueError("Content generation model not initialized")

        response = model.generate_content(prompt)
        translated_text = response.text.strip()

        # Clean up the response (remove quotes if present)
        if translated_text.startswith('"') and translated_text.endswith('"'):
            translated_text = translated_text[1:-1]

        return APIResponse(
            success=True,
            data={
                "originalText": request.text,
                "translatedText": translated_text,
                "sourceLanguage": request.sourceLanguage,
                "targetLanguage": request.targetLanguage,
                "confidence": 0.95,
                "processingTime": 0,
                "method": "gemini"
            },
            message="Text translated successfully using Gemini"
        )

    except Exception as e:
        logger.error(f"Error in Gemini translation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api_service:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        log_level="info"
    )