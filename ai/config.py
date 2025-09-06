"""
Configuration settings for AI services
"""

import os
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

class Config:
    """Base configuration class"""
    
    # API Keys - Do NOT hard-code secrets
    OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_AI_API_KEY')
    BHASHINI_API_KEY = os.getenv('BHASHINI_API_KEY')
    BHASHINI_USER_ID = os.getenv('BHASHINI_USER_ID')
    
    # OpenRouter configuration
    OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    # Updated working free models
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct")
    OPENROUTER_BACKUP_MODEL = os.getenv("OPENROUTER_BACKUP_MODEL", "microsoft/phi-3-mini-128k-instruct")
    OPENROUTER_FREE_FALLBACK_MODEL = os.getenv("OPENROUTER_FREE_FALLBACK_MODEL", "qwen/qwen-2-7b-instruct")
    
    # Use OpenRouter as primary API if key is provided or flag is set
    USE_OPENROUTER = os.getenv('USE_OPENROUTER', '').lower() in ['1', 'true', 'yes'] or bool(OPENROUTER_API_KEY)
    
    # Model paths
    MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
    DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
    NCERT_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'ncert')
    
    # AI Service settings
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', '2048'))
    TEMPERATURE = float(os.getenv('TEMPERATURE', '0.7'))
    TOP_P = float(os.getenv('TOP_P', '0.9'))
    
    # File upload settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'txt', 'docx'}
    
    # Database settings
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/edusarathi')
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/ai_service.log')
    
    # Rate limiting
    RATE_LIMIT_REQUESTS = int(os.getenv('RATE_LIMIT_REQUESTS', '100'))
    RATE_LIMIT_WINDOW = int(os.getenv('RATE_LIMIT_WINDOW', '3600'))  # 1 hour
    
    # Cache settings
    CACHE_TTL = int(os.getenv('CACHE_TTL', '3600'))  # 1 hour
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    pass

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    pass

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    MONGODB_URI = os.getenv('TEST_MONGODB_URI', 'mongodb://localhost:27017/edusarathi_test')
    pass

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config() -> Config:
    """Get configuration based on environment"""
    env = os.getenv('ENVIRONMENT', 'default')
    return config.get(env, config['default'])()

# Model configurations - Updated with specific free models for each module
MODEL_CONFIGS = {
    'quiz_generation': {
        'model_name': 'deepseek/deepseek-chat-v3.1:free',  # Advanced reasoning for quiz logic
        'max_tokens': 2048,
        'temperature': 0.7,
        'top_p': 0.9,
        'description': 'DeepSeek Chat for intelligent quiz generation with logical reasoning'
    },
    'curriculum_generation': {
        'model_name': 'meta-llama/llama-3.2-3b-instruct:free',  # Structured content planning
        'max_tokens': 4096,
        'temperature': 0.8,
        'top_p': 0.9,
        'description': 'Llama 3.2 for comprehensive curriculum planning and structure'
    },
    'grading': {
        'model_name': 'google/gemma-2-9b-it:free',  # Precise evaluation and assessment
        'max_tokens': 1024,
        'temperature': 0.3,
        'top_p': 0.8,
        'description': 'Gemma 2 for accurate grading and assessment evaluation'
    },
    'content_generation': {
        'model_name': 'google/gemini-2.5-flash-image-preview:free',  # Rich content with visual support
        'max_tokens': 4096,
        'temperature': 0.7,
        'top_p': 0.9,
        'description': 'Gemini 2.5 Flash for content generation with image understanding'
    },
    'slide_generation': {
        'model_name': 'openai/gpt-oss-120b:free',  # Creative presentation content
        'max_tokens': 3072,
        'temperature': 0.8,
        'top_p': 0.9,
        'description': 'GPT OSS 120B for creative and engaging slide content'
    },
    'mindmap_generation': {
        'model_name': 'deepseek/deepseek-chat-v3.1:free',  # Logical structure and connections
        'max_tokens': 2048,
        'temperature': 0.6,
        'top_p': 0.9,
        'description': 'DeepSeek Chat for structured mindmap creation'
    },
    'lecture_plan_generation': {
        'model_name': 'meta-llama/llama-3.2-3b-instruct:free',  # Educational planning
        'max_tokens': 3072,
        'temperature': 0.7,
        'top_p': 0.9,
        'description': 'Llama 3.2 for detailed lecture planning and organization'
    },
    'answer_assessment': {
        'model_name': 'google/gemma-2-9b-it:free',  # Analytical evaluation
        'max_tokens': 1536,
        'temperature': 0.4,
        'top_p': 0.8,
        'description': 'Gemma 2 for thorough answer assessment and feedback'
    },
    'translation': {
        'model_name': 'google/gemini-2.5-flash-image-preview:free',  # Multilingual support
        'max_tokens': 1024,
        'temperature': 0.5,
        'top_p': 0.9,
        'fallback_model': 'google-translate',
        'description': 'Gemini 2.5 Flash for accurate translations'
    }
}

# Subject-specific configurations
SUBJECT_CONFIGS = {
    'mathematics': {
        'difficulty_levels': ['easy', 'medium', 'hard'],
        'question_types': ['mcq', 'short_answer', 'numerical', 'proof'],
        'topics': ['algebra', 'geometry', 'calculus', 'statistics']
    },
    'science': {
        'difficulty_levels': ['easy', 'medium', 'hard'],
        'question_types': ['mcq', 'short_answer', 'diagram', 'experiment'],
        'topics': ['physics', 'chemistry', 'biology']
    },
    'english': {
        'difficulty_levels': ['basic', 'intermediate', 'advanced'],
        'question_types': ['mcq', 'essay', 'comprehension', 'grammar'],
        'topics': ['literature', 'grammar', 'writing', 'reading']
    }
}

# Grading rubrics
GRADING_RUBRICS = {
    'mathematics': {
        'criteria': ['accuracy', 'method', 'explanation', 'presentation'],
        'weights': [0.4, 0.3, 0.2, 0.1],
        'max_score': 10
    },
    'science': {
        'criteria': ['scientific_accuracy', 'understanding', 'examples', 'terminology'],
        'weights': [0.4, 0.3, 0.2, 0.1],
        'max_score': 10
    },
    'english': {
        'criteria': ['content', 'language', 'structure', 'creativity'],
        'weights': [0.3, 0.3, 0.2, 0.2],
        'max_score': 10
    }
}