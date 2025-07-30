import React, { useState } from 'react';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const QuizEditor = ({ quiz, onSave, onCancel }) => {
  const [editedQuiz, setEditedQuiz] = useState({
    ...quiz,
    questions: quiz.questions.map(q => ({ ...q }))
  });

  const updateQuizField = (field, value) => {
    setEditedQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateQuestion = (questionIndex, field, value) => {
    setEditedQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setEditedQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? {
          ...q,
          options: q.options.map((opt, optIdx) => 
            optIdx === optionIndex ? value : opt
          )
        } : q
      )
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      type: 'mcq',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: ''
    };

    setEditedQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (editedQuiz.questions.length <= 1) {
      toast.error('Quiz must have at least one question');
      return;
    }

    setEditedQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const addOption = (questionIndex) => {
    setEditedQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? {
          ...q,
          options: [...(q.options || []), '']
        } : q
      )
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const question = editedQuiz.questions[questionIndex];
    if (question.options.length <= 2) {
      toast.error('Question must have at least 2 options');
      return;
    }

    setEditedQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? {
          ...q,
          options: q.options.filter((_, optIdx) => optIdx !== optionIndex)
        } : q
      )
    }));
  };

  const handleSave = () => {
    // Validate quiz
    if (!editedQuiz.title?.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (editedQuiz.questions.length === 0) {
      toast.error('Quiz must have at least one question');
      return;
    }

    for (let i = 0; i < editedQuiz.questions.length; i++) {
      const question = editedQuiz.questions[i];
      
      if (!question.question?.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }

      if (question.type === 'mcq') {
        if (!question.options || question.options.length < 2) {
          toast.error(`Question ${i + 1} must have at least 2 options`);
          return;
        }

        if (question.options.some(opt => !opt?.trim())) {
          toast.error(`Question ${i + 1} has empty options`);
          return;
        }

        if (!question.correct_answer?.trim()) {
          toast.error(`Question ${i + 1} must have a correct answer`);
          return;
        }

        if (!question.options.includes(question.correct_answer)) {
          toast.error(`Question ${i + 1} correct answer must be one of the options`);
          return;
        }
      }
    }

    onSave(editedQuiz);
    toast.success('Quiz saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Edit Quiz</h2>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Save size={16} />
          <span>Save Quiz</span>
        </button>
      </div>

      {/* Quiz Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title
          </label>
          <input
            type="text"
            value={editedQuiz.title || ''}
            onChange={(e) => updateQuizField('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={editedQuiz.difficulty || 'medium'}
            onChange={(e) => updateQuizField('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Questions</h3>
          <button
            onClick={addQuestion}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Add Question</span>
          </button>
        </div>

        {editedQuiz.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800">Question {questionIndex + 1}</h4>
              <button
                onClick={() => removeQuestion(questionIndex)}
                className="text-red-600 hover:text-red-800"
                disabled={editedQuiz.questions.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <textarea
                value={question.question || ''}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Enter question text"
              />
            </div>

            {/* Question Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Type
              </label>
              <select
                value={question.type || 'mcq'}
                onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>

            {/* Options (for MCQ) */}
            {question.type === 'mcq' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <button
                    onClick={() => addOption(questionIndex)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <input
                        type="text"
                        value={option || ''}
                        onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                      <button
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="text-red-600 hover:text-red-800"
                        disabled={question.options.length <= 2}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                {question.type === 'mcq' ? (
                  <select
                    value={question.correct_answer || ''}
                    onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correct answer</option>
                    {(question.options || []).map((option, optIdx) => (
                      <option key={optIdx} value={option}>
                        {String.fromCharCode(65 + optIdx)}) {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={question.correct_answer || ''}
                    onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter correct answer"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={question.points || 1}
                  onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional)
              </label>
              <textarea
                value={question.explanation || ''}
                onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Enter explanation for the answer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizEditor;
