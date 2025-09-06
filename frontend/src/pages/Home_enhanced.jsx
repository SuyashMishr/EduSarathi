import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Upload, Presentation, Brain, Calendar, ArrowRight, Globe, Star, TrendingUp, Users, Award } from 'lucide-react';
import SystemStatus from '../components/SystemStatus';
import QuickTest from '../components/QuickTest';
import { useLanguage } from '../components/LanguageSelector';

const Home = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1234,
    contentGenerated: 5678,
    quizzesCreated: 890,
    successRate: 95
  });

  // Enhanced features with better descriptions and icons
  const features = [
    {
      icon: BookOpen,
      title: t('nav.curriculum') || 'Enhanced Curriculum Generation',
      description: t('features.curriculum.desc') || 'AI-powered NCERT-aligned curriculum creation with comprehensive pedagogical design and assessment strategies',
      link: '/curriculum',
      color: 'blue',
      badge: 'Popular',
      stats: '2.3k+ generated'
    },
    {
      icon: HelpCircle,
      title: t('nav.quiz') || 'Intelligent Quiz Generator',
      description: t('features.quiz.desc') || 'Create engaging, interactive quizzes with multiple question types, detailed explanations, and automatic grading',
      link: '/quiz',
      color: 'green',
      badge: 'New Features',
      stats: '5.1k+ quizzes'
    },
    {
      icon: Upload,
      title: t('nav.assessment') || 'Smart Answer Assessment',
      description: t('features.assessment.desc') || 'Advanced AI-powered answer sheet evaluation with detailed feedback, rubrics, and performance analytics',
      link: '/assessment',
      color: 'purple',
      badge: 'AI-Enhanced',
      stats: '98% accuracy'
    },
    {
      icon: Presentation,
      title: t('nav.slides') || 'Professional Slide Generator',
      description: t('features.slides.desc') || 'Generate beautiful, interactive presentation slides with visual elements, animations, and educational templates',
      link: '/slides',
      color: 'orange',
      badge: 'Visual Learning',
      stats: '1.8k+ presentations'
    },
    {
      icon: Brain,
      title: t('nav.mindmap') || 'Interactive Mind Maps',
      description: t('features.mindmap.desc') || 'Create dynamic, visual mind maps with hierarchical structures, cross-connections, and collaborative features',
      link: '/mindmap',
      color: 'indigo',
      badge: 'Collaborative',
      stats: '4.2k+ mindmaps'
    },
    {
      icon: Calendar,
      title: t('nav.lecture_plan') || 'Comprehensive Lecture Planner',
      description: t('features.lecture_plan.desc') || 'Design detailed lesson plans with learning objectives, activities, assessments, and time management',
      link: '/lecture-plan',
      color: 'red',
      badge: 'Time-Saving',
      stats: '3.5k+ lessons'
    }
  ];

  const achievements = [
    { icon: Users, label: 'Active Users', value: stats.totalUsers, suffix: '+' },
    { icon: BookOpen, label: 'Content Generated', value: stats.contentGenerated, suffix: '+' },
    { icon: Award, label: 'Success Rate', value: stats.successRate, suffix: '%' },
    { icon: TrendingUp, label: 'Daily Growth', value: 12, suffix: '%' }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              {currentLanguage === 'hi' ? 'भाषा चुनें' : 'Choose Your Language'}
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  changeLanguage('en');
                  setShowLanguageModal(false);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  currentLanguage === 'en'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                    : 'border-gray-300 hover:border-blue-300 hover:scale-102'
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
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  currentLanguage === 'hi'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                    : 'border-gray-300 hover:border-blue-300 hover:scale-102'
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
              className="w-full mt-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {currentLanguage === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Achievement Stats Banner */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <achievement.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {achievement.value.toLocaleString()}{achievement.suffix}
                    </div>
                    <div className="text-xs text-gray-600">{achievement.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection Banner */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-8 max-w-4xl mx-auto shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <Globe size={28} className="animate-pulse" />
              <span className="font-bold text-lg">
                {currentLanguage === 'hi' ? 'उन्नत द्विभाषी शिक्षा मंच' : 'Advanced Bilingual Education Platform'}
              </span>
            </div>
            <p className="text-blue-100 mb-4">
              {currentLanguage === 'hi' 
                ? 'ChatGPT से बेहतर गुणवत्ता के साथ AI-संचालित शैक्षिक सामग्री जनरेशन'
                : 'AI-powered educational content generation with superior quality than ChatGPT'
              }
            </p>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
            >
              {currentLanguage === 'hi' ? 'भाषा बदलें' : 'Change Language'}
            </button>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            {currentLanguage === 'hi' ? (
              <>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">एडुसारथी</span> 
                <br />में आपका स्वागत है
              </>
            ) : (
              <>
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduSarathi</span>
              </>
            )}
          </h1>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8 max-w-4xl mx-auto shadow-md">
            <div className="flex items-center justify-center mb-3">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="font-bold text-green-800">
                {currentLanguage === 'hi' ? 'प्रीमियम सुविधाएं' : 'Premium Features'}
              </span>
              <Star className="h-6 w-6 text-yellow-500 ml-2" />
            </div>
            <p className="text-green-800 font-semibold text-lg mb-2">
              {currentLanguage === 'hi'
                ? '📚 उपलब्ध विषय: भौतिक विज्ञान, रसायन विज्ञान, गणित, जीव विज्ञान, अर्थशास्त्र (कक्षा 11 NCERT)'
                : '📚 Available Subjects: Physics, Chemistry, Mathematics, Biology, Economics (Class 11 NCERT)'
              }
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-green-700">
                <Award className="h-4 w-4 mr-2" />
                {currentLanguage === 'hi' ? 'NCERT-संरेखित' : 'NCERT-Aligned'}
              </div>
              <div className="flex items-center text-green-700">
                <Brain className="h-4 w-4 mr-2" />
                {currentLanguage === 'hi' ? 'AI-संचालित' : 'AI-Powered'}
              </div>
              <div className="flex items-center text-green-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                {currentLanguage === 'hi' ? 'उच्च गुणवत्ता' : 'Superior Quality'}
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {currentLanguage === 'hi'
              ? 'पाठ्यक्रम, प्रश्नोत्तरी, मूल्यांकन और शिक्षण सामग्री बनाने के लिए आपका उन्नत AI-संचालित शैक्षिक साथी। सभी विषयों के लिए NCERT सामग्री के साथ कक्षा 11 के लिए विशेष रूप से अनुकूलित। ChatGPT से बेहतर शैक्षिक गुणवत्ता के साथ।'
              : 'Your advanced AI-powered educational companion for creating curricula, quizzes, assessments, and comprehensive learning materials. Specially optimized for Class 11 with authentic NCERT content across all subjects. Delivering superior educational quality beyond ChatGPT standards.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/curriculum"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {currentLanguage === 'hi' ? 'अभी शुरू करें' : 'Get Started Now'}
            </Link>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              {currentLanguage === 'hi' ? 'भाषा विकल्प' : 'Language Options'}
            </button>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  {feature.badge && (
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {feature.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    {feature.stats}
                  </span>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    {currentLanguage === 'hi' ? 'खोजें' : 'Explore'}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Status and Quick Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentLanguage === 'hi' ? 'सिस्टम स्थिति' : 'System Status'}
            </h3>
            <SystemStatus />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentLanguage === 'hi' ? 'त्वरित परीक्षण' : 'Quick Test'}
            </h3>
            <QuickTest />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
