#!/usr/bin/env python3
"""
Comprehensive test script for all subjects in both languages
"""

import requests
import json
import time

def test_health():
    """Test service health"""
    try:
        response = requests.get("http://localhost:8001/health", timeout=10)
        if response.status_code == 200:
            print("✅ Service is healthy:", response.json())
            return True
        else:
            print("❌ Health check failed:", response.status_code)
            return False
    except Exception as e:
        print("❌ Health check failed:", str(e))
        return False

def test_subject_quiz(subject_en, subject_hi, topic_en, topic_hi, language):
    """Test quiz generation for a specific subject"""
    url = "http://localhost:8001/quiz/generate"
    
    if language.lower() in ["hi", "hindi"]:
        quiz_request = {
            "subject": subject_hi,
            "topic": topic_hi,
            "grade": 11,
            "questionCount": 2,
            "difficulty": "easy",
            "questionTypes": ["mcq"],
            "language": language
        }
    else:
        quiz_request = {
            "subject": subject_en,
            "topic": topic_en,
            "grade": 11,
            "questionCount": 2,
            "difficulty": "easy",
            "questionTypes": ["mcq"],
            "language": language
        }
    
    try:
        print(f"\n🧪 Testing {subject_en} Quiz in {language.upper()}")
        print("=" * 50)
        print(f"Request: {json.dumps(quiz_request, indent=2, ensure_ascii=False)}")
        
        response = requests.post(url, json=quiz_request, timeout=30)
        
        if response.status_code == 200:
            quiz_data = response.json()
            print(f"✅ Success! Generated quiz in {language}")
            print(f"📝 Quiz Title: {quiz_data.get('title', 'N/A')}")
            print(f"🌐 Language: {quiz_data.get('language', 'N/A')}")
            print(f"📊 Questions: {len(quiz_data.get('questions', []))}")
            
            # Show first question as sample
            questions = quiz_data.get('questions', [])
            if questions:
                first_q = questions[0]
                print(f"\n📋 Sample Question:")
                print(f"   Question: {first_q.get('question', 'N/A')}")
                print(f"   Type: {first_q.get('type', 'N/A')}")
                if first_q.get('options'):
                    print(f"   Options: {first_q.get('options')}")
                print(f"   Answer: {first_q.get('correct_answer', 'N/A')}")
                
                # Check language content
                question_text = first_q.get('question', '')
                if language.lower() in ["hi", "hindi"]:
                    has_hindi = any('\u0900' <= char <= '\u097F' for char in question_text)
                    print(f"   ✅ Hindi Content: {'Yes' if has_hindi else 'No'}")
                else:
                    has_english = any('a' <= char.lower() <= 'z' for char in question_text)
                    print(f"   ✅ English Content: {'Yes' if has_english else 'No'}")
            
            return True
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("🚀 Starting Comprehensive EduSarathi Subject Tests")
    print("=" * 60)
    
    # Test health first
    print("\n🏥 Testing Health Check")
    print("=" * 50)
    if not test_health():
        print("❌ Service not healthy, stopping tests")
        return
    
    # Define subjects to test
    subjects = [
        ("Physics", "भौतिक विज्ञान", "Motion in a Straight Line", "सरल रेखा में गति"),
        ("Chemistry", "रसायन विज्ञान", "Structure of Atom", "परमाणु की संरचना"),
        ("Mathematics", "गणित", "Sets", "समुच्चय"),
        ("Biology", "जीव विज्ञान", "The Living World", "जीव जगत"),
        ("Economics", "अर्थशास्त्र", "Introduction to Economics", "अर्थशास्त्र का परिचय")
    ]
    
    languages = ["en", "hi"]
    
    results = []
    
    for subject_en, subject_hi, topic_en, topic_hi in subjects:
        for language in languages:
            success = test_subject_quiz(subject_en, subject_hi, topic_en, topic_hi, language)
            results.append((f"{subject_en} ({language.upper()})", success))
            time.sleep(2)  # Small delay between tests
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 50)
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for production.")
    else:
        print("⚠️  Some tests failed. Check the logs above.")

if __name__ == "__main__":
    main()
