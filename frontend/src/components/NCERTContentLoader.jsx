import React from 'react';
import { BookOpen, Brain, CheckCircle, Clock, FileText, Lightbulb, Loader2 } from 'lucide-react';

// Simple UI components to replace the missing ones
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 bg-white text-gray-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const NCERTContentLoader = ({ 
  isLoading, 
  content, 
  contentType = 'quiz',
  grade,
  subject,
  topic 
}) => {
  if (isLoading) {
    return <LoadingPlaceholder contentType={contentType} grade={grade} subject={subject} topic={topic} />;
  }

  if (!content) {
    return null;
  }

  return <ContentDisplay content={content} contentType={contentType} />;
};

const LoadingPlaceholder = ({ contentType, grade, subject, topic }) => {
  const getLoadingMessages = () => {
    switch (contentType) {
      case 'quiz':
        return [
          `🔍 Analyzing NCERT Class ${grade} ${subject} curriculum...`,
          `📚 Extracting content from "${topic}" chapter...`,
          `🧠 Generating NCERT-aligned questions using AI...`,
          `✅ Creating comprehensive quiz with explanations...`,
          `🎯 Finalizing quiz based on learning objectives...`
        ];
      case 'curriculum':
        return [
          `📋 Reviewing NCERT Class ${grade} ${subject} syllabus...`,
          `🗓️ Planning curriculum structure and timeline...`,
          `🎯 Aligning learning objectives with NCERT standards...`,
          `📊 Creating assessment strategies...`,
          `✨ Finalizing comprehensive curriculum plan...`
        ];
      case 'content':
        return [
          `📖 Accessing NCERT Class ${grade} ${subject} textbook...`,
          `🔍 Locating "${topic}" content and examples...`,
          `🧠 Processing content with AI...`,
          `📝 Generating detailed explanations...`,
          `✅ Preparing NCERT-aligned educational content...`
        ];
      default:
        return [
          `🤖 Processing your request with AI...`,
          `📚 Accessing NCERT database...`,
          `✨ Generating high-quality content...`
        ];
    }
  };

  const [currentMessage, setCurrentMessage] = React.useState(0);
  const messages = getLoadingMessages();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 animate-pulse" />
          <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Generating NCERT-Aligned Content
        </CardTitle>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Class {grade}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {subject}
          </Badge>
          {topic && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {topic}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Processing Step */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-blue-700 font-medium">
              {messages[currentMessage]}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">NCERT Aligned</h4>
              <p className="text-sm text-green-600">Following official curriculum</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
            <div>
              <h4 className="font-semibold text-purple-800">AI Powered</h4>
              <p className="text-sm text-purple-600">Powered by OpenRouter models</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800">Quality Content</h4>
              <p className="text-sm text-orange-600">Comprehensive and accurate</p>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            What makes our content special:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>100% NCERT curriculum aligned</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Grade-appropriate difficulty level</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Comprehensive explanations</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real textbook examples</span>
            </li>
          </ul>
        </div>

        {/* Estimated Time */}
        <div className="text-center text-sm text-gray-500 flex items-center justify-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>Estimated time: 30-60 seconds</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentDisplay = ({ content, contentType }) => {
  const renderQuizContent = () => {
    if (!content.questions) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {content.title || 'Generated Quiz'}
          </h3>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ NCERT Aligned
            </Badge>
            {/* AI service badge removed */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{content.questions.length}</div>
            <div className="text-sm text-blue-600">Questions</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{content.total_points || content.totalPoints || 'N/A'}</div>
            <div className="text-sm text-green-600">Total Points</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{content.estimated_time || content.estimatedTime || 'N/A'}</div>
            <div className="text-sm text-orange-600">Minutes</div>
          </div>
        </div>

        <div className="space-y-4">
          {content.questions.map((question, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Question {index + 1}
                  </h4>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {question.points || 1} pts
                    </Badge>
                    {question.ncert_reference && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        📚 {question.ncert_reference}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{question.question}</p>
                
                {question.options && (
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`p-2 rounded border ${
                          option === question.correct_answer || option === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                )}
                
                {question.explanation && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Explanation:</h5>
                    <p className="text-blue-700 text-sm">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCurriculumContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">
          {content.title || 'Generated Curriculum'}
        </h3>
        
        {content.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{content.description}</p>
          </div>
        )}
        
        {content.modules && content.modules.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Curriculum Modules</h4>
            {content.modules.map((module, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">{module.title}</h5>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGenericContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="prose max-w-none">
            {typeof content === 'string' ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(content, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {contentType === 'quiz' && renderQuizContent()}
        {contentType === 'curriculum' && renderCurriculumContent()}
        {!['quiz', 'curriculum'].includes(contentType) && renderGenericContent()}
      </CardContent>
    </Card>
  );
};

export default NCERTContentLoader;