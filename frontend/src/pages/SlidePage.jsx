import React, { useState } from 'react';
import SlideGenerator from '../components/SlideGenerator';

const SlidePage = () => {
  const [generatedSlides, setGeneratedSlides] = useState(null);

  const handleSlidesGenerated = (slides) => {
    setGeneratedSlides(slides);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Slide Generator</h1>
        <p className="text-gray-600">
          Create beautiful presentation slides for your lessons using AI technology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SlideGenerator onSlidesGenerated={handleSlidesGenerated} />
        </div>

        <div>
          {generatedSlides ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Generated Slides: {generatedSlides.title}
              </h2>
              
              <div className="space-y-4">
                {generatedSlides.description && (
                  <div>
                    <h3 className="font-medium text-gray-700">Description</h3>
                    <p className="text-gray-600">{generatedSlides.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <p className="text-gray-600">{generatedSlides.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Topic:</span>
                    <p className="text-gray-600">{generatedSlides.topic}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Slides:</span>
                    <p className="text-gray-600">{generatedSlides.slides?.length || 0}</p>
                  </div>
                </div>

                {generatedSlides.slides && generatedSlides.slides.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Slides Preview</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {generatedSlides.slides.slice(0, 3).map((slide, index) => (
                        <div key={index} className="border border-gray-200 rounded p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">
                              Slide {index + 1}: {slide.title}
                            </h4>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              {slide.type || 'content'}
                            </span>
                          </div>
                          
                          {slide.content && (
                            <div className="text-sm text-gray-600 mb-2">
                              {slide.content.substring(0, 150)}
                              {slide.content.length > 150 && '...'}
                            </div>
                          )}

                          {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {slide.bulletPoints.slice(0, 3).map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      
                      {generatedSlides.slides.length > 3 && (
                        <div className="text-center text-gray-500 text-sm">
                          ... and {generatedSlides.slides.length - 3} more slides
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {generatedSlides.settings && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Slide Settings</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Theme:</span>
                        <p className="text-gray-600">{generatedSlides.settings.theme}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Template:</span>
                        <p className="text-gray-600">{generatedSlides.settings.template}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                  View Presentation
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Export PDF
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                  Edit Slides
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V4a1 1 0 011-1h6a1 1 0 011 1v0M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v8a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Slides Generated</h3>
              <p className="text-gray-600">
                Fill out the form on the left to generate your presentation slides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidePage;