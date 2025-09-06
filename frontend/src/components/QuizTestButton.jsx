import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuizTestButton = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testQuizGeneration = async () => {
    setTesting(true);
    setResult(null);

    const testData = {
      subject: "Physics",
      topic: "Motion in a Straight Line",
      grade: 11,
      questionCount: 2,
      difficulty: "easy",
      questionTypes: ["mcq"],
      language: "en"
    };

    try {
      console.log('Testing quiz generation with data:', testData);
      
  const response = await axios.post('/api/quiz/generate', testData, {
        timeout: 45000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Quiz generation response:', response.data);

      if (response.data.success) {
        setResult({
          status: 'success',
          message: `Generated ${response.data.data.questions?.length || 0} questions successfully!`,
          data: response.data.data
        });
        toast.success('Quiz generation test passed!');
      } else {
        setResult({
          status: 'error',
          message: 'Quiz generation returned unsuccessful response'
        });
        toast.error('Quiz generation test failed');
      }

    } catch (error) {
      console.error('Quiz generation test error:', error);
      
      let errorMessage = 'Unknown error';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setResult({
        status: 'error',
        message: `Error: ${errorMessage}`,
        details: error.response?.data || error.message
      });
      
      toast.error(`Test failed: ${errorMessage}`);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Quiz Generation Test</h3>
        <button
          onClick={testQuizGeneration}
          disabled={testing}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Play size={16} />
          )}
          <span>{testing ? 'Testing...' : 'Test Quiz Generation'}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(result.status)}
            <span className={`text-sm font-medium ${
              result.status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.status === 'success' ? 'SUCCESS' : 'FAILED'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">{result.message}</p>
          
          {result.status === 'success' && result.data && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-800">
                <strong>Quiz Title:</strong> {result.data.title}
              </p>
              <p className="text-sm text-green-800">
                <strong>Questions:</strong> {result.data.questions?.length || 0}
              </p>
              <p className="text-sm text-green-800">
                <strong>Total Points:</strong> {result.data.total_points || 0}
              </p>
            </div>
          )}
          
          {result.status === 'error' && result.details && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-xs text-red-600 font-mono">
                {JSON.stringify(result.details, null, 2)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Test Parameters:</strong> Physics, Motion in a Straight Line, Grade 11, 2 MCQ questions, Easy difficulty
        </p>
      </div>
    </div>
  );
};

export default QuizTestButton;
