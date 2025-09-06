import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NCERTContentLoader from './NCERTContentLoader';

const CurriculumForm = ({ onCurriculumGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCurriculum, setGeneratedCurriculum] = useState(null);
  const [formData, setFormData] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    setFormData(data);
    setGeneratedCurriculum(null);
    
    try {
      // Try Gemini API first
      let response;
      try {
        response = await axios.post('/api/gemini/curriculum/generate', data);
        toast.success('Curriculum generated successfully with Gemini AI!');
      } catch (geminiError) {
        console.warn('Gemini API failed, falling back to legacy API:', geminiError);
        response = await axios.post('/api/curriculum/generate', data);
        toast.success('Curriculum generated successfully!');
      }
      
      const curriculumData = response.data.data || response.data;
      setGeneratedCurriculum(curriculumData);
      onCurriculumGenerated(curriculumData);
    } catch (error) {
      toast.error('Failed to generate curriculum');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <BookOpen className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Generate Curriculum</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Currently optimized for Physics Class 11 based on NCERT content.
          Other subjects will use general AI knowledge.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              {...register('subject', { required: 'Subject is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Try: Physics (NCERT available), Chemistry, Mathematics, Biology"
              defaultValue="Physics"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade *
            </label>
            <select
              {...register('grade', { required: 'Grade is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="11"
            >
              <option value="">Select Grade</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                <option key={grade} value={grade}>
                  Grade {grade} {grade === 11 ? '(NCERT Physics Available)' : ''}
                </option>
              ))}
            </select>
            {errors.grade && (
              <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Board/Framework
          </label>
          <select
            {...register('board')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="CBSE"
          >
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="IB">International Baccalaureate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (weeks)
          </label>
          <input
            {...register('duration')}
            type="number"
            min="1"
            max="52"
            defaultValue="12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives
          </label>
          <textarea
            {...register('learningObjectives')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what students should learn..."
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Curriculum...
            </>
          ) : (
            'Generate Curriculum'
          )}
        </button>
      </form>
      
      {/* Show NCERT Content Loader when generating or displaying results */}
      {(isGenerating || generatedCurriculum) && (
        <div className="mt-6">
          <NCERTContentLoader
            isLoading={isGenerating}
            content={generatedCurriculum}
            contentType="curriculum"
            grade={formData?.grade}
            subject={formData?.subject}
            topic={formData?.topic}
          />
        </div>
      )}
    </div>
  );
};

export default CurriculumForm;