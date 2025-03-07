import loadedstopwords from "./stopwords";

/**
 * Generates a human-friendly answer based on the extracted answer and context
 * @param {string} question - The original question
 * @param {string} extractedAnswer - The answer extracted by the QnA model (can be empty)
 * @param {string} context - The context paragraph(s)
 * @param {string} intent - The classified intent of the question
 * @param {boolean} isGenerative - Whether to generate an answer when extraction failed
 * @returns {string} A human-friendly answer
 */
export const generateHumanFriendlyAnswer = (
  question,
  extractedAnswer,
  context,
  intent,
  isGenerative = false
) => {
  // If we have no context, return a default message
  if (!context || context.trim().length === 0) {
    return "I couldn't find any relevant information to answer your question.";
  }

  // If we're not in generative mode and have no extracted answer, return a default message
  if (!isGenerative && (!extractedAnswer || extractedAnswer.trim().length === 0)) {
    return "I couldn't find a specific answer to your question in the text.";
  }

  // Clean up the question and answer
  const cleanQuestion = question.trim().replace(/[?.,;!]$/, '');
  const cleanAnswer = extractedAnswer ? extractedAnswer.trim() : '';

  // Determine question type based on intent and first word
  const questionLower = cleanQuestion.toLowerCase();
  const firstWord = questionLower.split(' ')[0];
  
  // Handle different question types
  if (isGenerative || cleanAnswer.length === 0) {
    return generateAnswerFromScratch(cleanQuestion, context, intent);
  }
  
  // Format direct answers based on question type
  if (firstWord === 'what') {
    if (intent === 'definition') {
      return `${extractFirstNoun(cleanQuestion)} is ${cleanAnswer}.`;
    } else {
      return capitalizeFirstLetter(cleanAnswer) + '.';
    }
  } else if (firstWord === 'who') {
    return `${cleanAnswer}.`;
  } else if (firstWord === 'when') {
    return `This happened ${cleanAnswer}.`;
  } else if (firstWord === 'where') {
    return `The location is ${cleanAnswer}.`;
  } else if (firstWord === 'why') {
    return `Because ${cleanAnswer.toLowerCase()}.`;
  } else if (firstWord === 'how') {
    if (questionLower.includes('how many') || questionLower.includes('how much')) {
      return `${capitalizeFirstLetter(cleanAnswer)}.`;
    } else {
      return `${capitalizeFirstLetter(cleanAnswer)}.`;
    }
  } else if (firstWord === 'is' || firstWord === 'are' || firstWord === 'do' || firstWord === 'does' || firstWord === 'can') {
    // Yes/No questions
    return `${capitalizeFirstLetter(cleanAnswer)}.`;
  } else {
    // Default formatting
    return `${capitalizeFirstLetter(cleanAnswer)}.`;
  }
};

/**
 * Generates an answer from scratch when no direct answer is available
 * @param {string} question - The original question
 * @param {string} context - The context paragraph(s)
 * @param {string} intent - The classified intent of the question
 * @returns {string} A generated answer
 */
