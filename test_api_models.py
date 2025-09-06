#!/usr/bin/env python3
"""
Test script to validate all OpenRouter models are working with the API key
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

def test_openrouter_models():
    """Test all OpenRouter models configured in the environment"""
    print("=" * 60)
    print("TESTING OPENROUTER MODELS")
    print("=" * 60)
    
    try:
        from openrouter_service import OpenRouterService
        
        # Get API key
        api_key = os.getenv('OPENROUTER_API_KEY')
        if not api_key:
            print("❌ OPENROUTER_API_KEY not found in environment")
            return
        
        print(f"✅ API Key loaded: {api_key[:10]}...")
        
        # Initialize service
        service = OpenRouterService(api_key)
        
        # Get all models from environment
        models_to_test = {
            'QUIZ_MODEL': os.getenv('QUIZ_MODEL', 'deepseek/deepseek-chat-v3.1:free'),
            'CURRICULUM_MODEL': os.getenv('CURRICULUM_MODEL', 'meta-llama/llama-3.2-3b-instruct:free'),
            'GRADING_MODEL': os.getenv('GRADING_MODEL', 'google/gemma-2-9b-it:free'),
            'CONTENT_MODEL': os.getenv('CONTENT_MODEL', 'google/gemini-2.5-flash-image-preview:free'),
            'SLIDES_MODEL': os.getenv('SLIDES_MODEL', 'openai/gpt-oss-120b:free'),
            'MINDMAP_MODEL': os.getenv('MINDMAP_MODEL', 'deepseek/deepseek-chat-v3.1:free'),
            'LECTURE_PLAN_MODEL': os.getenv('LECTURE_PLAN_MODEL', 'meta-llama/llama-3.2-3b-instruct:free'),
            'ASSESSMENT_MODEL': os.getenv('ASSESSMENT_MODEL', 'google/gemma-2-9b-it:free')
        }
        
        print(f"\nTesting {len(models_to_test)} models...")
        print("-" * 60)
        
        successful_models = []
        failed_models = []
        
        for model_var, model_name in models_to_test.items():
            print(f"\n🧪 Testing {model_var}: {model_name}")
            
            try:
                # Create a simple test message
                test_messages = [
                    {"role": "system", "content": "You are a helpful educational assistant."},
                    {"role": "user", "content": "What is 2+2? Answer in one word."}
                ]
                
                # Test the model
                response = service._request_with_fallback(
                    messages=test_messages,
                    temperature=0.3,
                    max_tokens=50,
                    model_override=model_name
                )
                
                if response.get("success"):
                    content = response.get("content", "").strip()
                    print(f"   ✅ SUCCESS: {content[:50]}{'...' if len(content) > 50 else ''}")
                    successful_models.append(f"{model_var} ({model_name})")
                else:
                    error = response.get("error", "Unknown error")
                    print(f"   ❌ FAILED: {error}")
                    failed_models.append(f"{model_var} ({model_name}): {error}")
                    
            except Exception as e:
                print(f"   ❌ EXCEPTION: {str(e)}")
                failed_models.append(f"{model_var} ({model_name}): {str(e)}")
        
        # Summary
        print("\n" + "=" * 60)
        print("MODEL TEST SUMMARY")
        print("=" * 60)
        
        print(f"✅ Successful models: {len(successful_models)}")
        for model in successful_models:
            print(f"   • {model}")
        
        if failed_models:
            print(f"\n❌ Failed models: {len(failed_models)}")
            for model in failed_models:
                print(f"   • {model}")
        else:
            print(f"\n🎉 ALL MODELS WORKING!")
        
        return len(failed_models) == 0
        
    except Exception as e:
        print(f"❌ OpenRouter service test failed: {e}")
        return False

def test_module_specific_models():
    """Test models in the context of their specific modules"""
    print("\n" + "=" * 60)
    print("TESTING MODULE-SPECIFIC MODEL INTEGRATION")
    print("=" * 60)
    
    module_tests = [
        ("Quiz Generation", "deepseek/deepseek-chat-v3.1:free", "Create a math question about fractions."),
        ("Curriculum Design", "meta-llama/llama-3.2-3b-instruct:free", "List 3 topics for Grade 10 Math."),
        ("Content Grading", "google/gemma-2-9b-it:free", "Grade this answer: The capital of India is New Delhi."),
        ("Slide Creation", "openai/gpt-oss-120b:free", "Create a slide title about photosynthesis."),
        ("Mindmap Design", "deepseek/deepseek-chat-v3.1:free", "Create a simple mindmap about plants."),
        ("Lecture Planning", "meta-llama/llama-3.2-3b-instruct:free", "Plan a 30-min lesson on addition."),
        ("Assessment", "google/gemma-2-9b-it:free", "Assess student knowledge of basic arithmetic.")
    ]
    
    try:
        from openrouter_service import OpenRouterService
        service = OpenRouterService()
        
        successful_tests = 0
        
        for module_name, model, test_prompt in module_tests:
            print(f"\n🧪 Testing {module_name} with {model}")
            
            try:
                response = service._request_with_fallback(
                    messages=[
                        {"role": "system", "content": f"You are an expert in {module_name.lower()}. Respond concisely."},
                        {"role": "user", "content": test_prompt}
                    ],
                    temperature=0.5,
                    max_tokens=100,
                    model_override=model
                )
                
                if response.get("success"):
                    content = response.get("content", "").strip()
                    print(f"   ✅ SUCCESS: {content[:80]}{'...' if len(content) > 80 else ''}")
                    successful_tests += 1
                else:
                    error = response.get("error", "Unknown error")
                    print(f"   ❌ FAILED: {error}")
                    
            except Exception as e:
                print(f"   ❌ EXCEPTION: {str(e)}")
        
        print(f"\n📊 Module Integration Results: {successful_tests}/{len(module_tests)} successful")
        return successful_tests == len(module_tests)
        
    except Exception as e:
        print(f"❌ Module integration test failed: {e}")
        return False

def test_fallback_mechanism():
    """Test the fallback mechanism when models fail"""
    print("\n" + "=" * 60)
    print("TESTING FALLBACK MECHANISM")
    print("=" * 60)
    
    try:
        from openrouter_service import OpenRouterService
        service = OpenRouterService()
        
        # Test with an invalid model that should trigger fallback
        print("🧪 Testing fallback with invalid model...")
        
        response = service._request_with_fallback(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'fallback working' if you can read this."}
            ],
            temperature=0.3,
            max_tokens=50,
            model_override="invalid/nonexistent-model"
        )
        
        if response.get("success"):
            content = response.get("content", "").strip()
            print(f"   ✅ FALLBACK SUCCESS: {content}")
            return True
        else:
            print(f"   ❌ FALLBACK FAILED: {response.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Fallback test failed: {e}")
        return False

def main():
    """Main test function"""
    print("OpenRouter API & Model Validation Test")
    print("=" * 60)
    
    # Load environment
    load_env_file()
    
    # Check API key
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("❌ OPENROUTER_API_KEY not found in environment")
        return False
    
    # Run all tests
    test_results = []
    
    # Test 1: Basic model functionality
    test_results.append(("Basic Model Tests", test_openrouter_models()))
    
    # Test 2: Module-specific integration
    test_results.append(("Module Integration", test_module_specific_models()))
    
    # Test 3: Fallback mechanism
    test_results.append(("Fallback Mechanism", test_fallback_mechanism()))
    
    # Final summary
    print("\n" + "=" * 60)
    print("FINAL TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = 0
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed_tests += 1
    
    print(f"\nOverall Result: {passed_tests}/{len(test_results)} tests passed")
    
    if passed_tests == len(test_results):
        print("🎉 ALL TESTS PASSED! API key and models are working correctly.")
    else:
        print("⚠️  Some tests failed. Check the details above.")
    
    return passed_tests == len(test_results)

if __name__ == "__main__":
    main()
