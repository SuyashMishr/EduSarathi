import React from 'react';
import { useLanguage } from '../components/LanguageSelector';
import BilingualDemoMode from '../components/BilingualDemoMode';

const DemoPage = () => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentLanguage === 'hi' ? (
              <>
                <span className="text-blue-600">एडुसारथी</span> उन्नत द्विभाषी डेमो मोड
              </>
            ) : (
              <>
                <span className="text-blue-600">EduSarathi</span> Enhanced Bilingual Demo Mode
              </>
            )}
          </h1>
          
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div>
                <p className="font-semibold mb-2">
                  {currentLanguage === 'hi' ? '🤖 AI मॉडल सेटअप:' : '🤖 AI Model Setup:'}
                </p>
                <p className="text-sm">
                  {currentLanguage === 'hi' 
                    ? 'प्राथमिक: Sarvam (sarvamai/sarvam-m:free)\nफॉलबैक: Claude 3.5 Sonnet, GPT-4'
                    : 'Primary: Sarvam (sarvamai/sarvam-m:free)\nFallback: Claude 3.5 Sonnet, GPT-4'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  {currentLanguage === 'hi' ? '📚 उन्नत मॉड्यूल:' : '📚 Enhanced Modules:'}
                </p>
                <p className="text-sm">
                  {currentLanguage === 'hi'
                    ? 'पाठ्यक्रम, प्रश्नोत्तरी, व्याख्यान योजना\nमानसिक मानचित्र, स्लाइड, मूल्यांकन'
                    : 'Curriculum, Quiz, Lecture Plans\nMindmaps, Slides, Assessment'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            {currentLanguage === 'hi'
              ? 'सभी उन्नत शैक्षिक मॉड्यूल का प्रदर्शन देखें: संपूर्ण पाठ्यक्रम निर्माण, इंटरैक्टिव प्रश्नोत्तरी, विस्तृत व्याख्यान योजना, दृश्य मानसिक मानचित्र, प्रस्तुति स्लाइड, और स्मार्ट मूल्यांकन - सभी अंग्रेजी और हिंदी में।'
              : 'Experience all enhanced educational modules: Comprehensive curriculum generation, interactive quiz creation, detailed lecture planning, visual mindmaps, presentation slides, and smart assessment - all in English and Hindi.'
            }
          </p>
        </div>

        <div className="space-y-8">
          <BilingualDemoMode />
          
          {/* Enhanced Features Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {currentLanguage === 'hi' ? 'उन्नत AI शैक्षिक क्षमताएं' : 'Enhanced AI Educational Capabilities'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  category: currentLanguage === 'hi' ? 'सामग्री निर्माण' : 'Content Generation',
                  features: currentLanguage === 'hi' 
                    ? ['NCERT संरेखित पाठ्यक्रम', 'व्यापक प्रश्न बैंक', 'इंटरैक्टिव प्रस्तुतियां']
                    : ['NCERT-aligned curriculum', 'Comprehensive question banks', 'Interactive presentations'],
                  icon: '📚'
                },
                {
                  category: currentLanguage === 'hi' ? 'दृश्य शिक्षण' : 'Visual Learning',
                  features: currentLanguage === 'hi'
                    ? ['अवधारणा मानसिक मानचित्र', 'प्रक्रिया फ्लोचार्ट', 'इंटरैक्टिव आरेख']
                    : ['Concept mindmaps', 'Process flowcharts', 'Interactive diagrams'],
                  icon: '🎨'
                },
                {
                  category: currentLanguage === 'hi' ? 'स्मार्ट मूल्यांकन' : 'Smart Assessment',
                  features: currentLanguage === 'hi'
                    ? ['स्वचालित ग्रेडिंग', 'विस्तृत फीडबैक', 'प्रगति ट्रैकिंग']
                    : ['Automated grading', 'Detailed feedback', 'Progress tracking'],
                  icon: '✅'
                },
                {
                  category: currentLanguage === 'hi' ? 'शिक्षण योजना' : 'Teaching Plans',
                  features: currentLanguage === 'hi'
                    ? ['संरचित पाठ योजना', 'समय प्रबंधन', 'गतिविधि सुझाव']
                    : ['Structured lesson plans', 'Time management', 'Activity suggestions'],
                  icon: '📋'
                },
                {
                  category: currentLanguage === 'hi' ? 'द्विभाषी समर्थन' : 'Bilingual Support',
                  features: currentLanguage === 'hi'
                    ? ['अंग्रेजी-हिंदी अनुवाद', 'सांस्कृतिक संदर्भ', 'भाषा अनुकूलन']
                    : ['English-Hindi translation', 'Cultural context', 'Language adaptation'],
                  icon: '�'
                },
                {
                  category: currentLanguage === 'hi' ? 'AI संचालित' : 'AI-Powered',
                  features: currentLanguage === 'hi'
                    ? ['प्राकृतिक भाषा प्रसंस्करण', 'व्यक्तिगत शिक्षण', 'अनुकूली सामग्री']
                    : ['Natural language processing', 'Personalized learning', 'Adaptive content'],
                  icon: '🤖'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <div className="text-3xl mb-3 text-center">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-center">{feature.category}</h3>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
