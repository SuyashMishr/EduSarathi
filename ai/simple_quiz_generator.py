"""
Simple Quiz Generator with PDF integration
Uses OpenRouter for creating educational quiz content based on data folder content
"""

import json
import logging
import os
from typing import Dict, List, Optional
from pathlib import Path
from openrouter_service import OpenRouterService
from pdf_extractor import NCERTPDFExtractor as PDFExtractor

logger = logging.getLogger(__name__)

class SimpleQuizGenerator:
    """Simple quiz generator with PDF content integration"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the quiz generator"""
        self.openrouter = OpenRouterService(api_key)
        self.model_name = "deepseek/deepseek-chat-v3.1:free"
        
        # Initialize PDF extractor with data directory
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        self.pdf_extractor = PDFExtractor(data_dir) if os.path.exists(data_dir) else None
        
    def generate_quiz(self, subject: str, topic: str, grade: int = 10, 
                     question_count: int = 5, difficulty: str = "medium") -> Dict:
        """Generate a quiz using PDF content from data folder"""
        
        try:
            # Extract relevant PDF content
            pdf_content = self._get_subject_content(subject, grade)
            
            # Generate quiz using AI
            prompt = self._create_prompt(subject, topic, grade, question_count, difficulty, pdf_content)
            
            response = self.openrouter._request_with_fallback(
                messages=[
                    {"role": "system", "content": "You are an expert educational content creator specializing in NCERT-aligned assessments."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=3000,
                model_override=self.model_name
            )
            
            if response.get("success"):
                quiz_data = self._parse_response(response["content"], subject, topic, grade, difficulty)
                return {
                    "success": True,
                    "data": quiz_data,
                    "pdf_content_used": len(pdf_content) > 0
                }
            else:
                return {"success": False, "error": response.get("error", "Unknown error")}
                
        except Exception as e:
            logger.error(f"Quiz generation error: {e}")
            return {"success": False, "error": str(e)}
    
    def _get_subject_content(self, subject: str, grade: int) -> str:
        """Extract relevant content from PDFs for the subject"""
        if not self.pdf_extractor:
            return ""
        
        content_pieces = []
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        
        # Look for subject-specific PDFs
        search_paths = [
            os.path.join(data_dir, f'Class_{grade}th', 'English_books', subject),
            os.path.join(data_dir, f'Class_{grade}th', 'Hindi_books', subject),
            os.path.join(data_dir, 'ncert', f'grade_{grade}')
        ]
        
        for path in search_paths:
            if os.path.exists(path):
                pdf_files = [f for f in os.listdir(path) if f.endswith('.pdf')]
                for pdf_file in pdf_files[:1]:  # Take first PDF to avoid token limits
                    try:
                        full_path = os.path.join(path, pdf_file)
                        content = self.pdf_extractor.extract_text_from_pdf(Path(full_path))
                        if content:
                            # Take first 1000 characters as sample content
                            content_pieces.append(content[:1000])
                            break
                    except Exception as e:
                        logger.warning(f"Error reading {pdf_file}: {e}")
                        continue
        
        return "\\n\\n".join(content_pieces)
    
    def _create_prompt(self, subject: str, topic: str, grade: int, 
                      question_count: int, difficulty: str, pdf_content: str) -> str:
        """Create prompt for quiz generation"""
        
        content_info = ""
        if pdf_content:
            content_info = f"\\n\\nREFERENCE CONTENT FROM TEXTBOOK:\\n{pdf_content[:800]}\\n"
        
        return f"""Create {question_count} multiple choice questions about "{topic}" for {subject} Grade {grade}.

Requirements:
- Difficulty: {difficulty}
- NCERT curriculum aligned
- Include real-world applications
- Clear explanations for answers{content_info}

Return ONLY valid JSON in this format:
{{
  "title": "Quiz: {topic}",
  "subject": "{subject}",
  "topic": "{topic}",
  "grade": {grade},
  "questions": [
    {{
      "id": 1,
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A",
      "explanation": "Why this answer is correct"
    }}
  ]
}}"""
    
    def _parse_response(self, content: str, subject: str, topic: str, 
                       grade: int, difficulty: str) -> Dict:
        """Parse AI response into structured quiz data"""
        try:
            # Clean JSON response
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            elif content.startswith('```'):
                content = content.replace('```', '').strip()
            
            quiz_data = json.loads(content)
            
            # Ensure required fields
            quiz_data.setdefault('title', f'Quiz: {topic}')
            quiz_data.setdefault('subject', subject)
            quiz_data.setdefault('topic', topic)
            quiz_data.setdefault('grade', grade)
            quiz_data.setdefault('difficulty', difficulty)
            quiz_data.setdefault('questions', [])
            
            # Add metadata
            quiz_data['metadata'] = {
                'generated_with_pdf': True,
                'model': self.model_name,
                'ncert_aligned': True
            }
            
            return quiz_data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            # Return fallback quiz
            return {
                "title": f"Quiz: {topic}",
                "subject": subject,
                "topic": topic,
                "grade": grade,
                "difficulty": difficulty,
                "questions": [
                    {
                        "id": 1,
                        "question": f"What is a key concept in {topic}?",
                        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
                        "correctAnswer": "A",
                        "explanation": "This is the correct answer based on NCERT curriculum."
                    }
                ],
                "metadata": {"fallback": True, "error": str(e)}
            }
