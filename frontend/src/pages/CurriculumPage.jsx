import React, { useState } from 'react';
import CurriculumForm from '../components/CurriculumForm';

const CurriculumPage = () => {
  const [generatedCurriculum, setGeneratedCurriculum] = useState(null);

  const handleCurriculumGenerated = (curriculum) => {
    setGeneratedCurriculum(curriculum);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Curriculum Generator</h1>
        <p className="text-gray-600">
          Create comprehensive curricula tailored to your educational requirements using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CurriculumForm onCurriculumGenerated={handleCurriculumGenerated} />
        </div>

        <div>
          {generatedCurriculum ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Generated Curriculum
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Title</h3>
                  <p className="text-gray-600">{generatedCurriculum.title}</p>
                </div>

                {generatedCurriculum.description && (
                  <div>
                    <h3 className="font-medium text-gray-700">Description</h3>
                    <p className="text-gray-600">{generatedCurriculum.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Subject</h3>
                    <p className="text-gray-600">{generatedCurriculum.subject}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Grade</h3>
                    <p className="text-gray-600">Grade {generatedCurriculum.grade}</p>
                  </div>
                </div>

                {generatedCurriculum.units && generatedCurriculum.units.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Units</h3>
                    <div className="space-y-2">
                      {generatedCurriculum.units.map((unit, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <h4 className="font-medium text-gray-800">{unit.title}</h4>
                          {unit.description && (
                            <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                          )}
                          {unit.duration && (
                            <p className="text-xs text-gray-500 mt-1">Duration: {unit.duration} weeks</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedCurriculum.learningObjectives && generatedCurriculum.learningObjectives.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {generatedCurriculum.learningObjectives.map((objective, index) => (
                        <li key={index} className="text-sm text-gray-600">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Download PDF
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                  Edit Curriculum
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Curriculum Generated</h3>
              <p className="text-gray-600">
                Fill out the form on the left to generate your curriculum.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;