"""
Utility functions for AI services
"""

import os
import json
import logging
import hashlib
import re
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
import pandas as pd
import numpy as np

def setup_logging(log_level: str = "INFO", log_file: str = "logs/ai_service.log") -> logging.Logger:
    """Setup logging configuration"""
    
    # Create logs directory if it doesn't exist
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?;:()\-]', '', text)
    
    return text

def extract_keywords(text: str, min_length: int = 3) -> List[str]:
    """Extract keywords from text"""
    if not text:
        return []
    
    # Simple keyword extraction
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = [word for word in words if len(word) >= min_length]
    
    # Remove common stop words
    stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
    keywords = [word for word in keywords if word not in stop_words]
    
    return list(set(keywords))

def calculate_text_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts using simple word overlap"""
    if not text1 or not text2:
        return 0.0
    
    words1 = set(extract_keywords(text1))
    words2 = set(extract_keywords(text2))
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union) if union else 0.0

def generate_hash(content: str) -> str:
    """Generate hash for content"""
    return hashlib.md5(content.encode()).hexdigest()

def validate_grade(grade: Union[str, int]) -> int:
    """Validate and normalize grade"""
    try:
        grade_int = int(grade)
        if 1 <= grade_int <= 12:
            return grade_int
        else:
            raise ValueError(f"Grade must be between 1 and 12, got {grade_int}")
    except (ValueError, TypeError):
        raise ValueError(f"Invalid grade format: {grade}")

def validate_subject(subject: str) -> str:
    """Validate and normalize subject"""
    if not subject or not isinstance(subject, str):
        raise ValueError("Subject must be a non-empty string")
    
    valid_subjects = {
        'mathematics', 'math', 'maths',
        'science', 'physics', 'chemistry', 'biology',
        'english', 'language', 'literature',
        'history', 'geography', 'social_studies',
        'computer_science', 'programming', 'coding'
    }
    
    subject_lower = subject.lower().strip()
    
    # Normalize common variations
    subject_mapping = {
        'math': 'mathematics',
        'maths': 'mathematics',
        'language': 'english',
        'literature': 'english',
        'social_studies': 'history',
        'programming': 'computer_science',
        'coding': 'computer_science'
    }
    
    normalized_subject = subject_mapping.get(subject_lower, subject_lower)
    
    if normalized_subject not in valid_subjects:
        # If not in valid subjects, return original (allow flexibility)
        return subject.title()
    
    return normalized_subject.title()

def parse_quiz_response(response: str) -> Dict[str, Any]:
    """Parse AI response for quiz generation"""
    try:
        # Try to parse as JSON first
        if response.strip().startswith('{'):
            return json.loads(response)
        
        # Parse structured text format
        quiz_data = {
            'questions': [],
            'metadata': {}
        }
        
        lines = response.split('\n')
        current_question = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('Question'):
                if current_question:
                    quiz_data['questions'].append(current_question)
                current_question = {'question': '', 'options': [], 'correct_answer': ''}
                current_question['question'] = line.split(':', 1)[1].strip()
            
            elif line.startswith('A)') or line.startswith('B)') or line.startswith('C)') or line.startswith('D)'):
                if current_question:
                    current_question['options'].append(line[2:].strip())
            
            elif line.startswith('Answer:') or line.startswith('Correct:'):
                if current_question:
                    current_question['correct_answer'] = line.split(':', 1)[1].strip()
        
        if current_question:
            quiz_data['questions'].append(current_question)
        
        return quiz_data
    
    except Exception as e:
        logging.error(f"Error parsing quiz response: {e}")
        return {'questions': [], 'error': str(e)}

def format_curriculum_output(curriculum_data: Dict[str, Any]) -> Dict[str, Any]:
    """Format curriculum data for consistent output"""
    
    formatted = {
        'title': curriculum_data.get('title', ''),
        'subject': curriculum_data.get('subject', ''),
        'grade': curriculum_data.get('grade', 0),
        'board': curriculum_data.get('board', ''),
        'description': curriculum_data.get('description', ''),
        'duration': curriculum_data.get('duration', ''),
        'learning_objectives': curriculum_data.get('learning_objectives', []),
        'units': curriculum_data.get('units', []),
        'assessment_plan': curriculum_data.get('assessment_plan', {}),
        'resources': curriculum_data.get('resources', []),
        'created_at': datetime.utcnow().isoformat(),
        'version': '1.0'
    }
    
    return formatted

def calculate_difficulty_score(text: str, grade: int) -> float:
    """Calculate difficulty score for educational content"""
    
    # Simple heuristics for difficulty
    word_count = len(text.split())
    avg_word_length = np.mean([len(word) for word in text.split()])
    sentence_count = len(re.split(r'[.!?]+', text))
    avg_sentence_length = word_count / max(sentence_count, 1)
    
    # Complex words (more than 6 characters)
    complex_words = len([word for word in text.split() if len(word) > 6])
    complex_word_ratio = complex_words / max(word_count, 1)
    
    # Base difficulty score
    difficulty = (
        avg_word_length * 0.3 +
        avg_sentence_length * 0.3 +
        complex_word_ratio * 100 * 0.4
    )
    
    # Adjust for grade level
    grade_factor = grade / 12  # Normalize to 0-1
    expected_difficulty = 5 + (grade_factor * 5)  # Expected difficulty 5-10
    
    # Normalize to 0-10 scale
    normalized_difficulty = min(10, max(0, difficulty))
    
    return round(normalized_difficulty, 2)

def extract_learning_objectives(text: str) -> List[str]:
    """Extract learning objectives from curriculum text"""
    
    objectives = []
    
    # Look for common patterns
    patterns = [
        r'(?:students will|learners will|objectives?:?)\s*(.+?)(?:\n|$)',
        r'(?:by the end|after this|upon completion).+?students will\s*(.+?)(?:\n|$)',
        r'(?:understand|learn|identify|analyze|evaluate|create)\s*(.+?)(?:\n|\.)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            objective = clean_text(match)
            if objective and len(objective) > 10:
                objectives.append(objective)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_objectives = []
    for obj in objectives:
        if obj.lower() not in seen:
            seen.add(obj.lower())
            unique_objectives.append(obj)
    
    return unique_objectives[:10]  # Limit to 10 objectives

def validate_file_upload(file_path: str, allowed_extensions: set) -> bool:
    """Validate uploaded file"""
    
    if not os.path.exists(file_path):
        return False
    
    # Check file extension
    file_ext = os.path.splitext(file_path)[1].lower().lstrip('.')
    if file_ext not in allowed_extensions:
        return False
    
    # Check file size (10MB limit)
    file_size = os.path.getsize(file_path)
    if file_size > 10 * 1024 * 1024:
        return False
    
    return True

def create_response(success: bool, data: Any = None, message: str = "", error: str = "") -> Dict[str, Any]:
    """Create standardized API response"""
    
    response = {
        'success': success,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if success:
        response['data'] = data
        if message:
            response['message'] = message
    else:
        response['error'] = error or "An error occurred"
        if data:
            response['details'] = data
    
    return response

def load_json_file(file_path: str) -> Dict[str, Any]:
    """Load JSON file safely"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logging.error(f"Error loading JSON file {file_path}: {e}")
        return {}

def save_json_file(data: Dict[str, Any], file_path: str) -> bool:
    """Save data to JSON file safely"""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        logging.error(f"Error saving JSON file {file_path}: {e}")
        return False