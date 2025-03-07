
export const classifyIntent = (question) => {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('what') || questionLower.includes('explain')) {
      return 'information';
    } else if (questionLower.includes('how')) {
      return 'process';
    } else if (questionLower.includes('why')) {
      return 'reason';
    } else if (questionLower.includes('when') || questionLower.includes('date')) {
      return 'time';
    } else if (questionLower.includes('where')) {
      return 'location';
    } else {
      return 'general';
    }
  };