import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LecturePlanDisplay from './LecturePlanDisplay';

const LecturePlanner = ({ onPlanGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/lecture-plan/generate', data);
      toast.success('Lecture plan generated successfully!');
      setGeneratedPlan(response.data.data);
      if (onPlanGenerated) {
        onPlanGenerated(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to generate lecture plan');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (plan) => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `lecture-plan-${plan.subject}-${plan.topic}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Lecture plan downloaded!');
  };

  const handleShare = (plan) => {
    if (navigator.share) {
      navigator.share({
        title: plan.title,
        text: plan.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEdit = (plan) => {
    // Reset form with current plan data
    setGeneratedPlan(null);
    toast.info('Edit mode activated. Modify the form and regenerate.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Calendar className="text-red-600 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Generate Lecture Plan</h2>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              {...register('subject', { required: 'Subject is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Try: Laws of Motion, Chemical Bonding, Quadratic Equations, Cell Division, Market Structures"
            />
            {errors.topic && (
              <p className="text-red-500 text-xs mt-1">{errors.topic.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade *
            </label>
            <select
              {...register('grade', { required: 'Grade is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              defaultValue="11"
            >
              <option value="">Select Grade</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            {errors.grade && (
              <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              {...register('duration')}
              type="number"
              min="30"
              max="180"
              defaultValue="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              defaultValue="intermediate"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives
          </label>
          <textarea
            {...register('learningObjectives')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Example: Students will understand Newton's laws of motion and apply them to solve real-world physics problems"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teaching Strategies
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'Interactive Discussion',
              'Visual Aids',
              'Hands-on Activities',
              'Group Work',
              'Problem Solving',
              'Demonstrations',
              'Case Studies',
              'Technology Integration'
            ].map((strategy) => (
              <label key={strategy} className="flex items-center text-sm">
                <input
                  {...register('teachingStrategies')}
                  type="checkbox"
                  value={strategy}
                  className="mr-2"
                />
                {strategy}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Lecture Plan...
            </>
          ) : (
            'Generate Lecture Plan'
          )}
        </button>
      </form>
      </div>

      {/* Display generated lecture plan */}
      {generatedPlan && (
        <LecturePlanDisplay
          lecturePlan={generatedPlan}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default LecturePlanner;