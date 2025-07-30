import React from 'react';
import LecturePlanner from '../components/LecturePlanner';

const LecturePlanPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecture Plan Generator</h1>
          <p className="text-gray-600">
            Generate comprehensive lecture plans with structured content and timing.
          </p>
        </div>
        
        <LecturePlanner />
      </div>
    </div>
  );
};

export default LecturePlanPage;