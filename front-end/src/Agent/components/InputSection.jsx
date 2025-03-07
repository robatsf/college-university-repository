// src/components/Agent/Agentview/InputSection.jsx
export const InputSection = ({ 
    question, 
    setQuestion, 
    loading, 
    passage, 
    processQuestion, 
    clearChat,
    chatHistory 
  }) => (
    <div className="flex space-x-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && processQuestion()}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Type your message here..."
        disabled={loading || !passage}
      />
      <button
        onClick={processQuestion}
        disabled={loading || !question || !passage}
        className={`px-4 py-2 rounded-md ${
          loading || !question || !passage
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>
      <button
        onClick={clearChat}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        disabled={chatHistory.length === 0 || loading}
      >
        Clear Chat
      </button>
    </div>
  );
