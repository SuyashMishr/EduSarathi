"""
Slide Generation Module
Uses AI to generate presentation slides for educational content
"""

'''import openai'''
import json
from typing import Dict, List, Optional
import os
from datetime import datetime

class SlideGenerator:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the slide generator with OpenAI API key"""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if self.api_key:
            openai.api_key = self.api_key
    
    def generate_slides(self, 
                       subject: str,
                       topic: str,
                       grade: Optional[int] = None,
                       slide_count: int = 10,
                       theme: str = "default",
                       template: str = "education",
                       difficulty: str = "intermediate",
                       include_images: bool = False) -> Dict:
        """
        Generate presentation slides for a topic
        
        Args:
            subject: Subject name
            topic: Topic for the presentation
            grade: Grade level (optional)
            slide_count: Number of slides to generate
            theme: Visual theme (default, modern, minimal, colorful)
            template: Template type (education, business, scientific, creative)
            difficulty: Content difficulty (beginner, intermediate, advanced)
            include_images: Whether to include image suggestions
            
        Returns:
            Dictionary containing the generated slides
        """
        
        prompt = self._create_slides_prompt(
            subject, topic, grade, slide_count, theme, template, difficulty, include_images
        )
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert presentation designer who creates engaging educational slides."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=3000,
                temperature=0.7
            )
            
            slides_text = response.choices[0].message.content
            slide_deck = self._parse_slides_response(
                slides_text, subject, topic, grade, theme, template
            )
            
            return {
                "success": True,
                "data": slide_deck,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _create_slides_prompt(self, subject: str, topic: str, grade: Optional[int],
                             slide_count: int, theme: str, template: str,
                             difficulty: str, include_images: bool) -> str:
        """Create a detailed prompt for slide generation"""
        
        grade_text = f" for Grade {grade} students" if grade else ""
        
        prompt = f"""
        Create a {slide_count}-slide presentation on "{topic}" in {subject}{grade_text}.
        
        Requirements:
        - Topic: {topic}
        - Subject: {subject}
        - Number of slides: {slide_count}
        - Difficulty level: {difficulty}
        - Theme: {theme}
        - Template style: {template}
        - Make content engaging and educational
        - Use clear, concise language appropriate for the audience
        
        For each slide, provide:
        1. Slide number and title
        2. Main content (bullet points or paragraphs)
        3. Key concepts to highlight
        4. Speaker notes (what the presenter should say)
        """
        
        if include_images:
            prompt += "5. Image suggestions (describe what images would enhance the slide)\n"
        
        prompt += """
        
        Structure the presentation with:
        - Title slide
        - Introduction/Overview
        - Main content slides (concepts, examples, explanations)
        - Summary/Conclusion slide
        - Questions/Discussion slide (if space allows)
        
        Format each slide as:
        SLIDE X: [Title]
        CONTENT:
        - Main point 1
        - Main point 2
        - Main point 3
        
        SPEAKER NOTES: [What to say during this slide]
        """
        
        if include_images:
            prompt += "IMAGE SUGGESTIONS: [Describe relevant images]\n"
        
        prompt += "\n---\n"
        
        return prompt
    
    def _parse_slides_response(self, response_text: str, subject: str, topic: str,
                              grade: Optional[int], theme: str, template: str) -> Dict:
        """Parse the AI response into a structured slide deck format"""
        
        slide_deck = {
            "title": f"{topic} Presentation",
            "subject": subject,
            "topic": topic,
            "grade": grade,
            "description": f"Educational presentation on {topic}",
            "slides": [],
            "settings": {
                "theme": theme,
                "template": template,
                "total_slides": 0
            },
            "metadata": {
                "estimated_duration": 0,  # Will be calculated
                "target_audience": f"Grade {grade}" if grade else "General",
                "presentation_type": "Educational"
            }
        }
        
        # Parse slides from response
        slides = self._extract_slides_from_text(response_text)
        slide_deck["slides"] = slides
        slide_deck["settings"]["total_slides"] = len(slides)
        
        # Estimate duration (2-3 minutes per slide)
        slide_deck["metadata"]["estimated_duration"] = len(slides) * 2.5
        
        return slide_deck
    
    def _extract_slides_from_text(self, text: str) -> List[Dict]:
        """Extract slides from the AI response text"""
        
        slides = []
        lines = text.split('\n')
        current_slide = None
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this is a new slide
            if line.startswith('SLIDE') and ':' in line:
                if current_slide:
                    slides.append(current_slide)
                
                slide_title = line.split(':', 1)[1].strip()
                slide_number = len(slides) + 1
                
                current_slide = {
                    "slide_number": slide_number,
                    "title": slide_title,
                    "content": [],
                    "bullet_points": [],
                    "speaker_notes": "",
                    "image_suggestions": [],
                    "type": self._determine_slide_type(slide_title, slide_number)
                }
                current_section = None
            
            elif current_slide:
                # Parse slide sections
                if line.startswith('CONTENT:'):
                    current_section = "content"
                elif line.startswith('SPEAKER NOTES:'):
                    current_section = "speaker_notes"
                    current_slide["speaker_notes"] = line.split(':', 1)[1].strip()
                elif line.startswith('IMAGE SUGGESTIONS:'):
                    current_section = "images"
                    image_text = line.split(':', 1)[1].strip()
                    if image_text:
                        current_slide["image_suggestions"].append(image_text)
                elif line.startswith('-') or line.startswith('•'):
                    # Handle bullet points
                    bullet_text = line[1:].strip()
                    if current_section == "content":
                        current_slide["bullet_points"].append(bullet_text)
                        current_slide["content"].append(bullet_text)
                elif current_section == "content" and not line.startswith('SLIDE'):
                    # Regular content
                    current_slide["content"].append(line)
                elif current_section == "speaker_notes" and not line.startswith(('SLIDE', 'CONTENT:', 'IMAGE')):
                    # Additional speaker notes
                    if current_slide["speaker_notes"]:
                        current_slide["speaker_notes"] += " " + line
                    else:
                        current_slide["speaker_notes"] = line
        
        # Add the last slide
        if current_slide:
            slides.append(current_slide)
        
        # If no slides were parsed, create default slides
        if not slides:
            slides = self._create_default_slides()
        
        return slides
    
    def _determine_slide_type(self, title: str, slide_number: int) -> str:
        """Determine the type of slide based on title and position"""
        
        title_lower = title.lower()
        
        if slide_number == 1 or 'title' in title_lower:
            return "title"
        elif 'introduction' in title_lower or 'overview' in title_lower:
            return "introduction"
        elif 'conclusion' in title_lower or 'summary' in title_lower:
            return "conclusion"
        elif 'question' in title_lower or 'discussion' in title_lower:
            return "discussion"
        else:
            return "content"
    
    def _create_default_slides(self) -> List[Dict]:
        """Create default slides if parsing fails"""
        
        return [
            {
                "slide_number": 1,
                "title": "Title Slide",
                "content": ["Presentation Title", "Subject", "Date"],
                "bullet_points": [],
                "speaker_notes": "Welcome and introduce the topic",
                "image_suggestions": [],
                "type": "title"
            },
            {
                "slide_number": 2,
                "title": "Introduction",
                "content": ["Overview of the topic", "Learning objectives", "What we'll cover"],
                "bullet_points": ["Overview of the topic", "Learning objectives", "What we'll cover"],
                "speaker_notes": "Introduce the topic and set expectations",
                "image_suggestions": [],
                "type": "introduction"
            }
        ]
    
    def generate_slide_templates(self, theme: str, template: str) -> Dict:
        """Generate slide templates with styling information"""
        
        templates = {
            "education": {
                "colors": {
                    "primary": "#2563eb",
                    "secondary": "#64748b",
                    "accent": "#f59e0b",
                    "background": "#ffffff",
                    "text": "#1f2937"
                },
                "fonts": {
                    "heading": "Inter, sans-serif",
                    "body": "Inter, sans-serif"
                },
                "layout": "clean"
            },
            "business": {
                "colors": {
                    "primary": "#1f2937",
                    "secondary": "#6b7280",
                    "accent": "#3b82f6",
                    "background": "#f9fafb",
                    "text": "#111827"
                },
                "fonts": {
                    "heading": "Roboto, sans-serif",
                    "body": "Roboto, sans-serif"
                },
                "layout": "professional"
            },
            "scientific": {
                "colors": {
                    "primary": "#059669",
                    "secondary": "#6b7280",
                    "accent": "#dc2626",
                    "background": "#ffffff",
                    "text": "#374151"
                },
                "fonts": {
                    "heading": "Source Sans Pro, sans-serif",
                    "body": "Source Sans Pro, sans-serif"
                },
                "layout": "structured"
            },
            "creative": {
                "colors": {
                    "primary": "#7c3aed",
                    "secondary": "#a78bfa",
                    "accent": "#f59e0b",
                    "background": "#faf5ff",
                    "text": "#581c87"
                },
                "fonts": {
                    "heading": "Poppins, sans-serif",
                    "body": "Open Sans, sans-serif"
                },
                "layout": "dynamic"
            }
        }
        
        return templates.get(template, templates["education"])
    
    def export_slides(self, slide_deck: Dict, format: str = "json") -> str:
        """Export slides in various formats"""
        
        if format == "json":
            return json.dumps(slide_deck, indent=2)
        
        elif format == "text":
            output = f"Presentation: {slide_deck['title']}\n"
            output += "=" * len(output) + "\n\n"
            
            for slide in slide_deck["slides"]:
                output += f"Slide {slide['slide_number']}: {slide['title']}\n"
                output += "-" * 40 + "\n"
                
                for content in slide["content"]:
                    output += f"• {content}\n"
                
                if slide["speaker_notes"]:
                    output += f"\nSpeaker Notes: {slide['speaker_notes']}\n"
                
                output += "\n"
            
            return output
        
        elif format == "html":
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{slide_deck['title']}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    .slide {{ margin-bottom: 30px; padding: 20px; border: 1px solid #ccc; }}
                    .slide-title {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; }}
                    .slide-content {{ margin-bottom: 10px; }}
                    .speaker-notes {{ font-style: italic; color: #666; }}
                </style>
            </head>
            <body>
                <h1>{slide_deck['title']}</h1>
            """
            
            for slide in slide_deck["slides"]:
                html += f"""
                <div class="slide">
                    <div class="slide-title">Slide {slide['slide_number']}: {slide['title']}</div>
                    <div class="slide-content">
                """
                
                for content in slide["content"]:
                    html += f"<p>• {content}</p>"
                
                if slide["speaker_notes"]:
                    html += f'<div class="speaker-notes">Speaker Notes: {slide["speaker_notes"]}</div>'
                
                html += "</div></div>"
            
            html += "</body></html>"
            return html
        
        return json.dumps(slide_deck, indent=2)
    
    def save_slides(self, slide_deck: Dict, filename: str) -> bool:
        """Save slide deck to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(slide_deck, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving slides: {e}")
            return False

# Example usage
if __name__ == "__main__":
    generator = SlideGenerator()
    
    # Generate sample slides
    result = generator.generate_slides(
        subject="Biology",
        topic="Photosynthesis",
        grade=10,
        slide_count=8,
        theme="modern",
        template="education",
        difficulty="intermediate",
        include_images=True
    )
    
    if result["success"]:
        print("Slides generated successfully!")
        print(json.dumps(result["data"], indent=2))
    else:
        print(f"Error: {result['error']}")