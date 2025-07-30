import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Upload, Presentation, Brain, Calendar, ArrowRight, Globe } from 'lucide-react';
import SystemStatus from '../components/SystemStatus';
import QuickTest from '../components/QuickTest';
import { useLanguage } from '../components/LanguageSelector';

const Home = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: t('nav.curriculum') || 'Curriculum Generation',
      description: t('features.curriculum.desc') || 'AI-powered curriculum creation tailored to your educational needs',
      link: '/curriculum',
      color: 'blue'
    },
    {
      icon: HelpCircle,
      title: t('nav.quiz') || 'Quiz Generator',
      description: t('features.quiz.desc') || 'Create engaging quizzes with multiple question types automatically',
      link: '/quiz',
      color: 'green'
    },
    {
      icon: Upload,
      title: t('nav.assessment') || 'Answer Assessment',
      description: t('features.assessment.desc') || 'Upload and grade answer sheets using advanced AI technology',
      link: '/assessment',
      color: 'purple'
    },
    {
      icon: Presentation,
      title: t('nav.slides') || 'Slide Generator',
      description: t('features.slides.desc') || 'Generate beautiful presentation slides for your lessons',
      link: '/slides',
      color: 'orange'
    },
    {
      icon: Brain,
      title: t('nav.mindmap') || 'Mind Maps',
      description: t('features.mindmap.desc') || 'Create visual mind maps to enhance learning and understanding',
      link: '/mindmap',
      color: 'indigo'
    },
    {
      icon: Calendar,
      title: t('nav.lecture_plan') || 'Lecture Planner',
      description: t('features.lecture_plan.desc') || 'Plan comprehensive lectures with structured activities',
      link: '/lecture-plan',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
      green: 'text-green-600 bg-green-50 hover:bg-green-100',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
      orange: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
      red: 'text-red-600 bg-red-50 hover:bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              {currentLanguage === 'hi' ? 'भाषा चुनें' : 'Choose Your Language'}
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  changeLanguage('en');
                  setShowLanguageModal(false);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  currentLanguage === 'en'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">English</div>
                    <div className="text-sm text-gray-600">Continue in English</div>
                  </div>
                  <Globe size={24} />
                </div>
              </button>
              <button
                onClick={() => {
                  changeLanguage('hi');
                  setShowLanguageModal(false);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  currentLanguage === 'hi'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">हिन्दी</div>
                    <div className="text-sm text-gray-600">हिन्दी में जारी रखें</div>
                  </div>
                  <Globe size={24} />
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {currentLanguage === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Language Selection Banner */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <Globe size={24} />
              <span className="font-semibold">
                {currentLanguage === 'hi' ? 'द्विभाषी शिक्षा मंच' : 'Bilingual Education Platform'}
              </span>
            </div>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm transition-colors"
            >
              {currentLanguage === 'hi' ? 'भाषा बदलें' : 'Change Language'}
            </button>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {currentLanguage === 'hi' ? (
              <><span className="text-blue-600">एडुसारथी</span> में आपका स्वागत है</>
            ) : (
              <>Welcome to <span className="text-blue-600">EduSarathi</span></>
            )}
          </h1>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-blue-800 font-semibold">
              {currentLanguage === 'hi'
                ? '📚 उपलब्ध विषय: भौतिक विज्ञान, रसायन विज्ञान, गणित, जीव विज्ञान, अर्थशास्त्र (कक्षा 11 NCERT)'
                : '📚 Available Subjects: Physics, Chemistry, Mathematics, Biology, Economics (Class 11 NCERT)'
              }
            </p>
            <p className="text-blue-700 text-sm mt-1">
              {currentLanguage === 'hi'
                ? 'NCERT पाठ्यपुस्तकों से निकाली गई सामग्री पर आधारित द्विभाषी शिक्षा मंच'
                : 'Bilingual educational platform based on extracted NCERT textbook content'
              }
            </p>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {currentLanguage === 'hi'
              ? 'पाठ्यक्रम, प्रश्नोत्तरी, मूल्यांकन और शिक्षण सामग्री बनाने के लिए आपका AI-संचालित शैक्षिक साथी। सभी विषयों के लिए NCERT सामग्री के साथ कक्षा 11 के लिए अनुकूलित।'
              : 'Your AI-powered educational companion for creating curricula, quizzes, assessments, and learning materials. Optimized for Class 11 with NCERT content across all subjects.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/curriculum"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {currentLanguage === 'hi' ? 'शुरू करें' : 'Get Started'}
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {currentLanguage === 'hi' ? 'और जानें' : 'Learn More'}
            </button>
          </div>
        </div>

        {/* System Status and Quick Test */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <SystemStatus />
          <QuickTest />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 ${getColorClasses(feature.color)}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(feature.color)}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-medium">
                  Explore
                  <ArrowRight className="ml-1" size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">
                {currentLanguage === 'hi' ? 'पाठ्यक्रम तैयार' : 'Curricula Generated'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5000+</div>
              <div className="text-gray-600">
                {currentLanguage === 'hi' ? 'प्रश्नोत्तरी बनाई गई' : 'Quizzes Created'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2500+</div>
              <div className="text-gray-600">
                {currentLanguage === 'hi' ? 'मूल्यांकन ग्रेड किए गए' : 'Assessments Graded'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
              <div className="text-gray-600">
                {currentLanguage === 'hi' ? 'भाषाएं समर्थित' : 'Languages Supported'}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {currentLanguage === 'hi'
              ? 'अपने शिक्षण को बदलने के लिए तैयार हैं?'
              : 'Ready to Transform Your Teaching?'
            }
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {currentLanguage === 'hi'
              ? 'बेहतर शिक्षण अनुभव बनाने के लिए एडुसारथी का उपयोग करने वाले हजारों शिक्षकों से जुड़ें।'
              : 'Join thousands of educators using EduSarathi to create better learning experiences.'
            }
          </p>
          <Link
            to="/curriculum"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 inline-flex items-center"
          >
            {currentLanguage === 'hi' ? 'अभी बनाना शुरू करें' : 'Start Creating Now'}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;