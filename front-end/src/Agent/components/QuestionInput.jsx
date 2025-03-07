import React from 'react';

const QuestionInput = ({ question, setQuestion, handleKeyPress, processQuestion, loading }) => {
  return (
    <div>
      <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
        Ask a Question
      </label>
      <div className="flex">
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type your question and press Enter..."
        />
        <button
          onClick={processQuestion}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </div>
    </div>
  );
};

export default QuestionInput;