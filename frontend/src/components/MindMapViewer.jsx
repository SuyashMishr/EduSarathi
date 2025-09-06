import React, { useState, useEffect } from 'react';
import { Brain, ZoomIn, ZoomOut, Download } from 'lucide-react';

const MindMapViewer = ({ mindMapData }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (!mindMapData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Brain className="text-indigo-600 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Mind Map Viewer</h2>
        </div>
        <div className="text-center text-gray-500 py-12">
          <Brain size={64} className="mx-auto mb-4 text-gray-300" />
          <p>No mind map data to display</p>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handleExport = async () => {
    try {
      // This would call the export API
      console.log('Exporting mind map...');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="text-indigo-600 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Mind Map: {mindMapData.title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <div 
          className="w-full h-full bg-gray-50 relative overflow-auto"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* Check if this is a demo with an image */}
          {mindMapData.metadata?.hasImage && mindMapData.metadata?.imageUrl ? (
            <div className="p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={mindMapData.metadata.imageUrl}
                  alt={`Mind Map: ${mindMapData.title}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  style={{ maxHeight: '450px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none' }} className="text-center py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                    <Brain size={48} className="mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold text-blue-800 mb-2">Demo Mind Map</h3>
                    <p className="text-blue-700 text-sm mb-4">{mindMapData.description}</p>
                    <p className="text-xs text-blue-600">
                      📝 Note: Upload your mind map image and place it in: <code>/public/images/physics-laws-of-motion-mindmap.png</code>
                    </p>
                  </div>
                </div>
                {mindMapData.metadata?.isDemo && (
                  <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-lg mx-auto">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Demo Preview - Class 11 Physics</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      This demonstrates our comprehensive 12-week CBSE Physics curriculum. 
                      The full system creates detailed, interactive diagrams covering mechanics and thermodynamics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Regular mind map visualization */
            <div className="p-8">
              {mindMapData.nodes && mindMapData.nodes.map((node, index) => (
                <div
                  key={node.id || index}
                  className={`absolute bg-white border-2 rounded-lg p-3 shadow-sm ${
                    node.type === 'central' ? 'border-indigo-500 bg-indigo-50' :
                    node.type === 'main' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300'
                  }`}
                  style={{
                    left: `${(node.position?.x || index * 150) + 50}px`,
                    top: `${(node.position?.y || index * 100) + 50}px`,
                    minWidth: '120px'
                  }}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {node.label || node.text}
                  </div>
                  {node.description && (
                    <div className="text-xs text-gray-600 mt-1">
                      {node.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mindMapData.description && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Description</h3>
          <p className="text-sm text-gray-600">{mindMapData.description}</p>
        </div>
      )}
    </div>
  );
};

export default MindMapViewer;