// src/components/Agent/Agentview/hooks/useKnowledgeBase.js
import { useState, useEffect } from 'react';
import BackendUrl from '../../hooks/config';

export const useKnowledgeBase = (id) => {
  const [passage, setPassage] = useState('');

  useEffect(() => {
    if (!id) return
    const fetchKnowledgeBase = async () => {
      console.log("id",id)
      try {
        const response = await fetch(BackendUrl.file +"/getParg/" + id + "/");
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge base');
        }

        const data = await response.json();
        setPassage(data.pages);
        console.log(data)
        setPassage("Sample knowledge base content...");
      } catch (error) {
        console.error('Error fetching knowledge base:', error);
      }
    };

    fetchKnowledgeBase();
  }, []);

  return { passage };
};