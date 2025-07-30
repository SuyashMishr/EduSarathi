import React, { useState, useEffect } from 'react';
import { Play, Download, Edit, Eye, EyeOff, Clock, CheckCircle, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const QuizViewer = ({ quiz, onEdit, onStartNew }) => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isQuizStarted && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, isQuizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowAnswers({});
    setTimeElapsed(0);
    setIsQuizCompleted(false);
    toast.success('Quiz started! Good luck!');
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleShowAnswer = (questionIndex) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    setIsQuizCompleted(true);
    toast.success('Quiz completed!');
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach((question, index) => {
      totalPoints += question.points || 1;
      if (userAnswers[index] === question.correct_answer) {
        correct += question.points || 1;
      }
    });
    
    return { correct, totalPoints, percentage: Math.round((correct / totalPoints) * 100) };
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text(quiz.title || 'Quiz', 20, yPosition);
      yPosition += 15;

      // Quiz info
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Subject: ${quiz.subject}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Topic: ${quiz.topic}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Grade: ${quiz.grade}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Difficulty: ${quiz.difficulty}`, 20, yPosition);
      yPosition += 15;

      // Questions
      quiz.questions.forEach((question, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        // Question number and text
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
        yPosition += 10;

        // Options for MCQ
        if (question.type === 'mcq' && question.options) {
          doc.setFont(undefined, 'normal');
          question.options.forEach((option, optIndex) => {
            const letter = String.fromCharCode(65 + optIndex);
            doc.text(`   ${letter}) ${option}`, 25, yPosition);
            yPosition += 7;
          });
        }

        yPosition += 10;

        // Answer section (hidden by default)
        doc.setFont(undefined, 'italic');
        doc.text('Answer: ___________________', 20, yPosition);
        yPosition += 15;
      });

      doc.save(`${quiz.title || 'quiz'}.pdf`);
      toast.success('Quiz PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (!quiz || !quiz.questions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No quiz data available</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const score = isQuizCompleted ? calculateScore() : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{quiz.title}</h2>
          <p className="text-sm text-gray-600">
            {quiz.subject} • {quiz.topic} • Grade {quiz.grade} • {quiz.questions.length} Questions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isQuizStarted && (
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded">
              <Clock size={16} className="text-blue-600" />
              <span className="text-blue-800 font-mono">{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isQuizStarted && (
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={startQuiz}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Play size={16} />
            <span>Start Quiz</span>
          </button>
          
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            <Edit size={16} />
            <span>Edit Quiz</span>
          </button>
        </div>
      )}

      {/* Quiz Content */}
      {!isQuizStarted ? (
        // Quiz Preview
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Quiz Preview</h3>
          {quiz.questions.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-800">
                  {index + 1}. {question.question}
                </h4>
                <button
                  onClick={() => toggleShowAnswer(index)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  {showAnswers[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="text-sm">
                    {showAnswers[index] ? 'Hide' : 'Show'} Answer
                  </span>
                </button>
              </div>

              {question.type === 'mcq' && question.options && (
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {showAnswers[index] && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                  <p className="text-green-800 font-medium">
                    <strong>Answer:</strong> {question.correct_answer}
                  </p>
                  {question.explanation && (
                    <p className="text-green-700 mt-2">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  )}
                  {question.ncert_reference && (
                    <p className="text-green-600 text-sm mt-1">
                      <strong>NCERT Reference:</strong> {question.ncert_reference}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : isQuizCompleted ? (
        // Quiz Results
        <div className="text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Quiz Completed!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">{score.correct}</p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{score.totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{score.percentage}%</p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
            </div>
            <p className="text-gray-600 mt-4">Time taken: {formatTime(timeElapsed)}</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsQuizStarted(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Review Quiz
            </button>
            <button
              onClick={onStartNew}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Generate New Quiz
            </button>
          </div>
        </div>
      ) : (
        // Quiz Taking Interface
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Counter */}
          <div className="text-center">
            <span className="text-lg font-medium text-gray-800">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>

          {/* Current Question */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'mcq' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={userAnswers[currentQuestionIndex] === option}
                      onChange={() => handleAnswerSelect(currentQuestionIndex, option)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={completeQuiz}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Complete Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
