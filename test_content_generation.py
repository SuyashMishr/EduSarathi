#!/usr/bin/env python3
"""
Test script to validate quiz and curriculum generation with proper environment loading
"""

import os
import sys
import json
from pathlib import Path

# Add AI directory to path
ai_dir = Path(__file__).parent / 'ai'
sys.path.insert(0, str(ai_dir))

def load_env_file():
    """Load environment variables from .env file"""
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

def test_quiz_generation():
    """Test quiz generation functionality"""
    print("=" * 50)
    print("TESTING QUIZ GENERATION")
    print("=" * 50)
    
    try:
        from enhanced_quiz_generator import EnhancedQuizGenerator
        
        generator = EnhancedQuizGenerator()
        result = generator.generate_quiz(
            subject='Mathematics',
            topic='Quadratic Equations', 
            grade=10,
            question_count=3,
            difficulty='medium'
        )
        
        print("Quiz Generation Result:")
        print(json.dumps(result, indent=2))
        
        # Check if quiz has questions
        if result.get('success') and result.get('data'):
            questions = result['data'].get('questions', [])
            print(f"\n✅ Quiz generated successfully with {len(questions)} questions")
            for i, q in enumerate(questions[:2], 1):  # Show first 2 questions
                print(f"\nQuestion {i}: {q.get('question', 'No question text')}")
                print(f"Type: {q.get('type', 'Unknown')}")
        else:
            print("\n❌ Quiz generation failed or returned empty")
            
    except Exception as e:
        print(f"❌ Quiz generation error: {e}")

def test_curriculum_generation():
    """Test curriculum generation functionality"""
    print("\n" + "=" * 50)
    print("TESTING CURRICULUM GENERATION")
    print("=" * 50)
    
    try:
        from enhanced_curriculum_generator import EnhancedCurriculumGenerator
        
        generator = EnhancedCurriculumGenerator()
        result = generator.generate_curriculum(
            subject='Mathematics',
            grade=10,
            duration='1 semester',
            focus_areas=['Algebra', 'Geometry']
        )
        
        print("Curriculum Generation Result:")
        print(json.dumps(result, indent=2))
        
        # Check if curriculum has content
        if result.get('success') and result.get('data'):
            curriculum = result['data']
            print(f"\n✅ Curriculum generated successfully")
            print(f"Title: {curriculum.get('title', 'No title')}")
            print(f"Duration: {curriculum.get('duration', 'Not specified')}")
            topics = curriculum.get('topics', [])
            print(f"Topics: {len(topics)} topics found")
        else:
            print("\n❌ Curriculum generation failed or returned empty")
            
    except Exception as e:
        print(f"❌ Curriculum generation error: {e}")

def test_data_folder_access():
    """Test if data folder content is being used"""
    print("\n" + "=" * 50)
    print("TESTING DATA FOLDER ACCESS")
    print("=" * 50)
    
    try:
        from pdf_extractor import NCERTPDFExtractor
        
        data_dir = Path(__file__).parent / 'data'
        print(f"Data directory: {data_dir}")
        print(f"Data directory exists: {data_dir.exists()}")
        
        if data_dir.exists():
            extractor = NCERTPDFExtractor(str(data_dir))
            
            # Check what files are available
            pdf_files = list(data_dir.rglob("*.pdf"))
            print(f"Found {len(pdf_files)} PDF files")
            
            for pdf_file in pdf_files[:3]:  # Show first 3
                relative_path = pdf_file.relative_to(data_dir)
                print(f"  - {relative_path}")
                
            # Test extraction
            if pdf_files:
                print(f"\nTesting extraction on: {pdf_files[0].name}")
                content = extractor.extract_text_from_pdf(pdf_files[0])
                print(f"Extracted {len(content)} characters")
                if content:
                    print(f"Sample content: {content[:200]}...")
                    print("✅ PDF extraction working")
                else:
                    print("❌ No content extracted")
            else:
                print("❌ No PDF files found to test")
        else:
            print("❌ Data directory not found")
            
    except Exception as e:
        print(f"❌ Data folder access error: {e}")

def main():
    """Main test function"""
    print("EduSarathi Content Generation Test")
    print("Loading environment variables...")
    
    # Load environment
    load_env_file()
    
    # Check API key
    api_key = os.getenv('OPENROUTER_API_KEY')
    if api_key:
        print(f"✅ OPENROUTER_API_KEY loaded: {api_key[:10]}...")
    else:
        print("❌ OPENROUTER_API_KEY not found")
        return
    
    # Run tests
    test_data_folder_access()
    test_quiz_generation()
    test_curriculum_generation()
    
    print("\n" + "=" * 50)
    print("TEST COMPLETE")
    print("=" * 50)

if __name__ == "__main__":
    main()
