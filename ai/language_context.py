"""
Language Context Manager for EduSarathi
Manages bilingual content, translations, and language-specific configurations
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class SupportedLanguage(Enum):
    ENGLISH = "english"
    HINDI = "hindi"
    EN = "en"
    HI = "hi"

@dataclass
class LanguageConfig:
    code: str
    name: str
    native_name: str
    direction: str = "ltr"  # ltr or rtl
    font_family: Optional[str] = None
    
class LanguageContextManager:
    """Manages language context and translations for the EduSarathi system"""
    
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.current_language = "english"
        self.translations = {}
        self.language_configs = self._initialize_language_configs()
        self._load_translations()
    
    def _initialize_language_configs(self) -> Dict[str, LanguageConfig]:
        """Initialize supported language configurations"""
        return {
            "english": LanguageConfig(
                code="en",
                name="English",
                native_name="English",
                direction="ltr",
                font_family="Inter, system-ui, sans-serif"
            ),
            "hindi": LanguageConfig(
                code="hi", 
                name="Hindi",
                native_name="हिन्दी",
                direction="ltr",
                font_family="Noto Sans Devanagari, system-ui, sans-serif"
            ),
            "en": LanguageConfig(
                code="en",
                name="English", 
                native_name="English",
                direction="ltr",
                font_family="Inter, system-ui, sans-serif"
            ),
            "hi": LanguageConfig(
                code="hi",
                name="Hindi",
                native_name="हिन्दी", 
                direction="ltr",
                font_family="Noto Sans Devanagari, system-ui, sans-serif"
            )
        }
    
    def _load_translations(self):
        """Load translation files for supported languages"""
        translations_dir = self.data_dir / "translations"
        
        if not translations_dir.exists():
            translations_dir.mkdir(parents=True, exist_ok=True)
            self._create_default_translations(translations_dir)
        
        for lang_config in self.language_configs.values():
            translation_file = translations_dir / f"{lang_config.code}.json"
            if translation_file.exists():
                try:
                    with open(translation_file, 'r', encoding='utf-8') as f:
                        self.translations[lang_config.code] = json.load(f)
                except Exception as e:
                    logger.error(f"Error loading translations for {lang_config.code}: {e}")
                    self.translations[lang_config.code] = {}
            else:
                self.translations[lang_config.code] = {}
    
    def _create_default_translations(self, translations_dir: Path):
        """Create default translation files"""
        
        # English translations (base)
        english_translations = {
            "app": {
                "title": "EduSarathi",
                "subtitle": "AI Educational Platform",
                "welcome": "Welcome to EduSarathi"
            },
            "navigation": {
                "home": "Home",
                "curriculum": "Curriculum",
                "quiz": "Quiz",
                "assessment": "Assessment", 
                "slides": "Slides",
                "mindmap": "Mind Map",
                "lecture_plan": "Lecture Plan"
            },
            "quiz": {
                "title": "Quiz Generator",
                "generate": "Generate Quiz",
                "start": "Start Quiz",
                "download": "Download PDF",
                "edit": "Edit Quiz",
                "show_answers": "Show Answers",
                "hide_answers": "Hide Answers",
                "subject": "Subject",
                "topic": "Topic",
                "grade": "Grade",
                "difficulty": "Difficulty",
                "question_count": "Number of Questions",
                "question_types": "Question Types"
            },
            "subjects": {
                "physics": "Physics",
                "chemistry": "Chemistry", 
                "mathematics": "Mathematics",
                "biology": "Biology"
            },
            "common": {
                "loading": "Loading...",
                "error": "Error",
                "success": "Success",
                "cancel": "Cancel",
                "save": "Save",
                "delete": "Delete",
                "edit": "Edit",
                "view": "View",
                "close": "Close",
                "submit": "Submit",
                "reset": "Reset"
            }
        }
        
        # Hindi translations
        hindi_translations = {
            "app": {
                "title": "एडुसारथी",
                "subtitle": "AI शैक्षिक मंच",
                "welcome": "एडुसारथी में आपका स्वागत है"
            },
            "navigation": {
                "home": "होम",
                "curriculum": "पाठ्यक्रम",
                "quiz": "प्रश्नोत्तरी",
                "assessment": "मूल्यांकन",
                "slides": "स्लाइड्स",
                "mindmap": "माइंड मैप",
                "lecture_plan": "व्याख्यान योजना"
            },
            "quiz": {
                "title": "प्रश्नोत्तरी जेनरेटर",
                "generate": "प्रश्नोत्तरी बनाएं",
                "start": "प्रश्नोत्तरी शुरू करें",
                "download": "PDF डाउनलोड करें",
                "edit": "प्रश्नोत्तरी संपादित करें",
                "show_answers": "उत्तर दिखाएं",
                "hide_answers": "उत्तर छुपाएं",
                "subject": "विषय",
                "topic": "टॉपिक",
                "grade": "कक्षा",
                "difficulty": "कठिनाई",
                "question_count": "प्रश्नों की संख्या",
                "question_types": "प्रश्न के प्रकार"
            },
            "subjects": {
                "physics": "भौतिक विज्ञान",
                "chemistry": "रसायन विज्ञान",
                "mathematics": "गणित",
                "biology": "जीव विज्ञान"
            },
            "common": {
                "loading": "लोड हो रहा है...",
                "error": "त्रुटि",
                "success": "सफलता",
                "cancel": "रद्द करें",
                "save": "सेव करें",
                "delete": "हटाएं",
                "edit": "संपादित करें",
                "view": "देखें",
                "close": "बंद करें",
                "submit": "जमा करें",
                "reset": "रीसेट करें"
            }
        }
        
        # Save translation files
        with open(translations_dir / "en.json", 'w', encoding='utf-8') as f:
            json.dump(english_translations, f, indent=2, ensure_ascii=False)
        
        with open(translations_dir / "hi.json", 'w', encoding='utf-8') as f:
            json.dump(hindi_translations, f, indent=2, ensure_ascii=False)
        
        logger.info("Created default translation files")
    
    def set_language(self, language: str):
        """Set the current language"""
        normalized_lang = self._normalize_language_code(language)
        if normalized_lang in self.language_configs:
            self.current_language = normalized_lang
            logger.info(f"Language set to: {normalized_lang}")
        else:
            logger.warning(f"Unsupported language: {language}")
    
    def _normalize_language_code(self, language: str) -> str:
        """Normalize language code to full name"""
        lang_mapping = {
            "en": "english",
            "hi": "hindi",
            "english": "english", 
            "hindi": "hindi"
        }
        return lang_mapping.get(language.lower(), "english")
    
    def get_translation(self, key: str, language: Optional[str] = None) -> str:
        """Get translation for a key in specified language"""
        target_language = language or self.current_language
        lang_code = self.language_configs[target_language].code
        
        # Navigate nested keys (e.g., "app.title")
        keys = key.split('.')
        translation_dict = self.translations.get(lang_code, {})
        
        for k in keys:
            if isinstance(translation_dict, dict) and k in translation_dict:
                translation_dict = translation_dict[k]
            else:
                # Fallback to English if translation not found
                if lang_code != "en":
                    return self.get_translation(key, "english")
                return key  # Return key if no translation found
        
        return str(translation_dict) if translation_dict else key
    
    def get_language_config(self, language: Optional[str] = None) -> LanguageConfig:
        """Get language configuration"""
        target_language = language or self.current_language
        return self.language_configs.get(target_language, self.language_configs["english"])
    
    def get_supported_languages(self) -> List[Dict[str, str]]:
        """Get list of supported languages"""
        return [
            {
                "code": config.code,
                "name": config.name,
                "nativeName": config.native_name,
                "direction": config.direction
            }
            for config in self.language_configs.values()
            if config.code in ["en", "hi"]  # Only return unique codes
        ]
    
    def get_subject_folder_mapping(self, language: str) -> Dict[str, str]:
        """Get subject to folder name mapping for different languages"""
        mappings = {
            "english": {
                "physics": "Physics",
                "chemistry": "Chemistry", 
                "mathematics": "Maths",
                "biology": "Biology"
            },
            "hindi": {
                "physics": "भौतिक_विज्ञान",
                "chemistry": "रसायन_विज्ञान",
                "mathematics": "गणित", 
                "biology": "जीव_विज्ञान"
            }
        }
        
        normalized_lang = self._normalize_language_code(language)
        return mappings.get(normalized_lang, mappings["english"])
    
    def get_language_folder_name(self, language: str) -> str:
        """Get folder name for language"""
        folder_mapping = {
            "english": "English_books",
            "hindi": "Hindi_books",
            "en": "English_books",
            "hi": "Hindi_books"
        }
        return folder_mapping.get(language.lower(), "English_books")

# Global instance
_language_context = None

def get_language_context(data_dir: Optional[str] = None) -> LanguageContextManager:
    """Get global language context manager instance"""
    global _language_context
    if _language_context is None:
        if data_dir is None:
            data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        _language_context = LanguageContextManager(data_dir)
    return _language_context
