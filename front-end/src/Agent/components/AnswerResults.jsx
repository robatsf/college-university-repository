import React from 'react';

const AnswerResults = ({ answer, generatedAnswer, answerSource }) => {
  if (!answer && !generatedAnswer) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Answer</h3>
      
      {/* Generated human-friendly answer */}
      {generatedAnswer && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-gray-800">{generatedAnswer}</p>
          {answerSource === 'generated' && (
            <p className="text-xs text-gray-500 mt-2">
              This answer was generated based on the context since no direct answer was found.
            </p>
          )}
        </div>
      )}
      
      {/* Direct model answers */}
      {answer && answer.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {answerSource === 'generated' ? 'Model Predictions' : 'Raw Model Output'}
          </h4>
          <div className="space-y-3">
            {answer.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800">Answer {index + 1}</span>
                  <span className="text-sm text-gray-500">
                    Score: {(item.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerResults;