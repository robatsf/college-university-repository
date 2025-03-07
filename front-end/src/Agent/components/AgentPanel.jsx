
  // src/components/Agent/Agentview/AgentPanel.jsx
  import { ProcessingDetails } from './ProcessingDetails';
  import { ChatHistory } from './ChatHistory';
  import { InputSection } from './InputSection';
  import { ModelError } from './ModelError';
  import { LoadingIndicator } from './LoadingIndicator';
  
  export const AgentPanel = ({ 
    isOpen,
    agentLogic
  }) => (
    <div 
      className={`fixed top-0 left-0 h-full w-[320px] bg-white shadow-xl transition-transform duration-300 transform z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">AI Chatbot Agent</h1>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {agentLogic.modelLoading ? (
            <LoadingIndicator />
          ) : (
            <div className="space-y-4">
              {agentLogic.modelError && <ModelError error={agentLogic.modelError} />}
              <ChatHistory chatHistory={agentLogic.chatHistory} />
              {agentLogic.relevantParagraphs.length > 0 && (
                <ProcessingDetails 
                  intent={agentLogic.intent}
                  entities={agentLogic.entities}
                  relevantParagraphs={agentLogic.relevantParagraphs}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <InputSection {...agentLogic} />
        </div>
      </div>
    </div>
  );