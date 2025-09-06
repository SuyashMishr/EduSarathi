# EduSarathi AI Model Configuration

## Overview
EduSarathi now uses specialized free AI models for different educational modules, optimizing performance and capabilities for specific tasks.

## Model Assignments

### 📝 Quiz Generation
- **Model**: `deepseek/deepseek-chat-v3.1:free`
- **Reason**: Advanced reasoning capabilities for logical quiz structure and varied question types
- **Temperature**: 0.8
- **Max Tokens**: 2048

### 📚 Curriculum Generation  
- **Model**: `meta-llama/llama-3.2-3b-instruct:free`
- **Reason**: Excellent for structured content planning and educational frameworks
- **Temperature**: 0.8
- **Max Tokens**: 4096

### 📊 Answer Assessment & Grading
- **Model**: `google/gemma-2-9b-it:free`
- **Reason**: Precise evaluation capabilities and analytical assessment
- **Temperature**: 0.3-0.4 (lower for consistency)
- **Max Tokens**: 1024-1536

### 🎨 Slide Generation
- **Model**: `openai/gpt-oss-120b:free`
- **Reason**: Creative content generation and engaging presentation material
- **Temperature**: 0.7-0.8
- **Max Tokens**: 3072

### 🧠 Mindmap Generation
- **Model**: `deepseek/deepseek-chat-v3.1:free`
- **Reason**: Logical structure creation and conceptual relationships
- **Temperature**: 0.6-0.8
- **Max Tokens**: 2048

### 📅 Lecture Plan Generation
- **Model**: `meta-llama/llama-3.2-3b-instruct:free`
- **Reason**: Educational planning and structured lesson organization
- **Temperature**: 0.7
- **Max Tokens**: 3072

### 🔄 Content Generation & Translation
- **Model**: `google/gemini-2.5-flash-image-preview:free`
- **Reason**: Multilingual support and rich content generation with image understanding
- **Temperature**: 0.5-0.7
- **Max Tokens**: 1024-4096

## Configuration Files Updated

### 1. `/ai/config.py`
- Updated `MODEL_CONFIGS` with specific models for each module
- Added model descriptions and optimized parameters

### 2. `/ai/openrouter_service.py`
- Updated free models list
- Added module-specific model mapping
- Added `get_model_for_module()` method

### 3. Enhanced Modules Updated
- `enhanced_quiz_generator.py` → DeepSeek Chat v3.1
- `enhanced_curriculum_generator.py` → Llama 3.2 3B Instruct  
- `enhanced_slide_generator.py` → GPT OSS 120B
- `enhanced_answer_assessment.py` → Gemma 2 9B IT
- `enhanced_mindmap_generator.py` → DeepSeek Chat v3.1
- `enhanced_lecture_plan_generator.py` → Llama 3.2 3B Instruct

### 4. Environment Configuration (`.env`)
- Added module-specific model environment variables
- Updated default OpenRouter model

## Benefits

### 🎯 **Specialized Performance**
- Each model is optimized for its specific educational task
- Better quality outputs tailored to module requirements

### 💰 **Cost Effective**
- All models are free tier, reducing operational costs
- No API usage limits for basic educational features

### ⚡ **Performance Optimized**
- Appropriate token limits and temperature settings per module
- Faster responses from specialized smaller models where appropriate

### 🔧 **Maintainable**
- Clear separation of concerns
- Easy to update individual modules without affecting others

## Usage

The system automatically selects the appropriate model based on the educational module being used. No manual model selection required from the frontend.

## API Endpoints Affected

All existing API endpoints continue to work as before, but now use optimized models:

- `/quiz/generate` → DeepSeek Chat v3.1
- `/curriculum/generate` → Llama 3.2 3B
- `/slides/generate` → GPT OSS 120B  
- `/grading/assess` → Gemma 2 9B
- `/mindmap/generate` → DeepSeek Chat v3.1
- `/lecture-plan/generate` → Llama 3.2 3B

## Monitoring

Each response includes the model used in the metadata for tracking and debugging purposes.
