import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HelpCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NCERTContentLoader from './NCERTContentLoader';
import { useLanguage } from './LanguageSelector';

const QuizGenerator = ({ onQuizGenerated, selectedTopic }) => {
  const { currentLanguage, t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [formData, setFormData] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Update topic when selectedTopic prop changes
  React.useEffect(() => {
    if (selectedTopic) {
      setValue('topic', selectedTopic);
    }
  }, [selectedTopic, setValue]);

  const onSubmit = async (data) => {
    setIsGenerating(true);
    setFormData(data);
    setGeneratedQuiz(null);

    try {
      // Ensure questionCount is a number and reasonable
      const requestData = {
        ...data,
        questionCount: parseInt(data.questionCount) || 3,
        grade: parseInt(data.grade) || 11,
        questionTypes: Array.isArray(data.questionTypes) ? data.questionTypes : ['mcq'],
        difficulty: data.difficulty || 'easy',
        language: data.language || currentLanguage || 'en'
      };

      // If questionTypes is a string, convert to array
      if (typeof requestData.questionTypes === 'string') {
        requestData.questionTypes = [requestData.questionTypes];
      }

      // Ensure at least one question type is selected
      if (!requestData.questionTypes || requestData.questionTypes.length === 0) {
        requestData.questionTypes = ['mcq'];
      }

      console.log('Sending quiz request:', requestData);

      // Call backend quiz API (OpenRouter-backed)
      let response = await axios.post('/api/quiz/generate', requestData, {
        timeout: 45000,
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Quiz generated successfully!');

      const quizData = response.data.data || response.data;
      setGeneratedQuiz(quizData);
      onQuizGenerated(quizData);
    } catch (error) {
      console.error('Quiz generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <HelpCircle className="text-green-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">{t('quiz.title')}</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-800 text-sm">
          <strong>{t('common.note') || 'Note'}:</strong> {
            currentLanguage === 'hi'
              ? 'NCERT सामग्री पर आधारित कक्षा 11 के सभी विषयों (भौतिक विज्ञान, रसायन विज्ञान, गणित, जीव विज्ञान, अर्थशास्त्र) के साथ सर्वोत्तम परिणाम।'
              : 'Best results with Class 11 subjects (Physics, Chemistry, Mathematics, Biology, Economics) based on NCERT content.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quiz.subject')} *
            </label>
            <select
              {...register('subject', { required: t('quiz.subject') + ' is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue={currentLanguage === 'hi' ? 'भौतिक विज्ञान' : 'Physics'}
            >
              {currentLanguage === 'hi' ? (
                <>
                  <option value="भौतिक विज्ञान">भौतिक विज्ञान (Physics)</option>
                  <option value="रसायन विज्ञान">रसायन विज्ञान (Chemistry)</option>
                  <option value="गणित">गणित (Mathematics)</option>
                  <option value="जीव विज्ञान">जीव विज्ञान (Biology)</option>
                  <option value="अर्थशास्त्र">अर्थशास्त्र (Economics)</option>
                </>
              ) : (
                <>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Economics">Economics</option>
                </>
              )}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quiz.topic')} *
            </label>
            <input
              {...register('topic', { required: t('quiz.topic') + ' is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={currentLanguage === 'hi' ? 
                'उदाहरण: गति के नियम, त्रिकोणमितीय फलन, परमाणु की संरचना, कोशिका' : 
                'Try: Laws of Motion, Quadratic Equations, Cell Division, Photosynthesis'
              }
              defaultValue={selectedTopic || (currentLanguage === 'hi' ? 'गति के नियम' : 'Laws of Motion')}
            />
            {errors.topic && (
              <p className="text-red-500 text-xs mt-1">{errors.topic.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              {...register('grade')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="11"
            >
              <option value="">Select Grade</option>
              {[6,7,8,9,10,11,12].map(grade => (
                <option key={grade} value={grade}>Class {grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Count
            </label>
            <input
              {...register('questionCount')}
              type="number"
              min="1"
              max="10"
              defaultValue="5"
              placeholder="3-8 questions recommended"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="medium"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              {...register('language')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue={currentLanguage}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Types
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                {...register('questionTypes')}
                type="checkbox"
                value="mcq"
                defaultChecked
                className="mr-2"
              />
              Multiple Choice
            </label>
            <label className="flex items-center">
              <input
                {...register('questionTypes')}
                type="checkbox"
                value="true_false"
                className="mr-2"
              />
              True/False
            </label>
            <label className="flex items-center">
              <input
                {...register('questionTypes')}
                type="checkbox"
                value="short_answer"
                className="mr-2"
              />
              Short Answer
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Quiz...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>
      
      {/* Show NCERT Content Loader when generating or displaying results */}
      {(isGenerating || generatedQuiz) && (
        <div className="mt-6">
          <NCERTContentLoader
            isLoading={isGenerating}
            content={generatedQuiz}
            contentType="quiz"
            grade={formData?.grade}
            subject={formData?.subject}
            topic={formData?.topic}
          />
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;