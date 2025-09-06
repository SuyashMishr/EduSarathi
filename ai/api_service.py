"""
FastAPI service for AI-powered educational content generation using OpenRouter
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import logging
import json
from datetime import datetime

from openrouter_service import OpenRouterService
from config import get_config

# Import enhanced modules
from enhanced_quiz_generator import EnhancedQuizGenerator
from enhanced_slide_generator import EnhancedSlideGenerator
from enhanced_curriculum_generator import EnhancedCurriculumGenerator
from enhanced_lecture_plan_generator import EnhancedLecturePlanGenerator
from enhanced_mindmap_generator import EnhancedMindmapGenerator
from enhanced_answer_assessment import EnhancedAnswerSheetAssessment

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="EduSarathi AI Service",
    description="NCERT-aligned educational content generation using OpenRouter AI",
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

# Initialize services
config = get_config()
# Remove Gemini usage per user request
# gemini_service = GeminiService()
openrouter_service = OpenRouterService()  # Primary AI service

# Initialize enhanced modules with OpenRouter
enhanced_quiz_generator = EnhancedQuizGenerator()
enhanced_slide_generator = EnhancedSlideGenerator()
enhanced_curriculum_generator = EnhancedCurriculumGenerator()
enhanced_lecture_plan_generator = EnhancedLecturePlanGenerator()
enhanced_mindmap_generator = EnhancedMindmapGenerator()
enhanced_answer_assessment = EnhancedAnswerSheetAssessment()

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

class MindmapGenerationRequest(BaseModel):
    subject: str = Field(..., description="Subject name")
    topic: str = Field(..., description="Topic name")
    grade: int = Field(10, ge=1, le=12, description="Grade level")
    mindmapType: str = Field("conceptual", description="Type of mindmap")
    language: str = Field("en", description="Language code")

class AnswerSheetRequest(BaseModel):
    answerContent: str = Field(..., description="Answer sheet content")
    subject: str = Field(..., description="Subject name")
    questionPaper: Optional[str] = Field(None, description="Question paper content")
    grade: int = Field(10, ge=1, le=12, description="Grade level")
    assessmentType: str = Field("subjective", description="Type of assessment")
    language: str = Field("en", description="Language code")
    detailedFeedback: bool = Field(True, description="Provide detailed feedback")

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

# Enhanced Quiz generation endpoint with superior AI integration
@app.post("/quiz/generate", response_model=APIResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate superior quiz using enhanced OpenRouter service with educational expertise"""
    try:
        logger.info(f"Generating enhanced quiz for {request.subject} - {request.topic} (Grade {request.grade})")
        
        # Use enhanced OpenRouter service for superior content generation
        quiz_data = openrouter_service.generate_quiz({
            'subject': request.subject,
            'topic': request.topic,
            'grade': request.grade,
            'questionCount': request.questionCount,
            'difficulty': request.difficulty,
            'questionTypes': request.questionTypes,
            'language': request.language,
            'enhanced_mode': True,
            'ncert_alignment': True,
            'superior_quality': True
        })
        
        if quiz_data.get('success'):
            return APIResponse(
                success=True,
                data=quiz_data['data'],
                message="Enhanced quiz generated successfully with superior educational quality",
                timestamp=datetime.now().isoformat()
            )
        else:
            # Enhanced fallback for quiz generation
            logger.warning("Primary service failed, using enhanced educational fallback")
            fallback_quiz = enhanced_quiz_generator.generate_superior_quiz(
                request.subject, request.topic, request.grade, 
                request.questionCount, request.difficulty
            )
            
            return APIResponse(
                success=True,
                data=fallback_quiz,
                message="Quiz generated using enhanced educational fallback system",
                timestamp=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Enhanced quiz generation error: {e}")
        return APIResponse(
            success=False,
            error=f"Quiz generation failed: {str(e)}",
            message="Unable to generate quiz. Please try again or contact support."
        )

# Enhanced Curriculum generation endpoint
@app.post("/curriculum/generate", response_model=APIResponse)
async def generate_curriculum(request: CurriculumGenerationRequest):
    """Generate comprehensive curriculum using enhanced educational AI"""
    try:
        logger.info(f"Generating enhanced curriculum for {request.subject} - Grade {request.grade}")
        
        # Use enhanced OpenRouter service for superior curriculum design
        curriculum_data = openrouter_service.generate_curriculum({
            'subject': request.subject,
            'grade': request.grade,
            'duration': request.duration,
            'focus_areas': request.focus_areas or [],
            'enhanced_features': True,
            'pedagogical_design': True,
            'ncert_alignment': True,
            'comprehensive_assessment': True
        })
        
        if curriculum_data.get('success'):
            return APIResponse(
                success=True,
                data=curriculum_data['data'],
                message="Enhanced curriculum generated with comprehensive pedagogical design",
                timestamp=datetime.now().isoformat()
            )
        else:
            # Enhanced curriculum fallback
            logger.warning("Primary service failed, using enhanced curriculum fallback")
            fallback_curriculum = enhanced_curriculum_generator.generate_comprehensive_curriculum(
                request.subject, request.grade, request.duration
            )
            
            return APIResponse(
                success=True,
                data=fallback_curriculum,
                message="Curriculum generated using enhanced educational framework",
                timestamp=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Enhanced curriculum generation error: {e}")
        return APIResponse(
            success=False,
            error=f"Curriculum generation failed: {str(e)}",
            message="Unable to generate curriculum. Please try again."
        )

# Enhanced Lecture plan generation endpoint
@app.post("/lecture-plan/generate", response_model=APIResponse)
async def generate_lecture_plan(request: LecturePlanGenerationRequest):
    """Generate comprehensive lecture plan with superior educational design"""
    try:
        logger.info(f"Generating enhanced lecture plan for {request.subject} - {request.topic}")
        
        # Use enhanced OpenRouter service for superior lecture planning
        lecture_plan_data = openrouter_service.generate_lecture_plan({
            'subject': request.subject,
            'topic': request.topic,
            'grade': request.grade,
            'duration': request.duration,
            'learning_objectives': request.learningObjectives,
            'difficulty': request.difficulty,
            'teaching_strategies': request.teachingStrategies,
            'language': request.language,
            'enhanced_pedagogy': True,
            '5e_model': True,
            'assessment_integration': True
        })
        
        if lecture_plan_data.get('success'):
            return APIResponse(
                success=True,
                data=lecture_plan_data['data'],
                message="Enhanced lecture plan generated with comprehensive pedagogical framework",
                timestamp=datetime.now().isoformat()
            )
        else:
            # Enhanced lecture plan fallback
            logger.warning("Primary service failed, using enhanced lecture plan fallback")
            fallback_plan = enhanced_lecture_plan_generator.generate_comprehensive_plan(
                request.subject, request.topic, request.grade, request.duration
            )
            
            return APIResponse(
                success=True,
                data=fallback_plan,
                message="Lecture plan generated using enhanced educational methodology",
                timestamp=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Enhanced lecture plan generation error: {e}")
        return APIResponse(
            success=False,
            error=f"Lecture plan generation failed: {str(e)}",
            message="Unable to generate lecture plan. Please try again."
        )

# Enhanced Slides generation endpoint
@app.post("/slides/generate", response_model=APIResponse)
async def generate_slides(request: SlideGenerationRequest):
    """Generate professional presentation slides with superior design"""
    try:
        logger.info(f"Generating enhanced slides for {request.subject} - {request.topic}")
        
        # Use enhanced OpenRouter service for superior slide generation
        slides_data = openrouter_service.generate_slides({
            'subject': request.subject,
            'topic': request.topic,
            'grade': request.grade,
            'slide_count': request.slideCount,
            'theme': request.theme,
            'template': request.template,
            'difficulty': request.difficulty,
            'language': request.language,
            'include_images': request.includeImages,
            'professional_design': True,
            'interactive_elements': True,
            'accessibility_features': True
        })
        
        if slides_data.get('success'):
            return APIResponse(
                success=True,
                data=slides_data['data'],
                message="Enhanced slides generated with professional design and interactive elements",
                timestamp=datetime.now().isoformat()
            )
        else:
            # Enhanced slides fallback
            logger.warning("Primary service failed, using enhanced slides fallback")
            fallback_slides = enhanced_slide_generator.generate_professional_slides(
                request.subject, request.topic, request.grade, request.slideCount
            )
            
            return APIResponse(
                success=True,
                data=fallback_slides,
                message="Slides generated using enhanced presentation framework",
                timestamp=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Enhanced slides generation error: {e}")
        return APIResponse(
            success=False,
            error=f"Slides generation failed: {str(e)}",
            message="Unable to generate slides. Please try again."
        )

# Enhanced Mindmap generation endpoint  
@app.post("/mindmap/generate", response_model=APIResponse)
async def generate_mindmap(request: MindmapGenerationRequest):
    """Generate interactive mindmap with superior visual design"""
    try:
        logger.info(f"Generating enhanced mindmap for {request.subject} - {request.topic}")
        
        # Use enhanced OpenRouter service for superior mindmap generation
        mindmap_data = openrouter_service.generate_mindmap({
            'subject': request.subject,
            'topic': request.topic,
            'grade': request.grade,
            'mindmap_type': request.mindmapType,
            'language': request.language,
            'hierarchical_structure': True,
            'cross_connections': True,
            'visual_elements': True,
            'collaborative_features': True
        })
        
        if mindmap_data.get('success'):
            return APIResponse(
                success=True,
                data=mindmap_data['data'],
                message="Enhanced mindmap generated with interactive and collaborative features",
                timestamp=datetime.now().isoformat()
            )
        else:
            # Enhanced mindmap fallback
            logger.warning("Primary service failed, using enhanced mindmap fallback")
            fallback_mindmap = enhanced_mindmap_generator.generate_interactive_mindmap(
                request.subject, request.topic, request.grade
            )
            
            return APIResponse(
                success=True,
                data=fallback_mindmap,
                message="Mindmap generated using enhanced visual learning framework",
                timestamp=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Enhanced mindmap generation error: {e}")
        return APIResponse(
            success=False,
            error=f"Mindmap generation failed: {str(e)}",
            message="Unable to generate mindmap. Please try again."
        )
    try:
        logger.info(f"Generating enhanced quiz for {request.subject} - {request.topic} using OpenRouter only")
        result = openrouter_service.generate_quiz(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Quiz generated successfully (OpenRouter)")
        else:
            raise HTTPException(status_code=500, detail=f"Quiz generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in quiz generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Curriculum generation endpoint
@app.post("/curriculum/generate", response_model=APIResponse)
async def generate_curriculum(request: CurriculumGenerationRequest):
    try:
        logger.info(f"Generating curriculum for {request.subject} Grade {request.grade} using OpenRouter only")
        result = openrouter_service.generate_curriculum(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Curriculum generated successfully (OpenRouter)")
        else:
            raise HTTPException(status_code=500, detail=f"Curriculum generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in curriculum generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Grading endpoint
@app.post("/grading/evaluate", response_model=APIResponse)
async def grade_answer(request: GradingRequest):
    """Grade student answer using OpenRouter only"""
    try:
        logger.info(f"Grading answer for {request.subject} using OpenRouter only")
        result = openrouter_service.grade_answer(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Answer graded successfully")
        else:
            raise HTTPException(status_code=500, detail=f"Grading failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in grading: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Content generation endpoint
@app.post("/content/generate", response_model=APIResponse)
async def generate_content(request: ContentGenerationRequest):
    """Generate educational content using OpenRouter only"""
    try:
        logger.info(f"Generating {request.type} content for {request.subject} - {request.topic} using OpenRouter only")
        result = openrouter_service.generate_content(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Content generated successfully")
        else:
            raise HTTPException(status_code=500, detail=f"Content generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in content generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lecture plan generation endpoint
@app.post("/lecture-plan/generate", response_model=APIResponse)
async def generate_lecture_plan(request: LecturePlanGenerationRequest):
    """Generate NCERT-aligned lecture plan using OpenRouter only"""
    try:
        logger.info(f"Generating lecture plan for {request.subject} - {request.topic} (Grade {request.grade}) with OpenRouter only")
        result = openrouter_service.generate_lecture_plan(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Lecture plan generated successfully")
        else:
            raise HTTPException(status_code=500, detail=f"Lecture plan generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in lecture plan generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Slide generation endpoint
@app.post("/slides/generate", response_model=APIResponse)
async def generate_slides(request: SlideGenerationRequest):
    """Generate superior presentation slides using Enhanced Slide Generator with OpenRouter Claude 3.5 Sonnet"""
    try:
        logger.info(f"Generating slides for {request.subject} - {request.topic} (Grade {request.grade}) with OpenRouter only")
        result = openrouter_service.generate_slides(request.model_dump())
        if result["success"]:
            return APIResponse(success=True, data=result["data"], message="Slides generated successfully")
        else:
            raise HTTPException(status_code=500, detail=f"Slide generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in slide generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Remove Gemini-specific endpoints and health checks
@app.get("/system/status")
async def get_system_status():
    try:
        return APIResponse(
            success=True,
            data={
                "openrouter_service": "operational",
                "use_openrouter": True
            },
            message="System status retrieved"
        )
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        return APIResponse(success=False, error=str(e), message="System status check failed")

# Translation endpoint using OpenRouter
@app.post("/translate", response_model=APIResponse)
async def translate(request: TranslationRequest):
    """Translate text using OpenRouter with fallback"""
    try:
        logger.info(f"Translating text from {request.sourceLanguage} to {request.targetLanguage} via OpenRouter")
        result = openrouter_service.translate(request.text, request.sourceLanguage, request.targetLanguage, request.domain)
        if result.get('success'):
            data = result['data']
            translated_text = data.get('translatedText') or data.get('text')
            return APIResponse(
                success=True,
                data={
                    "originalText": request.text,
                    "translatedText": translated_text,
                    "sourceLanguage": request.sourceLanguage,
                    "targetLanguage": request.targetLanguage,
                    "method": "openrouter"
                },
                message="Text translated successfully"
            )
        else:
            raise HTTPException(status_code=500, detail=f"Translation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in translation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced educational content generation endpoints
@app.post("/enhanced/curriculum", response_model=APIResponse)
async def generate_enhanced_curriculum(request: CurriculumGenerationRequest):
    """Generate comprehensive curriculum using Enhanced Curriculum Generator"""
    try:
        logger.info(f"Generating enhanced curriculum for {request.subject} Grade {request.grade}")
        
        result = enhanced_curriculum_generator.generate_curriculum(
            subject=request.subject,
            grade=request.grade,
            curriculum_type=getattr(request, 'curriculumType', 'annual'),
            language=request.language
        )
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Enhanced curriculum generated successfully with Claude 3.5 Sonnet"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Enhanced curriculum generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in enhanced curriculum generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhanced/lecture-plan", response_model=APIResponse) 
async def generate_enhanced_lecture_plan(request: LecturePlanGenerationRequest):
    """Generate comprehensive lecture plan using Enhanced Lecture Plan Generator"""
    try:
        logger.info(f"Generating enhanced lecture plan for {request.subject} - {request.topic}")
        
        result = enhanced_lecture_plan_generator.generate_lecture_plan(
            subject=request.subject,
            topic=request.topic,
            grade=request.grade,
            duration=getattr(request, 'duration', 45),
            language=request.language
        )
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Enhanced lecture plan generated successfully with Claude 3.5 Sonnet"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Enhanced lecture plan generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in enhanced lecture plan generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhanced/mindmap", response_model=APIResponse)
async def generate_enhanced_mindmap(request: MindmapGenerationRequest):
    """Generate cognitive mindmap using Enhanced Mindmap Generator"""
    try:
        logger.info(f"Generating enhanced mindmap for {request.subject} - {request.topic}")
        
        result = enhanced_mindmap_generator.generate_mindmap(
            subject=request.subject,
            topic=request.topic,
            grade=getattr(request, 'grade', 10),
            mindmap_type=getattr(request, 'mindmapType', 'conceptual'),
            language=getattr(request, 'language', 'en')
        )
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Enhanced mindmap generated successfully with Claude 3.5 Sonnet"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Enhanced mindmap generation failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in enhanced mindmap generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhanced/assessment", response_model=APIResponse)
async def assess_answer_sheet(request: AnswerSheetRequest):
    """Assess answer sheet using Enhanced Answer Assessment"""
    try:
        logger.info(f"Assessing answer sheet for {request.subject} Grade {getattr(request, 'grade', 10)}")
        
        result = enhanced_answer_assessment.assess_answer_sheet(
            answer_sheet_content=request.answerContent,
            question_paper=getattr(request, 'questionPaper', None),
            subject=request.subject,
            grade=getattr(request, 'grade', 10),
            assessment_type=getattr(request, 'assessmentType', 'subjective'),
            language=getattr(request, 'language', 'en'),
            detailed_feedback=getattr(request, 'detailedFeedback', True)
        )
        
        if result["success"]:
            return APIResponse(
                success=True,
                data=result["data"],
                message="Answer sheet assessed successfully with Claude 3.5 Sonnet"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Answer sheet assessment failed: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error in answer sheet assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/demo/bilingual", response_model=APIResponse)
async def run_bilingual_demo():
    """Run the bilingual full demo mode showcasing all modules"""
    try:
        logger.info("Starting bilingual demo mode")
        
        # This will run the demo and return results
        demo_results = []
        
        for module_name, demo_input in bilingual_demo.demo_modules.items():
            try:
                english_output, hindi_output = await bilingual_demo.generate_bilingual_response(
                    module_name, demo_input
                )
                
                demo_results.append({
                    "module": module_name,
                    "demo_input": demo_input,
                    "english_output": english_output,
                    "hindi_output": hindi_output,
                    "status": "success"
                })
                
            except Exception as e:
                demo_results.append({
                    "module": module_name,
                    "demo_input": demo_input,
                    "english_output": f"Error: {str(e)}",
                    "hindi_output": f"त्रुटि: {str(e)}",
                    "status": "error"
                })
        
        return APIResponse(
            success=True,
            data={
                "demo_results": demo_results,
                "total_modules": len(bilingual_demo.demo_modules),
                "successful_modules": len([r for r in demo_results if r["status"] == "success"]),
                "ai_model": "sarvamai/sarvam-m:free",
                "api_provider": "OpenRouter",
                "demo_timestamp": datetime.now().isoformat()
            },
            message="Bilingual demo completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Error in bilingual demo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/demo/bilingual/module", response_model=APIResponse)
async def run_single_module_demo(module_name: str, demo_input: str):
    """Run demo for a single module with custom input"""
    try:
        logger.info(f"Running single module demo: {module_name}")
        
        if module_name not in bilingual_demo.demo_modules:
            raise HTTPException(
                status_code=400, 
                detail=f"Module '{module_name}' not found. Available modules: {list(bilingual_demo.demo_modules.keys())}"
            )
        
        english_output, hindi_output = await bilingual_demo.generate_bilingual_response(
            module_name, demo_input
        )
        
        return APIResponse(
            success=True,
            data={
                "module": module_name,
                "demo_input": demo_input,
                "english_output": english_output,
                "hindi_output": hindi_output,
                "ai_model": "sarvamai/sarvam-m:free",
                "api_provider": "OpenRouter"
            },
            message=f"Single module demo for '{module_name}' completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Error in single module demo: {e}")
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