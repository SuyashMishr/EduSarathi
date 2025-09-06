import React, { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AnswerUploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [quizId, setQuizId] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !quizId) {
      toast.error('Please select a file and enter quiz ID');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('answerSheet', file);
    formData.append('quizId', quizId);

    try {
      const response = await axios.post('/api/grading/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Answer sheet uploaded successfully!');
      onUploadComplete(response.data.data);
      setFile(null);
      setQuizId('');
    } catch (error) {
      toast.error('Failed to upload answer sheet');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Upload className="text-purple-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Upload Answer Sheet</h2>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-purple-800 text-sm">
          <strong>Demo Tip:</strong> First generate a quiz to get its ID, then upload handwritten answers for AI-powered assessment and detailed feedback.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz ID *
          </label>
          <input
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Try: QUIZ_123, PHYSICS_LAWS_001, or generate a quiz first"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer Sheet File *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex items-center justify-center">
                <FileText className="text-purple-600 mr-2" size={24} />
                <span className="text-sm text-gray-600">{file.name}</span>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file || !quizId}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Uploading...
            </>
          ) : (
            'Upload Answer Sheet'
          )}
        </button>
      </div>
    </div>
  );
};

export default AnswerUploader;