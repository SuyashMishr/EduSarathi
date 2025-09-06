import React, { useState } from 'react';
import MindMapViewer from '../components/MindMapViewer';
import MindMapGenerator from '../components/MindMapGenerator';

const MindMapPage = () => {
  const [generatedMindMap, setGeneratedMindMap] = useState(null);

  const handleMindMapGenerated = (mindMapData) => {
    setGeneratedMindMap(mindMapData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mind Map Generator</h1>
          <p className="text-gray-600">
            Create visual mind maps to help organize and understand complex topics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MindMapGenerator onMindMapGenerated={handleMindMapGenerated} />
          </div>
          
          <div>
            <MindMapViewer mindMapData={generatedMindMap} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapPage;