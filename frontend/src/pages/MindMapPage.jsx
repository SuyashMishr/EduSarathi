import React from 'react';
import MindMapViewer from '../components/MindMapViewer';

const MindMapPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mind Map Generator</h1>
          <p className="text-gray-600">
            Create visual mind maps to help organize and understand complex topics.
          </p>
        </div>
        
        <MindMapViewer />
      </div>
    </div>
  );
};

export default MindMapPage;