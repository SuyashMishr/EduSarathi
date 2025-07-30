import React, { useState } from 'react';
import AnswerUploader from '../components/AnswerUploader';

const AssessmentPage = () => {
  const [uploadResult, setUploadResult] = useState(null);
  const [gradingResult, setGradingResult] = useState(null);

  const handleUploadComplete = (result) => {
    setUploadResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Answer Assessment</h1>
        <p className="text-gray-600">
          Upload answer sheets and get AI-powered grading with detailed feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AnswerUploader onUploadComplete={handleUploadComplete} />
        </div>

        <div>
          {uploadResult ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Successful
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">File uploaded successfully!</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">File Details</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Original Name:</span> {uploadResult.originalName}</p>
                    <p><span className="font-medium">Answer Sheet ID:</span> {uploadResult.answerSheetId}</p>
                    <p><span className="font-medium">Status:</span> Ready for grading</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Next Steps</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                      Start AI Grading
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                      View Answer Sheet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No File Uploaded</h3>
              <p className="text-gray-600">
                Upload an answer sheet to begin the assessment process.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Assessments</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assessment History</h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No assessments yet. Upload your first answer sheet to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;