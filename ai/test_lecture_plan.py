#!/usr/bin/env python3
"""
Test script for lecture plan generation functionality
Tests both English and Hindi language support
"""

import sys
import os
import json
import requests
import time
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gemini_service import GeminiService

def test_lecture_plan_generation():
    """Test lecture plan generation with various parameters"""
    print("🧪 Testing Lecture Plan Generation")
    print("=" * 50)
    
    try:
        # Initialize Gemini service
        service = GeminiService()
        print("✅ Gemini service initialized successfully")
        
        # Test cases for different subjects and languages
        test_cases = [
            {
                "name": "Physics - English",
                "data": {
                    "subject": "Physics",
                    "topic": "Laws of Motion",
                    "grade": "11",
                    "duration": 60,
                    "learningObjectives": [
                        "Understand Newton's three laws of motion",
                        "Apply laws of motion to solve problems"
                    ],
                    "difficulty": "intermediate",
                    "teachingStrategies": ["demonstration", "problem-solving"],
                    "language": "en"
                }
            },
            {
                "name": "Mathematics - Hindi",
                "data": {
                    "subject": "गणित",
                    "topic": "द्विघात समीकरण",
                    "grade": "10",
                    "duration": 45,
                    "learningObjectives": [
                        "द्विघात समीकरण को समझना",
                        "द्विघात समीकरण हल करना"
                    ],
                    "difficulty": "intermediate",
                    "teachingStrategies": ["interactive discussion", "practice"],
                    "language": "hi"
                }
            },
            {
                "name": "Chemistry - English",
                "data": {
                    "subject": "Chemistry",
                    "topic": "Periodic Table",
                    "grade": "11",
                    "duration": 90,
                    "learningObjectives": [
                        "Understand periodic trends",
                        "Classify elements based on properties"
                    ],
                    "difficulty": "advanced",
                    "teachingStrategies": ["visual aids", "group work"],
                    "language": "en"
                }
            }
        ]
        
        results = []
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n🔬 Test Case {i}: {test_case['name']}")
            print("-" * 30)
            
            start_time = time.time()
            
            try:
                # Generate lecture plan
                result = service.generate_lecture_plan(test_case['data'])
                
                end_time = time.time()
                generation_time = end_time - start_time
                
                if result['success']:
                    plan = result['data']
                    
                    print(f"✅ Generation successful in {generation_time:.2f}s")
                    print(f"📋 Title: {plan.get('title', 'N/A')}")
                    print(f"⏱️  Duration: {plan.get('durationBreakdown', {}).get('total', 'N/A')} minutes")
                    print(f"🎯 Objectives: {len(plan.get('learningObjectives', []))}")
                    print(f"🎭 Activities: {len(plan.get('activities', []))}")
                    print(f"📚 Resources: {len(plan.get('resources', []))}")
                    print(f"📊 Assessments: {len(plan.get('assessments', []))}")
                    
                    # Validate structure
                    validation_result = validate_lecture_plan_structure(plan, test_case['data'])
                    if validation_result['valid']:
                        print("✅ Structure validation passed")
                    else:
                        print(f"❌ Structure validation failed: {validation_result['errors']}")
                    
                    results.append({
                        'test_case': test_case['name'],
                        'success': True,
                        'generation_time': generation_time,
                        'plan_quality': assess_plan_quality(plan),
                        'validation': validation_result
                    })
                    
                else:
                    print(f"❌ Generation failed: {result.get('error', 'Unknown error')}")
                    results.append({
                        'test_case': test_case['name'],
                        'success': False,
                        'error': result.get('error', 'Unknown error')
                    })
                    
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
                results.append({
                    'test_case': test_case['name'],
                    'success': False,
                    'error': str(e)
                })
        
        # Print summary
        print("\n📊 Test Summary")
        print("=" * 50)
        
        successful_tests = sum(1 for r in results if r['success'])
        total_tests = len(results)
        
        print(f"✅ Successful tests: {successful_tests}/{total_tests}")
        print(f"❌ Failed tests: {total_tests - successful_tests}/{total_tests}")
        
        if successful_tests > 0:
            avg_time = sum(r.get('generation_time', 0) for r in results if r['success']) / successful_tests
            print(f"⏱️  Average generation time: {avg_time:.2f}s")
            
            avg_quality = sum(r.get('plan_quality', {}).get('score', 0) for r in results if r['success']) / successful_tests
            print(f"🌟 Average plan quality: {avg_quality:.1f}/10")
        
        # Save detailed results
        save_test_results(results)
        
        return successful_tests == total_tests
        
    except Exception as e:
        print(f"❌ Test setup failed: {e}")
        return False

