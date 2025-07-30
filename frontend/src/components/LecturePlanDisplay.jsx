import React, { useState } from 'react';
import { 
  Clock, 
  Target, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Download,
  Share2,
  Edit,
  ChevronDown,
  ChevronUp,
  Play,
  Pause
} from 'lucide-react';

const LecturePlanDisplay = ({ lecturePlan, onEdit, onDownload, onShare }) => {
  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    structure: true,
    activities: false,
    resources: false,
    assessments: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getBloomsLevelColor = (level) => {
    const colors = {
      'remember': 'bg-blue-100 text-blue-800',
      'understand': 'bg-green-100 text-green-800',
      'apply': 'bg-yellow-100 text-yellow-800',
      'analyze': 'bg-orange-100 text-orange-800',
      'evaluate': 'bg-red-100 text-red-800',
      'create': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getActivityTypeIcon = (type) => {
    const icons = {
      'introduction': <Play className="w-4 h-4" />,
      'explanation': <BookOpen className="w-4 h-4" />,
      'demonstration': <Users className="w-4 h-4" />,
      'practice': <Edit className="w-4 h-4" />,
      'discussion': <Users className="w-4 h-4" />,
      'assessment': <CheckCircle className="w-4 h-4" />,
      'summary': <Pause className="w-4 h-4" />
    };
    return icons[type] || <BookOpen className="w-4 h-4" />;
  };

  if (!lecturePlan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No lecture plan to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{lecturePlan.title}</h1>
            <p className="text-blue-100 mb-4">{lecturePlan.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(lecturePlan.duration?.total || 60)}
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Grade {lecturePlan.grade}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {lecturePlan.subject}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(lecturePlan)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            {onDownload && (
              <button
                onClick={() => onDownload(lecturePlan)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            {onShare && (
              <button
                onClick={() => onShare(lecturePlan)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Duration Breakdown */}
        {lecturePlan.durationBreakdown && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Time Allocation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(lecturePlan.durationBreakdown).map(([phase, minutes]) => (
                <div key={phase} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{minutes}m</div>
                  <div className="text-sm text-gray-600 capitalize">{phase.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('objectives')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Learning Objectives
            </h3>
            {expandedSections.objectives ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.objectives && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {lecturePlan.learningObjectives?.map((obj, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{obj.objective || obj}</p>
                      {obj.bloomsLevel && (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getBloomsLevelColor(obj.bloomsLevel)}`}>
                          {obj.bloomsLevel}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {lecturePlan.prerequisites && lecturePlan.prerequisites.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Prerequisites</h3>
            <ul className="list-disc list-inside space-y-1">
              {lecturePlan.prerequisites.map((prereq, index) => (
                <li key={index} className="text-gray-700">{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Vocabulary */}
        {lecturePlan.keyVocabulary && lecturePlan.keyVocabulary.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Key Vocabulary</h3>
            <div className="grid gap-3">
              {lecturePlan.keyVocabulary.map((vocab, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-800">{vocab.term || vocab}</div>
                  {vocab.definition && (
                    <div className="text-gray-600 text-sm mt-1">{vocab.definition}</div>
                  )}
                  {vocab.example && (
                    <div className="text-blue-600 text-sm mt-1 italic">Example: {vocab.example}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lesson Structure */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('structure')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
              Lesson Structure
            </h3>
            {expandedSections.structure ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.structure && lecturePlan.structure && (
            <div className="px-4 pb-4 space-y-4">
              {lecturePlan.structure.openingHook && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Opening Hook</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded">{lecturePlan.structure.openingHook}</p>
                </div>
              )}
              
              {lecturePlan.structure.introduction && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Introduction</h4>
                  <p className="text-gray-700">{lecturePlan.structure.introduction}</p>
                </div>
              )}
              
              {lecturePlan.structure.mainContent && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Main Content</h4>
                  <div className="space-y-3">
                    {lecturePlan.structure.mainContent.map((section, index) => (
                      <div key={index} className="border-l-4 border-green-400 pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-gray-800">{section.section}</h5>
                          <span className="text-sm text-gray-500">{section.duration}m</span>
                        </div>
                        <p className="text-gray-700 mb-2">{section.content}</p>
                        {section.teachingStrategy && (
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {section.teachingStrategy}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {lecturePlan.structure.conclusion && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Conclusion</h4>
                  <p className="text-gray-700">{lecturePlan.structure.conclusion}</p>
                </div>
              )}
              
              {lecturePlan.structure.homework && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Homework</h4>
                  <p className="text-gray-700 bg-orange-50 p-3 rounded">{lecturePlan.structure.homework}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Activities */}
        {lecturePlan.activities && lecturePlan.activities.length > 0 && (
          <div className="border rounded-lg">
            <button
              onClick={() => toggleSection('activities')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Activities ({lecturePlan.activities.length})
              </h3>
              {expandedSections.activities ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.activities && (
              <div className="px-4 pb-4 space-y-4">
                {lecturePlan.activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getActivityTypeIcon(activity.type)}
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {activity.duration}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{activity.description}</p>

                    {activity.instructions && (
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-800 mb-1">Instructions:</h5>
                        <p className="text-gray-700 text-sm">{activity.instructions}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {activity.grouping && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {activity.grouping.replace('_', ' ')}
                        </span>
                      )}
                      {activity.type && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {activity.type}
                        </span>
                      )}
                    </div>

                    {activity.materials && activity.materials.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-800 mb-1">Materials:</h5>
                        <div className="flex flex-wrap gap-1">
                          {activity.materials.map((material, idx) => (
                            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        {lecturePlan.resources && lecturePlan.resources.length > 0 && (
          <div className="border rounded-lg">
            <button
              onClick={() => toggleSection('resources')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                Resources ({lecturePlan.resources.length})
              </h3>
              {expandedSections.resources ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.resources && (
              <div className="px-4 pb-4 space-y-3">
                {lecturePlan.resources.map((resource, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{resource.title}</h4>
                        {resource.required && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {resource.type}
                      </span>
                    </div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assessments */}
        {lecturePlan.assessments && lecturePlan.assessments.length > 0 && (
          <div className="border rounded-lg">
            <button
              onClick={() => toggleSection('assessments')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Assessments ({lecturePlan.assessments.length})
              </h3>
              {expandedSections.assessments ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.assessments && (
              <div className="px-4 pb-4 space-y-3">
                {lecturePlan.assessments.map((assessment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{assessment.title}</h4>
                      <div className="flex gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {assessment.type}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {assessment.method}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
                    {assessment.timing && (
                      <p className="text-gray-500 text-xs">Timing: {assessment.timing}</p>
                    )}
                    {assessment.criteria && assessment.criteria.length > 0 && (
                      <div className="mt-2">
                        <h5 className="font-medium text-gray-700 text-sm mb-1">Criteria:</h5>
                        <div className="flex flex-wrap gap-1">
                          {assessment.criteria.map((criterion, idx) => (
                            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {criterion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teaching Strategies & Differentiation */}
        <div className="grid md:grid-cols-2 gap-6">
          {lecturePlan.teachingStrategies && lecturePlan.teachingStrategies.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Teaching Strategies</h3>
              <div className="flex flex-wrap gap-2">
                {lecturePlan.teachingStrategies.map((strategy, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {strategy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lecturePlan.differentiation && Object.keys(lecturePlan.differentiation).length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Differentiation</h3>
              <div className="space-y-2 text-sm">
                {lecturePlan.differentiation.forAdvanced && (
                  <div>
                    <span className="font-medium text-green-700">Advanced:</span>
                    <span className="text-gray-700 ml-2">{lecturePlan.differentiation.forAdvanced}</span>
                  </div>
                )}
                {lecturePlan.differentiation.forStruggling && (
                  <div>
                    <span className="font-medium text-yellow-700">Support:</span>
                    <span className="text-gray-700 ml-2">{lecturePlan.differentiation.forStruggling}</span>
                  </div>
                )}
                {lecturePlan.differentiation.forELL && (
                  <div>
                    <span className="font-medium text-purple-700">ELL:</span>
                    <span className="text-gray-700 ml-2">{lecturePlan.differentiation.forELL}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Technology & Safety */}
        <div className="grid md:grid-cols-2 gap-6">
          {lecturePlan.technology && lecturePlan.technology.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Technology</h3>
              <div className="flex flex-wrap gap-2">
                {lecturePlan.technology.map((tech, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lecturePlan.safety && (lecturePlan.safety.considerations?.length > 0 || lecturePlan.safety.procedures?.length > 0) && (
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Safety</h3>
              {lecturePlan.safety.considerations && lecturePlan.safety.considerations.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-medium text-red-700 text-sm mb-1">Considerations:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {lecturePlan.safety.considerations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lecturePlan.safety.procedures && lecturePlan.safety.procedures.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 text-sm mb-1">Procedures:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {lecturePlan.safety.procedures.map((procedure, index) => (
                      <li key={index}>{procedure}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {lecturePlan.tags && lecturePlan.tags.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {lecturePlan.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturePlanDisplay;
