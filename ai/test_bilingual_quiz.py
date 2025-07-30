#!/usr/bin/env python3
"""
Test script for bilingual quiz generation
"""

import requests
import json
import time

def test_quiz_generation(language="en"):
    """Test quiz generation in specified language"""
    url = "http://localhost:8001/quiz/generate"

    # Test data with proper subject names for each language
    if language.lower() in ["hi", "hindi"]:
        quiz_request = {
            "subject": "भौतिक विज्ञान",
            "topic": "सरल रेखा में गति",
            "grade": 11,
            "questionCount": 3,
            "difficulty": "easy",
            "questionTypes": ["mcq"],
            "language": language
        }
    else:
        quiz_request = {
            "subject": "Physics",
            "topic": "Motion in a Straight Line",
            "grade": 11,
            "questionCount": 3,
            "difficulty": "easy",
            "questionTypes": ["mcq"],
            "language": language
        }
    
    print(f"\n🧪 Testing Quiz Generation in {language.upper()}")
    print("=" * 50)
    print(f"Request: {json.dumps(quiz_request, indent=2)}")
    
    try:
        response = requests.post(url, json=quiz_request, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! Generated quiz in {language}")
            
            if result.get("success") and result.get("data"):
                quiz_data = result["data"]
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

                    # Check if content is actually in the requested language
                    question_text = first_q.get('question', '')
                    if language.lower() in ["hi", "hindi"]:
                        # Check for Hindi characters
                        has_hindi = any('\u0900' <= char <= '\u097F' for char in question_text)
                        print(f"   ✅ Hindi Content: {'Yes' if has_hindi else 'No'}")
                    else:
                        # Check for English content
                        has_english = any('a' <= char.lower() <= 'z' for char in question_text)
                        print(f"   ✅ English Content: {'Yes' if has_english else 'No'}")

                return True
            else:
                print(f"❌ Failed: {result.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

def test_translation():
    """Test Gemini translation functionality"""
    url = "http://localhost:8001/translate/gemini"
    
    # Test English to Hindi
    translation_request = {
        "text": "What is the velocity of an object in motion?",
        "sourceLanguage": "en",
        "targetLanguage": "hi",
        "domain": "physics"
    }
    
    print(f"\n🔄 Testing Translation (EN → HI)")
    print("=" * 50)
    print(f"Original: {translation_request['text']}")
    
    try:
        response = requests.post(url, json=translation_request, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                translated = result["data"].get("translatedText", "N/A")
                print(f"✅ Translated: {translated}")
                return True
            else:
                print(f"❌ Translation failed: {result.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

def test_health_check():
    """Test AI service health"""
    url = "http://localhost:8001/health"
    
    print(f"\n🏥 Testing Health Check")
    print("=" * 50)
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Service is healthy: {result}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Bilingual EduSarathi Tests")
    print("=" * 60)
    
    # Test health first
    if not test_health_check():
        print("❌ Service not healthy, stopping tests")
        return
    
    # Test translation
    translation_success = test_translation()
    
    # Test quiz generation in English
    english_success = test_quiz_generation("en")
    
    # Test quiz generation in Hindi
    hindi_success = test_quiz_generation("hi")
    
    # Summary
    print(f"\n📊 Test Summary")
    print("=" * 50)
    print(f"Health Check: {'✅' if True else '❌'}")
    print(f"Translation: {'✅' if translation_success else '❌'}")
    print(f"English Quiz: {'✅' if english_success else '❌'}")
    print(f"Hindi Quiz: {'✅' if hindi_success else '❌'}")
    
    total_tests = 4
    passed_tests = sum([True, translation_success, english_success, hindi_success])
    
    print(f"\n🎯 Overall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Bilingual system is working!")
    else:
        print("⚠️  Some tests failed. Check the logs above.")

if __name__ == "__main__":
    main()
