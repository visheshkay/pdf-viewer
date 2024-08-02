const pdf = require('pdf-parse');

// Common words to be ignored in definitions
const commonWords = new Set([
  'and', 'or', 'for', 'the', 'of', 'in', 'to', 'a', 'an', 'on', 'with', 'by', 'as', 'at'
]);

const processPDF = async (fileBuffer) => {
  const data = await pdf(fileBuffer);
  const text = data.text;

  const words = text.split(/\s+/);
  const pairs = new Map();
  const wordBuffer = [];

  const isAcronym = (word) => {
    return word.match(/^[A-Z]+$/);
  };

  const extractDefinition = (acronym, wordBuffer) => {
    const numCapitalLetters = acronym.replace(/[^A-Z]/g, '').length;
    const definitionWords = [];

    // Traverse the buffer in reverse to find the definition
    for (let i = wordBuffer.length - 1; i >= 0 && definitionWords.length < numCapitalLetters; i--) {
      if (!commonWords.has(wordBuffer[i].toLowerCase())) {
        definitionWords.unshift(wordBuffer[i]);
      }
    }

    return definitionWords.join(' ');
  };

  words.forEach(word => {
    if (word.match(/\(([^)]+)\)/)) {
      const acronymMatch = word.match(/\(([^)]+)\)/)[1];
      if (isAcronym(acronymMatch) && !pairs.has(acronymMatch)) {
        const definition = extractDefinition(acronymMatch, wordBuffer);
        pairs.set(acronymMatch, definition);
      }
    //   wordBuffer.push(word); // Add current word with acronym to buffer
    } else {
      wordBuffer.push(word); // Regular word, add to buffer
    }
  });

  const resultArray = Array.from(pairs, ([acronym, definition]) => ({ acronym, definition }));
  return resultArray;
};

module.exports = { processPDF };
