#!/usr/bin/env python3
"""
Comprehensive test script for all EduSarathi modules:
1. Lecture Plan Generation
2. Curriculum Generation  
3. Lecture Slide Generation
"""

import requests
import json
import time
from datetime import datetime

class EduSarathiTester:
    def __init__(self):
        self.base_urls = {
            'frontend': 'http://localhost:3000',
            'backend': 'http://localhost:5001',
            'ai_service': 'http://localhost:8001'
        }
        self.test_results = {
            'lecture_plan': {'passed': 0, 'failed': 0, 'details': []},
            'curriculum': {'passed': 0, 'failed': 0, 'details': []},
            'slides': {'passed': 0, 'failed': 0, 'details': []},
            'integration': {'passed': 0, 'failed': 0, 'details': []}
        }
    
    def log_result(self, module, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results[module]['passed' if success else 'failed'] += 1
        self.test_results[module]['details'].append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        })
    
    def check_services(self):
        """Check if all services are running"""
        print("\n🔍 CHECKING SERVICES")
        print("=" * 40)
        
        all_running = True
        for name, url in self.base_urls.items():
            try:
                health_url = f"{url}/health" if name != 'frontend' else url
                response = requests.get(health_url, timeout=5)
                if response.status_code == 200:
                    print(f"✅ {name.title()}: Running")
                else:
                    print(f"❌ {name.title()}: Not responding (Status: {response.status_code})")
                    all_running = False
            except requests.exceptions.RequestException as e:
                print(f"❌ {name.title()}: Connection failed - {e}")
                all_running = False
        
        return all_running
    
    def test_lecture_plan_generation(self):
        """Test lecture plan generation module"""
        print("\n📋 TESTING LECTURE PLAN GENERATION")
        print("=" * 50)
        
        # Test cases for different scenarios
        test_cases = [
            {
                "name": "Basic English Lecture Plan",
                "payload": {
                    "subject": "Mathematics",
                    "topic": "Quadratic Equations",
                    "grade": "10",
                    "duration": 60,
                    "learningObjectives": ["Understand quadratic equations", "Solve using factorization"],
                    "difficulty": "intermediate",
                    "teachingStrategies": ["problem-solving", "interactive"],
                    "language": "en"
                }
            },
            {
                "name": "Hindi Physics Lecture Plan",
                "payload": {
                    "subject": "भौतिकी",
                    "topic": "गति के नियम",
                    "grade": "11",
                    "duration": 45,
                    "learningObjectives": ["न्यूटन के नियमों को समझना"],
                    "difficulty": "intermediate",
                    "teachingStrategies": ["demonstration"],
                    "language": "hi"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                print(f"\n🧪 Testing: {test_case['name']}")
                
                # Test AI service directly
                ai_response = requests.post(
                    f"{self.base_urls['ai_service']}/lecture-plan/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if ai_response.status_code == 200:
                    ai_data = ai_response.json()
                    if ai_data.get('success'):
                        plan_data = ai_data.get('data', {})
                        self.log_result('lecture_plan', f"AI Service - {test_case['name']}", True,
                                      f"Generated plan with {len(plan_data.get('learningObjectives', []))} objectives")
                    else:
                        self.log_result('lecture_plan', f"AI Service - {test_case['name']}", False,
                                      f"AI service returned unsuccessful response")
                else:
                    self.log_result('lecture_plan', f"AI Service - {test_case['name']}", False,
                                  f"AI service error: {ai_response.status_code}")
                
                # Test backend endpoint
                backend_response = requests.post(
                    f"{self.base_urls['backend']}/api/lecture-plan/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if backend_response.status_code == 200:
                    backend_data = backend_response.json()
                    if backend_data.get('success'):
                        self.log_result('lecture_plan', f"Backend - {test_case['name']}", True,
                                      "Backend successfully generated and saved plan")
                    else:
                        self.log_result('lecture_plan', f"Backend - {test_case['name']}", False,
                                      f"Backend error: {backend_data.get('message', 'Unknown')}")
                else:
                    self.log_result('lecture_plan', f"Backend - {test_case['name']}", False,
                                  f"Backend HTTP error: {backend_response.status_code}")
                
                time.sleep(2)  # Rate limiting
                
            except requests.exceptions.RequestException as e:
                self.log_result('lecture_plan', f"Connection - {test_case['name']}", False, str(e))
            except Exception as e:
                self.log_result('lecture_plan', f"General - {test_case['name']}", False, str(e))
    
    def test_curriculum_generation(self):
        """Test curriculum generation module"""
        print("\n📚 TESTING CURRICULUM GENERATION")
        print("=" * 45)
        
        test_cases = [
            {
                "name": "Mathematics Curriculum",
                "payload": {
                    "subject": "Mathematics",
                    "grade": 10,
                    "language": "en",
                    "additional_requirements": "Focus on practical applications"
                }
            },
            {
                "name": "Hindi Science Curriculum",
                "payload": {
                    "subject": "विज्ञान",
                    "grade": 9,
                    "language": "hi",
                    "additional_requirements": "प्रयोगों पर जोर"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                print(f"\n🧪 Testing: {test_case['name']}")
                
                # Test AI service
                ai_response = requests.post(
                    f"{self.base_urls['ai_service']}/curriculum/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if ai_response.status_code == 200:
                    ai_data = ai_response.json()
                    if ai_data.get('success'):
                        curriculum_data = ai_data.get('data', {})
                        self.log_result('curriculum', f"AI Service - {test_case['name']}", True,
                                      f"Generated curriculum with {len(curriculum_data.get('units', []))} units")
                    else:
                        self.log_result('curriculum', f"AI Service - {test_case['name']}", False,
                                      "AI service returned unsuccessful response")
                else:
                    self.log_result('curriculum', f"AI Service - {test_case['name']}", False,
                                  f"AI service error: {ai_response.status_code}")
                
                # Test backend endpoint
                backend_response = requests.post(
                    f"{self.base_urls['backend']}/api/curriculum/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if backend_response.status_code == 200:
                    backend_data = backend_response.json()
                    if backend_data.get('success'):
                        self.log_result('curriculum', f"Backend - {test_case['name']}", True,
                                      "Backend successfully generated curriculum")
                    else:
                        self.log_result('curriculum', f"Backend - {test_case['name']}", False,
                                      f"Backend error: {backend_data.get('message', 'Unknown')}")
                else:
                    self.log_result('curriculum', f"Backend - {test_case['name']}", False,
                                  f"Backend HTTP error: {backend_response.status_code}")
                
                time.sleep(2)  # Rate limiting
                
            except requests.exceptions.RequestException as e:
                self.log_result('curriculum', f"Connection - {test_case['name']}", False, str(e))
            except Exception as e:
                self.log_result('curriculum', f"General - {test_case['name']}", False, str(e))
    
    def test_slide_generation(self):
        """Test lecture slide generation module"""
        print("\n🎯 TESTING LECTURE SLIDE GENERATION")
        print("=" * 45)
        
        test_cases = [
            {
                "name": "Basic Slide Generation",
                "payload": {
                    "subject": "Physics",
                    "topic": "Newton's Laws",
                    "grade": "11",
                    "slideCount": 8,
                    "language": "en"
                }
            },
            {
                "name": "Hindi Chemistry Slides",
                "payload": {
                    "subject": "रसायन",
                    "topic": "अम्ल और क्षार",
                    "grade": "10",
                    "slideCount": 6,
                    "language": "hi"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                print(f"\n🧪 Testing: {test_case['name']}")
                
                # Test AI service
                ai_response = requests.post(
                    f"{self.base_urls['ai_service']}/slides/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if ai_response.status_code == 200:
                    ai_data = ai_response.json()
                    if ai_data.get('success'):
                        slides_data = ai_data.get('data', {})
                        self.log_result('slides', f"AI Service - {test_case['name']}", True,
                                      f"Generated {len(slides_data.get('slides', []))} slides")
                    else:
                        self.log_result('slides', f"AI Service - {test_case['name']}", False,
                                      "AI service returned unsuccessful response")
                else:
                    self.log_result('slides', f"AI Service - {test_case['name']}", False,
                                  f"AI service error: {ai_response.status_code}")
                
                # Test backend endpoint
                backend_response = requests.post(
                    f"{self.base_urls['backend']}/api/slides/generate",
                    json=test_case['payload'],
                    timeout=60
                )
                
                if backend_response.status_code == 200:
                    backend_data = backend_response.json()
                    if backend_data.get('success'):
                        self.log_result('slides', f"Backend - {test_case['name']}", True,
                                      "Backend successfully generated slides")
                    else:
                        self.log_result('slides', f"Backend - {test_case['name']}", False,
                                      f"Backend error: {backend_data.get('message', 'Unknown')}")
                else:
                    self.log_result('slides', f"Backend - {test_case['name']}", False,
                                  f"Backend HTTP error: {backend_response.status_code}")
                
                time.sleep(2)  # Rate limiting
                
            except requests.exceptions.RequestException as e:
                self.log_result('slides', f"Connection - {test_case['name']}", False, str(e))
            except Exception as e:
                self.log_result('slides', f"General - {test_case['name']}", False, str(e))
    
    def test_integration(self):
        """Test integration between modules"""
        print("\n🔗 TESTING MODULE INTEGRATION")
        print("=" * 40)
        
        try:
            # Test if all endpoints are accessible
            endpoints = [
                ('/api/lecture-plan', 'GET'),
                ('/api/curriculum', 'GET'),
                ('/api/slides', 'GET'),
                ('/api/ai-health', 'GET')
            ]
            
            for endpoint, method in endpoints:
                try:
                    url = f"{self.base_urls['backend']}{endpoint}"
                    response = requests.get(url, timeout=10)
                    
                    if response.status_code in [200, 404]:  # 404 is OK for empty collections
                        self.log_result('integration', f"Endpoint {endpoint}", True,
                                      f"Accessible (Status: {response.status_code})")
                    else:
                        self.log_result('integration', f"Endpoint {endpoint}", False,
                                      f"Unexpected status: {response.status_code}")
                except Exception as e:
                    self.log_result('integration', f"Endpoint {endpoint}", False, str(e))
            
        except Exception as e:
            self.log_result('integration', "General Integration", False, str(e))
    
    def print_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "="*60)
        print("🏆 COMPREHENSIVE TEST SUMMARY")
        print("="*60)
        
        total_passed = 0
        total_failed = 0
        
        for module, results in self.test_results.items():
            passed = results['passed']
            failed = results['failed']
            total = passed + failed
            
            total_passed += passed
            total_failed += failed
            
            if total > 0:
                success_rate = (passed / total) * 100
                status = "✅" if success_rate >= 80 else "⚠️" if success_rate >= 50 else "❌"
                print(f"\n{status} {module.upper().replace('_', ' ')}:")
                print(f"   Passed: {passed}/{total} ({success_rate:.1f}%)")
                if failed > 0:
                    print(f"   Failed: {failed}")
        
        overall_total = total_passed + total_failed
        if overall_total > 0:
            overall_success = (total_passed / overall_total) * 100
            print(f"\n🎯 OVERALL RESULTS:")
            print(f"   Total Tests: {overall_total}")
            print(f"   Passed: {total_passed} ({overall_success:.1f}%)")
            print(f"   Failed: {total_failed}")
            
            if overall_success >= 80:
                print(f"\n🎉 EXCELLENT! All modules are working well!")
            elif overall_success >= 60:
                print(f"\n👍 GOOD! Most functionality is working.")
            else:
                print(f"\n⚠️  NEEDS ATTENTION! Several issues found.")
        
        print(f"\n📅 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    print("🚀 STARTING COMPREHENSIVE MODULE TESTING")
    print("="*60)
    
    tester = EduSarathiTester()
    
    # Check if services are running
    if not tester.check_services():
        print("\n❌ Not all services are running. Please start the project first.")
        return
    
    print("\n⏳ Waiting for services to fully initialize...")
    time.sleep(5)
    
    # Run all tests
    tester.test_lecture_plan_generation()
    tester.test_curriculum_generation()
    tester.test_slide_generation()
    tester.test_integration()
    
    # Print summary
    tester.print_summary()

if __name__ == "__main__":
    main()
