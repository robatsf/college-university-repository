import * as tf from "@tensorflow/tfjs";
import loadedstopwords from "./stopwords";

export const extractEntitiesWithTF = async (question) => {
  if (!question) {
    return [];
  }
  
  try {
    const words = question.split(/\s+/);
    return await tf.tidy(() => {
      const stopWords = new Set(loadedstopwords);
      const filteredWords = words.filter(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
        return !stopWords.has(cleanWord) && cleanWord.length > 2;
      });

      const wordFreq = {};
      filteredWords.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
        if (cleanWord) {
          wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
      });
      
      const uniqueWords = Object.keys(wordFreq);
      const frequencies = uniqueWords.map(word => wordFreq[word]);

      if (uniqueWords.length === 0) {
        return [];
      }
      
      const freqTensor = tf.tensor1d(frequencies);
      
      const maxFreq = freqTensor.max();
      const normalizedFreq = tf.div(freqTensor, maxFreq);
      
      const scores = normalizedFreq.arraySync();
      
      const wordScores = uniqueWords.map((word, i) => ({ word, score: scores[i] }));
      wordScores.sort((a, b) => b.score - a.score);
      
      const topN = Math.min(5, wordScores.length);
      const topEntities = wordScores.slice(0, topN).map(item => item.word);
      
      return topEntities;
    });
  } catch (error) {
    console.error('Error in TF entity extraction:', error);
    return extractEntitiesFallback(question);
  }
};

// Fallback entity extraction method (original implementation)
export const extractEntitiesFallback = (question) => {
  const words = question.toLowerCase().split(' ');
  const stopWords = loadedstopwords;
  
  return words
    .filter(word => !stopWords.includes(word) && word.length > 3)
    .map(word => word.replace(/[^\w\s]/gi, ''));
};