import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const QuickTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const runQuickTest = async () => {
    setTesting(true);
    setResults(null);

    const testResults = {
      backend: { status: 'testing', message: '' },
      aiService: { status: 'testing', message: '' },
      quizGeneration: { status: 'testing', message: '' }
    };

    try {
      // Test 1: Backend Health
      try {
        const backendResponse = await axios.get('/health', { timeout: 5000 });
        testResults.backend = {
          status: backendResponse.data.status === 'OK' ? 'success' : 'error',
          message: backendResponse.data.status === 'OK' ? 'Backend is healthy' : 'Backend returned unexpected status'
        };
      } catch (error) {
        testResults.backend = {
          status: 'error',
          message: `Backend connection failed: ${error.message}`
        };
      }

      // Test 2: AI Service Health
      try {
        const aiResponse = await axios.get('/api/ai-health', { timeout: 5000 });
        testResults.aiService = {
          status: aiResponse.data.status === 'online' ? 'success' : 'error',
          message: aiResponse.data.status === 'online' ? 'AI Service is online' : 'AI Service is offline'
        };
      } catch (error) {
        testResults.aiService = {
          status: 'error',
          message: `AI Service check failed: ${error.message}`
        };
      }

      // Test 3: Quiz Generation (only if AI service is working)
      if (testResults.aiService.status === 'success') {
        try {
          const quizResponse = await axios.post('/api/gemini/quiz/generate', {
            subject: 'Physics',
            topic: 'Motion in a Straight Line',
            grade: 11,
            questionCount: 1,
            difficulty: 'easy',
            questionTypes: ['mcq'],
            language: 'en'
          }, { timeout: 30000 });

          if (quizResponse.data.success && quizResponse.data.data.questions) {
            testResults.quizGeneration = {
              status: 'success',
              message: `Generated ${quizResponse.data.data.questions.length} question(s) successfully`
            };
          } else {
            testResults.quizGeneration = {
              status: 'error',
              message: 'Quiz generation returned unexpected format'
            };
          }
        } catch (error) {
          testResults.quizGeneration = {
            status: 'error',
            message: `Quiz generation failed: ${error.message}`
          };
        }
      } else {
        testResults.quizGeneration = {
          status: 'skipped',
          message: 'Skipped due to AI Service being offline'
        };
      }

    } catch (error) {
      console.error('Test error:', error);
    }

    setResults(testResults);
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
      case 'testing':
        return <Loader2 className="text-blue-500 animate-spin" size={16} />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">System Quick Test</h3>
        <button
          onClick={runQuickTest}
          disabled={testing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Play size={16} />
          )}
          <span>{testing ? 'Testing...' : 'Run Test'}</span>
        </button>
      </div>

      {results && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Backend Health</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.backend.status)}
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(results.backend.status)}`}>
                {results.backend.status}
              </span>
            </div>
          </div>
          {results.backend.message && (
            <p className="text-xs text-gray-500 ml-4">{results.backend.message}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">AI Service</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.aiService.status)}
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(results.aiService.status)}`}>
                {results.aiService.status}
              </span>
            </div>
          </div>
          {results.aiService.message && (
            <p className="text-xs text-gray-500 ml-4">{results.aiService.message}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quiz Generation</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.quizGeneration.status)}
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(results.quizGeneration.status)}`}>
                {results.quizGeneration.status}
              </span>
            </div>
          </div>
          {results.quizGeneration.message && (
            <p className="text-xs text-gray-500 ml-4">{results.quizGeneration.message}</p>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Quick Test:</strong> This tests backend connectivity, AI service status, and quiz generation functionality.
        </p>
      </div>
    </div>
  );
};

export default QuickTest;
