import React, { useState } from 'react';
import { Play, Globe, Loader2, CheckCircle, XCircle, BookOpen, Brain, FileText, PresentationChart, Map, ClipboardList } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BilingualDemoMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState(null);
  const [currentModule, setCurrentModule] = useState('');
  const [moduleProgress, setModuleProgress] = useState({});

  const modules = [
    { name: 'Curriculum Generation', icon: BookOpen, description: 'Generate comprehensive NCERT curriculum' },
    { name: 'Quiz Generation', icon: ClipboardList, description: 'Create MCQ and subjective questions' },
    { name: 'Lecture Plan Generation', icon: FileText, description: 'Design detailed teaching plans' },
    { name: 'Mindmap Generation', icon: Map, description: 'Create visual learning mindmaps' },
    { name: 'Slide Generation', icon: PresentationChart, description: 'Generate presentation slides' },
    { name: 'Answer Assessment', icon: CheckCircle, description: 'Assess student responses' },
    { name: 'Question Answering', icon: Brain, description: 'AI-powered Q&A system' },
    { name: 'Concept Explanation', icon: BookOpen, description: 'Detailed concept explanations' },
    { name: 'Doubt Resolution', icon: Brain, description: 'Resolve student doubts' },
    { name: 'Motivational Tip', icon: CheckCircle, description: 'Study motivation and tips' }
  ];

  const runFullDemo = async () => {
    setIsRunning(true);
    setDemoResults(null);
    setCurrentModule('Initializing...');
    setModuleProgress({});

    // Initialize progress for all modules
    const initialProgress = {};
    modules.forEach((module, index) => {
      initialProgress[module.name] = { 
        status: index === 0 ? 'loading' : 'pending', 
        english_output: '', 
        hindi_output: '' 
      };
    });
    setModuleProgress(initialProgress);

    try {
      const response = await axios.get('http://localhost:8001/demo/bilingual');
      
      if (response.data.success) {
        setDemoResults(response.data.data);
        toast.success('Bilingual demo completed successfully!');
      } else {
        throw new Error(response.data.message || 'Demo failed');
      }
    } catch (error) {
      console.error('Demo error:', error);
      toast.error('Demo failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsRunning(false);
      setCurrentModule('');
    }
  };

  const runSingleModuleDemo = async (moduleName, demoInput) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], status: 'loading' }
    }));

    try {
      const response = await axios.post('http://localhost:8001/demo/bilingual/module', null, {
        params: { module_name: moduleName, demo_input: demoInput }
      });
      
      if (response.data.success) {
        setModuleProgress(prev => ({
          ...prev,
          [moduleName]: { 
            status: 'success',
            english_output: response.data.data.english_output,
            hindi_output: response.data.data.hindi_output
          }
        }));
        
        // Update the specific module in results
        setDemoResults(prev => ({
          ...prev,
          demo_results: prev.demo_results.map(result => 
            result.module === moduleName ? response.data.data : result
          )
        }));
        toast.success(`Module ${moduleName} demo completed!`);
      }
    } catch (error) {
      setModuleProgress(prev => ({
        ...prev,
        [moduleName]: { ...prev[moduleName], status: 'error' }
      }));
      toast.error(`Module ${moduleName} demo failed: ` + (error.response?.data?.detail || error.message));
    }
  };

  const getPlaceholderContent = (moduleName) => {
    const placeholders = {
      'Curriculum Generation': {
        english: 'Generating comprehensive Class 11 NCERT curriculum with learning objectives, assessments, and alignment...',
        hindi: 'कक्षा 11 NCERT पाठ्यक्रम तैयार किया जा रहा है जिसमें शिक्षण उद्देश्य, मूल्यांकन और संरेखण शामिल है...'
      },
      'Quiz Generation': {
        english: 'Creating engaging quiz with MCQ and subjective questions for Class 11 concepts...',
        hindi: 'कक्षा 11 की अवधारणाओं के लिए MCQ और वर्णनात्मक प्रश्नों के साथ रोचक प्रश्नोत्तरी बनाई जा रही है...'
      },
      'Mindmap Generation': {
        english: 'Designing visual mindmap with interconnected concepts and learning pathways...',
        hindi: 'परस्पर जुड़ी अवधारणाओं और शिक्षण मार्गों के साथ दृश्य मानसिक मानचित्र बनाया जा रहा है...'
      },
      'Slide Generation': {
        english: 'Creating interactive presentation slides with visual elements and animations...',
        hindi: 'दृश्य तत्वों और एनीमेशन के साथ इंटरैक्टिव प्रस्तुति स्लाइड बनाई जा रही हैं...'
      },
      'Lecture Plan Generation': {
        english: 'Developing detailed lesson plan with activities, assessments, and time management...',
        hindi: 'गतिविधियों, मूल्यांकन और समय प्रबंधन के साथ विस्तृत पाठ योजना विकसित की जा रही है...'
      }
    };
    
    return placeholders[moduleName] || {
      english: 'Processing educational content with AI-powered analysis...',
      hindi: 'AI-संचालित विश्लेषण के साथ शैक्षिक सामग्री को संसाधित किया जा रहा है...'
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Globe className="text-blue-600 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            EduSarathi Enhanced Bilingual Demo Mode
          </h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>🤖 AI Model:</strong> Sarvam (sarvamai/sarvam-m:free) via OpenRouter<br/>
            <strong>🌐 Languages:</strong> English & Hindi<br/>
            <strong>📚 Content:</strong> Class 11 NCERT Aligned Educational Modules<br/>
            <strong>✨ Features:</strong> Enhanced curriculum, quiz, mindmap, slides, lecture plans & assessment
          </p>
        </div>

        <button
          onClick={runFullDemo}
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isRunning ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Running Enhanced Demo...
            </>
          ) : (
            <>
              <Play className="mr-2" size={20} />
              Run Enhanced Bilingual Demo
            </>
          )}
        </button>

        {isRunning && currentModule && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Currently processing:</strong> {currentModule}
            </p>
          </div>
        )}
      </div>

      {/* Module Grid with Placeholders */}
      {(isRunning || Object.keys(moduleProgress).length > 0) && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Module Demonstrations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module, index) => {
              const progress = moduleProgress[module.name];
              const IconComponent = module.icon;
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <IconComponent className="mr-2" size={16} />
                      {module.name}
                      {progress?.status === 'loading' && <Loader2 className="animate-spin ml-2 text-blue-600" size={16} />}
                      {progress?.status === 'success' && <CheckCircle className="ml-2 text-green-600" size={16} />}
                      {progress?.status === 'error' && <XCircle className="ml-2 text-red-600" size={16} />}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <h5 className="font-medium text-blue-800 mb-2">📝 English Output</h5>
                      {progress?.status === 'loading' ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-blue-200 rounded mb-2"></div>
                          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                        </div>
                      ) : progress?.english_output ? (
                        <p className="text-blue-700 text-sm">{progress.english_output}</p>
                      ) : (
                        <p className="text-blue-600 text-sm italic">{getPlaceholderContent(module.name).english}</p>
                      )}
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded p-3">
                      <h5 className="font-medium text-orange-800 mb-2">🇮🇳 Hindi Output</h5>
                      {progress?.status === 'loading' ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-orange-200 rounded mb-2"></div>
                          <div className="h-4 bg-orange-200 rounded w-3/4"></div>
                        </div>
                      ) : progress?.hindi_output ? (
                        <p className="text-orange-700 text-sm">{progress.hindi_output}</p>
                      ) : (
                        <p className="text-orange-600 text-sm italic">{getPlaceholderContent(module.name).hindi}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {demoResults && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Demo Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Modules:</span> {demoResults.total_modules}
              </div>
              <div>
                <span className="font-medium">Successful:</span> {demoResults.successful_modules}
              </div>
              <div>
                <span className="font-medium">Success Rate:</span> {
                  ((demoResults.successful_modules / demoResults.total_modules) * 100).toFixed(1)
                }%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Module Demonstrations</h3>
            
            {demoResults.demo_results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    {result.status === 'success' ? (
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                    ) : (
                      <XCircle className="text-red-600 mr-2" size={16} />
                    )}
                    {result.module}
                  </h4>
                  <button
                    onClick={() => runSingleModuleDemo(result.module, result.demo_input)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
                  >
                    Re-run
                  </button>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Demo Input:</strong> {result.demo_input}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <h5 className="font-medium text-blue-800 mb-2">📝 English Output</h5>
                    <p className="text-blue-700 text-sm">{result.english_output}</p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <h5 className="font-medium text-orange-800 mb-2">🇮🇳 Hindi Output</h5>
                    <p className="text-orange-700 text-sm">{result.hindi_output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">
              Demo completed at: {new Date(demoResults.demo_timestamp).toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm">
              Powered by {demoResults.ai_model} via {demoResults.api_provider}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BilingualDemoMode;
