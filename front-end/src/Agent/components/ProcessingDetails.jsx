import React, { useState } from 'react';

const ProcessingDetails = ({ intent, entities, relevantParagraphs }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-800">Processing Details</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4">
          {/* Intent */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Detected Intent:</h4>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {intent}
              </span>
            </div>
          </div>

          {/* Entities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Extracted Entities:</h4>
            <div className="bg-white p-2 rounded border border-gray-200 flex flex-wrap gap-1">
              {entities.length > 0 ? (
                entities.map((entity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {entity}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No entities extracted</span>
              )}
            </div>
          </div>

          {/* Relevant Paragraphs */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Relevant Paragraphs:</h4>
            {relevantParagraphs.length > 0 ? (
              <div className="space-y-3">
                {relevantParagraphs.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Paragraph {item.paragraphNum}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Score: {item.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{item.paragraph}</p>
                    {item.matchedEntities && item.matchedEntities.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 mr-2">Matched:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.matchedEntities.map((entity, entityIndex) => (
                            <span
                              key={entityIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 text-sm">No relevant paragraphs found</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingDetails;