import React, { useState, useEffect, createContext, useContext } from 'react';
import { Globe } from 'lucide-react';
import axios from 'axios';

// Language Context
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  const loadTranslations = async (languageCode) => {
    try {
      // In a real app, you'd load translations from your backend or translation files
      const translationMap = {
        'en': {
          'app.title': 'EduSarathi',
          'app.subtitle': 'AI Educational Platform',
          'nav.home': 'Home',
          'nav.curriculum': 'Curriculum',
          'nav.quiz': 'Quiz',
          'nav.assessment': 'Assessment',
          'nav.slides': 'Slides',
          'nav.mindmap': 'Mind Map',
          'nav.lecture_plan': 'Lecture Plan',
          'quiz.title': 'Quiz Generator',
          'quiz.generate': 'Generate Quiz',
          'quiz.start': 'Start Quiz',
          'quiz.download': 'Download PDF',
          'quiz.edit': 'Edit Quiz',
          'quiz.show_answers': 'Show Answers',
          'quiz.hide_answers': 'Hide Answers',
          'quiz.subject': 'Subject',
          'quiz.topic': 'Chapter',
          'quiz.grade': 'Class',
          'quiz.difficulty': 'Difficulty',
          'quiz.question_count': 'Number of Questions',
          'quiz.question_types': 'Question Types',
          'quiz.language': 'Language',
          'features.curriculum.desc': 'AI-powered curriculum creation tailored to your educational needs',
          'features.quiz.desc': 'Create engaging quizzes with multiple question types automatically',
          'features.assessment.desc': 'Upload and grade answer sheets using advanced AI technology',
          'features.slides.desc': 'Generate beautiful presentation slides for your lessons',
          'features.mindmap.desc': 'Create visual mind maps to enhance learning and understanding',
          'features.lecture_plan.desc': 'Plan comprehensive lectures with structured activities',
          'subjects.physics': 'Physics',
          'subjects.chemistry': 'Chemistry',
          'subjects.mathematics': 'Mathematics',
          'subjects.biology': 'Biology',
          'subjects.economics': 'Economics',
          'common.loading': 'Loading...',
          'common.error': 'Error',
          'common.success': 'Success',
          'common.cancel': 'Cancel',
          'common.save': 'Save',
          'common.delete': 'Delete',
          'common.edit': 'Edit',
          'common.view': 'View',
          'common.close': 'Close',
          'common.submit': 'Submit',
          'common.reset': 'Reset'
        },
        'hi': {
          'app.title': 'एडुसारथी',
          'app.subtitle': 'AI शैक्षिक मंच',
          'nav.home': 'होम',
          'nav.curriculum': 'पाठ्यक्रम',
          'nav.quiz': 'प्रश्नोत्तरी',
          'nav.assessment': 'मूल्यांकन',
          'nav.slides': 'स्लाइड्स',
          'nav.mindmap': 'माइंड मैप',
          'nav.lecture_plan': 'व्याख्यान योजना',
          'quiz.title': 'प्रश्नोत्तरी जेनरेटर',
          'quiz.generate': 'प्रश्नोत्तरी बनाएं',
          'quiz.start': 'प्रश्नोत्तरी शुरू करें',
          'quiz.download': 'PDF डाउनलोड करें',
          'quiz.edit': 'प्रश्नोत्तरी संपादित करें',
          'quiz.show_answers': 'उत्तर दिखाएं',
          'quiz.hide_answers': 'उत्तर छुपाएं',
          'quiz.subject': 'विषय',
          'quiz.topic': 'अध्याय',
          'quiz.grade': 'कक्षा',
          'quiz.difficulty': 'कठिनाई',
          'quiz.question_count': 'प्रश्नों की संख्या',
          'quiz.question_types': 'प्रश्न के प्रकार',
          'quiz.language': 'भाषा',
          'features.curriculum.desc': 'आपकी शैक्षिक आवश्यकताओं के अनुरूप AI-संचालित पाठ्यक्रम निर्माण',
          'features.quiz.desc': 'स्वचालित रूप से कई प्रश्न प्रकारों के साथ आकर्षक प्रश्नोत्तरी बनाएं',
          'features.assessment.desc': 'उन्नत AI तकनीक का उपयोग करके उत्तर पत्रक अपलोड और ग्रेड करें',
          'features.slides.desc': 'अपने पाठों के लिए सुंदर प्रस्तुति स्लाइड बनाएं',
          'features.mindmap.desc': 'सीखने और समझ को बढ़ाने के लिए दृश्य माइंड मैप बनाएं',
          'features.lecture_plan.desc': 'संरचित गतिविधियों के साथ व्यापक व्याख्यान की योजना बनाएं',
          'subjects.physics': 'भौतिक विज्ञान',
          'subjects.chemistry': 'रसायन विज्ञान',
          'subjects.mathematics': 'गणित',
          'subjects.biology': 'जीव विज्ञान',
          'subjects.economics': 'अर्थशास्त्र',
          'common.loading': 'लोड हो रहा है...',
          'common.error': 'त्रुटि',
          'common.success': 'सफलता',
          'common.cancel': 'रद्द करें',
          'common.save': 'सेव करें',
          'common.delete': 'हटाएं',
          'common.edit': 'संपादित करें',
          'common.view': 'देखें',
          'common.close': 'बंद करें',
          'common.submit': 'जमा करें',
          'common.reset': 'रीसेट करें'
        }
      };

      setTranslations(translationMap[languageCode] || translationMap['en']);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    loadTranslations(languageCode);
  };

  const t = (key) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [languages, setLanguages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await axios.get('/api/translate/languages');
      setLanguages(response.data.data.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback to Hindi and English only for bilingual support
      setLanguages([
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
      ]);
    }
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const selectedLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Globe size={20} />
        <span className="text-sm font-medium">
          {selectedLang?.nativeName || 'English'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;