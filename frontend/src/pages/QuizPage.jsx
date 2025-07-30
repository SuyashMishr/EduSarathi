import React, { useState } from 'react';
import QuizGenerator from '../components/QuizGenerator';
import Physics11Topics from '../components/Physics11Topics';
import QuizTestButton from '../components/QuizTestButton';
import QuizViewer from '../components/QuizViewer';
import QuizEditor from '../components/QuizEditor';

const QuizPage = () => {
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentView, setCurrentView] = useState('generator'); // 'generator', 'viewer', 'editor'

  const handleQuizGenerated = (quiz) => {
    setGeneratedQuiz(quiz);
    setCurrentView('viewer');
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleEditQuiz = () => {
    setCurrentView('editor');
  };

  const handleSaveQuiz = (editedQuiz) => {
    setGeneratedQuiz(editedQuiz);
    setCurrentView('viewer');
  };

  const handleCancelEdit = () => {
    setCurrentView('viewer');
  };

  const handleStartNewQuiz = () => {
    setGeneratedQuiz(null);
    setCurrentView('generator');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Generator</h1>
        <p className="text-gray-600">
          Create engaging quizzes with multiple question types using AI technology.
        </p>
      </div>

      {currentView === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <QuizGenerator
              onQuizGenerated={handleQuizGenerated}
              selectedTopic={selectedTopic}
            />
          </div>

          <div className="space-y-6">
            <QuizTestButton />
            <Physics11Topics onTopicSelect={handleTopicSelect} />
          </div>

          <div>
            {generatedQuiz ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Generated Quiz: {generatedQuiz.title}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Subject:</span>
                      <p className="text-gray-600">{generatedQuiz.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Topic:</span>
                      <p className="text-gray-600">{generatedQuiz.topic}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Questions:</span>
                      <p className="text-gray-600">{generatedQuiz.questions?.length || 0}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('viewer')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View & Start Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Generated</h3>
                <p className="text-gray-600">
                  Fill out the form on the left to generate your quiz.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'viewer' && generatedQuiz && (
        <QuizViewer
          quiz={generatedQuiz}
          onEdit={handleEditQuiz}
          onStartNew={handleStartNewQuiz}
        />
      )}

      {currentView === 'editor' && generatedQuiz && (
        <QuizEditor
          quiz={generatedQuiz}
          onSave={handleSaveQuiz}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default QuizPage;