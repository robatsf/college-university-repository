/**
 * Finds the most relevant paragraphs across multiple pages based on entity matching
 * @param {Array<Array<string>>} pages - List of pages, where each page is a list of paragraphs
 * @param {Array<string>} entities - List of entities to search for
 * @param {number} maxResults - Maximum number of paragraphs to return (default: 3)
 * @returns {Array<{paragraph: string, score: number, pageNum: number, paragraphNum: number, matchedEntities: Array<string>}>} - Sorted list of relevant paragraphs with metadata
 */
export const findRelevantParagraphs = (pages, entities, maxResults = 3) => {
  console.log(pages, entities, maxResults)
  if (!pages || !Array.isArray(pages) || entities.length === 0) {
    return [];
  }

  const allScoredParagraphs = [];
  
  // Process each page
  pages.forEach((page, pageIndex) => {
    if (!Array.isArray(page)) {
      console.warn(`Page at index ${pageIndex} is not an array, skipping`);
      return;
    }
    
    // Process each paragraph in the page
    page.forEach((paragraph, paragraphIndex) => {
      if (typeof paragraph !== 'string') {
        return; // Skip non-string paragraphs
      }
      
      const paraLower = paragraph.toLowerCase();
      let score = 0;
      const matchedEntities = new Set();
      
      // Score the paragraph based on entity matches
      entities.forEach(entity => {
        if (entity && paraLower.includes(entity.toLowerCase())) {
          score += 1;
          matchedEntities.add(entity);
        }
      });
      
      // Add paragraph to results if it matches any entity
      if (score > 0) {
        allScoredParagraphs.push({
          paragraph,
          score,
          pageNum: pageIndex + 1, // 1-based page numbering for user-friendly display
          paragraphNum: paragraphIndex + 1, // 1-based paragraph numbering
          matchedEntities: Array.from(matchedEntities)
        });
      }
    });
  });

  // Sort paragraphs by relevance score (descending)
  allScoredParagraphs.sort((a, b) => {
    // Primary sort by score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary sort by page number (earlier pages first)
    if (a.pageNum !== b.pageNum) {
      return a.pageNum - b.pageNum;
    }
    // Tertiary sort by paragraph position
    return a.paragraphNum - b.paragraphNum;
  });
  
  // Return the top N most relevant paragraphs
  return allScoredParagraphs.slice(0, maxResults);
};

/**
 * Updated function that returns multiple relevant paragraphs from a single passage
 * @param {string} passage - Single passage text
 * @param {Array<string>} entities - List of entities to search for
 * @param {number} maxResults - Maximum number of paragraphs to return (default: 3)
 * @returns {Array<{paragraph: string, score: number, paragraphNum: number, matchedEntities: Array<string>}>} - List of relevant paragraphs
 */
export const findRelevantParagraph = (passage, entities, maxResults = 3) => {
  if (!passage || entities.length === 0) return [{ paragraph: passage, score: 0, paragraphNum: 1, matchedEntities: [] }];

  const paragraphs = passage.split('\n\n');
  const result = findRelevantParagraphs([paragraphs], entities, maxResults);
  
  if (result.length > 0) {
    // Return the results but remove the pageNum property since it's always 1 in this context
    return result.map(({ paragraph, score, paragraphNum, matchedEntities }) => ({
      paragraph,
      score,
      paragraphNum,
      matchedEntities
    }));
  }

  // If no matches, return the original passage as a single result with score 0
  return [{ paragraph: passage, score: 0, paragraphNum: 1, matchedEntities: [] }];
};