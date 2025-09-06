#!/usr/bin/env python3
"""
Comprehensive Module Test for EduSarathi
Tests all educational modules with actual data folder content
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

def test_module(module_name, test_func, *args):
    """Test a module and report results"""
    print(f"\n{'='*20} TESTING {module_name.upper()} {'='*20}")
    try:
        result = test_func(*args)
        if result.get('success'):
            print(f"✅ {module_name} - SUCCESS")
            data = result.get('data', {})
            
            # Show key metrics
            if 'questions' in data:
                print(f"   📝 Generated {len(data['questions'])} questions")
            if 'title' in data:
                print(f"   📚 Title: {data['title']}")
            if 'units' in data or 'curriculum' in data:
                curriculum = data.get('curriculum', data)
                units = curriculum.get('units', [])
                print(f"   📖 Generated {len(units)} curriculum units")
                
            return True
        else:
            print(f"❌ {module_name} - FAILED")
            print(f"   Error: {result.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ {module_name} - EXCEPTION")
        print(f"   Error: {str(e)}")
        return False

def test_quiz_generation():
    """Test quiz generation module"""
    from enhanced_quiz_generator import EnhancedQuizGenerator
    
    generator = EnhancedQuizGenerator()
    return generator.generate_quiz(
        subject='Mathematics',
        topic='Quadratic Equations',
        grade=10,
        question_count=3,
        difficulty='medium'
    )

def test_curriculum_generation():
    """Test curriculum generation module"""
    from enhanced_curriculum_generator import EnhancedCurriculumGenerator
    
    generator = EnhancedCurriculumGenerator()
    return generator.generate_curriculum(
        subject='Mathematics',
        grade=10,
        duration='1 semester',
        focus_areas=['Algebra', 'Geometry']
    )

def test_slides_generation():
    """Test slides generation module"""
    from enhanced_slide_generator import EnhancedSlideGenerator
    
    generator = EnhancedSlideGenerator()
    return generator.generate_slides(
        subject='Mathematics',
        topic='Linear Equations',
        grade=10,
        slide_count=5
    )

def test_mindmap_generation():
    """Test mindmap generation module"""
    from enhanced_mindmap_generator import EnhancedMindmapGenerator
    
    generator = EnhancedMindmapGenerator()
    return generator.generate_mindmap(
        subject='Science',
        topic='Photosynthesis',
        grade=10
    )

def test_lecture_plan_generation():
    """Test lecture plan generation module"""
    from enhanced_lecture_plan_generator import EnhancedLecturePlanGenerator
    
    generator = EnhancedLecturePlanGenerator()
    return generator.generate_lecture_plan(
        subject='Science',
        topic='Chemical Reactions',
        grade=10,
        duration=60
    )

def test_grading_system():
    """Test answer grading module"""
    from enhanced_answer_assessment import EnhancedAnswerSheetAssessment
    
    assessor = EnhancedAnswerSheetAssessment()
    
    # Create sample answer sheet content as text
    answer_sheet_content = """
    Student Name: Test Student
    Subject: Science
    Topic: Life Processes
    Grade: 10
    
    Question 1: What is photosynthesis?
    Answer: Photosynthesis is the process by which plants make food using sunlight, water, and carbon dioxide.
    
    Question 2: Name the parts of a plant cell.
    Answer: Cell wall, cell membrane, nucleus, cytoplasm, chloroplasts, vacuole.
    """
    
    return assessor.assess_answer_sheet(
        answer_sheet_content=answer_sheet_content,
        subject="Science",
        grade=10,
        assessment_type="subjective"
    )

def check_data_folder():
    """Check data folder contents"""
    print("\n" + "="*60)
    print("DATA FOLDER ANALYSIS")
    print("="*60)
    
    data_dir = Path(__file__).parent / 'data'
    if not data_dir.exists():
        print("❌ Data folder not found")
        return False
    
    # Count PDFs by subject
    pdf_count = 0
    subjects = {}
    
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.pdf'):
                pdf_count += 1
                # Determine subject from path
                path_parts = Path(root).parts
                for part in path_parts:
                    if any(subj in part.lower() for subj in ['math', 'science', 'english', 'physics', 'chemistry', 'biology']):
                        subjects[part] = subjects.get(part, 0) + 1
    
    print(f"📁 Total PDF files: {pdf_count}")
    print("📚 Subject distribution:")
    for subject, count in subjects.items():
        print(f"   - {subject}: {count} files")
    
    # Test PDF extraction
    try:
        from pdf_extractor import NCERTPDFExtractor as PDFExtractor
        extractor = PDFExtractor(str(data_dir))
        
        # Find a sample PDF
        sample_pdf = None
        for root, dirs, files in os.walk(data_dir):
            for file in files:
                if file.endswith('.pdf'):
                    sample_pdf = Path(root) / file
                    break
            if sample_pdf:
                break
        
        if sample_pdf:
            print(f"\n🔍 Testing extraction on: {sample_pdf.name}")
            content = extractor.extract_text_from_pdf(sample_pdf)
            print(f"✅ Extracted {len(content)} characters")
            if content:
                print(f"📄 Sample: {content[:100]}...")
        
    except Exception as e:
        print(f"❌ PDF extraction test failed: {e}")
    
    return True

def main():
    """Main test runner"""
    print("🚀 EduSarathi Comprehensive Module Test")
    print("="*60)
    
    # Load environment
    load_env_file()
    
    # Check API key
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("❌ OPENROUTER_API_KEY not found")
        return
    print(f"✅ API Key loaded: {api_key[:10]}...")
    
    # Check data folder
    if not check_data_folder():
        print("⚠️  Continuing without data folder...")
    
    # Test all modules
    test_results = {}
    
    test_results['quiz'] = test_module('Quiz Generation', test_quiz_generation)
    test_results['curriculum'] = test_module('Curriculum Generation', test_curriculum_generation)
    test_results['slides'] = test_module('Slides Generation', test_slides_generation)
    test_results['mindmap'] = test_module('Mindmap Generation', test_mindmap_generation)
    test_results['lecture_plan'] = test_module('Lecture Plan Generation', test_lecture_plan_generation)
    test_results['grading'] = test_module('Answer Grading', test_grading_system)
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print("="*60)
    
    total_tests = len(test_results)
    passed_tests = sum(test_results.values())
    
    print(f"📊 Total modules tested: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {total_tests - passed_tests}")
    print(f"📈 Success rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL MODULES WORKING! Ready for production.")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} modules need attention.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
