// src/components/Agent/Agentview/ChatHistory.jsx
export const ChatHistory = ({ chatHistory }) => (
    <div className="border border-gray-300 rounded-md p-4 h-96 overflow-y-auto bg-gray-50">
      {chatHistory.length === 0 ? (
        <div className="text-center text-gray-500 mt-32">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg ${
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
  );