def validate_lecture_plan_structure(plan, input_data):
    """Validate that the generated lecture plan has proper structure"""
    errors = []
    
    # Required fields
    required_fields = ['title', 'description', 'learningObjectives', 'structure']
    for field in required_fields:
        if field not in plan or not plan[field]:
            errors.append(f"Missing required field: {field}")
    
    # Check learning objectives structure
    if 'learningObjectives' in plan:
        for i, obj in enumerate(plan['learningObjectives']):
            if isinstance(obj, dict):
                if 'objective' not in obj:
                    errors.append(f"Learning objective {i+1} missing 'objective' field")
            elif not isinstance(obj, str):
                errors.append(f"Learning objective {i+1} has invalid format")
    
    # Check structure components
    if 'structure' in plan:
        structure = plan['structure']
        structure_fields = ['openingHook', 'introduction', 'mainContent', 'conclusion']
        for field in structure_fields:
            if field not in structure:
                errors.append(f"Missing structure field: {field}")
    
    # Check duration breakdown
    if 'durationBreakdown' in plan:
        breakdown = plan['durationBreakdown']
        total_duration = sum(breakdown.values()) if isinstance(breakdown, dict) else 0
        expected_duration = input_data.get('duration', 60)
        
        if abs(total_duration - expected_duration) > 10:  # Allow 10 minute variance
            errors.append(f"Duration mismatch: expected ~{expected_duration}, got {total_duration}")
    
    # Check language consistency
    expected_language = input_data.get('language', 'en')
    if expected_language == 'hi':
        # Check if content contains Hindi characters
        title = plan.get('title', '')
        if not any('\u0900' <= char <= '\u097F' for char in title):
            errors.append("Hindi language requested but content appears to be in English")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def assess_plan_quality(plan):
    """Assess the quality of the generated lecture plan"""
    score = 0
    max_score = 10
    feedback = []
    
    # Title quality (1 point)
    if plan.get('title') and len(plan['title']) > 10:
        score += 1
        feedback.append("Good title length")
    
    # Learning objectives (2 points)
    objectives = plan.get('learningObjectives', [])
    if len(objectives) >= 2:
        score += 1
        feedback.append("Adequate number of objectives")
    if any(isinstance(obj, dict) and 'bloomsLevel' in obj for obj in objectives):
        score += 1
        feedback.append("Bloom's taxonomy levels specified")
    
    # Activities (2 points)
    activities = plan.get('activities', [])
    if len(activities) >= 2:
        score += 1
        feedback.append("Multiple activities included")
    if any(act.get('differentiation') for act in activities):
        score += 1
        feedback.append("Differentiation strategies included")
    
    # Resources (1 point)
    if plan.get('resources') and len(plan['resources']) >= 1:
        score += 1
        feedback.append("Resources provided")
    
    # Assessments (1 point)
    if plan.get('assessments') and len(plan['assessments']) >= 1:
        score += 1
        feedback.append("Assessment methods included")
    
    # Structure completeness (2 points)
    structure = plan.get('structure', {})
    if all(field in structure for field in ['openingHook', 'introduction', 'mainContent']):
        score += 1
        feedback.append("Complete lesson structure")
    if structure.get('mainContent') and len(structure['mainContent']) >= 2:
        score += 1
        feedback.append("Detailed main content sections")
    
    # Teaching strategies (1 point)
    if plan.get('teachingStrategies') and len(plan['teachingStrategies']) >= 2:
        score += 1
        feedback.append("Multiple teaching strategies")
    
    return {
        'score': score,
        'max_score': max_score,
        'percentage': (score / max_score) * 100,
        'feedback': feedback
    }

def save_test_results(results):
    """Save test results to a file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"lecture_plan_test_results_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"📁 Test results saved to: {filename}")

def test_api_endpoint():
    """Test the API endpoint directly"""
    print("\n🌐 Testing API Endpoint")
    print("=" * 30)
    
    try:
        # Test data
        test_data = {
            "subject": "Mathematics",
            "topic": "Quadratic Equations",
            "grade": "10",
            "duration": 60,
            "learningObjectives": ["Solve quadratic equations", "Graph quadratic functions"],
            "difficulty": "intermediate",
            "teachingStrategies": ["problem-solving", "visual aids"],
            "language": "en"
        }
        
        # Make API request
        response = requests.post(
            "http://localhost:8001/lecture-plan/generate",
            json=test_data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ API endpoint working correctly")
                plan = result.get('data', {})
                print(f"📋 Generated plan title: {plan.get('title', 'N/A')}")
                return True
            else:
                print(f"❌ API returned error: {result.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ API request failed with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API service (is it running?)")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Lecture Plan Generation Tests")
    print("=" * 60)
    
    # Test the service directly
    service_test_passed = test_lecture_plan_generation()
    
    # Test the API endpoint
    api_test_passed = test_api_endpoint()
    
    print("\n🏁 Final Results")
    print("=" * 30)
    print(f"Service Test: {'✅ PASSED' if service_test_passed else '❌ FAILED'}")
    print(f"API Test: {'✅ PASSED' if api_test_passed else '❌ FAILED'}")
    
    if service_test_passed and api_test_passed:
        print("\n🎉 All tests passed! Lecture plan generation is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the output above.")
        sys.exit(1)
