import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Presentation, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SlideGenerator = ({ onSlidesGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/slides/generate', data);
      toast.success('Slides generated successfully!');
      onSlidesGenerated(response.data.data);
    } catch (error) {
      toast.error('Failed to generate slides');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Presentation className="text-orange-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Generate Slides</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              {...register('subject', { required: 'Subject is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              defaultValue="Physics"
            >
              <option value="">Select Subject</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Economics">Economics</option>
              <option value="History">History</option>
              <option value="English">English</option>
            </select>
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic *
            </label>
            <input
              {...register('topic', { required: 'Topic is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Try: Laws of Motion, Mughal Empire, Cell Division, Photosynthesis"
              defaultValue="Laws of Motion"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              Slide Count
            </label>
            <input
              {...register('slideCount')}
              type="number"
              min="5"
              max="20"
              defaultValue="8"
              placeholder="5-15 slides recommended"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              {...register('theme')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="default">Default</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="colorful">Colorful</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template
            </label>
            <select
              {...register('template')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="education">Education</option>
              <option value="business">Business</option>
              <option value="scientific">Scientific</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            {...register('includeImages')}
            type="checkbox"
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Include AI-generated images</label>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Slides...
            </>
          ) : (
            'Generate Slides'
          )}
        </button>
      </form>
    </div>
  );
};

export default SlideGenerator;