"""
Quiz Generation Module
Uses AI models to generate quizzes with various question types
"""

import openai
import json
import random
from typing import Dict, List, Optional
import os
from datetime import datetime

class QuizGenerator:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the quiz generator with OpenAI API key"""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if self.api_key:
            openai.api_key = self.api_key
    
    def generate_quiz(self, 
                     subject: str,
                     topic: str,
                     grade: Optional[int] = None,
                     question_count: int = 10,
                     difficulty: str = "medium",
                     question_types: List[str] = None) -> Dict:
        """
        Generate a quiz with specified parameters
        
        Args:
            subject: Subject name
            topic: Specific topic
            grade: Grade level (optional)
            question_count: Number of questions
            difficulty: easy, medium, hard
            question_types: List of question types (mcq, true_false, short_answer)
            
        Returns:
            Dictionary containing the generated quiz
        """
        
        if question_types is None:
            question_types = ["mcq", "true_false", "short_answer"]
        
        prompt = self._create_quiz_prompt(subject, topic, grade, question_count, difficulty, question_types)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert educator who creates high-quality educational quizzes."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2500,
                temperature=0.7
            )
            
            quiz_text = response.choices[0].message.content
            quiz = self._parse_quiz_response(quiz_text, subject, topic, grade, difficulty)
            
            return {
                "success": True,
                "data": quiz,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _create_quiz_prompt(self, subject: str, topic: str, grade: Optional[int],
                          question_count: int, difficulty: str, question_types: List[str]) -> str:
        """Create a detailed prompt for quiz generation"""
        
        grade_text = f" for Grade {grade} students" if grade else ""
        
        prompt = f"""
        Create a {difficulty} level quiz on {topic} in {subject}{grade_text}.
        
        Requirements:
        - Total questions: {question_count}
        - Difficulty level: {difficulty}
        - Question types to include: {', '.join(question_types)}
        - Ensure questions test understanding, not just memorization
        - Include a mix of conceptual and application-based questions
        
        For each question, provide:
        1. Question text
        2. Question type (mcq, true_false, short_answer)
        3. For MCQ: 4 options with correct answer marked
        4. For True/False: correct answer
        5. For Short Answer: sample correct answer
        6. Points value (1-5 based on difficulty)
        7. Explanation for the correct answer
        
        Format as a structured quiz that can be easily parsed.
        """
        
        return prompt
    
    def _parse_quiz_response(self, response_text: str, subject: str, topic: str,
                           grade: Optional[int], difficulty: str) -> Dict:
        """Parse the AI response into a structured quiz format"""
        
        quiz = {
            "title": f"{subject} Quiz: {topic}",
            "subject": subject,
            "topic": topic,
            "grade": grade,
            "difficulty": difficulty,
            "description": f"A {difficulty} level quiz on {topic}",
            "questions": [],
            "total_points": 0,
            "time_limit": None,
            "instructions": "Answer all questions to the best of your ability."
        }
        
        # Parse questions from response
        questions = self._extract_questions_from_text(response_text)
        quiz["questions"] = questions
        quiz["total_points"] = sum(q.get("points", 1) for q in questions)
        
        # Set time limit based on question count and difficulty
        base_time = len(questions) * 2  # 2 minutes per question
        if difficulty == "easy":
            quiz["time_limit"] = base_time
        elif difficulty == "medium":
            quiz["time_limit"] = int(base_time * 1.5)
        else:  # hard
            quiz["time_limit"] = base_time * 2
        
        return quiz
    
    def _extract_questions_from_text(self, text: str) -> List[Dict]:
        """Extract questions from the AI response text"""
        
        questions = []
        lines = text.split('\n')
        current_question = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this is a new question
            if (line.startswith('Q') and ':' in line) or (line.startswith('Question') and ':' in line):
                if current_question:
                    questions.append(current_question)
                
                current_question = {
                    "question": line.split(':', 1)[1].strip(),
                    "type": "mcq",  # default
                    "options": [],
                    "correct_answer": "",
                    "points": 1,
                    "explanation": ""
                }
            
            elif current_question:
                # Parse question details
                if line.startswith('Type:'):
                    current_question["type"] = line.split(':', 1)[1].strip().lower()
                elif line.startswith('Points:'):
                    try:
                        current_question["points"] = int(line.split(':', 1)[1].strip())
                    except:
                        current_question["points"] = 1
                elif line.startswith('Explanation:'):
                    current_question["explanation"] = line.split(':', 1)[1].strip()
                elif line.startswith('Answer:') or line.startswith('Correct Answer:'):
                    current_question["correct_answer"] = line.split(':', 1)[1].strip()
                elif line.startswith(('A)', 'B)', 'C)', 'D)', 'a)', 'b)', 'c)', 'd)')):
                    # MCQ option
                    option_text = line[2:].strip()
                    current_question["options"].append(option_text)
                    if '*' in line or 'correct' in line.lower():
                        current_question["correct_answer"] = option_text
        
        # Add the last question
        if current_question:
            questions.append(current_question)
        
        # If no questions were parsed, create sample questions
        if not questions:
            questions = self._create_sample_questions()
        
        return questions
    
    def _create_sample_questions(self) -> List[Dict]:
        """Create sample questions if parsing fails"""
        
        return [
            {
                "question": "What is the main concept being tested?",
                "type": "mcq",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "points": 1,
                "explanation": "This tests basic understanding of the concept."
            },
            {
                "question": "True or False: This statement is correct.",
                "type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "points": 1,
                "explanation": "This statement is true because..."
            }
        ]
    
    def generate_question_bank(self, subject: str, topics: List[str], 
                             questions_per_topic: int = 20) -> Dict:
        """Generate a question bank for multiple topics"""
        
        question_bank = {
            "subject": subject,
            "topics": {},
            "total_questions": 0,
            "created_at": datetime.now().isoformat()
        }
        
        for topic in topics:
            quiz_result = self.generate_quiz(
                subject=subject,
                topic=topic,
                question_count=questions_per_topic,
                difficulty="medium"
            )
            
            if quiz_result["success"]:
                question_bank["topics"][topic] = quiz_result["data"]["questions"]
                question_bank["total_questions"] += len(quiz_result["data"]["questions"])
        
        return question_bank
    
    def save_quiz(self, quiz: Dict, filename: str) -> bool:
        """Save quiz to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(quiz, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving quiz: {e}")
            return False
    
    def load_quiz(self, filename: str) -> Optional[Dict]:
        """Load quiz from JSON file"""
        try:
            with open(filename, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading quiz: {e}")
            return None

# Example usage
if __name__ == "__main__":
    generator = QuizGenerator()
    
    # Generate a sample quiz
    result = generator.generate_quiz(
        subject="Mathematics",
        topic="Algebra",
        grade=8,
        question_count=5,
        difficulty="medium",
        question_types=["mcq", "short_answer"]
    )
    
    if result["success"]:
        print("Quiz generated successfully!")
        print(json.dumps(result["data"], indent=2))
    else:
        print(f"Error: {result['error']}")