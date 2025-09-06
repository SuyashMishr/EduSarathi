import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Brain, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MindMapGenerator = ({ onMindMapGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMindMap, setGeneratedMindMap] = useState(null);
  const [formData, setFormData] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    setFormData(data);
    setGeneratedMindMap(null);
    
    try {
      // Check if this is a Physics + Laws of Motion demo request
      const isPhysicsDemo = data.subject === 'Physics' && 
                          (data.topic.toLowerCase().includes('motion') || 
                           data.topic.toLowerCase().includes('force') ||
                           data.topic.toLowerCase().includes('newton') ||
                           data.topic.toLowerCase() === 'laws of motion' ||
                           data.topic.toLowerCase().includes('mechanics'));
      
      if (isPhysicsDemo) {
        // Show demo mindmap with the uploaded image
        const demoMindMapData = {
          title: `${data.subject}: ${data.topic}`,
          subject: data.subject,
          topic: data.topic,
          type: 'demo',
          demoImage: '/images/physics-laws-of-motion-mindmap.png',
          description: 'Comprehensive mind map covering Newton\'s Laws of Motion from our Class 11 Physics 12-week CBSE curriculum. Includes Week 4 content: inertia, force relationships, momentum, friction, and real-world applications.',
          nodes: [
            {
              id: 'central',
              type: 'central',
              label: 'Laws of Motion',
              position: { x: 300, y: 200 }
            },
            {
              id: 'newton1',
              type: 'main',
              label: 'Newton\'s First Law (Inertia)',
              position: { x: 100, y: 100 }
            },
            {
              id: 'newton2',
              type: 'main', 
              label: 'Newton\'s Second Law (F=ma)',
              position: { x: 500, y: 100 }
            },
            {
              id: 'newton3',
              type: 'main',
              label: 'Newton\'s Third Law (Action-Reaction)',
              position: { x: 300, y: 50 }
            },
            {
              id: 'momentum',
              type: 'secondary',
              label: 'Momentum & Conservation',
              position: { x: 150, y: 300 }
            },
            {
              id: 'friction',
              type: 'secondary',
              label: 'Friction Forces',
              position: { x: 450, y: 300 }
            }
          ],
          metadata: {
            isDemo: true,
            hasImage: true,
            imageUrl: '/images/physics-laws-of-motion-mindmap.png'
          }
        };
        
        setTimeout(() => {
          setGeneratedMindMap(demoMindMapData);
          onMindMapGenerated(demoMindMapData);
          toast.success('Demo mind map generated! This shows our Class 11 Physics curriculum structure with your uploaded image.');
          setIsGenerating(false);
        }, 1500); // Simulate generation time
        
        return;
      }
      
  // Regular API call for other topics
  const response = await axios.post('/api/mindmap/generate', data);
  toast.success('Mind map generated successfully!');
      
      const mindMapData = response.data.data || response.data;
      setGeneratedMindMap(mindMapData);
      onMindMapGenerated(mindMapData);
    } catch (error) {
      toast.error('Failed to generate mind map');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Brain className="text-indigo-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Generate Mind Map</h2>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <p className="text-indigo-800 text-sm mb-2">
          <strong>Demo Available:</strong> Try "Physics" + "Laws of Motion" or "Newton" or "Mechanics" to see our comprehensive mind map with your uploaded image!
        </p>
        <p className="text-indigo-700 text-xs">
          Features Class 11 CBSE Physics curriculum with 12-week structure. Best results with Physics, Chemistry, Mathematics, Biology topics.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              {...register('subject', { required: 'Subject is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Try: Laws of Motion, Chemical Bonding, Photosynthesis, Market Structures"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              Complexity
            </label>
            <select
              {...register('complexity')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="moderate"
            >
              <option value="simple">Simple</option>
              <option value="moderate">Moderate</option>
              <option value="complex">Complex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="intermediate"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              {...register('layout')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="hierarchical"
            >
              <option value="hierarchical">Hierarchical</option>
              <option value="radial">Radial</option>
              <option value="tree">Tree</option>
              <option value="circular">Circular</option>
              <option value="force">Force-directed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              {...register('theme')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="colorful"
            >
              <option value="default">Default</option>
              <option value="colorful">Colorful</option>
              <option value="minimal">Minimal</option>
              <option value="academic">Academic</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives (Optional)
          </label>
          <textarea
            {...register('learningObjectives')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Example: Help students visualize the relationships between Newton's three laws and their real-world applications"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Mind Map...
            </>
          ) : (
            'Generate Mind Map'
          )}
        </button>
      </form>
    </div>
  );
};

export default MindMapGenerator;
