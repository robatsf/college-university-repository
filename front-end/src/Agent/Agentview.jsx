import { useState, useRef, useEffect } from 'react';
import { useAgentLogic } from './backgroundWork/useAgentLogic';
import { useKnowledgeBase } from './backgroundWork/getParag';

function Agentview({id}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [passage, setPassage] = useState([]);
  const { passage: knowledgeBasePassage } = useKnowledgeBase(id);
  const agentLogic = useAgentLogic(passage);
  const chatContainerRef = useRef(null);

  // Update passage when knowledgeBasePassage changes
  useEffect(() => {
    if (knowledgeBasePassage) {
      setPassage(knowledgeBasePassage);
    }
  }, [knowledgeBasePassage]);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [agentLogic.chatHistory]);

  // Handle key down event for Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && agentLogic.question.trim() && !agentLogic.loading) {
      e.preventDefault();
      agentLogic.processQuestion();
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 flex">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isPanelOpen ? 'left-[400px]' : 'left-0'
        } z-50 bg-blue-500 text-white p-2 rounded-r-md shadow-lg transition-all duration-300`}
      >
        {isPanelOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Sliding Panel */}
      <div 
        className={`w-[400px] bg-white shadow-xl transition-transform duration-300 transform ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        } h-full flex flex-col`}
      >
        {/* Header with title and clear button */}
        <div className="p-2.5 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">AI Chatbot Agent</h1>
          <button
            onClick={agentLogic.clearChat}
            disabled={agentLogic.chatHistory.length === 0 || agentLogic.loading}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              agentLogic.chatHistory.length === 0 || agentLogic.loading 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600'
            }`}
            title="Clear conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Main content area - Using absolute positioning for the chat container and input */}
        <div className="relative flex-1 overflow-hidden">
          {agentLogic.modelLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Chat History - Takes all available space except for input height */}
              <div 
                ref={chatContainerRef}
                className="absolute inset-0 bottom-[70px] overflow-y-auto p-4 bg-gray-50"
              >
                {agentLogic.chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p>No Question yet. Start a conversation!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agentLogic.chatHistory.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Section - Fixed at bottom using absolute positioning */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={agentLogic.question}
                    onChange={(e) => agentLogic.setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={agentLogic.loading ? "Thinking..." : "Type your question here..."}
                    disabled={agentLogic.loading}
                  />
                  {agentLogic.loading ? (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (agentLogic.question.trim() && !agentLogic.loading) {
                          agentLogic.processQuestion();
                        }
                      }}
                      disabled={!agentLogic.question.trim() || agentLogic.loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                      aria-label="Send message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agentview;