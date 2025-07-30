"""
Configuration settings for AI services
"""

import os
from typing import Dict, Any

class Config:
    """Base configuration class"""
    
    # API Keys
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY', 'AIzaSyBag4p-exEulPp3znM2A7MegvH3_FhCxxY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBag4p-exEulPp3znM2A7MegvH3_FhCxxY')
    BHASHINI_API_KEY = os.getenv('BHASHINI_API_KEY')
    BHASHINI_USER_ID = os.getenv('BHASHINI_USER_ID')
    
    # Model paths
    MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
    DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
    NCERT_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'ncert')
    
    # AI Service settings
    MAX_TOKENS = 2048
    TEMPERATURE = 0.7
    TOP_P = 0.9
    
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

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    MONGODB_URI = os.getenv('TEST_MONGODB_URI', 'mongodb://localhost:27017/edusarathi_test')

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

# Model configurations
MODEL_CONFIGS = {
    'quiz_generation': {
        'model_name': 'gemini-1.5-flash',
        'max_tokens': 2048,
        'temperature': 0.7,
        'top_p': 0.9
    },
    'curriculum_generation': {
        'model_name': 'gemini-1.5-pro',
        'max_tokens': 4096,
        'temperature': 0.8,
        'top_p': 0.9
    },
    'grading': {
        'model_name': 'gemini-1.5-flash',
        'max_tokens': 1024,
        'temperature': 0.3,
        'top_p': 0.8
    },
    'content_generation': {
        'model_name': 'gemini-1.5-pro',
        'max_tokens': 4096,
        'temperature': 0.7,
        'top_p': 0.9
    },
    'translation': {
        'model_name': 'bhashini',
        'fallback_model': 'google-translate'
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