const generateAnswerFromScratch = (question, context, intent) => {
  // Clean and normalize the context
  const cleanContext = cleanRawText(context);
  
  // Extract key information from the context based on the question
  const questionLower = question.toLowerCase();
  const contextLower = cleanContext.toLowerCase();
  const firstWord = questionLower.split(' ')[0];
  
  // Look for sentences in the context that might contain the answer
  const sentences = cleanContext.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract key terms from the question (excluding stop words)
  const stopWords = new Set(loadedstopwords);
  const keyTerms = question.toLowerCase().split(/\s+/).filter(word => !stopWords.has(word) && word.length > 2);
  
  // Score each sentence based on how many key terms it contains
  const scoredSentences = sentences.map(sentence => {
    const sentenceLower = sentence.toLowerCase();
    let score = 0;
    
    keyTerms.forEach(term => {
      if (sentenceLower.includes(term)) {
        score += 1;
      }
    });
    
    return { sentence: sentence.trim(), score };
  });
  
  // Sort sentences by score
  scoredSentences.sort((a, b) => b.score - a.score);
  
  // If we have high-scoring sentences, use them to construct an answer
  if (scoredSentences.length > 0 && scoredSentences[0].score > 0) {
    const topSentences = scoredSentences
      .filter(item => item.score > 0)
      .slice(0, 2)
      .map(item => item.sentence);
    
    // Construct answer based on question type
    if (firstWord === 'what') {
      if (intent === 'definition') {
        const subject = extractFirstNoun(question);
        return `Based on the text, ${subject} appears to be ${topSentences[0]}.`;
      } else {
        return `${capitalizeFirstLetter(topSentences.join(' '))}.`;
      }
    } else if (firstWord === 'who') {
      return `Based on the information, ${topSentences.join(' ')}.`;
    } else if (firstWord === 'when') {
      // Look for time-related words
      const timeWords = ['year', 'month', 'day', 'hour', 'minute', 'second', 'decade', 'century', 'period', 'era', 'time', 'date'];
      const timeRelatedSentences = sentences.filter(s => 
        timeWords.some(word => s.toLowerCase().includes(word)) || 
        /\d{4}/.test(s) // Contains a year-like number
      );
      
      if (timeRelatedSentences.length > 0) {
        return `According to the text, ${timeRelatedSentences[0].trim()}.`;
      } else {
        return `The text doesn't specify exactly when, but it mentions: ${topSentences[0]}.`;
      }
    } else if (firstWord === 'where') {
      // Look for location-related words
      const locationWords = ['at', 'in', 'near', 'location', 'place', 'area', 'region', 'country', 'city', 'town', 'building'];
      const locationSentences = sentences.filter(s => 
        locationWords.some(word => s.toLowerCase().includes(word))
      );
      
      if (locationSentences.length > 0) {
        return `According to the text, ${locationSentences[0].trim()}.`;
      } else {
        return `The text doesn't specify the exact location, but it mentions: ${topSentences[0]}.`;
      }
    } else if (firstWord === 'why') {
      // Look for causal words
      const causalWords = ['because', 'since', 'as', 'due to', 'result', 'cause', 'reason', 'therefore', 'thus'];
      const causalSentences = sentences.filter(s => 
        causalWords.some(word => s.toLowerCase().includes(word))
      );
      
      if (causalSentences.length > 0) {
        return `${capitalizeFirstLetter(causalSentences[0].trim())}.`;
      } else {
        return `Based on the text, it appears that ${topSentences.join(' ')}.`;
      }
    } else if (firstWord === 'how') {
      if (questionLower.includes('how many') || questionLower.includes('how much')) {
        // Look for numbers
        const numberSentences = sentences.filter(s => /\d+/.test(s));
        if (numberSentences.length > 0) {
          return `According to the text, ${numberSentences[0].trim()}.`;
        }
      }
      return `Based on the information provided, ${topSentences.join(' ')}.`;
    } else if (firstWord === 'is' || firstWord === 'are' || firstWord === 'do' || firstWord === 'does' || firstWord === 'can') {
      // Yes/No questions - look for affirmative or negative indicators
      const affirmativeWords = ['yes', 'can', 'do', 'does', 'is', 'are', 'will', 'should'];
      const negativeWords = ['no', 'not', "don't", "doesn't", "can't", "won't", "shouldn't", 'never'];
      
      const hasAffirmative = topSentences.some(s => 
        affirmativeWords.some(word => s.toLowerCase().includes(word)) &&
        !negativeWords.some(word => s.toLowerCase().includes(word))
      );
      
      const hasNegative = topSentences.some(s => 
        negativeWords.some(word => s.toLowerCase().includes(word))
      );
      
      if (hasNegative) {
        return `No, according to the text: ${topSentences[0]}.`;
      } else if (hasAffirmative) {
        return `Yes, according to the text: ${topSentences[0]}.`;
      } else {
        return `Based on the text, ${topSentences[0]}.`;
      }
    } else {
      // Default response for other question types
      return `According to the information provided, ${topSentences.join(' ')}.`;
    }
  } else {
    // No relevant sentences found
    // Extract a summary sentence from the beginning of the text
    const firstSentence = sentences.length > 0 ? 
      sentences[0].trim() : 
      "No clear information was found";
    
    return `I couldn't find specific information about that in the text. The passage discusses ${summarizeText(cleanContext, 20)}.`;
  }
};

/**
 * Cleans raw text by removing formatting artifacts and normalizing spacing
 * @param {string} text - The raw text to clean
 * @returns {string} Cleaned text
 */
const cleanRawText = (text) => {
  if (!text) return "";
  
  // Replace multiple spaces, newlines, and tabs with a single space
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Remove common formatting artifacts
  cleaned = cleaned.replace(/\[\d+\]/g, ''); // Remove citation numbers like [1]
  cleaned = cleaned.replace(/\((\d{4})\)/g, ' in $1 '); // Convert (2021) to "in 2021"
  
  // Fix common formatting issues
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1. $2'); // Add period between sentences without proper spacing
  
  // Remove redundant location/coordinate information
  cleaned = cleaned.replace(/\b(Coordinates|Location|Show map of|UTC)\b.*?[.;]/g, '');
  
  // Remove table-like data
  cleaned = cleaned.replace(/(\w+):\s*(\d+)[^\w.]+/g, '$1 is $2. ');
  
  // Fix missing spaces after periods
  cleaned = cleaned.replace(/\.([A-Z])/g, '. $1');
  
  return cleaned.trim();
};

/**
 * Creates a brief summary of text by extracting key information
 * @param {string} text - The text to summarize
 * @param {number} wordLimit - Maximum number of words in summary
 * @returns {string} A brief summary
 */
const summarizeText = (text, wordLimit = 20) => {
  if (!text) return "";
  
  // Extract the first sentence
  const firstSentence = text.split(/[.!?]+/)[0].trim();
  
  // If it's already short enough, return it
  const words = firstSentence.split(/\s+/);
  if (words.length <= wordLimit) {
    return firstSentence;
  }
  
  // Otherwise, truncate to word limit and add ellipsis
  return words.slice(0, wordLimit).join(' ') + '...';
};

/**
 * Extracts the first noun from a question
 * @param {string} question - The question to analyze
 * @returns {string} The first noun found
 */
const extractFirstNoun = (question) => {
  // Simple implementation - extract the first non-question word
  const words = question.toLowerCase().split(/\s+/);
  const questionWords = new Set(['what', 'when', 'where', 'why', 'how', 'is', 'are', 'do', 'does', 'can', 'could', 'would', 'should', 'the', 'a', 'an']);
  
  for (const word of words) {
    if (!questionWords.has(word) && word.length > 2) {
      return word;
    }
  }
  
  return 'this';
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
const capitalizeFirstLetter = (str) => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default generateHumanFriendlyAnswer;