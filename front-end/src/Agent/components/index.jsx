// src/components/Agent/Agentview/index.jsx
import { useState } from 'react';
import { useAgentLogic } from './hooks/useAgentLogic';
import { useKnowledgeBase } from '../backgroundWork/getParag';
import { ToggleButton } from './ToggleButton';
import { AgentPanel } from './AgentPanel';

const Agentview = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { passage } = useKnowledgeBase();
  const agentLogic = useAgentLogic(passage);

  return (
    <>
      <ToggleButton 
        isOpen={isPanelOpen} 
        onClick={() => setIsPanelOpen(!isPanelOpen)} 
      />
      <AgentPanel 
        isOpen={isPanelOpen}
        agentLogic={agentLogic}
      />
    </>
  );
};

export default Agentview;