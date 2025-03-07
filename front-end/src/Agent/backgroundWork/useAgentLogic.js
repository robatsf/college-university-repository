// src/components/Agent/Agentview/hooks/useAgentLogic.js
import { useState } from 'react';
import { useQnAModel } from './agent';
import { extractEntitiesFallback } from './extractEntitiesWithTF';
import { classifyIntent } from './classifyIntent';
import { findRelevantParagraph } from './findRelevantParagraph';
import { generateHumanFriendlyAnswer } from './answerGenerator';

export const useAgentLogic = (passage) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [relevantParagraphs, setRelevantParagraphs] = useState([]);
  const [intent, setIntent] = useState('');
  const [entities, setEntities] = useState([]);
  const [answerSource, setAnswerSource] = useState('direct');
  const [chatHistory, setChatHistory] = useState([]);

  const { qnaModel, modelLoading, modelError } = useQnAModel();

  const processQuestion = async () => {
    if (!qnaModel || !question || !passage) return;
    
    // Add user message to chat history
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    
    try {
      setLoading(true);
      setGeneratedAnswer('');
      setAnswerSource('direct');
      
      // Classify intent
      const detectedIntent = classifyIntent(question);
      setIntent(detectedIntent);
      
      // Extract entities using fallback method
      const extractedEntities = extractEntitiesFallback(question);
      setEntities(extractedEntities);
      
      // Find relevant paragraphs
      const relevantResults = findRelevantParagraph(passage, extractedEntities);
      setRelevantParagraphs(relevantResults);
      
      // Use the highest scoring paragraph for the QnA model
      const topParagraph = relevantResults.length > 0 ? relevantResults[0].paragraph : passage;
      
      // Get answer from model
      const answers = await qnaModel.findAnswers(question, topParagraph);
      setAnswer(answers);
      
      // Check if we got a good answer
      const hasGoodAnswer = answers && answers.length > 0 && answers[0].score > 0.3;
      
      let botResponse = '';
      
      if (hasGoodAnswer) {
        // Format the answer for better human understanding
        const humanFriendlyAnswer = generateHumanFriendlyAnswer(
          question, 
          answers[0].text, 
          topParagraph,
          detectedIntent
        );
        setGeneratedAnswer(humanFriendlyAnswer);
        botResponse = humanFriendlyAnswer;
      } else {
        // Generate an answer if no good direct answer was found
        const combinedContext = relevantResults
          .map(result => result.paragraph)
          .join('\n\n');
        
        const generatedResponse = await generateAnswerFromContext(
          question,
          combinedContext,
          extractedEntities,
          detectedIntent
        );
        
        setGeneratedAnswer(generatedResponse);
        setAnswerSource('generated');
        botResponse = generatedResponse;
      }
      
      // Add bot response to chat history
      const botMessage = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toISOString(),
        metadata: {
          intent: detectedIntent,
          entities: extractedEntities,
          answerSource: hasGoodAnswer ? 'direct' : 'generated',
          confidence: hasGoodAnswer && answers.length > 0 ? answers[0].score : null
        }
      };
      setChatHistory(prevHistory => [...prevHistory, botMessage]);
      
    } catch (error) {
      console.error('Error processing question:', error);
      
      try {
        // Fallback processing
        const fallbackEntities = extractEntitiesFallback(question);
        setEntities(fallbackEntities);
        
        const relevantResults = findRelevantParagraph(passage, fallbackEntities);
        setRelevantParagraphs(relevantResults);
        
        // Generate response from context
        const combinedContext = relevantResults
          .map(result => result.paragraph)
          .join('\n\n');
        
        const generatedResponse = await generateAnswerFromContext(
          question,
          combinedContext,
          fallbackEntities,
          classifyIntent(question)
        );
        
        setGeneratedAnswer(generatedResponse);
        setAnswerSource('generated');
        
        // Add bot response to chat history
        const botMessage = {
          type: 'bot',
          content: generatedResponse,
          timestamp: new Date().toISOString(),
          metadata: {
            intent: classifyIntent(question),
            entities: fallbackEntities,
            answerSource: 'generated'
          }
        };
        setChatHistory(prevHistory => [...prevHistory, botMessage]);
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        const errorMessage = "I'm sorry, I couldn't find an answer to your question in the provided text.";
        setGeneratedAnswer(errorMessage);
        setAnswerSource('generated');
        
        // Add error message to chat history
        const botMessage = {
          type: 'bot',
          content: errorMessage,
          timestamp: new Date().toISOString(),
          metadata: {
            error: true
          }
        };
        setChatHistory(prevHistory => [...prevHistory, botMessage]);
      }
    } finally {
      setLoading(false);
      setQuestion(''); // Clear input after sending
    }
  };

  const generateAnswerFromContext = async (question, context, entities, intent) => {
    if (!context || context.length < 20) {
      return "I couldn't find specific information about that in the text. Please try a different question or provide more content.";
    }
    
    try {
      // Use the answer generator to create a response
      return await generateHumanFriendlyAnswer(
        question, 
        "", // No direct answer text
        context, 
        intent, 
        true // Force generation mode
      );
    } catch (error) {
      console.error('Error generating answer:', error);
      return "I'm sorry, I couldn't generate a good answer based on the available information.";
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setAnswer(null);
    setGeneratedAnswer('');
    setRelevantParagraphs([]);
    setIntent('');
    setEntities([]);
  };

  return {
    question,
    setQuestion,
    answer,
    generatedAnswer,
    loading,
    relevantParagraphs,
    intent,
    entities,
    answerSource,
    chatHistory,
    modelLoading,
    modelError,
    processQuestion,
    clearChat
  };
};