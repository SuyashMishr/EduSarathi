"""
NCERT PDF Content Extractor
Extracts text content from NCERT PDFs and structures it for AI processing
Enhanced version with better error handling and improved content analysis
"""

import PyPDF2
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
import time
import hashlib

# Configure logging with better formatting
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NCERTPDFExtractor:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.extracted_data = {}
        self.extraction_stats = {
            'total_files': 0,
            'successful_extractions': 0,
            'failed_extractions': 0,
            'start_time': None,
            'end_time': None
        }
        
        # Create cache directory for processed files
        self.cache_dir = self.data_dir / ".cache"
        self.cache_dir.mkdir(exist_ok=True)
        
    def extract_text_from_pdf(self, pdf_path: Path) -> str:
        """Extract text content from a PDF file"""
        try:
            text_content = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text.strip():
                            text_content += f"\n--- Page {page_num + 1} ---\n"
                            text_content += page_text
                    except Exception as e:
                        logger.warning(f"Error extracting page {page_num + 1} from {pdf_path}: {e}")
                        continue
                        
            return text_content
            
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {e}")
            return ""
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize extracted text with enhanced preprocessing"""
        if not text:
            return ""
        
        # Store original length for logging
        original_length = len(text)
        
        # Remove page markers but preserve structure
        text = re.sub(r'--- Page \d+ ---', '\n\n', text)
        
        # Fix common OCR and encoding issues
        ocr_fixes = {
            'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl',
            '"': '"', '"': '"', "'": "'", "'": "'",
            '–': '-', '—': '-', '…': '...',
            'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta',
            'θ': 'theta', 'λ': 'lambda', 'μ': 'mu', 'π': 'pi',
            '°': ' degrees', '²': '^2', '³': '^3'
        }
        
        for old, new in ocr_fixes.items():
            text = text.replace(old, new)
        
        # Clean up mathematical expressions
        text = re.sub(r'(\d)\s*×\s*(\d)', r'\1 × \2', text)  # Fix multiplication
        text = re.sub(r'(\d)\s*÷\s*(\d)', r'\1 ÷ \2', text)  # Fix division
        text = re.sub(r'(\d)\s*=\s*(\d)', r'\1 = \2', text)  # Fix equals
        
        # Remove excessive whitespace but preserve paragraph structure
        text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces/tabs to single space
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Multiple newlines to double
        
        # Remove common PDF artifacts
        text = re.sub(r'\f', '\n', text)  # Form feed to newline
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', text)  # Control chars
        
        # Fix broken words (common in PDF extraction)
        text = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', text)  # Hyphenated words across lines
        
        # Clean up chapter/section numbering
        text = re.sub(r'^(\d+\.?\d*)\s*$', r'\n\1\n', text, flags=re.MULTILINE)
        
        # Remove standalone numbers that are likely page numbers
        text = re.sub(r'^\s*\d{1,3}\s*$', '', text, flags=re.MULTILINE)
        
        cleaned_text = text.strip()
        
        # Log cleaning statistics
        if original_length > 0:
            reduction_percent = ((original_length - len(cleaned_text)) / original_length * 100)
            logger.debug(f"Text cleaning: {original_length} → {len(cleaned_text)} characters "
                        f"({reduction_percent:.1f}% reduction)")
        
        return cleaned_text
    
    def identify_chapter_structure(self, text: str, filename: str) -> Dict:
        """Identify chapter structure from text content"""
        chapter_data = {
            "filename": filename,
            "title": self.extract_chapter_title(text, filename),
            "sections": [],
            "key_concepts": [],
            "examples": [],
            "exercises": [],
            "full_text": text[:5000]  # Limit text size for storage
        }
        
        # Extract sections
        sections = self.extract_sections(text)
        chapter_data["sections"] = sections
        
        # Extract key concepts
        concepts = self.extract_key_concepts(text)
        chapter_data["key_concepts"] = concepts
        
        # Extract examples
        examples = self.extract_examples(text)
        chapter_data["examples"] = examples
        
        # Extract exercises
        exercises = self.extract_exercises(text)
        chapter_data["exercises"] = exercises
        
        return chapter_data
    
    def extract_chapter_title(self, text: str, filename: str) -> str:
        """Extract chapter title from text or filename"""
        # Try to find title in text first
        lines = text.split('\n')[:10]  # Check first 10 lines
        
        for line in lines:
            line = line.strip()
            if len(line) > 5 and len(line) < 100:
                # Check if line looks like a title
                if (line.isupper() or 
                    line.title() == line or 
                    re.match(r'^Chapter \d+', line, re.IGNORECASE)):
                    return line
        
        # Fallback to filename
        title = filename.replace('.pdf', '').replace('_', ' ').title()
        return title
    
    def extract_sections(self, text: str) -> List[Dict]:
        """Extract sections from chapter text"""
        sections = []
        
        # Look for section patterns
        section_patterns = [
            r'^\d+\.\d+\s+(.+)$',  # 1.1 Section Title
            r'^(\d+\.\d+\.\d+)\s+(.+)$',  # 1.1.1 Subsection
            r'^([A-Z][A-Z\s]+)$',  # ALL CAPS SECTIONS
        ]
        
        lines = text.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if line matches section pattern
            is_section = False
            for pattern in section_patterns:
                match = re.match(pattern, line)
                if match:
                    # Save previous section
                    if current_section:
                        sections.append({
                            "title": current_section,
                            "content": '\n'.join(current_content)[:1000]  # Limit content
                        })
                    
                    # Start new section
                    current_section = line
                    current_content = []
                    is_section = True
                    break
            
            if not is_section and current_section:
                current_content.append(line)
        
        # Add last section
        if current_section:
            sections.append({
                "title": current_section,
                "content": '\n'.join(current_content)[:1000]
            })
        
        return sections[:10]  # Limit to 10 sections
    
    def extract_key_concepts(self, text: str) -> List[str]:
        """Extract key concepts and terms"""
        concepts = []
        
        # Look for definition patterns
        definition_patterns = [
            r'(\w+)\s+is\s+defined\s+as',
            r'(\w+)\s+can\s+be\s+defined\s+as',
            r'The\s+(\w+)\s+is',
            r'(\w+):\s*[A-Z]',  # Term: Definition
        ]
        
        for pattern in definition_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    concept = match[0]
                else:
                    concept = match
                
                if len(concept) > 2 and concept.isalpha():
                    concepts.append(concept.title())
        
        # Remove duplicates and sort
        concepts = list(set(concepts))
        concepts.sort()
        
        return concepts[:15]  # Limit to top 15 concepts
    
    def extract_examples(self, text: str) -> List[Dict]:
        """Extract examples from text"""
        examples = []
        
        # Look for example patterns
        example_patterns = [
            r'Example\s+(\d+\.?\d*):?\s*(.+?)(?=Example|\n\n|$)',
            r'EXAMPLE\s+(\d+\.?\d*):?\s*(.+?)(?=EXAMPLE|\n\n|$)',
        ]
        
        for pattern in example_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            for match in matches:
                example_num, example_text = match
                examples.append({
                    "number": example_num,
                    "content": example_text.strip()[:300]  # Limit length
                })
        
        return examples[:5]  # Limit to 5 examples
    
    def extract_exercises(self, text: str) -> List[str]:
        """Extract exercise questions"""
        exercises = []
        
        # Look for exercise patterns
        exercise_patterns = [
            r'(\d+\.)\s+(.+?\?)',  # 1. Question?
            r'Q\.?\s*(\d+)\.?\s*(.+?\?)',  # Q.1 Question?
            r'Question\s+(\d+):?\s*(.+?\?)',  # Question 1: Question?
        ]
        
        for pattern in exercise_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple) and len(match) >= 2:
                    question = f"{match[0]} {match[1]}"
                    if len(question) > 10:  # Filter out very short matches
                        exercises.append(question.strip())
        
        return exercises[:8]  # Limit to 8 exercises
    
    def process_subject_by_language(self, subject: str, grade: int, language: str = "english") -> Dict:
        """Process all PDFs for a subject and grade in specified language"""
        # Map language codes to folder names
        language_folders = {
            "english": "English_books",
            "hindi": "Hindi_books",
            "en": "English_books",
            "hi": "Hindi_books"
        }

        # Map subject names to folder names
        subject_folders = {
            "physics": {"english": "Physics", "hindi": "भौतिक_विज्ञान"},
            "chemistry": {"english": "Chemistry", "hindi": "रसायन_विज्ञान"},
            "mathematics": {"english": "Maths", "hindi": "गणित"},
            "biology": {"english": "Biology", "hindi": "जीव_विज्ञान"},
            "economics": {"english": "Economics", "hindi": "अर्थशास्त्र"}
        }

        language_folder = language_folders.get(language.lower(), "English_books")

        # Get subject folder name based on language
        if subject.lower() in subject_folders:
            subject_folder = subject_folders[subject.lower()].get(language.lower(), subject.title())
        else:
            subject_folder = subject.title()

        # Construct path: data/Class_11th/English_books/Physics or data/Class_11th/Hindi_books/भौतिक_विज्ञान
        subject_dir = self.data_dir / f"Class_{grade}th" / language_folder / subject_folder

        if not subject_dir.exists():
            logger.error(f"Subject directory not found: {subject_dir}")
            return {}

        # Initialize statistics
        self.extraction_stats['start_time'] = time.time()

        subject_data = {
            "grade": grade,
            "subject": subject.lower(),
            "language": language.lower(),
            "book_title": f"{subject.title()} - Class {grade} ({language.title()})",
            "chapters": [],
            "extraction_metadata": {
                "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "language": language.lower(),
                "total_files_found": 0,
                "files_processed": 0,
                "files_skipped": 0,
                "total_characters_extracted": 0
            }
        }

        # Process each PDF
        pdf_files = list(subject_dir.glob("*.pdf"))
        subject_data["extraction_metadata"]["total_files_found"] = len(pdf_files)
        self.extraction_stats['total_files'] = len(pdf_files)

        logger.info(f"Found {len(pdf_files)} PDF files in {subject_dir}")

        for pdf_file in pdf_files:
            if pdf_file.name.upper() in ['CONTENT.PDF', 'ANSWERS.PDF', 'APPENDICES.PDF', 'INDEX.PDF']:
                logger.info(f"Skipping {pdf_file.name} (metadata file)")
                subject_data["extraction_metadata"]["files_skipped"] += 1
                continue

            logger.info(f"Processing: {pdf_file.name}")

            try:
                # Extract text
                text_content = self.extract_text_from_pdf(pdf_file)
                if not text_content:
                    logger.warning(f"No text extracted from {pdf_file.name}")
                    self.extraction_stats['failed_extractions'] += 1
                    continue

                # Clean text
                cleaned_text = self.clean_text(text_content)
                subject_data["extraction_metadata"]["total_characters_extracted"] += len(cleaned_text)

                # Structure chapter data
                chapter_data = self.identify_chapter_structure(cleaned_text, pdf_file.name)
                chapter_data["language"] = language.lower()
                chapter_data["extraction_metadata"] = {
                    "file_size_bytes": pdf_file.stat().st_size,
                    "characters_extracted": len(cleaned_text),
                    "processing_time": time.time(),
                    "language": language.lower()
                }

                subject_data["chapters"].append(chapter_data)
                subject_data["extraction_metadata"]["files_processed"] += 1
                self.extraction_stats['successful_extractions'] += 1

                logger.info(f"Successfully processed {pdf_file.name}: {len(cleaned_text)} characters")

            except Exception as e:
                logger.error(f"Error processing {pdf_file.name}: {e}")
                self.extraction_stats['failed_extractions'] += 1
                continue

        # Finalize statistics
        self.extraction_stats['end_time'] = time.time()
        processing_time = self.extraction_stats['end_time'] - self.extraction_stats['start_time']
        subject_data["extraction_metadata"]["total_processing_time_seconds"] = processing_time

        logger.info(f"Processing completed in {processing_time:.2f} seconds")
        logger.info(f"Successfully processed: {self.extraction_stats['successful_extractions']}/{self.extraction_stats['total_files']} files")

        return subject_data

    def process_physics_11th(self) -> Dict:
        """Legacy method - Process Physics 11th grade PDFs (English)"""
        return self.process_subject_by_language("physics", 11, "english")
    
    def save_extracted_data(self, data: Dict, output_path: Path):
        """Save extracted data to JSON file"""
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Data saved to: {output_path}")
            
        except Exception as e:
            logger.error(f"Error saving data to {output_path}: {e}")
    
    def extract_all_ncert_data(self):
        """Extract data from all available NCERT PDFs for both languages"""
        logger.info("Starting bilingual NCERT PDF extraction...")

        all_extracted_data = {}

        # Define subjects and languages to process
        subjects = ["physics", "chemistry", "mathematics", "biology"]
        languages = ["english", "hindi"]
        grades = [11]  # Can be extended for other grades

        for grade in grades:
            for subject in subjects:
                for language in languages:
                    try:
                        logger.info(f"Processing {subject} Grade {grade} in {language}")
                        subject_data = self.process_subject_by_language(subject, grade, language)

                        if subject_data and subject_data.get("chapters"):
                            # Create output path
                            output_path = (self.data_dir / "ncert" / f"grade_{grade}" /
                                         subject / f"chapters_from_pdf_{language}.json")
                            self.save_extracted_data(subject_data, output_path)

                            # Store in return data
                            key = f"{subject}_{grade}_{language}"
                            all_extracted_data[key] = subject_data

                            logger.info(f"Successfully extracted {len(subject_data['chapters'])} chapters for {subject} Grade {grade} ({language})")
                        else:
                            logger.warning(f"No data extracted for {subject} Grade {grade} ({language})")

                    except Exception as e:
                        logger.error(f"Error processing {subject} Grade {grade} ({language}): {e}")
                        continue

        logger.info("Bilingual NCERT PDF extraction completed!")
        logger.info(f"Total datasets extracted: {len(all_extracted_data)}")
        return all_extracted_data

# Example usage
if __name__ == "__main__":
    print("🚀 Starting NCERT PDF Content Extraction System")
    print("=" * 60)
    
    # Initialize extractor
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    extractor = NCERTPDFExtractor(data_dir)
    
    print(f"📁 Data directory: {data_dir}")
    print(f"💾 Cache directory: {extractor.cache_dir}")
    
    # Extract all data
    print("\n🔄 Starting extraction process...")
    extracted_data = extractor.extract_all_ncert_data()
    
    # Print detailed summary
    if extracted_data:
        print(f"\n📚 EXTRACTION RESULTS - Physics Class 11")
        print("=" * 50)
        
        # Metadata summary
        metadata = extracted_data.get('extraction_metadata', {})
        print(f"📊 Processing Statistics:")
        print(f"   • Total files found: {metadata.get('total_files_found', 0)}")
        print(f"   • Files processed: {metadata.get('files_processed', 0)}")
        print(f"   • Files skipped: {metadata.get('files_skipped', 0)}")
        print(f"   • Total characters: {metadata.get('total_characters_extracted', 0):,}")
        print(f"   • Processing time: {metadata.get('total_processing_time_seconds', 0):.2f} seconds")
        print(f"   • Extraction date: {metadata.get('extraction_date', 'Unknown')}")
        
        # Chapter details
        chapters = extracted_data.get('chapters', [])
        print(f"\n📖 Chapter Analysis ({len(chapters)} chapters):")
        print("-" * 40)
        
        total_sections = 0
        total_concepts = 0
        total_examples = 0
        total_exercises = 0
        
        for i, chapter in enumerate(chapters):
            title = chapter.get('title', 'Unknown')
            sections = len(chapter.get('sections', []))
            concepts = len(chapter.get('key_concepts', []))
            examples = len(chapter.get('examples', []))
            exercises = len(chapter.get('exercises', []))
            
            total_sections += sections
            total_concepts += concepts
            total_examples += examples
            total_exercises += exercises
            
            print(f"   {i+1:2d}. {title}")
            print(f"       📑 Sections: {sections:2d} | 🔑 Concepts: {concepts:2d} | "
                  f"💡 Examples: {examples:2d} | ❓ Exercises: {exercises:2d}")
            
            # Show file size if available
            file_metadata = chapter.get('extraction_metadata', {})
            if 'file_size_bytes' in file_metadata:
                size_mb = file_metadata['file_size_bytes'] / (1024 * 1024)
                chars = file_metadata.get('characters_extracted', 0)
                print(f"       📄 File size: {size_mb:.1f} MB | Characters: {chars:,}")
        
        print(f"\n📈 TOTALS:")
        print(f"   📑 Total Sections: {total_sections}")
        print(f"   🔑 Total Key Concepts: {total_concepts}")
        print(f"   💡 Total Examples: {total_examples}")
        print(f"   ❓ Total Exercises: {total_exercises}")
        
        # Show some sample concepts
        if chapters:
            print(f"\n🔍 Sample Key Concepts:")
            all_concepts = []
            for chapter in chapters[:3]:  # First 3 chapters
                all_concepts.extend(chapter.get('key_concepts', [])[:3])  # Top 3 from each
            
            for concept in all_concepts[:10]:  # Show top 10
                print(f"   • {concept}")
    
    else:
        print("\n❌ No data extracted. Please check:")
        print("   • PDF files exist in data/Physics-11th/")
        print("   • PDF files are readable")
        print("   • Check the log file for detailed errors")
    
    print(f"\n✅ PDF extraction system completed!")
    print(f"📊 Final Statistics:")
    print(f"   • Success rate: {extractor.extraction_stats['successful_extractions']}/{extractor.extraction_stats['total_files']}")
    if extractor.extraction_stats['total_files'] > 0:
        success_rate = (extractor.extraction_stats['successful_extractions'] / extractor.extraction_stats['total_files']) * 100
        print(f"   • Success percentage: {success_rate:.1f}%")
    
    print("=" * 60)