import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    aiService: 'checking',
    database: 'checking'
  });

  const checkServices = async () => {
    const newStatus = { ...status };

    // Check Backend
    try {
      const response = await axios.get('/health', { timeout: 5000 });
      newStatus.backend = response.data.status === 'OK' ? 'online' : 'offline';
      // If backend is online, database is also online (since backend connects to DB)
      newStatus.database = response.data.status === 'OK' ? 'online' : 'offline';
    } catch (error) {
      console.log('Backend check failed:', error.message);
      newStatus.backend = 'offline';
      newStatus.database = 'offline';
    }

    // Check AI Service through backend proxy
    try {
      const response = await axios.get('/api/ai-health', { timeout: 5000 });
      newStatus.aiService = response.data.status === 'online' ? 'online' : 'offline';
    } catch (error) {
      console.log('AI Service check failed:', error.message);
      newStatus.aiService = 'offline';
    }

    setStatus(newStatus);
  };

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (serviceStatus) => {
    switch (serviceStatus) {
      case 'online':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'offline':
        return <XCircle className="text-red-500" size={16} />;
      case 'checking':
        return <Loader2 className="text-blue-500 animate-spin" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (serviceStatus) => {
    switch (serviceStatus) {
      case 'online':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'offline':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'checking':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const allServicesOnline = Object.values(status).every(s => s === 'online');

  return (
    <div className={`border rounded-lg p-4 ${allServicesOnline ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">System Status</h3>
        <button
          onClick={checkServices}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Backend API</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.backend)}
            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(status.backend)}`}>
              {status.backend}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">AI Service</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.aiService)}
            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(status.aiService)}`}>
              {status.aiService}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Database</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.database)}
            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(status.database)}`}>
              {status.database}
            </span>
          </div>
        </div>
      </div>
      
      {!allServicesOnline && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
          Some services are offline. Please check your setup or restart services.
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
