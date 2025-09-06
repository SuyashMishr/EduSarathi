"""
Gemini AI Service
Integrates with Google's Gemini API to provide NCERT-aligned educational content generation
"""

import google.generativeai as genai
import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
from pathlib import Path

from config import get_config, MODEL_CONFIGS
from pdf_extractor import NCERTPDFExtractor
"""
Deprecated module placeholder.

This file remains only to preserve import stability in legacy environments.
All AI functionality now routes through OpenRouter-based services.
"""

from typing import Any

__all__ = ["DeprecatedService"]


class DeprecatedService:
    """No-op class. Use OpenRouterService instead."""

    def __init__(self, *_: Any, **__: Any) -> None:  # noqa: D401
        pass

            if not physics_11_en_path.exists() and not physics_11_hi_path.exists():
                logger.info("PDF data not found, extracting from PDFs...")
                self.pdf_extractor.extract_all_ncert_data()
            else:
                logger.info("PDF data already extracted and available")

        except Exception as e:
            logger.error(f"Error ensuring PDF data extraction: {e}")
    
    def _load_ncert_data(self) -> Dict:
        """Load NCERT curriculum data"""
        ncert_data = {}
        try:
            # Load curriculum mapping
            mapping_path = Path(self.config.NCERT_DATA_DIR) / "curriculum_mapping.json"
            if mapping_path.exists():
                with open(mapping_path, 'r', encoding='utf-8') as f:
                    ncert_data['curriculum_mapping'] = json.load(f)
            
            # Load grade-specific data
            ncert_dir = Path(self.config.NCERT_DATA_DIR)
            for grade_dir in ncert_dir.glob("grade_*"):
                if grade_dir.is_dir():
                    grade_num = grade_dir.name.split('_')[1]
                    ncert_data[f'grade_{grade_num}'] = {}
                    
                    for subject_dir in grade_dir.iterdir():
                        if subject_dir.is_dir():
                            subject_data = {}
                            
                            # Load chapters (try PDF-extracted data first)
                            pdf_chapters_file = subject_dir / "chapters_from_pdf.json"
                            chapters_file = subject_dir / "chapters.json"
                            
                            if pdf_chapters_file.exists():
                                with open(pdf_chapters_file, 'r', encoding='utf-8') as f:
                                    subject_data['chapters'] = json.load(f)
                                logger.info(f"Loaded PDF-extracted data for Grade {grade_num} {subject_dir.name}")
                            elif chapters_file.exists():
                                with open(chapters_file, 'r', encoding='utf-8') as f:
                                    subject_data['chapters'] = json.load(f)
                                logger.info(f"Loaded manual data for Grade {grade_num} {subject_dir.name}")
                            
                            ncert_data[f'grade_{grade_num}'][subject_dir.name] = subject_data
            
            logger.info(f"Loaded NCERT data for {len(ncert_data)} components")
            return ncert_data
            
        except Exception as e:
            logger.error(f"Error loading NCERT data: {e}")
            return {}
    
    def get_ncert_context(self, grade: int, subject: str, topic: Optional[str] = None, language: str = "english") -> str:
        """Get relevant NCERT context for given parameters with language support"""
        context_parts = []

        try:
            # Add comprehensive curriculum context for the subject
            subject_curriculum = self._get_comprehensive_subject_context(subject, grade, language)
            context_parts.append(subject_curriculum)

            # Try to load language-specific data first
            grade_key = f'grade_{grade}'

            # Look for language-specific data files
            ncert_dir = Path(self.config.NCERT_DATA_DIR)
            language_file = ncert_dir / grade_key / subject / f"chapters_from_pdf_{language.lower()}.json"

            if language_file.exists():
                try:
                    with open(language_file, 'r', encoding='utf-8') as f:
                        language_data = json.load(f)

                    context_parts.append(f"Grade {grade} {subject.title()} Content ({language.title()}):")
                    chapters_list = language_data.get('chapters', [])

                    # Filter and enhance chapters based on topic
                    relevant_chapters = []
                    for chapter in chapters_list:
                        chapter_info = self._process_chapter_data(chapter, topic, language)
                        if chapter_info:
                            relevant_chapters.append(chapter_info)

                    # Limit to most relevant chapters
                    context_parts.extend(relevant_chapters[:5])

                except Exception as e:
                    logger.error(f"Error loading language-specific data: {e}")
                    # Fall back to comprehensive context
                    return subject_curriculum
            else:
                # Use comprehensive context if no specific file
                logger.info(f"No language-specific file found, using comprehensive context")

            return "\n\n".join(context_parts)

        except Exception as e:
            logger.error(f"Error getting NCERT context: {e}")
            return self._get_comprehensive_subject_context(subject, grade, language)

    def _get_comprehensive_subject_context(self, subject: str, grade: int, language: str) -> str:
        """Get comprehensive subject context for Class 11"""
        normalized_subject = self._normalize_subject(subject, language)

        if language.lower() in ['hi', 'hindi']:
            return self._get_hindi_curriculum(normalized_subject, grade)
        else:
            return self._get_english_curriculum(normalized_subject, grade)

    def _get_hindi_curriculum(self, subject: str, grade: int) -> str:
        """Get Hindi curriculum for subjects"""
        curricula = {
            "physics": """
NCERT भौतिक विज्ञान कक्षा 11 पाठ्यक्रम:

भाग 1:
अध्याय 1: भौतिक जगत - भौतिकी का परिचय, मौलिक बल, प्रकृति के नियम
अध्याय 2: मात्रक और मापन - SI मात्रक, आयाम विश्लेषण, त्रुटि विश्लेषण
अध्याय 3: सरल रेखा में गति - स्थिति, वेग, त्वरण, गति के समीकरण
अध्याय 4: समतल में गति - प्रक्षेप्य गति, वृत्तीय गति, सापेक्ष वेग
अध्याय 5: गति के नियम - न्यूटन के नियम, घर्षण, वृत्तीय गति की गतिकी
अध्याय 6: कार्य, ऊर्जा और शक्ति - कार्य-ऊर्जा प्रमेय, संरक्षण नियम
अध्याय 7: कणों के निकाय और घूर्णी गति - द्रव्यमान केंद्र, कोणीय गति
अध्याय 8: गुरुत्वाकर्षण - न्यूटन का गुरुत्वाकर्षण नियम, केप्लर के नियम

भाग 2:
अध्याय 9: ठोसों के यांत्रिक गुण - प्रत्यास्थता, प्रतिबल और विकृति
अध्याय 10: तरलों के यांत्रिक गुण - दाब, पास्कल का नियम, बर्नूली का सिद्धांत
अध्याय 11: द्रव्य के तापीय गुण - तापमान, ऊष्मा, अवस्था परिवर्तन
अध्याय 12: ऊष्मागतिकी - ऊष्मागतिकी के नियम, कार्नो इंजन
अध्याय 13: अणुगति सिद्धांत - गैसों का व्यवहार, गतिज सिद्धांत
अध्याय 14: दोलन - सरल आवर्त गति, लोलक, तरंग गति
अध्याय 15: तरंगें - तरंग के प्रकार, ध्वनि तरंगें, डॉप्लर प्रभाव
""",
            "chemistry": """
NCERT रसायन विज्ञान कक्षा 11 पाठ्यक्रम:

भाग 1:
अध्याय 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ - परमाणु, अणु, मोल संकल्पना
अध्याय 2: परमाणु की संरचना - इलेक्ट्रॉन, प्रोटॉन, न्यूट्रॉन, क्वांटम संख्याएँ
अध्याय 3: तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तता - आवर्त सारणी
अध्याय 4: रासायनिक आबंधन तथा आण्विक संरचना - आयनिक, सहसंयोजक आबंध
अध्याय 5: द्रव्य की अवस्थाएँ - गैस, द्रव, ठोस की गुण
अध्याय 6: ऊष्मागतिकी - एन्थैल्पी, एन्ट्रॉपी, गिब्स ऊर्जा
अध्याय 7: साम्यावस्था - रासायनिक साम्य, ले शातेलिए का सिद्धांत

भाग 2:
अध्याय 8: अपचयोपचय अभिक्रियाएँ - ऑक्सीकरण, अपचयन
अध्याय 9: हाइड्रोजन - हाइड्रोजन के गुण, यौगिक
अध्याय 10: s-ब्लॉक तत्व - क्षार धातु, क्षारीय मृदा धातु
अध्याय 11: p-ब्लॉक तत्व - बोरॉन, कार्बन परिवार
अध्याय 12: कार्बनिक रसायन - हाइड्रोकार्बन, कार्यात्मक समूह
अध्याय 13: हाइड्रोकार्बन - एल्केन, एल्कीन, एल्काइन
अध्याय 14: पर्यावरणीय रसायन - प्रदूषण, ग्रीन हाउस प्रभाव
""",
            "mathematics": """
NCERT गणित कक्षा 11 पाठ्यक्रम:

अध्याय 1: समुच्चय - समुच्चय सिद्धांत, संक्रियाएँ
अध्याय 2: संबंध एवं फलन - संबंध के प्रकार, फलन की परिभाषा
अध्याय 3: त्रिकोणमितीय फलन - त्रिकोणमितीय अनुपात, सर्वसमिकाएँ
अध्याय 4: गणितीय आगमन का सिद्धांत - प्रमाण की विधि
अध्याय 5: सम्मिश्र संख्याएँ और द्विघातीय समीकरण - काल्पनिक संख्याएँ
अध्याय 6: रैखिक असमिकाएँ - असमिकाओं का हल
अध्याय 7: क्रमचय और संचय - व्यवस्था और चयन
अध्याय 8: द्विपद प्रमेय - द्विपद विस्तार
अध्याय 9: अनुक्रम तथा श्रेणी - समांतर, गुणोत्तर श्रेणी
अध्याय 10: सरल रेखाएँ - रेखा का समीकरण
अध्याय 11: शंकु परिच्छेद - वृत्त, परवलय, दीर्घवृत्त, अतिपरवलय
अध्याय 12: त्रिविमीय ज्यामिति का परिचय - निर्देशांक ज्यामिति
अध्याय 13: सीमा और अवकलज - कैलकुलस का परिचय
अध्याय 14: गणितीय तर्कशास्त्र - कथन, संयोजक
अध्याय 15: सांख्यिकी - केंद्रीय प्रवृत्ति के माप
अध्याय 16: प्रायिकता - घटना, प्रायिकता के नियम
""",
            "biology": """
NCERT जीव विज्ञान कक्षा 11 पाठ्यक्रम:

इकाई 1: जैविक विविधता
अध्याय 1: जीव जगत - वर्गीकरण, नामकरण
अध्याय 2: जैविक वर्गीकरण - पाँच जगत वर्गीकरण
अध्याय 3: वनस्पति जगत - पादप वर्गीकरण
अध्याय 4: प्राणि जगत - प्राणी वर्गीकरण

इकाई 2: पादप और प्राणियों में संरचनात्मक संगठन
अध्याय 5: पुष्पी पादपों की आकारिकी - जड़, तना, पत्ती, पुष्प
अध्याय 6: पुष्पी पादपों की शारीरिकी - ऊतक तंत्र
अध्याय 7: प्राणियों में संरचनात्मक संगठन - ऊतक, अंग तंत्र

इकाई 3: कोशिका संरचना और कार्य
अध्याय 8: कोशिका - जीवन की इकाई - कोशिका सिद्धांत
अध्याय 9: जैव अणु - कार्बोहाइड्रेट, प्रोटीन, लिपिड
अध्याय 10: कोशिका चक्र और कोशिका विभाजन - माइटोसिस, मियोसिस

इकाई 4: पादप कार्यिकी
अध्याय 11: पौधों में परिवहन - जल, खनिज लवण का परिवहन
अध्याय 12: खनिज पोषण - आवश्यक तत्व
अध्याय 13: उच्च पादपों में प्रकाश संश्लेषण - प्रकाश अभिक्रिया
अध्याय 14: पादपों में श्वसन - वायवीय, अवायवीय श्वसन
अध्याय 15: पादप वृद्धि एवं परिवर्धन - हार्मोन, वृद्धि नियामक
"""
        }

        return curricula.get(subject, f"NCERT {subject} कक्षा {grade} पाठ्यक्रम")

    def _get_english_curriculum(self, subject: str, grade: int) -> str:
        """Get English curriculum for subjects"""
        curricula = {
            "physics": """
NCERT Physics Class 11 Curriculum:

Part 1:
Chapter 1: Physical World - Introduction to Physics, Fundamental Forces, Laws of Nature
Chapter 2: Units and Measurements - SI Units, Dimensional Analysis, Error Analysis
Chapter 3: Motion in a Straight Line - Position, Velocity, Acceleration, Equations of Motion
Chapter 4: Motion in a Plane - Projectile Motion, Circular Motion, Relative Velocity
Chapter 5: Laws of Motion - Newton's Laws, Friction, Dynamics of Circular Motion
Chapter 6: Work, Energy and Power - Work-Energy Theorem, Conservation Laws
Chapter 7: System of Particles and Rotational Motion - Centre of Mass, Angular Momentum
Chapter 8: Gravitation - Newton's Law of Gravitation, Kepler's Laws

Part 2:
Chapter 9: Mechanical Properties of Solids - Elasticity, Stress and Strain
Chapter 10: Mechanical Properties of Fluids - Pressure, Pascal's Law, Bernoulli's Principle
Chapter 11: Thermal Properties of Matter - Temperature, Heat, Change of State
Chapter 12: Thermodynamics - Laws of Thermodynamics, Carnot Engine
Chapter 13: Kinetic Theory - Behavior of Gases, Kinetic Theory
Chapter 14: Oscillations - Simple Harmonic Motion, Pendulum, Wave Motion
Chapter 15: Waves - Types of Waves, Sound Waves, Doppler Effect

Key Topics: Motion, Forces, Energy, Gravitation, Oscillations, Waves
""",
            "chemistry": """
NCERT Chemistry Class 11 Curriculum:

Part 1:
Chapter 1: Some Basic Concepts of Chemistry - Atoms, Molecules, Mole Concept
Chapter 2: Structure of Atom - Electrons, Protons, Neutrons, Quantum Numbers
Chapter 3: Classification of Elements and Periodicity - Periodic Table
Chapter 4: Chemical Bonding and Molecular Structure - Ionic, Covalent Bonds
Chapter 5: States of Matter - Gases, Liquids, Solids
Chapter 6: Thermodynamics - Enthalpy, Entropy, Gibbs Energy
Chapter 7: Equilibrium - Chemical Equilibrium, Le Chatelier's Principle

Part 2:
Chapter 8: Redox Reactions - Oxidation, Reduction
Chapter 9: Hydrogen - Properties, Compounds of Hydrogen
Chapter 10: s-Block Elements - Alkali Metals, Alkaline Earth Metals
Chapter 11: p-Block Elements - Boron, Carbon Family
Chapter 12: Organic Chemistry - Hydrocarbons, Functional Groups
Chapter 13: Hydrocarbons - Alkanes, Alkenes, Alkynes
Chapter 14: Environmental Chemistry - Pollution, Green House Effect

Key Topics: Atomic Structure, Chemical Bonding, States of Matter, Organic Chemistry
""",
            "mathematics": """
NCERT Mathematics Class 11 Curriculum:

Chapter 1: Sets - Set Theory, Operations on Sets
Chapter 2: Relations and Functions - Types of Relations, Function Definition
Chapter 3: Trigonometric Functions - Trigonometric Ratios, Identities
Chapter 4: Principle of Mathematical Induction - Method of Proof
Chapter 5: Complex Numbers and Quadratic Equations - Imaginary Numbers
Chapter 6: Linear Inequalities - Solving Inequalities
Chapter 7: Permutations and Combinations - Arrangements and Selections
Chapter 8: Binomial Theorem - Binomial Expansion
Chapter 9: Sequences and Series - Arithmetic, Geometric Progressions
Chapter 10: Straight Lines - Equation of Line
Chapter 11: Conic Sections - Circle, Parabola, Ellipse, Hyperbola
Chapter 12: Introduction to Three Dimensional Geometry - Coordinate Geometry
Chapter 13: Limits and Derivatives - Introduction to Calculus
Chapter 14: Mathematical Reasoning - Statements, Connectives
Chapter 15: Statistics - Measures of Central Tendency
Chapter 16: Probability - Events, Probability Rules

Key Topics: Functions, Trigonometry, Coordinate Geometry, Calculus, Statistics
""",
            "biology": """
NCERT Biology Class 11 Curriculum:

Unit 1: Diversity in Living World
Chapter 1: The Living World - Classification, Nomenclature
Chapter 2: Biological Classification - Five Kingdom Classification
Chapter 3: Plant Kingdom - Plant Classification
Chapter 4: Animal Kingdom - Animal Classification

Unit 2: Structural Organisation in Animals and Plants
Chapter 5: Morphology of Flowering Plants - Root, Stem, Leaf, Flower
Chapter 6: Anatomy of Flowering Plants - Tissue Systems
Chapter 7: Structural Organisation in Animals - Tissues, Organ Systems

Unit 3: Cell Structure and Function
Chapter 8: Cell - The Unit of Life - Cell Theory
Chapter 9: Biomolecules - Carbohydrates, Proteins, Lipids
Chapter 10: Cell Cycle and Cell Division - Mitosis, Meiosis

Unit 4: Plant Physiology
Chapter 11: Transport in Plants - Water, Mineral Transport
Chapter 12: Mineral Nutrition - Essential Elements
Chapter 13: Photosynthesis in Higher Plants - Light Reactions
Chapter 14: Respiration in Plants - Aerobic, Anaerobic Respiration
Chapter 15: Plant Growth and Development - Hormones, Growth Regulators

Key Topics: Classification, Cell Biology, Plant Physiology, Animal Structure
"""
        }

        return curricula.get(subject, f"NCERT {subject.title()} Class {grade} Curriculum")

    def _process_chapter_data(self, chapter: Dict, topic: Optional[str], language: str) -> Optional[str]:
        """Process individual chapter data and return formatted info"""
        try:
            # Handle different chapter data structures
            if 'title' in chapter:
                chapter_title = chapter['title']
            elif 'filename' in chapter:
                chapter_title = chapter['filename'].replace('.pdf', '').replace('_', ' ').title()
            else:
                chapter_title = f"Chapter {chapter.get('chapter_number', 'Unknown')}"

            # Skip if title is too generic or malformed
            if len(chapter_title) < 3 or 'CONTENT' in chapter_title.upper():
                return None

            chapter_info = f"Chapter: {chapter_title}"

            # Check if this chapter matches the topic
            topic_match = False
            if topic:
                topic_match = (topic.lower() in chapter_title.lower() or
                             any(topic.lower() in section.get('title', '').lower()
                                 for section in chapter.get('sections', [])))

            if topic_match or not topic:
                # Include detailed info for matching topic or all if no specific topic
                if 'sections' in chapter and chapter['sections']:
                    valid_sections = [s.get('title', '') for s in chapter['sections'][:5]
                                    if s.get('title') and len(s.get('title', '')) > 3]
                    if valid_sections:
                        chapter_info += f"\nSections: {', '.join(valid_sections)}"

                # Add content if available
                if 'sections' in chapter:
                    content_parts = []
                    for section in chapter['sections'][:3]:
                        if section.get('content') and len(section.get('content', '')) > 10:
                            content_parts.append(section['content'][:200])

                    if content_parts:
                        chapter_info += f"\nContent Preview: {' ... '.join(content_parts)}"

                return chapter_info

            return None

        except Exception as e:
            logger.error(f"Error processing chapter data: {e}")
            return None

    def _get_default_ncert_context(self, grade: int, subject: str, topic: Optional[str] = None) -> str:
        """Fallback method for getting NCERT context when language-specific data is not available"""
        context_parts = []

        # Get grade-specific data
        grade_key = f'grade_{grade}'
        if grade_key in self.ncert_data and subject in self.ncert_data[grade_key]:
            subject_data = self.ncert_data[grade_key][subject]

            if 'chapters' in subject_data:
                chapters_data = subject_data['chapters']
                context_parts.append(f"Grade {grade} {subject.title()} Content:")

                # Handle both PDF-extracted and manual data structures
                if 'chapters' in chapters_data:
                    chapters_list = chapters_data['chapters']
                else:
                    chapters_list = chapters_data.get('chapters', [])

                for chapter in chapters_list:
                    # Handle different chapter data structures
                    if 'title' in chapter:
                        chapter_title = chapter['title']
                    elif 'filename' in chapter:
                        chapter_title = chapter['filename'].replace('.pdf', '').replace('_', ' ').title()
                    else:
                        chapter_title = f"Chapter {chapter.get('chapter_number', 'Unknown')}"

                    chapter_info = f"Chapter: {chapter_title}"

                    # Check if this chapter matches the topic
                    topic_match = (topic and
                                 (topic.lower() in chapter_title.lower() or
                                  any(topic.lower() in section.get('title', '').lower()
                                      for section in chapter.get('sections', []))))

                    if topic_match or not topic:
                        # Include detailed info for matching topic or all if no specific topic
                        if 'sections' in chapter and chapter['sections']:
                            section_titles = [s.get('title', '') for s in chapter['sections'][:5]]
                            chapter_info += f"\nSections: {', '.join(filter(None, section_titles))}"

                        if 'key_concepts' in chapter and chapter['key_concepts']:
                            chapter_info += f"\nKey Concepts: {', '.join(chapter['key_concepts'][:10])}"
                        elif 'topics' in chapter and chapter['topics']:
                            chapter_info += f"\nTopics: {', '.join(chapter['topics'][:10])}"

                        if 'examples' in chapter and chapter['examples']:
                            chapter_info += f"\nExamples Available: {len(chapter['examples'])}"

                        if 'exercises' in chapter and chapter['exercises']:
                            chapter_info += f"\nExercise Questions: {len(chapter['exercises'])}"

                    context_parts.append(chapter_info)

        return "\n\n".join(context_parts)
    
    def generate_quiz(self, input_data: Dict) -> Dict:
        """Generate quiz using Gemini API with NCERT context and language support"""
        try:
            # Extract parameters
            subject = input_data.get('subject', '')
            topic = input_data.get('topic', '')
            grade = input_data.get('grade', 10)
            question_count = input_data.get('questionCount', 10)
            difficulty = input_data.get('difficulty', 'medium')
            question_types = input_data.get('questionTypes', ['mcq'])
            language = input_data.get('language', 'english').lower()

            # Normalize subject for processing
            normalized_subject = self._normalize_subject(subject, language)

            # Get NCERT context with language support
            ncert_context = self.get_ncert_context(grade, normalized_subject, topic, language)

            # Create prompt with language support
            prompt = self._create_quiz_prompt(
                subject, topic, grade, question_count,
                difficulty, question_types, ncert_context, language
            )

            # Generate using Gemini
            model = self.models.get('quiz_generation')
            if not model:
                raise ValueError("Quiz generation model not initialized")

            response = model.generate_content(prompt)

            # Parse response
            quiz_data = self._parse_quiz_response(
                response.text, subject, topic, grade, difficulty, language
            )

            return {
                "success": True,
                "data": quiz_data,
                "generated_at": datetime.now().isoformat(),
                "model": "gemini-1.5-flash",
                "ncert_aligned": True,
                "language": language
            }

        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _create_quiz_prompt(self, subject: str, topic: str, grade: int,
                          question_count: int, difficulty: str,
                          question_types: List[str], ncert_context: str, language: str = "english") -> str:
        """Create detailed prompt for quiz generation with language support"""

        # Language-specific instructions
        language_instructions = {
            "english": {
                "instruction": "Generate all content in English only",
                "format_note": "Use English for all questions, options, explanations, and JSON keys. Do not mix languages.",
                "sample_question": "What is the velocity of an object moving at constant speed?",
                "sample_options": ["10 m/s", "20 m/s", "30 m/s", "40 m/s"]
            },
            "hindi": {
                "instruction": "Generate all content in Hindi only (केवल हिन्दी में सभी सामग्री तैयार करें)",
                "format_note": "Use Hindi (Devanagari script) for all questions, options, and explanations. Keep JSON structure in English but content in Hindi.",
                "sample_question": "स्थिर गति से चलने वाली वस्तु का वेग क्या है?",
                "sample_options": ["10 मी/से", "20 मी/से", "30 मी/से", "40 मी/से"]
            },
            "en": {
                "instruction": "Generate all content in English only",
                "format_note": "Use English for all questions, options, explanations, and JSON keys. Do not mix languages.",
                "sample_question": "What is the velocity of an object moving at constant speed?",
                "sample_options": ["10 m/s", "20 m/s", "30 m/s", "40 m/s"]
            },
            "hi": {
                "instruction": "Generate all content in Hindi only (केवल हिन्दी में सभी सामग्री तैयार करें)",
                "format_note": "Use Hindi (Devanagari script) for all questions, options, and explanations. Keep JSON structure in English but content in Hindi.",
                "sample_question": "स्थिर गति से चलने वाली वस्तु का वेग क्या है?",
                "sample_options": ["10 मी/से", "20 मी/से", "30 मी/से", "40 मी/से"]
            }
        }

        lang_config = language_instructions.get(language, language_instructions["english"])

        prompt = f"""
You are an expert NCERT-aligned educator. Generate a {difficulty} level quiz for Class {grade} students.

CRITICAL LANGUAGE REQUIREMENT: {lang_config["instruction"]}
{lang_config["format_note"]}

EXAMPLE FORMAT FOR {language.upper()}:
Question: {lang_config["sample_question"]}
Options: {lang_config["sample_options"]}

NCERT CONTEXT:
{ncert_context}

QUIZ REQUIREMENTS:
- Subject: {subject}
- Chapter: {topic}
- Class: {grade}
- Number of questions: {question_count}
- Difficulty: {difficulty}
- Question types: {', '.join(question_types)}
- Language: {language}

STRICT LANGUAGE RULES:
1. If language is "hindi" or "hi": ALL content must be in Hindi (Devanagari script)
2. If language is "english" or "en": ALL content must be in English
3. Do NOT mix languages in the same quiz
4. Technical terms can remain in English if commonly used that way
5. Units (m/s, kg, etc.) can remain in standard notation

CONTENT GUIDELINES:
1. All questions MUST be aligned with NCERT curriculum and textbooks
2. Use terminology and concepts exactly as presented in NCERT books
3. Ensure questions test conceptual understanding, not just memorization
4. Include a mix of direct questions and application-based problems
5. Reference specific NCERT chapter content when relevant

For each question, provide:
1. Question text (clear and unambiguous in specified language)
2. Question type (mcq, true_false, short_answer, numerical)
3. For MCQ: 4 options with one correct answer (in specified language)
4. For True/False: statement with correct answer (in specified language)
5. For Short Answer: expected answer length and key points
6. For Numerical: step-by-step solution approach
7. Points value (1-5 based on difficulty and complexity)
8. Detailed explanation referencing NCERT content (in specified language)
9. NCERT chapter/section reference if applicable

OUTPUT FORMAT:
Return a valid JSON object with the following structure:
{{
    "title": "Quiz title in {language}",
    "subject": "{subject}",
    "topic": "{topic}",
    "grade": {grade},
    "difficulty": "{difficulty}",
    "language": "{language}",
    "questions": [
        {{
            "question": "Question text in {language}",
            "type": "question_type",
            "options": ["option1 in {language}", "option2 in {language}", "option3 in {language}", "option4 in {language}"],
            "correct_answer": "correct option in {language}",
            "points": 1-5,
            "explanation": "Detailed explanation in {language}",
            "ncert_reference": "Chapter X, Section Y",
            "bloom_level": "remember/understand/apply/analyze"
        }}
    ],
    "total_points": "sum of all question points",
    "estimated_time": "estimated time in minutes",
    "ncert_alignment": true
}}

REMEMBER: Generate ALL content in {language} language only. Do not mix languages.

Generate the quiz now:
"""
        return prompt
    
    def _parse_quiz_response(self, response_text: str, subject: str,
                           topic: str, grade: int, difficulty: str, language: str = "english") -> Dict:
        """Parse Gemini response into structured quiz format with language support"""
        try:
            # Try to parse as JSON first
            if response_text.strip().startswith('{'):
                quiz_data = json.loads(response_text)
                # Ensure language is set
                quiz_data["language"] = language
                return quiz_data

            # If not JSON, extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start != -1 and json_end != -1:
                json_text = response_text[json_start:json_end]
                quiz_data = json.loads(json_text)
                # Ensure language is set
                quiz_data["language"] = language
                return quiz_data

            # Fallback: create structured quiz from text
            return self._create_fallback_quiz(response_text, subject, topic, grade, difficulty, language)

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            return self._create_fallback_quiz(response_text, subject, topic, grade, difficulty, language)
    
    def _create_fallback_quiz(self, text: str, subject: str, topic: str,
                            grade: int, difficulty: str, language: str = "english") -> Dict:
        """Create fallback quiz structure when parsing fails"""

        # Normalize language
        lang_key = "hindi" if language.lower() in ["hi", "hindi"] else "english"

        # Language-specific fallback content
        fallback_content = {
            "english": {
                "title": f"Class {grade} {subject.title()} Quiz: {topic}",
                "question": f"What is the main concept in {topic}?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "explanation": "This tests basic understanding of the concept.",
                "reference": f"Class {grade} {subject} textbook"
            },
            "hindi": {
                "title": f"कक्षा {grade} {self._get_subject_hindi(subject)} प्रश्नोत्तरी: {topic}",
                "question": f"{topic} में मुख्य अवधारणा क्या है?",
                "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
                "explanation": "यह अवधारणा की बुनियादी समझ का परीक्षण करता है।",
                "reference": f"कक्षा {grade} {self._get_subject_hindi(subject)} पाठ्यपुस्तक"
            }
        }

        content = fallback_content.get(lang_key, fallback_content["english"])

        return {
            "title": content["title"],
            "subject": subject,
            "topic": topic,
            "grade": grade,
            "difficulty": difficulty,
            "language": language,
            "questions": [
                {
                    "question": content["question"],
                    "type": "mcq",
                    "options": content["options"],
                    "correct_answer": content["options"][0],
                    "points": 1,
                    "explanation": content["explanation"],
                    "ncert_reference": content["reference"],
                    "bloom_level": "understand"
                }
            ],
            "total_points": 1,
            "estimated_time": 5,
            "ncert_alignment": True
        }

    def _get_subject_hindi(self, subject: str) -> str:
        """Get Hindi name for subject"""
        subject_mapping = {
            "physics": "भौतिक विज्ञान",
            "chemistry": "रसायन विज्ञान",
            "mathematics": "गणित",
            "biology": "जीव विज्ञान",
            "economics": "अर्थशास्त्र",
            "भौतिक विज्ञान": "भौतिक विज्ञान",
            "रसायन विज्ञान": "रसायन विज्ञान",
            "गणित": "गणित",
            "जीव विज्ञान": "जीव विज्ञान",
            "अर्थशास्त्र": "अर्थशास्त्र"
        }
        return subject_mapping.get(subject.lower(), subject)

    def _normalize_subject(self, subject: str, language: str) -> str:
        """Normalize subject name for consistent processing"""
        # Subject mapping for both directions
        subject_mapping = {
            # English to English (normalized)
            "physics": "physics",
            "chemistry": "chemistry",
            "mathematics": "mathematics",
            "biology": "biology",
            "economics": "economics",
            # Hindi to English
            "भौतिक विज्ञान": "physics",
            "रसायन विज्ञान": "chemistry",
            "गणित": "mathematics",
            "जीव विज्ञान": "biology",
            "अर्थशास्त्र": "economics"
        }

        normalized = subject_mapping.get(subject.lower(), subject.lower())
        return normalized
    
    def generate_curriculum(self, input_data: Dict) -> Dict:
        """Generate curriculum using Gemini API with NCERT alignment"""
        try:
            subject = input_data.get('subject', '')
            grade = input_data.get('grade', 10)
            duration = input_data.get('duration', '1 semester')
            
            # Get NCERT context
            ncert_context = self.get_ncert_context(grade, subject)
            
            prompt = f"""
You are an expert NCERT curriculum designer. Create a comprehensive curriculum plan.

NCERT CONTEXT:
{ncert_context}

CURRICULUM REQUIREMENTS:
- Subject: {subject}
- Grade: {grade}
- Duration: {duration}

Create a detailed curriculum that:
1. Follows NCERT guidelines and sequence
2. Covers all mandatory topics for the grade
3. Includes learning objectives aligned with NCERT outcomes
4. Provides assessment strategies
5. Suggests teaching methodologies
6. Includes timeline and pacing

Return a structured JSON response with curriculum details.
"""
            
            model = self.models.get('curriculum_generation')
            response = model.generate_content(prompt)
            
            return {
                "success": True,
                "data": self._parse_curriculum_response(response.text),
                "generated_at": datetime.now().isoformat(),
                "model": "gemini-1.5-pro",
                "ncert_aligned": True
            }
            
        except Exception as e:
            logger.error(f"Error generating curriculum: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _parse_curriculum_response(self, response_text: str) -> Dict:
        """Parse curriculum response"""
        try:
            # Try to parse as JSON
            if response_text.strip().startswith('{'):
                return json.loads(response_text)
            
            # Extract JSON if embedded
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_text = response_text[json_start:json_end]
                return json.loads(json_text)
            
            # Fallback structure
            return {
                "title": "NCERT Aligned Curriculum",
                "description": response_text[:500] + "...",
                "modules": [],
                "assessment_plan": {},
                "resources": []
            }
            
        except Exception as e:
            logger.error(f"Error parsing curriculum response: {e}")
            return {"error": "Failed to parse curriculum response"}
    
    def grade_answer(self, input_data: Dict) -> Dict:
        """Grade student answers using Gemini API"""
        try:
            question = input_data.get('question', '')
            student_answer = input_data.get('student_answer', '')
            correct_answer = input_data.get('correct_answer', '')
            subject = input_data.get('subject', '')
            grade = input_data.get('grade', 10)
            max_points = input_data.get('max_points', 5)
            
            # Get NCERT context for grading criteria
            ncert_context = self.get_ncert_context(grade, subject)
            
            prompt = f"""
You are an expert NCERT-aligned teacher grading student responses.

GRADING CONTEXT:
Subject: {subject}
Grade: {grade}
Max Points: {max_points}

NCERT REFERENCE:
{ncert_context[:1000]}...

QUESTION: {question}

CORRECT ANSWER: {correct_answer}

STUDENT ANSWER: {student_answer}

Grade the student's answer based on:
1. Accuracy of content
2. Use of correct terminology
3. Completeness of response
4. Understanding demonstrated
5. NCERT alignment

Provide:
- Score (0 to {max_points})
- Detailed feedback
- Areas for improvement
- NCERT references for further study

Return as JSON:
{{
    "score": 0-{max_points},
    "feedback": "detailed feedback",
    "strengths": ["strength1", "strength2"],
    "improvements": ["area1", "area2"],
    "ncert_references": ["reference1", "reference2"]
}}
"""
            
            model = self.models.get('grading')
            response = model.generate_content(prompt)
            
            return {
                "success": True,
                "data": self._parse_grading_response(response.text),
                "generated_at": datetime.now().isoformat(),
                "model": "gemini-1.5-flash"
            }
            
        except Exception as e:
            logger.error(f"Error grading answer: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _parse_grading_response(self, response_text: str) -> Dict:
        """Parse grading response"""
        try:
            if response_text.strip().startswith('{'):
                return json.loads(response_text)
            
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_text = response_text[json_start:json_end]
                return json.loads(json_text)
            
            # Fallback
            return {
                "score": 0,
                "feedback": "Unable to process grading response",
                "strengths": [],
                "improvements": ["Please review the answer"],
                "ncert_references": []
            }
            
        except Exception as e:
            logger.error(f"Error parsing grading response: {e}")
            return {
                "score": 0,
                "feedback": "Grading error occurred",
                "strengths": [],
                "improvements": [],
                "ncert_references": []
            }
    
    def generate_content(self, input_data: Dict) -> Dict:
        """Generate educational content using Gemini API"""
        try:
            content_type = input_data.get('type', 'explanation')
            subject = input_data.get('subject', '')
            topic = input_data.get('topic', '')
            grade = input_data.get('grade', 10)
            
            # Get NCERT context
            ncert_context = self.get_ncert_context(grade, subject, topic)
            
            prompt = f"""
Generate {content_type} content for NCERT-aligned education.

NCERT CONTEXT:
{ncert_context}

CONTENT REQUEST:
- Type: {content_type}
- Subject: {subject}
- Topic: {topic}
- Grade: {grade}

Create content that:
1. Aligns with NCERT curriculum
2. Uses appropriate language for grade level
3. Includes examples and illustrations
4. Provides clear explanations
5. References NCERT textbook content

Generate comprehensive {content_type} content now.
"""
            
            model = self.models.get('content_generation')
            response = model.generate_content(prompt)
            
            return {
                "success": True,
                "data": {
                    "content": response.text,
                    "type": content_type,
                    "subject": subject,
                    "topic": topic,
                    "grade": grade,
                    "ncert_aligned": True
                },
                "generated_at": datetime.now().isoformat(),
                "model": "gemini-1.5-pro"
            }
            
        except Exception as e:
            logger.error(f"Error generating content: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    def generate_lecture_plan(self, input_data: Dict) -> Dict:
        """Generate comprehensive lecture plan using Gemini API with NCERT alignment"""
        try:
            # Extract parameters
            subject = input_data.get('subject', '')
            topic = input_data.get('topic', '')
            grade = input_data.get('grade', '10')
            duration = input_data.get('duration', 60)
            learning_objectives = input_data.get('learningObjectives', [])
            difficulty = input_data.get('difficulty', 'intermediate')
            teaching_strategies = input_data.get('teachingStrategies', [])
            language = input_data.get('language', 'en')

            logger.info(f"Generating lecture plan for {subject} - {topic} (Grade {grade})")

            # Get NCERT context
            context = self.get_ncert_context(grade, subject, topic, language)

            # Build comprehensive prompt for lecture plan generation
            prompt = self._build_lecture_plan_prompt(
                subject, topic, grade, duration, learning_objectives,
                difficulty, teaching_strategies, language, context
            )

            # Generate using appropriate model
            model = self.models.get('curriculum_generation', self.models.get('content_generation'))
            if not model:
                raise Exception("No suitable model available for lecture plan generation")

            response = model.generate_content(prompt)

            if not response or not response.text:
                raise Exception("Empty response from Gemini API")

            # Parse and structure the response
            lecture_plan_data = self._parse_lecture_plan_response(response.text, input_data)

            return {
                "success": True,
                "data": lecture_plan_data,
                "model": "gemini-1.5-pro"
            }

        except Exception as e:
            logger.error(f"Error generating lecture plan: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    def generate_slides(self, input_data: Dict) -> Dict:
        """Generate presentation slides using Gemini API with NCERT alignment"""
        try:
            # Extract parameters
            subject = input_data.get('subject', '')
            topic = input_data.get('topic', '')
            grade = input_data.get('grade', '10')
            slide_count = input_data.get('slideCount', 10)
            theme = input_data.get('theme', 'default')
            template = input_data.get('template', 'education')
            difficulty = input_data.get('difficulty', 'intermediate')
            language = input_data.get('language', 'en')
            include_images = input_data.get('includeImages', False)

            logger.info(f"Generating {slide_count} slides for {subject} - {topic} (Grade {grade})")

            # Get NCERT context
            context = self.get_ncert_context(int(grade), subject, topic, language)

            # Build prompt for slide generation
            prompt = self._build_slides_prompt(
                subject, topic, grade, slide_count, theme, template,
                difficulty, language, include_images, context
            )

            # Get appropriate model
            model = self.models.get('curriculum_generation', self.models.get('content_generation'))
            if not model:
                raise Exception("No suitable model available for slide generation")

            # Generate slides
            response = model.generate_content(prompt)

            # Parse response
            slides_data = self._parse_slides_response(response.text, input_data)

            # Validate structure
            if not self._validate_slides_structure(slides_data):
                logger.warning("Generated slides structure validation failed, using fallback")
                slides_data = self._create_fallback_slides(input_data)

            return {
                "success": True,
                "data": slides_data,
                "model": "gemini-1.5-pro"
            }

        except Exception as e:
            logger.error(f"Error generating slides: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    def _build_lecture_plan_prompt(self, subject: str, topic: str, grade: str, duration: int,
                                 learning_objectives: List[str], difficulty: str,
                                 teaching_strategies: List[str], language: str, context: str) -> str:
        """Build comprehensive prompt for lecture plan generation"""

        # Language-specific instructions
        lang_instruction = ""
        if language == "hi":
            lang_instruction = "Generate the lecture plan in Hindi language. Use Devanagari script for all content."
        else:
            lang_instruction = "Generate the lecture plan in English language."

        # Format learning objectives
        objectives_text = ""
        if learning_objectives:
            objectives_text = f"Focus on these learning objectives: {', '.join(learning_objectives)}"

        # Format teaching strategies
        strategies_text = ""
        if teaching_strategies:
            strategies_text = f"Use these teaching strategies: {', '.join(teaching_strategies)}"

        prompt = f"""
You are an expert educator creating a comprehensive lecture plan for NCERT curriculum.

CONTEXT:
{context}

REQUIREMENTS:
- Subject: {subject}
- Topic: {topic}
- Grade: {grade}
- Duration: {duration} minutes
- Difficulty Level: {difficulty}
{objectives_text}
{strategies_text}

{lang_instruction}

Create a detailed lecture plan with the following structure in JSON format:

{{
    "title": "Engaging title for the lesson",
    "description": "Brief description of what students will learn",
    "learningObjectives": [
        {{
            "objective": "Clear, measurable learning objective",
            "bloomsLevel": "remember|understand|apply|analyze|evaluate|create"
        }}
    ],
    "prerequisites": ["List of prerequisite knowledge/skills"],
    "keyVocabulary": [
        {{
            "term": "Key term",
            "definition": "Clear definition",
            "example": "Example usage"
        }}
    ],
    "durationBreakdown": {{
        "introduction": {int(duration * 0.1)},
        "mainContent": {int(duration * 0.7)},
        "activities": {int(duration * 0.15)},
        "conclusion": {int(duration * 0.05)}
    }},
    "structure": {{
        "openingHook": "Engaging way to start the lesson",
        "introduction": "Introduction content and objectives",
        "mainContent": [
            {{
                "section": "Section title",
                "content": "Detailed content to cover",
                "duration": "time in minutes",
                "teachingStrategy": "Strategy to use"
            }}
        ],
        "conclusion": "Summary and key takeaways",
        "homework": "Assignment for students",
        "nextLesson": "Preview of next lesson"
    }},
    "activities": [
        {{
            "title": "Activity name",
            "type": "introduction|explanation|demonstration|practice|discussion|assessment|summary",
            "duration": "time in minutes",
            "description": "What students will do",
            "materials": ["Required materials"],
            "instructions": "Step-by-step instructions",
            "grouping": "individual|pairs|small_groups|whole_class",
            "differentiation": {{
                "forAdvanced": "Modifications for advanced students",
                "forStruggling": "Support for struggling students",
                "forELL": "Support for English language learners"
            }}
        }}
    ],
    "resources": [
        {{
            "title": "Resource name",
            "type": "textbook|video|website|handout|equipment",
            "description": "Description of resource",
            "url": "URL if applicable",
            "required": true
        }}
    ],
    "assessments": [
        {{
            "title": "Assessment name",
            "type": "formative|summative|diagnostic",
            "description": "What will be assessed",
            "method": "observation|quiz|project|discussion",
            "criteria": ["Assessment criteria"],
            "timing": "when during lesson"
        }}
    ],
    "teachingStrategies": ["List of strategies used"],
    "differentiation": {{
        "forAdvanced": "Overall modifications for advanced learners",
        "forStruggling": "Overall support strategies",
        "forELL": "Language support strategies"
    }},
    "technology": ["Technology tools to be used"],
    "safety": {{
        "considerations": ["Safety considerations if applicable"],
        "procedures": ["Safety procedures"]
    }},
    "standards": ["Relevant curriculum standards"],
    "tags": ["Relevant tags for categorization"]
}}

Ensure the lecture plan is:
1. Age-appropriate for Grade {grade}
2. Aligned with NCERT curriculum
3. Engaging and interactive
4. Includes diverse teaching methods
5. Provides clear assessment opportunities
6. Considers different learning styles
7. Includes proper time management

Generate ONLY the JSON response without any additional text or formatting.
"""
        return prompt.strip()

    def _parse_lecture_plan_response(self, response_text: str, input_data: Dict) -> Dict:
        """Parse and validate lecture plan response from Gemini"""
        try:
            # Clean the response text
            cleaned_text = response_text.strip()

            # Remove any markdown formatting
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]

            cleaned_text = cleaned_text.strip()

            # Parse JSON
            lecture_plan = json.loads(cleaned_text)

            # Validate and enhance the structure
            validated_plan = self._validate_lecture_plan_structure(lecture_plan, input_data)

            return validated_plan

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            return self._create_fallback_lecture_plan(response_text, input_data)

    def _validate_lecture_plan_structure(self, plan: Dict, input_data: Dict) -> Dict:
        """Validate and ensure proper lecture plan structure"""
        subject = input_data.get('subject', '')
        topic = input_data.get('topic', '')
        grade = input_data.get('grade', '10')
        duration = input_data.get('duration', 60)

        # Ensure required fields exist
        validated = {
            "title": plan.get("title", f"{topic} - {subject} Lesson Plan"),
            "description": plan.get("description", f"Comprehensive lesson on {topic} for Grade {grade}"),
            "learningObjectives": plan.get("learningObjectives", [
                {
                    "objective": f"Students will understand the key concepts of {topic}",
                    "bloomsLevel": "understand"
                }
            ]),
            "prerequisites": plan.get("prerequisites", []),
            "keyVocabulary": plan.get("keyVocabulary", []),
            "durationBreakdown": plan.get("durationBreakdown", {
                "introduction": int(duration * 0.1),
                "mainContent": int(duration * 0.7),
                "activities": int(duration * 0.15),
                "conclusion": int(duration * 0.05)
            }),
            "structure": plan.get("structure", {
                "openingHook": f"Engaging introduction to {topic}",
                "introduction": f"Overview of {topic} and learning objectives",
                "mainContent": [
                    {
                        "section": f"Core Concepts of {topic}",
                        "content": f"Detailed explanation of {topic}",
                        "duration": int(duration * 0.7),
                        "teachingStrategy": "Direct instruction with examples"
                    }
                ],
                "conclusion": f"Summary of key points about {topic}",
                "homework": f"Practice exercises on {topic}",
                "nextLesson": "Preview of upcoming topics"
            }),
            "activities": plan.get("activities", []),
            "resources": plan.get("resources", []),
            "assessments": plan.get("assessments", []),
            "teachingStrategies": plan.get("teachingStrategies", ["Direct instruction", "Interactive discussion"]),
            "differentiation": plan.get("differentiation", {}),
            "technology": plan.get("technology", []),
            "safety": plan.get("safety", {"considerations": [], "procedures": []}),
            "standards": plan.get("standards", []),
            "tags": plan.get("tags", [subject.lower(), topic.lower(), f"grade-{grade}"])
        }

        return validated

    def _create_fallback_lecture_plan(self, text: str, input_data: Dict) -> Dict:
        """Create fallback lecture plan structure when parsing fails"""
        subject = input_data.get('subject', '')
        topic = input_data.get('topic', '')
        grade = input_data.get('grade', '10')
        duration = input_data.get('duration', 60)

        return {
            "title": f"{topic} - {subject} Lesson Plan",
            "description": f"Comprehensive lesson on {topic} for Grade {grade}",
            "learningObjectives": [
                {
                    "objective": f"Students will understand the key concepts of {topic}",
                    "bloomsLevel": "understand"
                },
                {
                    "objective": f"Students will be able to apply {topic} concepts",
                    "bloomsLevel": "apply"
                }
            ],
            "prerequisites": [f"Basic understanding of {subject} concepts"],
            "keyVocabulary": [
                {
                    "term": topic,
                    "definition": f"Key concept in {subject}",
                    "example": f"Example related to {topic}"
                }
            ],
            "durationBreakdown": {
                "introduction": int(duration * 0.1),
                "mainContent": int(duration * 0.7),
                "activities": int(duration * 0.15),
                "conclusion": int(duration * 0.05)
            },
            "structure": {
                "openingHook": f"Engaging introduction to {topic}",
                "introduction": f"Today we will explore {topic} in {subject}",
                "mainContent": [
                    {
                        "section": f"Understanding {topic}",
                        "content": f"Core concepts and principles of {topic}",
                        "duration": int(duration * 0.4),
                        "teachingStrategy": "Direct instruction with examples"
                    },
                    {
                        "section": f"Applications of {topic}",
                        "content": f"Real-world applications and examples",
                        "duration": int(duration * 0.3),
                        "teachingStrategy": "Interactive discussion"
                    }
                ],
                "conclusion": f"Summary of key points about {topic}",
                "homework": f"Complete practice exercises on {topic}",
                "nextLesson": "Building on today's concepts"
            },
            "activities": [
                {
                    "title": f"Exploring {topic}",
                    "type": "practice",
                    "duration": int(duration * 0.15),
                    "description": f"Hands-on activity to understand {topic}",
                    "materials": ["Textbook", "Notebook", "Pen"],
                    "instructions": f"Work through examples related to {topic}",
                    "grouping": "pairs",
                    "differentiation": {
                        "forAdvanced": "Additional challenging problems",
                        "forStruggling": "Simplified examples with guidance",
                        "forELL": "Visual aids and simplified language"
                    }
                }
            ],
            "resources": [
                {
                    "title": f"NCERT {subject} Textbook",
                    "type": "textbook",
                    "description": f"Official textbook for Grade {grade}",
                    "url": "",
                    "required": True
                }
            ],
            "assessments": [
                {
                    "title": "Understanding Check",
                    "type": "formative",
                    "description": f"Quick assessment of {topic} understanding",
                    "method": "quiz",
                    "criteria": ["Accuracy", "Understanding", "Application"],
                    "timing": "End of lesson"
                }
            ],
            "teachingStrategies": ["Direct instruction", "Interactive discussion", "Hands-on activities"],
            "differentiation": {
                "forAdvanced": "Extended activities and challenging problems",
                "forStruggling": "Additional support and simplified explanations",
                "forELL": "Visual aids and language support"
            },
            "technology": ["Projector", "Interactive whiteboard"],
            "safety": {
                "considerations": [],
                "procedures": []
            },
            "standards": [f"NCERT {subject} Grade {grade} standards"],
            "tags": [subject.lower(), topic.lower(), f"grade-{grade}", "ncert"]
        }

    def _build_slides_prompt(self, subject: str, topic: str, grade: str, slide_count: int,
                           theme: str, template: str, difficulty: str, language: str,
                           include_images: bool, context: str) -> str:
        """Build prompt for slide generation"""

        language_instruction = "in Hindi" if language.lower() in ['hi', 'hindi'] else "in English"

        prompt = f"""
You are an expert educational presentation designer. Create a {slide_count}-slide presentation on "{topic}" for {subject} Grade {grade} students {language_instruction}.

NCERT Context:
{context}

Requirements:
- Topic: {topic}
- Subject: {subject}
- Grade: {grade}
- Number of slides: {slide_count}
- Difficulty: {difficulty}
- Theme: {theme}
- Template: {template}
- Language: {language_instruction}

Create a comprehensive slide deck with the following structure in JSON format:

{{
    "title": "Presentation title",
    "description": "Brief description of the presentation",
    "slides": [
        {{
            "slideNumber": 1,
            "title": "Slide title",
            "content": "Main content for the slide",
            "bulletPoints": ["Key point 1", "Key point 2"],
            "layout": "title|content|two_column|image_content|bullet_points|conclusion",
            "notes": "Speaker notes for this slide",
            "images": [
                {{
                    "description": "Image description",
                    "caption": "Image caption",
                    "placement": "center|left|right"
                }}
            ] if include_images else [],
            "animations": [],
            "duration": "estimated time in minutes"
        }}
    ],
    "totalDuration": "total presentation time",
    "learningObjectives": ["What students will learn"],
    "keyTakeaways": ["Main points to remember"],
    "nextSteps": "What to do after this presentation",
    "resources": ["Additional resources"],
    "tags": ["{subject.lower()}", "{topic.lower()}", "grade-{grade}"]
}}

Make the content:
1. Age-appropriate for Grade {grade} students
2. Aligned with NCERT curriculum
3. Engaging and interactive
4. Clear and well-structured
5. Include practical examples and applications

Ensure each slide has a clear purpose and flows logically to the next.
"""

        return prompt

    def _parse_slides_response(self, response_text: str, input_data: Dict) -> Dict:
        """Parse slides response from Gemini"""
        try:
            # Clean the response text
            cleaned_text = response_text.strip()
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]

            # Parse JSON
            slides_data = json.loads(cleaned_text)

            # Ensure required fields
            if 'slides' not in slides_data:
                slides_data['slides'] = []

            # Add metadata
            slides_data.update({
                'subject': input_data.get('subject', ''),
                'topic': input_data.get('topic', ''),
                'grade': input_data.get('grade', ''),
                'theme': input_data.get('theme', 'default'),
                'template': input_data.get('template', 'education'),
                'generatedAt': datetime.now().isoformat(),
                'slideCount': len(slides_data.get('slides', []))
            })

            return slides_data

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error in slides response: {e}")
            return self._create_fallback_slides(input_data)
        except Exception as e:
            logger.error(f"Error parsing slides response: {e}")
            return self._create_fallback_slides(input_data)

    def _validate_slides_structure(self, slides_data: Dict) -> bool:
        """Validate slides structure"""
        try:
            required_fields = ['title', 'slides']
            for field in required_fields:
                if field not in slides_data:
                    return False

            # Check slides array
            slides = slides_data.get('slides', [])
            if not isinstance(slides, list) or len(slides) == 0:
                return False

            # Check each slide
            for slide in slides:
                if not isinstance(slide, dict):
                    return False
                if 'title' not in slide or 'content' not in slide:
                    return False

            return True

        except Exception as e:
            logger.error(f"Error validating slides structure: {e}")
            return False

    def _create_fallback_slides(self, input_data: Dict) -> Dict:
        """Create fallback slides when generation fails"""
        subject = input_data.get('subject', 'Subject')
        topic = input_data.get('topic', 'Topic')
        grade = input_data.get('grade', '10')
        slide_count = input_data.get('slideCount', 5)

        slides = []
        for i in range(slide_count):
            if i == 0:
                slides.append({
                    "slideNumber": 1,
                    "title": f"{topic} - Introduction",
                    "content": f"Welcome to our lesson on {topic}",
                    "bulletPoints": [f"Overview of {topic}", "Learning objectives", "Key concepts"],
                    "layout": "title",
                    "notes": f"Introduce the topic of {topic} to Grade {grade} students",
                    "duration": "3 minutes"
                })
            elif i == slide_count - 1:
                slides.append({
                    "slideNumber": i + 1,
                    "title": "Summary and Conclusion",
                    "content": f"Key takeaways from {topic}",
                    "bulletPoints": ["Review main concepts", "Questions for discussion", "Next steps"],
                    "layout": "conclusion",
                    "notes": "Summarize the lesson and engage students",
                    "duration": "5 minutes"
                })
            else:
                slides.append({
                    "slideNumber": i + 1,
                    "title": f"{topic} - Part {i}",
                    "content": f"Content about {topic}",
                    "bulletPoints": ["Key concept", "Example", "Application"],
                    "layout": "content",
                    "notes": f"Explain this aspect of {topic}",
                    "duration": "4 minutes"
                })

        return {
            "title": f"{topic} - {subject} Grade {grade}",
            "description": f"Educational presentation on {topic}",
            "slides": slides,
            "totalDuration": f"{slide_count * 4} minutes",
            "learningObjectives": [f"Understand {topic}", f"Apply {topic} concepts"],
            "keyTakeaways": [f"Main concepts of {topic}"],
            "subject": subject,
            "topic": topic,
            "grade": grade,
            "slideCount": len(slides),
            "generatedAt": datetime.now().isoformat(),
            "tags": [subject.lower(), topic.lower(), f"grade-{grade}"]
        }

# Example usage
if __name__ == "__main__":
    service = GeminiService()
    
    # Test quiz generation
    quiz_input = {
        "subject": "mathematics",
        "topic": "Quadratic Equations",
        "grade": 10,
        "questionCount": 5,
        "difficulty": "medium",
        "questionTypes": ["mcq", "short_answer"]
    }
    
    result = service.generate_quiz(quiz_input)
    print("Quiz Generation Result:")
    print(json.dumps(result, indent=2))