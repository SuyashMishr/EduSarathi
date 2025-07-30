# AI Models Directory

This directory contains fine-tuned AI models for various educational tasks.

## Model Structure

### quiz_model/
Fine-tuned models for quiz generation
- `t5_quiz_generator.pth` - T5 model for quiz generation
- `config.json` - Model configuration
- `tokenizer/` - Tokenizer files

### grading_model/
Models for automated answer grading
- `grading_classifier.pth` - Answer classification model
- `rubric_scorer.pth` - Rubric-based scoring model
- `ocr_model/` - OCR model for handwriting recognition

### slide_model/
Models for presentation slide generation
- `slide_generator.pth` - Slide content generation model
- `layout_classifier.pth` - Slide layout classification

### mindmap_model/
Models for mind map generation
- `concept_extractor.pth` - Concept extraction model
- `relationship_mapper.pth` - Concept relationship mapping

### lecture_plan_model/
Models for lecture plan generation
- `plan_generator.pth` - Lecture plan generation model
- `activity_recommender.pth` - Activity recommendation model

## Model Training

Models are trained using the notebooks in the `notebooks/` directory:
- `quiz_finetuning_t5.ipynb` - Quiz generation model training
- `grading_rubric_model.ipynb` - Grading model training
- `slide_generation_prompt_test.ipynb` - Slide generation testing
- `mindmap_generation_gpt.ipynb` - Mind map generation
- `lecture_plan_finetuning.ipynb` - Lecture plan model training

## Usage

Models are automatically loaded by the AI service when starting the application.

## Requirements

- PyTorch >= 1.9.0
- Transformers >= 4.20.0
- Sufficient GPU memory for model inference