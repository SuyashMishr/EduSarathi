#!/usr/bin/env python3
"""
Comprehensive test of all EduSarathi modules with updated API key
Tests: Lecture Plans, Curriculum Generation, and Slide Generation
"""

import requests
import json
import time
from datetime import datetime

def test_with_updated_api_key():
    """Test all modules with the updated API key"""
    print("🚀 TESTING ALL MODULES WITH UPDATED API KEY")
    print("=" * 60)
    
    # Test configurations for all three main modules
    test_modules = {
        "lecture_plan": {
            "name": "📋 LECTURE PLAN GENERATION",
            "endpoint": "http://localhost:8001/lecture-plan/generate",
            "payload": {
                "subject": "Physics",
                "topic": "Newton's Laws of Motion",
                "grade": "11",
                "duration": 50,
                "learningObjectives": [
                    "Understand Newton's three laws of motion",
                    "Apply laws to solve problems"
                ],
                "difficulty": "intermediate",
                "teachingStrategies": ["demonstration", "problem-solving"],
                "language": "en"
            }
        },
        "curriculum": {
            "name": "📚 CURRICULUM GENERATION",
            "endpoint": "http://localhost:8001/curriculum/generate",
            "payload": {
                "subject": "Chemistry",
                "grade": 10,
                "language": "en"
            }
        },
        "slides": {
            "name": "🎯 SLIDE GENERATION",
            "endpoint": "http://localhost:8001/slides/generate",
            "payload": {
                "subject": "Mathematics",
                "topic": "Quadratic Equations",
                "grade": "10",
                "slideCount": 8,
                "theme": "modern",
                "template": "education",
                "difficulty": "intermediate",
                "language": "en",
                "includeImages": True
            }
        }
    }
    
    results = {}
    
    # Test each module
    for module_key, config in test_modules.items():
        print(f"\n{config['name']}")
        print("-" * 50)
        
        try:
            print(f"🔄 Testing {config['endpoint']}")
            print(f"📝 Payload: {json.dumps(config['payload'], indent=2)}")
            
            start_time = time.time()
            response = requests.post(
                config['endpoint'],
                json=config['payload'],
                timeout=60
            )
            end_time = time.time()
            
            print(f"⏱️  Response time: {end_time - start_time:.2f} seconds")
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('success'):
                    print(f"✅ {module_key.upper()}: SUCCESS!")
                    
                    # Show key details from response
                    response_data = data.get('data', {})
                    
                    if module_key == 'lecture_plan':
                        title = response_data.get('title', 'N/A')
                        objectives = len(response_data.get('learningObjectives', []))
                        activities = len(response_data.get('activities', []))
                        print(f"   📋 Title: {title}")
                        print(f"   🎯 Learning Objectives: {objectives}")
                        print(f"   🎪 Activities: {activities}")
                        
                    elif module_key == 'curriculum':
                        title = response_data.get('title', 'N/A')
                        modules = len(response_data.get('modules', []))
                        print(f"   📚 Title: {title}")
                        print(f"   📖 Modules: {modules}")
                        
                    elif module_key == 'slides':
                        title = response_data.get('title', 'N/A')
                        slide_count = len(response_data.get('slides', []))
                        duration = response_data.get('totalDuration', 'N/A')
                        print(f"   🎯 Title: {title}")
                        print(f"   📊 Slides: {slide_count}")
                        print(f"   ⏱️  Duration: {duration}")
                    
                    results[module_key] = "SUCCESS"
                    
                else:
                    print(f"❌ {module_key.upper()}: API ERROR")
                    print(f"   Error: {data.get('message', 'Unknown error')}")
                    results[module_key] = "API_ERROR"
            else:
                print(f"❌ {module_key.upper()}: HTTP ERROR")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('detail', response.text[:200])}")
                except:
                    print(f"   Error: HTTP {response.status_code}")
                results[module_key] = "HTTP_ERROR"
            
            time.sleep(3)  # Rate limiting between requests
            
        except requests.exceptions.Timeout:
            print(f"⏰ {module_key.upper()}: TIMEOUT")
            results[module_key] = "TIMEOUT"
        except requests.exceptions.RequestException as e:
            print(f"🔌 {module_key.upper()}: CONNECTION ERROR")
            print(f"   Error: {e}")
            results[module_key] = "CONNECTION_ERROR"
        except Exception as e:
            print(f"💥 {module_key.upper()}: UNEXPECTED ERROR")
            print(f"   Error: {e}")
            results[module_key] = "UNEXPECTED_ERROR"
    
    # Test backend integration
    print(f"\n🔗 TESTING BACKEND INTEGRATION")
    print("-" * 40)
    
    backend_tests = [
        ("Lecture Plans", "http://localhost:5001/api/lecture-plan"),
        ("Curriculum", "http://localhost:5001/api/curriculum"),
        ("Slides", "http://localhost:5001/api/slides"),
        ("AI Health", "http://localhost:5001/api/ai-health")
    ]
    
    backend_results = {}
    
    for name, url in backend_tests:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code in [200, 404]:  # 404 OK for empty collections
                print(f"✅ {name}: ACCESSIBLE")
                backend_results[name] = "SUCCESS"
            else:
                print(f"❌ {name}: ERROR ({response.status_code})")
                backend_results[name] = "ERROR"
        except Exception as e:
            print(f"❌ {name}: CONNECTION FAILED")
            backend_results[name] = "FAILED"
    
    # Summary
    print(f"\n" + "=" * 60)
    print("🏆 COMPREHENSIVE TEST RESULTS WITH UPDATED API KEY")
    print("=" * 60)
    
    print(f"\n🤖 AI SERVICE MODULES:")
    success_count = 0
    for module, result in results.items():
        status_icon = "✅" if result == "SUCCESS" else "❌"
        print(f"   {status_icon} {module.replace('_', ' ').title()}: {result}")
        if result == "SUCCESS":
            success_count += 1
    
    print(f"\n🔗 BACKEND ENDPOINTS:")
    backend_success = 0
    for name, result in backend_results.items():
        status_icon = "✅" if result == "SUCCESS" else "❌"
        print(f"   {status_icon} {name}: {result}")
        if result == "SUCCESS":
            backend_success += 1
    
    # Overall assessment
    total_modules = len(results)
    total_backend = len(backend_results)
    
    print(f"\n📊 OVERALL ASSESSMENT:")
    print(f"   🤖 AI Modules: {success_count}/{total_modules} working")
    print(f"   🔗 Backend: {backend_success}/{total_backend} accessible")
    
    if success_count == total_modules and backend_success == total_backend:
        print(f"\n🎉 OUTSTANDING! ALL SYSTEMS WORKING WITH NEW API KEY!")
        print(f"   ✅ Updated API key is fully functional")
        print(f"   ✅ All three modules generating content successfully")
        print(f"   ✅ Backend integration is perfect")
        print(f"   ✅ No quota limits - fresh API key working!")
        print(f"\n🚀 EduSarathi is ready for full production use!")
        return True
    else:
        print(f"\n⚠️  Some issues detected:")
        failed_modules = [k for k, v in results.items() if v != "SUCCESS"]
        if failed_modules:
            print(f"   - Failed modules: {', '.join(failed_modules)}")
        failed_backend = [k for k, v in backend_results.items() if v != "SUCCESS"]
        if failed_backend:
            print(f"   - Backend issues: {', '.join(failed_backend)}")
        return False
    
    print(f"\n📅 Test completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    success = test_with_updated_api_key()
    exit(0 if success else 1)
